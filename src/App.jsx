import { Routes, Route } from "react-router-dom";
import LayoutAdmin from "./layouts/LayoutAdmin";
import LayoutUser from "./layouts/LayoutUser";
import PrivateRoute from "./componentes/PrivateRoute";

// Páginas
import Expedientes from "./pages/Expedientes";
import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import ExpedientesUser from "./pages/ExpedientesUser";
import MisExpedientes from "./pages/MisExpedientes";
import HistorialExpedientes from "./pages/HistorialExpedientes";
import Reingresos from "./pages/Reingresos";
import EditarUsuarioExpediente from "./pages/EditarUsuarioExpediente";
import PendientesUsuario from "./pages/PendientesUsuario";
import UploadExcel from "./pages/UploadExcel";
import TerminadosEstadisticas from "./pages/TerminadosEstadisticas";
import EditarUsuario from "./pages/EditarUsuario";
import UsuarioExpedientes from "./pages/UsuarioExpedientes";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/login" element={<Login />} />

      {/* Rutas ADMIN protegidas */}
      <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<LayoutAdmin />}>
          <Route path="expedientes" element={<Expedientes />} />

          <Route
            path="expedientes/historial"
            element={<HistorialExpedientes />}
          />
          <Route
            path="expedientes/editar-usuario/:id"
            element={<EditarUsuarioExpediente />}
          />
          <Route
            path="expedientes/usuarios/pendientes"
            element={<PendientesUsuario />}
          />
          <Route
            path="expedientes/usuarios/terminados"
            element={<TerminadosEstadisticas />}
          />
          <Route path="expedientes/upload-excel" element={<UploadExcel />} />

          <Route
            path="expedientes/editar-usuario/:id"
            element={<EditarUsuario />}
          />
        </Route>
      </Route>

      {/* Rutas USUARIO protegidas */}
      <Route element={<PrivateRoute allowedRoles={["usuario"]} />}>
        <Route path="/user" element={<LayoutUser />}>
          {/* Página principal de expedientes */}

          <Route path="expedientes" element={<ExpedientesUser />} />
          <Route path="expedientes/asignados" element={<MisExpedientes />} />
          <Route path="expedientes/reingresos" element={<Reingresos />} />
          <Route path="expedientes/:id" element={<ExpedientesUser />} />

          <Route path="expedientes/usuario" element={<UsuarioExpedientes />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
