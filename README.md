# Aplicación de Búsqueda de Ciudades y Clima

## Descripción
Esta es una aplicación web que permite buscar ciudades de todo el mundo y obtener información meteorológica en tiempo real.  
Utiliza la API **GeoDB Cities** para localizar ciudades y la API **Open-Meteo** para mostrar datos del clima actual y pronósticos horarios.

## Características
- Búsqueda controlada de ciudades (botón o tecla Enter)
- Visualización de banderas de países junto a cada ciudad
- Información climática detallada:
  - Temperatura actual
  - Condiciones meteorológicas
  - Velocidad del viento
- Página **WeatherCharts** con:
  - Panel lateral con el clima actual
  - Gráfico del pronóstico horario

## Tecnologías Utilizadas
- [React (Vite)](https://vitejs.dev/)
- [Material UI (MUI)](https://mui.com/)
- [React Router](https://reactrouter.com/)
- [GeoDB Cities API](https://rapidapi.com/wirefreethought/api/geodb-cities/)
- [Open-Meteo API](https://open-meteo.com/)
- [Chart.js](https://www.chartjs.org/)
- [date-fns](https://date-fns.org/)

## Instalación y Ejecución

1. Clona este repositorio:
   ```bash
   git clone <URL-del-repositorio>
   cd mi-proyecto
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Ejecuta la aplicación en modo desarrollo:
   ```bash
   npm run dev
   ```
   # Configuración de API Keys

1. Regístrese en RapidAPI: https://rapidapi.com/
2. Suscríbase a la API "GB Cities"
3. Cree un archivo `.env` en la raíz del proyecto






