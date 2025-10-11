import SidebarUser from "../componentes/sidebar/SidebarUser";
import Header from "../componentes/header/Header";
import { Outlet } from "react-router-dom";
import "./LayoutUser.css"; // CSS separado si querés

export default function LayoutUser() {
  return (
    <div className="layout">
      {" "}
      {/* contenedor horizontal */}
      <SidebarUser /> {/* sidebar a la izquierda */}
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
