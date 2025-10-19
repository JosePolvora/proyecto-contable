import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import {
  FiFileText, // Expedientes
  FiUpload, // Carga masiva
  FiClock, // Historial
  FiAlertCircle, // Pendientes
  FiCheckCircle, // Terminados
  FiFolder,
} from "react-icons/fi";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2>Menú</h2>
      <ul>
        <li>
          <NavLink
            to="/admin/expedientes"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FiFileText className="sidebar-icon" />
            <span>Expedientes</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/expedientes/upload-excel"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FiUpload className="sidebar-icon" />
            <span>Carga Masiva</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/expedientes/historial"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FiClock className="sidebar-icon" />
            <span>Seguimiento</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/expedientes/usuarios/pendientes"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FiAlertCircle className="sidebar-icon" />
            <span>Pendientes</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/expedientes/usuarios/terminados"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FiCheckCircle className="sidebar-icon" />
            <span>Terminados</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/expedientes/administrador"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FiFolder className="sidebar-icon" />
            <span>Consulta General</span>
          </NavLink>
        </li>
      </ul>
      <p className="footer-copyright">
        © {new Date().getFullYear()} Jose Oviedo.
      </p>
    </aside>
  );
};

export default Sidebar;
