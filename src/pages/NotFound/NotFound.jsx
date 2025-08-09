import { Container, Typography, Box, Paper, Button } from '@mui/material';
import { Home, ArrowBack } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
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
            mb: 2
          }}
        >
          404 - Página no encontrada
        </Typography>

        {/* Mensaje descriptivo */}
        <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary' }}>
          Lo sentimos, la página que estás buscando no existe.
        </Typography>

        
        <Box sx={{ 
          fontSize: '5rem',
          color: 'primary.light',
          mb: 4,
          lineHeight: 1
        }}>
          ⎈
        </Box>

        {/* Botones de acción */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: 2,
          flexWrap: 'wrap'
        }}>
          <Button 
            variant="contained" 
            component={Link} 
            to="/"
            startIcon={<Home />}
            sx={{ px: 4 }}
          >
            Ir al Inicio
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={() => window.history.back()}
            startIcon={<ArrowBack />}
          >
            Volver Atrás
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFound;