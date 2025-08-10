import { Box, Container, Typography, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom"; // 👈 Importa Link de React Router

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="body1" align="center">
          © {new Date().getFullYear()} Cityfind. Todos los derechos reservados.
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          <MuiLink component={Link} to="/" color="inherit"> 
            Inicio
          </MuiLink>{" "}
          |{" "}
          <MuiLink component={Link} to="/about" color="inherit">
            Acerca de
          </MuiLink>{" "}
          |{" "}
          <MuiLink component={Link} to="/contact" color="inherit">
            Contacto
          </MuiLink>
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;