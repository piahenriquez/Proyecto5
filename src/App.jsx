import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import NotFound from "./pages/NotFound/NotFound";
import WeatherCharts from "./pages/WeatherCharts/WeatherCharts";
import Dashboard from "./pages/Dashboard/Dashboard";



function App() {

  return (
    <BrowserRouter>    
    <Routes>
      <Route path="/" element={<Layout/>} >
      <Route index element={<Home/>} />
      <Route path="about" element={<About/>} />
      <Route path="contact" element={<Contact/>} />
      <Route path="weather-charts/:cityId" element={<WeatherCharts />} />
      <Route path="*" element={<NotFound/>} />
      <Route path="dashboard" element={<Dashboard />} />

      </Route>
      </Routes>      
    </BrowserRouter>
  )
}

export default App
