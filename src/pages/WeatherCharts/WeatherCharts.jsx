import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Chart, registerables } from 'chart.js';
import { Box, Button, Typography, CircularProgress, Card, CardContent, Alert, Avatar } from "@mui/material";
import { WbSunny, Cloud, Thunderstorm } from "@mui/icons-material";
Chart.register(...registerables);

const WeatherCharts = () => {
  const { cityId } = useParams();
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [forecast, setForecast] = useState(null);
  const [cityInfo, setCityInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCityInfo = async () => {
      try {
        const cachedCity = localStorage.getItem(`city_${cityId}`);
        if (cachedCity) {
          setCityInfo(JSON.parse(cachedCity));
          return JSON.parse(cachedCity);
        }

        const response = await fetch(
          `https://wft-geo-db.p.rapidapi.com/v1/geo/cities/${cityId}`,
          {
            headers: {
              "X-RapidAPI-Key": "7d392d73a8mshd529ad7b1b590b9p1e5f6ajsn23880764888e",
              "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com"
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(response.status === 429 ? 
            "Límite de solicitudes excedido. Intenta nuevamente más tarde." : 
            "Error al obtener datos de la ciudad");
        }
        
        const data = await response.json();
        if (isMounted) {
          localStorage.setItem(`city_${cityId}`, JSON.stringify(data.data));
          setCityInfo(data.data);
        }
        return data.data;
      } catch (error) {
        if (isMounted) {
          setError(error.message);
        }
        return null;
      }
    };

    const fetchWeatherData = async (city) => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`
        );
        
        if (!response.ok) throw new Error("Error al obtener datos del clima");
        
        const data = await response.json();
        if (isMounted) {
          setForecast(data);
          createChart(data);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const createChart = (weatherData) => {
      if (!weatherData || !chartRef.current) return;
      
      const ctx = chartRef.current.getContext('2d');
      
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }
      
      const labels = weatherData.hourly.time.slice(0, 24).map(time => 
        new Date(time).toLocaleTimeString([], {hour: '2-digit'})
      );
      const temperatures = weatherData.hourly.temperature_2m.slice(0, 24);
      
      chartRef.current.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Temperatura (°C)',
            data: temperatures,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            fill: true,
            backgroundColor: 'rgba(75, 192, 192, 0.2)'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: {
              display: true,
              text: 'Pronóstico de temperatura para las próximas 24 horas'
            }
          }
        }
      });
    };

    fetchCityInfo().then(city => {
      if (city) fetchWeatherData(city);
    });

    const chartInstanceRef = chartRef.current;

    return () => {
      isMounted = false;
      if (chartInstanceRef && chartInstanceRef.chart) {
        chartInstanceRef.chart.destroy();
      }
    };
  }, [cityId]);

  // Icono
  const getWeatherIcon = (weathercode) => {
    if (weathercode >= 80) return <Thunderstorm color="error" fontSize="large" />;
    if (weathercode >= 51 || weathercode <= 3) return <Cloud color="info" fontSize="large" />;
    return <WbSunny color="warning" fontSize="large" />;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Button onClick={() => navigate(-1)} variant="contained" sx={{ mb: 3 }}>
        Volver
      </Button>
      
      {loading && !error && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {cityInfo && forecast && (
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Clima actual a la izquierda */}
          <Card sx={{ minWidth: 280, flex: '0 0 320px', mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={`https://flagcdn.com/w40/${cityInfo.countryCode?.toLowerCase()}.png`}
                  alt={cityInfo.country}
                  sx={{ mr: 2 }}
                />
                <Box>
                  <Typography variant="h5">
                    {cityInfo.name}, {cityInfo.country}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {cityInfo.region}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                {getWeatherIcon(forecast.current_weather.weathercode)}
                <Typography variant="h2">
                  {forecast.current_weather.temperature}°C
                </Typography>
              </Box>
              <Typography>
                <strong>Viento:</strong> {forecast.current_weather.windspeed} km/h
              </Typography>
              <Typography>
                <strong>Hora:</strong> {new Date(forecast.current_weather.time).toLocaleTimeString()}
              </Typography>
            </CardContent>
          </Card>
          {/* Gráfico a la derecha */}
          <Box sx={{ flex: 1, minWidth: 320 }}>
            <Typography variant="h6" gutterBottom>
              Pronóstico de 24 horas
            </Typography>
            <Box sx={{ mb: 4 }}>
              <canvas ref={chartRef} width="800" height="400" />
            </Box>
            <Typography variant="h6" gutterBottom>
              Pronóstico semanal
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 2 }}>
              {forecast.daily.time.map((day, index) => (
                <Card key={day} sx={{ p: 2 }}>
                  <Typography variant="subtitle1">
                    {new Date(day).toLocaleDateString([], { weekday: 'long' })}
                  </Typography>
                  <Typography>
                    Máx: {forecast.daily.temperature_2m_max[index]}°C
                  </Typography>
                  <Typography>
                    Mín: {forecast.daily.temperature_2m_min[index]}°C
                  </Typography>
                </Card>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default WeatherCharts;