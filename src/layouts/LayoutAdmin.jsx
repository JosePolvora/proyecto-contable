import Sidebar from "../componentes/sidebar/Sidebar";
import Header from "../componentes/header/Header";
import { Outlet } from "react-router-dom";
import "./LayoutAdmin.css"; // asegúrate de importar el CSS

export default function LayoutAdmin() {
  return (
    <div className="layout">
      {" "}
      {/* contenedor horizontal */}
      <Sidebar /> {/* a la izquierda */}
      <div className="panel">
        {" "}
        {/* header arriba + main */}
        <Header />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
