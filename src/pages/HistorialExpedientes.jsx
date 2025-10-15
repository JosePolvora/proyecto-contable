import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaArrowLeft, FaArrowRight, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./HistorialExpedientes.css";
import Swal from "sweetalert2";

const HistorialExpedientes = () => {
  const [expedientes, setExpedientes] = useState([]);
  const [busquedaNumero, setBusquedaNumero] = useState("");
  const [busquedaNombre, setBusquedaNombre] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 5;

  const navigate = useNavigate();

  // 🔹 Resetear a página 1 cuando cambian las búsquedas
  useEffect(() => {
    setPaginaActual(1);
  }, [busquedaNumero, busquedaNombre]);

  useEffect(() => {
    axios

      .get("https://santaisabel2.online/api/expedientes/historial")
      .then((res) => {
        if (res.data.ok) {
          setExpedientes(res.data.body || []);
        }
      })
      .catch((err) => console.error("Error cargando historial:", err));
  }, []);

  const expedientesFiltrados = expedientes.filter((exp) => {
    const coincideNumero = exp.numero
      ?.toString()
      .toLowerCase()
      .includes(busquedaNumero.toLowerCase());

    const nombreCompleto = `${exp.usuario?.nombre || ""} ${
      exp.usuario?.apellido || ""
    }`;
    const coincideNombre = nombreCompleto
      .toLowerCase()
      .includes(busquedaNombre.toLowerCase());

    return coincideNumero && coincideNombre;
  });

  const totalPaginas = Math.ceil(expedientesFiltrados.length / itemsPorPagina);
  const inicio = (paginaActual - 1) * itemsPorPagina;
  const fin = inicio + itemsPorPagina;
  const expedientesPaginados = expedientesFiltrados.slice(inicio, fin);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const copiarNumero = (numero) => {
    navigator.clipboard
      .writeText(numero)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Número copiado",
          text: `Expediente ${numero} copiado al portapapeles`,
          showConfirmButton: false,
          timer: 1800,
          toast: true,
          position: "bottom-end",
          background: "#2e2e2e",
          color: "#fff",
        });
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo copiar el número",
          showConfirmButton: false,
          timer: 1800,
          toast: true,
          position: "bottom-end",
        });
      });
  };

  return (
    <div className="historial-container">
      <h2>Historial de Expedientes</h2>

      <div className="busqueda-container">
        <input
          type="text"
          placeholder="Buscar por número de expediente..."
          value={busquedaNumero}
          onChange={(e) => setBusquedaNumero(e.target.value)}
          className="busqueda-input"
        />
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busquedaNombre}
          onChange={(e) => setBusquedaNombre(e.target.value)}
          className="busqueda-input"
        />
      </div>

      {expedientesPaginados.length === 0 ? (
        <p className="sin-resultados">No hay resultados para mostrar</p>
      ) : (
        <table className="historial-table">
          <thead>
            <tr>
              <th>Número</th>
              <th>Asunto</th>
              <th>Clase</th>
              <th>Movimiento</th>
              <th>Usuario</th>
              <th>Fecha Ingreso</th>
              <th>Fecha Inicio</th>
              <th>Observación</th>
              <th>Comentarios</th>
              <th>Terminado</th>
              <th>Fecha Envío</th>
              <th>Última actualización</th>
            </tr>
          </thead>
          <tbody>
            {expedientesPaginados.map((exp) => (
              <tr key={exp.expediente_id}>
                <td
                  className="expediente-numero"
                  onClick={() => copiarNumero(exp.numero)}
                  title="Click para copiar número"
                  style={{
                    cursor: "pointer",
                    color: "#ff9800",
                    fontWeight: "bold",
                  }}
                >
                  {exp.numero}
                </td>
                <td>{exp.asunto}</td>
                <td>{exp.clase}</td>
                <td>{exp.tipoMovimiento || "-"}</td>
                {/* <td>
                  {exp.usuario?.nombre} {exp.usuario?.apellido}{" "}
                  <FaEdit
                    style={{
                      cursor: "pointer",
                      marginLeft: "8px",
                      color: "#4caf50",
                    }}
                    title="Editar usuario"
                    onClick={() =>
                      navigate(
                        `/admin/expedientes/editar-usuario/${exp.expediente_id}`
                      )
                    }
                  />
                </td> */}
                <td>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    {exp.usuario?.nombre} {exp.usuario?.apellido}
                    <FaEdit
                      style={{
                        cursor: "pointer",
                        color: "#4caf50",
                        fontSize: "20px", // más grande
                      }}
                      title="Editar usuario"
                      onClick={() =>
                        navigate(
                          `/admin/expedientes/editar-usuario/${exp.expediente_id}`
                        )
                      }
                    />
                  </span>
                </td>

                <td>{formatDate(exp.fechaIngreso)}</td>
                <td>{formatDate(exp.fechaInicio)}</td>
                <td>{exp.observacion || "-"}</td>
                <td>{exp.comentarios || "-"}</td>
                <td>{exp.terminado ? "Sí" : "No"}</td>
                <td>{formatDate(exp.fechaEnvio)}</td>
                <td>{formatDate(exp.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="paginacion">
        <button
          onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
          disabled={paginaActual === 1}
          className="paginacion-btn"
        >
          <FaArrowLeft />
        </button>

        <span>
          Página {paginaActual} de {totalPaginas}
        </span>

        <button
          onClick={() =>
            setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
          }
          disabled={paginaActual === totalPaginas || totalPaginas === 0}
          className="paginacion-btn"
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default HistorialExpedientes;
