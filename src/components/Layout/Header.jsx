import { Link } from "react-router-dom"

const Header = () => {
  return (
    <header >
      <h1>Aplicación</h1>
      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/about">Acerca de</Link>
      </nav>
    </header>
  )
}

export default Header