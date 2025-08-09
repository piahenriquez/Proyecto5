import { Container, Typography } from '@mui/material';
import CitySearch from "../../components/CitySearch/CitySearch";

const Home = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold',
          textAlign: 'center',
          color: 'primary.main',
          mb: 4,
          fontSize: { xs: '2rem', md: '2.5rem' }
        }}
      >
        Cityfind
      </Typography>
      
      <CitySearch />
    </Container>
  );
};

export default Home;