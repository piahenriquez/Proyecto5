import { Container, Typography, Box, Avatar, Paper } from '@mui/material';

const About = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ 
        p: { xs: 3, md: 4 },
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)'
      }}>
        {/* Título principal */}
        <Typography 
          variant="h3" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 3,
            textAlign: 'center'
          }}
        >
          Sobre CityFind
        </Typography>

        {/* Misión */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: 'secondary.main' }}>
            Nuestra Misión
          </Typography>
          <Typography >
            En CityFind nos dedicamos a proporcionar información meteorológica precisa y accesible 
            para ayudar a personas y empresas en la planificación de sus actividades diarias. 
            Creemos que el acceso a datos climáticos confiables debería ser sencillo y gratuito.
          </Typography>
        </Box>
        </Paper>

    </Container>
  );
};

export default About;