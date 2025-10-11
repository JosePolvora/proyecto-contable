import "./Header.css";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa"; // icono de logout

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("nombre"); // opcional
    navigate("/login");
  };

  const nombreUsuario = localStorage.getItem("nombre") || "Usuario";

  return (
    <header className="header">
      <h1>Panel de Administración</h1>
      <div className="header-right">
        <span className="nombre-usuario">Hola {nombreUsuario}.!!</span>
        <button className="btn-logout" onClick={handleLogout}>
          <FaSignOutAlt /> Cerrar sesión
        </button>
      </div>
    </header>
  );
};

export default Header;
