import { Link } from "react-router-dom";
import "./Inicio.css";

const Inicio = () => {
  return (
    <div className="inicio-container">
      <h1>Sistema de Control Contable</h1>
      <p>Gestión de expedientes</p>
      <Link to="/login" className="inicio-btn">
        Iniciar Sesión
      </Link>
    </div>
  );
};

export default Inicio;
