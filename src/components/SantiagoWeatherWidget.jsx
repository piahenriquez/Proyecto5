import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box, CircularProgress } from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CloudIcon from "@mui/icons-material/Cloud";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import AirIcon from "@mui/icons-material/Air";

const OPEN_METEO_URL = import.meta.env.VITE_OPEN_METEO_URL;

export default function SantiagoWeatherWidget() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        
        const response = await fetch(
          `${OPEN_METEO_URL}?latitude=-33.45&longitude=-70.66&current=temperature_2m,relative_humidity_2m,wind_speed_10m&hourly=temperature_2m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=America/Santiago`
        );
        if (!response.ok) throw new Error("Error al cargar datos");
        const data = await response.json();
        setWeatherData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  
  const getWeatherIcon = (code) => {
    if (code === 0) return <WbSunnyIcon />; 
    if (code >= 1 && code <= 3) return <CloudIcon />; 
    return <CloudIcon />; 
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Card sx={{ minWidth: 275, height: "100%" }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Clima en Santiago, Chile
        </Typography>

        {/* Clima actual */}
        {weatherData?.current && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            {getWeatherIcon(weatherData.daily.weather_code[0])}
            <Typography variant="h4">
              {weatherData.current.temperature_2m}°C
            </Typography>
            <Box sx={{ ml: "auto" }}>
              <Typography variant="body2">
                <WaterDropIcon fontSize="small" /> Humedad: {weatherData.current.relative_humidity_2m}%
              </Typography>
              <Typography variant="body2">
                <AirIcon fontSize="small" /> Viento: {weatherData.current.wind_speed_10m} km/h
              </Typography>
            </Box>
          </Box>
        )}

        {/* Pronóstico diario  */}
        {weatherData?.daily && (
          <Box>
            <Typography variant="subtitle1" sx={{ mt: 1 }}>
              Pronóstico:
            </Typography>
            {weatherData.daily.time.slice(0, 3).map((date, i) => (
              <Box key={date} sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                <Typography variant="body2">
                  {new Date(date).toLocaleDateString("es-CL", { weekday: "short" })}
                </Typography>
                <Typography variant="body2">
                  {weatherData.daily.temperature_2m_max[i]}° / {weatherData.daily.temperature_2m_min[i]}°
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}