import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCheckCircle,
  FaClock,
  FaFolderOpen,
  FaFolder,
  FaFilter,
  FaRedo,
} from "react-icons/fa";
import "./UsuarioExpedientes.css";

const UsuarioExpedientes = () => {
  const [expedientes, setExpedientes] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const usuarioId = Number(localStorage.getItem("usuarioId") || 2);

  useEffect(() => {
    if (!usuarioId) return;

    axios
      .get(`http://localhost:3000/api/expedientes/usuario/${usuarioId}`)
      .then((res) => {
        if (res.data.ok && Array.isArray(res.data.body)) {
          // 🔹 Ordenamos por fecha del último movimiento (updatedAt)
          const ordenados = [...res.data.body].sort((a, b) => {
            const fechaA = new Date(a.updatedAt || a.fechaIngreso);
            const fechaB = new Date(b.updatedAt || b.fechaIngreso);
            return fechaB - fechaA; // más recientes primero
          });
          setExpedientes(ordenados);
        }
      })
      .catch((err) => console.error("Error cargando expedientes:", err));
  }, [usuarioId]);

  // 🔹 Filtrado visual
  const filtrarExpedientes = () => {
    switch (filtro) {
      case "terminados":
        return expedientes.filter(
          (e) => e.terminado === true || e.terminado === 1
        );
      case "pendientes":
        return expedientes.filter(
          (e) => e.terminado === false || e.terminado === 0
        );
      default:
        return expedientes;
    }
  };

  const datosFiltrados = filtrarExpedientes();

  // 🔹 Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = datosFiltrados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(datosFiltrados.length / itemsPerPage);

  // 🔹 Totales
  const total = expedientes.length;
  const totalTerminados = expedientes.filter(
    (e) => e.terminado === true || e.terminado === 1
  ).length;
  const totalPendientes = expedientes.filter(
    (e) => e.terminado === false || e.terminado === 0
  ).length;

  return (
    <div>
      <h2>
        <FaFolderOpen style={{ marginRight: "10px", color: "#ff9800" }} />
        Consulta Estado de Expedientes
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
              <th>Fecha Ingreso</th>
              <th>Último Movimiento</th> {/* ✅ Nueva columna */}
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
                        {/* <FaRedo /> Reingresado */}
                      </span>
                    ) : (
                      <span className="estado pendiente">
                        <FaClock /> Pendiente
                      </span>
                    )}
                  </td>
                  <td>
                    {exp.fechaIngreso
                      ? new Date(exp.fechaIngreso).toLocaleDateString("es-AR")
                      : "-"}
                  </td>
                  {/* <td>
                    {exp.updatedAt
                      ? new Date(exp.updatedAt).toLocaleString("es-AR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-"}
                  </td> */}
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
                <td colSpan="7" style={{ textAlign: "center", color: "#ccc" }}>
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

        {/* Resumen */}
        <div className="usuario-resumen">
          <div className="resumen-item total">
            <FaFolderOpen /> Total: {total}
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

export default UsuarioExpedientes;
