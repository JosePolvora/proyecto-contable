import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCheckCircle,
  FaClock,
  FaFolderOpen,
  FaFolder,
  FaFilter,
  FaRedo,
  FaSearch,
} from "react-icons/fa";
import "./UsuarioExpedientes.css";

const Expedientes = () => {
  const [expedientes, setExpedientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // 🔹 Cargar expedientes
  useEffect(() => {
    axios
      .get(`https://santaisabel2.online/api/expedientes`)
      .then((res) => {
        if (res.data.ok && Array.isArray(res.data.body)) {
          const ordenados = [...res.data.body].sort((a, b) => {
            const fechaA = new Date(a.updatedAt || a.fechaIngreso);
            const fechaB = new Date(b.updatedAt || b.fechaIngreso);
            return fechaB - fechaA;
          });
          setExpedientes(ordenados);
        }
      })
      .catch((err) => console.error("Error cargando expedientes:", err));
  }, []);

  // 🔹 Cargar usuarios
  useEffect(() => {
    axios
      .get("https://santaisabel2.online/api/usuarios")
      .then((res) => {
        if (res.data.ok && Array.isArray(res.data.body)) {
          setUsuarios(res.data.body);
        }
      })
      .catch((err) => console.error("Error cargando usuarios:", err));
  }, []);

  // 🔹 Obtener nombre de usuario según ID
  const getNombreUsuario = (id) => {
    const user = usuarios.find((u) => u.usuario_id === id);
    return user ? user.nombre : "Sin asignar";
  };

  // 🔹 Filtrado combinado
  const filtrarExpedientes = () => {
    return expedientes
      .filter((e) => {
        if (filtro === "terminados") return e.terminado === true || e.terminado === 1;
        if (filtro === "pendientes") return e.terminado === false || e.terminado === 0;
        return true;
      })
      .filter((e) => {
        if (usuarioSeleccionado === "todos") return true;
        return e.usuario_id === parseInt(usuarioSeleccionado);
      })
      .filter((e) => {
        const texto = busqueda.toLowerCase();
        return (
          e.numero?.toLowerCase().includes(texto) ||
          e.asunto?.toLowerCase().includes(texto)
        );
      });
  };

  const datosFiltrados = filtrarExpedientes();

  // 🔹 Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = datosFiltrados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(datosFiltrados.length / itemsPerPage);

  // 🔹 Totales (AHORA basados en los datos filtrados)
  const total = datosFiltrados.length;
  const totalTerminados = datosFiltrados.filter(
    (e) => e.terminado === true || e.terminado === 1
  ).length;
  const totalPendientes = datosFiltrados.filter(
    (e) => e.terminado === false || e.terminado === 0
  ).length;

  return (
    <div>
      <h2>
        {/* <FaFolderOpen style={{ marginRight: "10px", color: "#ff9800" }} /> */}
        Consulta General de Expedientes
      </h2>

      <div className="usuario-expedientes-container">
        {/* Filtros */}
        <div className="usuario-filtros">
          <button
            className={filtro === "todos" ? "activo" : ""}
            onClick={() => {
              setFiltro("todos");
              setCurrentPage(1);
            }}
          >
            <FaFilter /> Todos
          </button>
          <button
            className={filtro === "terminados" ? "activo" : ""}
            onClick={() => {
              setFiltro("terminados");
              setCurrentPage(1);
            }}
          >
            <FaCheckCircle /> Terminados
          </button>
          <button
            className={filtro === "pendientes" ? "activo" : ""}
            onClick={() => {
              setFiltro("pendientes");
              setCurrentPage(1);
            }}
          >
            <FaClock /> Pendientes
          </button>

          {/* 🔹 Filtro por usuario */}
          <select
            value={usuarioSeleccionado}
            onChange={(e) => {
              setUsuarioSeleccionado(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              marginLeft: "15px",
              padding: "6px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            <option value="todos">Todos los usuarios</option>
            {usuarios.map((u) => (
              <option key={u.usuario_id} value={u.usuario_id}>
                {u.nombre}
              </option>
            ))}
          </select>

          {/* 🔹 Barra de búsqueda */}
          <div style={{ marginLeft: "15px", display: "flex", alignItems: "center" }}>
            <FaSearch style={{ marginRight: "5px", color: "#666" }} />
            <input
              type="text"
              placeholder="Buscar por número o asunto..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                padding: "6px 10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        </div>

        {/* Tabla */}
        <table className="tabla-expedientes">
          <thead>
            <tr>
              <th>N° Expediente</th>
              <th>Asunto</th>
              <th>Clase</th>
              <th>Movimiento</th>
              <th>Estado</th>
              <th>Usuario</th>
              <th>Fecha Ingreso</th>
              <th>Último Movimiento</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((exp) => (
                <tr key={exp.expediente_id}>
                  <td>{exp.numero}</td>
                  <td>{exp.asunto}</td>
                  <td>{exp.clase}</td>
                  <td>{exp.tipoMovimiento}</td>
                  <td>
                    {exp.terminado === true || exp.terminado === 1 ? (
                      <span className="estado terminado">
                        <FaCheckCircle /> Terminado
                      </span>
                    ) : exp.reingresos > 0 ? (
                      <span className="estado reingresado">
                        <FaRedo /> Pendiente
                      </span>
                    ) : (
                      <span className="estado pendiente">
                        <FaClock /> Pendiente
                      </span>
                    )}
                  </td>
                  <td>
                    {exp.usuario?.nombre ||
                      exp.usuarioNombre ||
                      getNombreUsuario(exp.usuario_id)}
                  </td>
                  <td>
                    {exp.fechaIngreso
                      ? new Date(exp.fechaIngreso).toLocaleDateString("es-AR")
                      : "-"}
                  </td>
                  <td>
                    {exp.updatedAt
                      ? new Date(exp.updatedAt).toLocaleDateString("es-AR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", color: "#ccc" }}>
                  <FaFolder style={{ marginRight: "5px" }} /> No hay expedientes
                  para mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Paginación */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "15px",
              gap: "8px",
            }}
          >
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                style={{
                  padding: "6px 10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  backgroundColor: i + 1 === currentPage ? "#ff9800" : "#fff",
                  color: i + 1 === currentPage ? "#fff" : "#000",
                  cursor: "pointer",
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        {/* Resumen (filtrado) */}
        <div className="usuario-resumen">
          <div className="resumen-item total">
            <FaFolderOpen /> Total filtrado: {total}
          </div>
          <div className="resumen-item terminado">
            <FaCheckCircle /> Terminados: {totalTerminados}
          </div>
          <div className="resumen-item pendiente">
            <FaClock /> Pendientes: {totalPendientes}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expedientes;
