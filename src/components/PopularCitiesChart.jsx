import { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box, CircularProgress } from "@mui/material";
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Ciudades predeterminadas 
const DEFAULT_CITIES = [
  { name: "Tokio", population: 37.4 },
  { name: "Nueva Delhi", population: 31.0 },
  { name: "Shanghái", population: 27.1 },
  { name: "São Paulo", population: 22.2 },
  { name: "Ciudad de México", population: 21.9 },
];

const GEO_API_KEY = import.meta.env.VITE_GEO_API_KEY;

export default function PopularCitiesChart() {
  const [cities, setCities] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularCities = async () => {
      try {
        const response = await fetch(
          "https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=5&sort=-population",
          {
            headers: {
              "X-RapidAPI-Key": GEO_API_KEY,
              "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
            },
          }
        );
        const data = await response.json();
        
        const citiesData = Array.isArray(data.data) ? data.data.slice(0, 5) : DEFAULT_CITIES;
        setCities(citiesData);
      } catch (error) {
        console.error("Error fetching cities:", error);
        setCities(DEFAULT_CITIES); 
      } finally {
        setLoading(false);
      }
    };
    fetchPopularCities();
  }, []);

 
  const chartData = {
    labels: cities.map((city) => city.name),
    datasets: [
      {
        label: "Población (millones)",
        data: cities.map((city) => 
          city.population?.toFixed(1) || city.population 
        ),
        backgroundColor: "#3f51b5",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Millones de habitantes" },
      },
    },
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Ciudades más pobladas
        </Typography>
        <Box sx={{ height: 300 }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Bar data={chartData} options={chartOptions} />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}