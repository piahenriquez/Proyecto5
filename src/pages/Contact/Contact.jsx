import { Container, Typography, Box, Paper } from '@mui/material';
import { LocationOn, Email, Phone, Schedule } from '@mui/icons-material';

const Contact = () => {
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
          Contacto
        </Typography>

        {/* Información de contacto */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: 'secondary.main' }}>
            Datos de Contacto
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationOn color="primary" sx={{ mr: 2 }} />
            <Typography>Av. Los Cien 742, Santiago, Chile</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Email color="primary" sx={{ mr: 2 }} />
            <Typography>contacto@cityfind.com</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Phone color="primary" sx={{ mr: 2 }} />
            <Typography>+56 9 8765 4321</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Schedule color="primary" sx={{ mr: 2 }} />
            <Typography>Lunes a Viernes: 9:00 - 18:00 hrs</Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Contact;