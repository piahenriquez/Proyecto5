import { Box, Container, Typography, Link } from "@mui/material";

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
          <Link color="inherit" href="/">
            Inicio
          </Link>{" "}
          |{" "}
          <Link color="inherit" href="/about">
            Acerca de
          </Link>{" "}
          |{" "}
          <Link color="inherit" href="/contact">
            Contacto
          </Link>
        </Typography>
      </Container>
    </Box>
  );
}
export default Footer;