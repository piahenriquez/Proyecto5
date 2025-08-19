import { Grid, Box } from "@mui/material";
import PopularCitiesChart from "../../components/PopularCitiesChart";
import SantiagoWeatherWidget from "../../components/SantiagoWeatherWidget";

export default function Dashboard() {
  return (
    <Box sx={{
       p: 3,
        flex: 1,
       display: "flex",
        flexDirection: "column",
       justifyContent: "center",
       }}>
      <Grid container 
      spacing={3}
      sx={{
        maxWidth: "1200px",
        justifyContent: "center",
      }}
      >
        {/* Módulo 1: Ciudades populares */}
        <Grid  xs={12} md={5}>
          <PopularCitiesChart />
        </Grid>

        {/* Módulo 2: Clima en Santiago */}
        <Grid  xs={12} md={5}>
          <SantiagoWeatherWidget />
        </Grid>
      </Grid>
    </Box>
  );
}
