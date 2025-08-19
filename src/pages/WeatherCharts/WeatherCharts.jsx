import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Chart, registerables } from 'chart.js';
import {
  Box, Button, Typography, CircularProgress, Card,
  Alert, Avatar, TextField
} from "@mui/material";
import { WbSunny, Cloud, Thunderstorm, DateRange } from "@mui/icons-material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import esLocale from 'date-fns/locale/es';

Chart.register(...registerables);

const GEO_API_KEY = import.meta.env.VITE_GEO_API_KEY;
const OPEN_METEO_URL = import.meta.env.VITE_OPEN_METEO_URL;

const WeatherCharts = () => {
  const { cityId } = useParams();
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [forecast, setForecast] = useState(null);
  const [cityInfo, setCityInfo] = useState(null);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date;
  });

  const formatDate = (date) => date.toISOString().split('T')[0];

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
              "X-RapidAPI-Key": import.meta.env.VITE_GEO_API_KEY,
              "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com"
            }
          }
        );
        if (!response.ok) throw new Error("Error al obtener datos de la ciudad");
        const data = await response.json();
        if (isMounted) {
          localStorage.setItem(`city_${cityId}`, JSON.stringify(data.data));
          setCityInfo(data.data);
        }
        return data.data;
      } catch (error) {
        if (isMounted) setError(error.message);
        return null;
      }
    };

    const fetchWeatherData = async (city) => {
      try {
        setLoading(true);
        const response = await fetch(
          `${OPEN_METEO_URL}?latitude=${city.latitude}&longitude=${city.longitude}&current_weather=true&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}&timezone=auto`
        );
        if (!response.ok) throw new Error("Error al obtener datos del clima");
        const data = await response.json();
        if (isMounted) {
          setForecast(data);
          setTimeout(() => createChart(data), 0);
        }
      } catch (error) {
        if (isMounted) setError(error.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const createChart = (weatherData) => {
      if (!weatherData || !chartRef.current) return;
      const ctx = chartRef.current.getContext('2d');
      if (chartRef.current.chartInstance) {
        chartRef.current.chartInstance.destroy();
      }
      const filteredData = weatherData.hourly.time
        .map((time, index) => ({
          time: new Date(time),
          temperature: weatherData.hourly.temperature_2m[index]
        }))
        .filter(item => item.time >= startDate && item.time <= endDate);

      const labels = filteredData.map(item =>
        item.time.toLocaleString([], { day: '2-digit', hour: '2-digit', minute: '2-digit' })
      );
      const temperatures = filteredData.map(item => item.temperature);

      chartRef.current.chartInstance = new Chart(ctx, {
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
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: {
              display: true,
              text: `Pronóstico de temperatura (${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()})`
            }
          },
          scales: {
            x: { ticks: { maxTicksLimit: 12 } }
          }
        }
      });
    };

    fetchCityInfo().then(city => {
      if (city) fetchWeatherData(city);
    });

    return () => {
      if (chartRef.current && chartRef.current.chartInstance) {
        chartRef.current.chartInstance.destroy();
      }
    };
  }, [cityId, startDate, endDate]);

  const handleDateChange = (newStartDate, newEndDate) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const getWeatherIcon = (weathercode) => {
    if (weathercode >= 80) return <Thunderstorm color="error" fontSize="large" />;
    if (weathercode >= 51 || weathercode <= 3) return <Cloud color="info" fontSize="large" />;
    return <WbSunny color="warning" fontSize="large" />;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px - 56px)',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          p: { xs: 1, md: 4 },
        }}
      >
        <Button onClick={() => navigate(-1)} variant="contained" sx={{ mb: 3 }}>
          Volver
        </Button>

        {/* Clima actual */}
        {cityInfo && forecast && (
          <Box
            sx={{
              maxWidth: 900,
              mx: "auto",
              mb: 4,
              p: 4,
              borderRadius: 4,
              background: "linear-gradient(90deg, #a8edea 0%, #fed6e3 100%)",
              boxShadow: 3,
              display: "flex",
              alignItems: "center",
              gap: 4,
              flexWrap: "wrap",
              justifyContent: "center"
            }}
          >
            <Avatar
              src={`https://flagcdn.com/w80/${cityInfo.countryCode?.toLowerCase()}.png`}
              alt={cityInfo.country}
              sx={{ width: 80, height: 80, mr: 2, boxShadow: 2 }}
            />
            <Box>
              <Typography variant="h3" fontWeight="bold" color="primary">
                {cityInfo.name}, {cityInfo.country}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {cityInfo.region}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                {getWeatherIcon(forecast.current_weather.weathercode)}
                <Typography variant="h2" fontWeight="bold">
                  {forecast.current_weather.temperature}°C
                </Typography>
              </Box>
              <Typography>
                <strong>Viento:</strong> {forecast.current_weather.windspeed} km/h
              </Typography>
              <Typography>
                <strong>Hora:</strong> {new Date(forecast.current_weather.time).toLocaleTimeString()}
              </Typography>
              <Typography variant="body2" sx={{ mt: 2 }}>
                <strong>Población:</strong> {cityInfo.population?.toLocaleString() || "N/A"}
                {" | "}
                <strong>Lat:</strong> {cityInfo.latitude}
                {" | "}
                <strong>Lon:</strong> {cityInfo.longitude}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Selector de fechas */}
        <Box
          sx={{
            maxWidth: 1100,
            mx: "auto",
            mb: 3,
            p: { xs: 2, md: 3 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: 2,
            background: "rgba(255,255,255,0.7)",
            borderRadius: 3,
            boxShadow: 1,
          }}
        >
          <Typography variant="body1" sx={{ flex: 1, minWidth: 200 }}>
            Por favor, elige una fecha inicial y final para ver el pronóstico de temperatura.
          </Typography>
          <DatePicker
            label="Fecha inicial"
            value={startDate}
            onChange={(newValue) => handleDateChange(newValue, endDate)}
            maxDate={endDate}
            renderInput={(params) => <TextField {...params} size="small" />}
          />
          <DatePicker
            label="Fecha final"
            value={endDate}
            onChange={(newValue) => handleDateChange(startDate, newValue)}
            minDate={startDate}
            renderInput={(params) => <TextField {...params} size="small" />}
          />
          <Button
            variant="outlined"
            startIcon={<DateRange />}
            onClick={() => {
              const today = new Date();
              const nextWeek = new Date();
              nextWeek.setDate(today.getDate() + 7);
              handleDateChange(today, nextWeek);
            }}
          >
            Restablecer
          </Button>
        </Box>

        {/* Mensaje de carga o error */}
        {loading && !error && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress size={40} thickness={4} />
          </Box>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Gráfico */}
        {forecast && (
          <Box
            sx={{
              width: "100%",
              maxWidth: 900,
              mx: "auto",
              mb: 4,
              p: 2.5,
              background: "linear-gradient(90deg, #fbc2eb 0%, #a6c1ee 100%)",
              borderRadius: 4,
              boxShadow: 2,
            }}
          >
            <Typography variant="h5" gutterBottom align="center">
              Pronóstico de temperatura
            </Typography>
            <Box sx={{ height: { xs: 180, md: 260 }, width: "100%", maxWidth: 800, mx: "auto" }}>
              <canvas ref={chartRef} style={{ width: '100%', height: '100%' }} />
            </Box>
          </Box>
        )}

        {/* Pronóstico diario */}
        {forecast && (
          <Box
            sx={{
              width: "100%",
              maxWidth: 900,
              mx: "auto",
              mb: 4,
              p: 2.5,
              background: "linear-gradient(90deg, #fdfbfb 0%, #ebedee 100%)",
              borderRadius: 4,
              boxShadow: 1,
            }}
          >
            <Typography variant="h5" gutterBottom align="center">
              Pronóstico diario ({startDate.toLocaleDateString()} - {endDate.toLocaleDateString()})
            </Typography>
            <Box sx={{
              display: 'flex',
              flexWrap: 'nowrap',
              overflowX: 'auto',
              gap: 2,
              justifyContent: 'flex-start',
              py: 2,
            }}>
              {forecast.daily.time.map((day, index) => {
                const dayDate = new Date(day);
                if (dayDate >= startDate && dayDate <= endDate) {
                  return (
                    <Card
                      sx={{
                        p: 2,
                        minWidth: 120,
                        maxWidth: 140,
                        flex: "0 0 auto",
                        textAlign: "center",
                        background: "rgba(255,255,255,0.85)",
                        boxShadow: 1,
                      }}
                      key={day}
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        {dayDate.toLocaleDateString([], { weekday: 'short' })}
                      </Typography>
                      <Typography variant="body2">
                        {dayDate.toLocaleDateString()}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "center", mt: 1 }}>
                        {getWeatherIcon(forecast.daily.weathercode[index])}
                        <Box sx={{ ml: 1 }}>
                          <Typography variant="body2">
                            ↑ {forecast.daily.temperature_2m_max[index]}°C
                          </Typography>
                          <Typography variant="body2">
                            ↓ {forecast.daily.temperature_2m_min[index]}°C
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  );
                }
                return null;
              })}
            </Box>
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default WeatherCharts;