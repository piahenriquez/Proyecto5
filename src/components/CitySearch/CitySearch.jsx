import { Avatar, Box, Button, Card, CardContent, CircularProgress, List, ListItemButton, TextField, Typography } from '@mui/material';
import { WbSunny, Cloud, Thunderstorm } from '@mui/icons-material';
import { useState, useEffect, useRef, useCallback, handleSearchClick } from 'react';

const CitySearch = () => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  // API Keys 
  const GEO_API_KEY = '7d392d73a8mshd529ad7b1b590b9p1e5f6ajsn23880764888e'; 
  

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const fetchCities = useCallback(async () => {
    if (searchTerm.length < 3) {
      setCities([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${searchTerm}&minPopulation=50000`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': GEO_API_KEY,
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (!data.data || data.data.length === 0) {
        throw new Error('No se encontraron ciudades con ese nombre');
      }
      setCities(data.data);
    } catch (error) {
      console.error("Error al buscar ciudades:", error);
      setError(error.message);
      setCities([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, GEO_API_KEY]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length > 2) {
        fetchCities();
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [searchTerm, fetchCities]);

  useEffect(() => {
    if (!selectedCity) return;

    const fetchWeather = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.latitude}&longitude=${selectedCity.longitude}&current_weather=true&temperature_unit=celsius&windspeed_unit=kmh`
        );
        
        if (!response.ok) {
          throw new Error('Error al obtener el clima');
        }
        
        const data = await response.json();
        setWeather(data.current_weather);
      } catch (error) {
        console.error("Error al obtener el clima:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [selectedCity]);

  const getWeatherIcon = () => {
    if (!weather) return <WbSunny />;
    if (weather.weathercode >= 80) {
      return <Thunderstorm color="error" fontSize="large" />;
    } else if (weather.weathercode >= 51 || weather.weathercode <= 3) {
      return <Cloud color="info" fontSize="large" />;
    }
    return <WbSunny color="warning" fontSize="large" />;
  };

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto', p: 3, mt: 4 }}>
    <Typography variant="h4" gutterBottom align="center" color="primary">
        Buscador de Ciudades y Clima
      </Typography>


    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <TextField
        inputRef={inputRef}
        label="Buscar ciudad"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
        disabled={isLoading}
        fullWidth
        margin="normal"

      />
      <Button
      variant="contained"
          onClick={handleSearchClick}
          disabled={isLoading || searchTerm.length < 3}
          sx={{ minWidth: 120 }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Buscar'}
        </Button>
      </Box>

    
      {error && (
        <Typography color="error" variant="body2">{error}</Typography>
      )}
      {isLoading && <CircularProgress />}
      <List>
        {cities.map(city => (
          <ListItemButton
            key={city.id}
            onClick={() => setSelectedCity(city)}
            selected={selectedCity && selectedCity.id === city.id}
          >
            <Avatar sx={{ mr: 2 }}>{city.name[0]}</Avatar>
            {city.name}, {city.country}
          </ListItemButton>
        ))}
      </List>
      {selectedCity && weather && (
        <Card sx={{ mt: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {selectedCity.name}, {selectedCity.country}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
              <Box sx={{ fontSize: 60 }}>
                {getWeatherIcon()}
              </Box>
              <Box>
                <Typography variant="h2">
                  {weather.temperature}°C
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {weather.weathercode === 0 ? 'Despejado' : 
                  weather.weathercode <= 3 ? 'Parcialmente nublado' :
                  weather.weathercode >= 80 ? 'Tormenta' : 'Lluvia/Nieve'}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Typography>
                <strong>Viento:</strong> {weather.windspeed} km/h
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}
    </Card
  >
  );};
export default CitySearch;