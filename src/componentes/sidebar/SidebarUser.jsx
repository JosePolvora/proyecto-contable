import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import { FaFolderOpen, FaRedo, FaChartBar } from "react-icons/fa"; // íconos más representativos

const SidebarUser = () => {
  return (
    <aside className="sidebar">
      <h2>Menú</h2>
      <ul>
        <li>
          <NavLink
            to="/user/expedientes/asignados"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaFolderOpen style={{ marginRight: "8px" }} />
            <span className="sidebar-text">Mis Expedientes</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/user/expedientes/reingresos"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaRedo style={{ marginRight: "8px" }} />
            <span className="sidebar-text">Reingresos</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/user/expedientes/usuario"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaChartBar style={{ marginRight: "8px" }} />
            <span className="sidebar-text">Consulta Estado</span>
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default SidebarUser;
