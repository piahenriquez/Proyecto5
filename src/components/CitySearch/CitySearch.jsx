import {
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  List,
  ListItemButton,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const CitySearch = () => {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // API Key
  const GEO_API_KEY = import.meta.env.VITE_GEO_API_KEY;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const fetchCities = useCallback(async () => {
    if (searchTerm.length < 3) {
      setCities([]);
      setError("Escribe al menos 3 letras para buscar.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${searchTerm}&minPopulation=50000`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": GEO_API_KEY,
            "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.data || data.data.length === 0) {
        throw new Error("No se encontraron ciudades con ese nombre");
      }
      setCities(data.data);
    } catch (error) {
      setError(error.message);
      setCities([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, GEO_API_KEY]);

  const handleSearchClick = () => {
    fetchCities();
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchCities();
    }
  };

  const handleCityClick = (city) => {
    navigate(`/weather-charts/${city.id}`);
  };

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", p: 3, mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        Buscador de Ciudades
      </Typography>

      <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
        <TextField
          inputRef={inputRef}
          label="Buscar ciudad"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleInputKeyDown}
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
          {isLoading ? <CircularProgress size={24} /> : "Buscar"}
        </Button>
      </Box>

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      )}
      <List>
        {cities.map((city) => (
          <ListItemButton
            key={city.id}
            onClick={() => handleCityClick(city)}
          >
            {/* Bandera del país */}
            <Avatar
              sx={{ mr: 2 }}
              src={`https://flagcdn.com/w40/${city.countryCode?.toLowerCase()}.png`}
              alt={city.country}
            >
              {city.name[0]}
            </Avatar>
            {city.name}, {city.country}
          </ListItemButton>
        ))}
      </List>
    </Card>
  );
};

export default CitySearch;