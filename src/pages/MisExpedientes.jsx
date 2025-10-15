import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEdit, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FaSearch } from "react-icons/fa"; // icono lupa
import "./MisExpedientes.css";

const MisExpedientes = () => {
  const [expedientes, setExpedientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const expedientesPorPagina = 5;

  const navigate = useNavigate();
  const usuarioId = Number(localStorage.getItem("usuarioId"));

  useEffect(() => {
    if (!usuarioId) return;

    axios
      .get(`https://santaisabel2.online/api/expedientes/usuario/${usuarioId}`)
      .then((res) => {
        if (res.data.ok) {
          // Ordenar por fechaIngreso descendente (última cargada primero)
          const sorted = (res.data.body || []).sort(
            (a, b) => new Date(b.fechaIngreso) - new Date(a.fechaIngreso)
          );
          setExpedientes(sorted);
        } else {
          setExpedientes([]);
        }
      })
      .catch((err) => {
        console.error("Error cargando expedientes:", err);
        setExpedientes([]);
      });
  }, [usuarioId]);

  // 🔹 Formatear fechas DD-MM-AAAA
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // 🔹 Copiar expediente con SweetAlert
  const copiarExpediente = (numero) => {
    navigator.clipboard.writeText(numero).then(() => {
      Swal.fire({
        icon: "success",
        title: "Número copiado",
        text: `Expediente ${numero} copiado al portapapeles`,
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        position: "bottom-end",
        background: "#2e2e2e",
        color: "#fff",
      });
    });
  };

  // 🔹 Filtrar expedientes
  const expedientesFiltrados = expedientes.filter((exp) =>
    exp.numero.toLowerCase().includes(busqueda.toLowerCase())
  );

  // 🔹 Paginación
  const indexUltimo = paginaActual * expedientesPorPagina;
  const indexPrimero = indexUltimo - expedientesPorPagina;
  const expedientesPagina = expedientesFiltrados.slice(
    indexPrimero,
    indexUltimo
  );
  const totalPaginas = Math.ceil(
    expedientesFiltrados.length / expedientesPorPagina
  );

  return (
    <div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por número de expediente"
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPaginaActual(1);
          }}
        />
        <FaSearch className="search-icon" />
      </div>

      <div className="exp-table-container">
        <h2>Mis Expedientes</h2>

        {expedientesPagina.length === 0 ? (
          <p>No hay expedientes asignados.</p>
        ) : (
          <>
            <table className="exp-table">
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Asunto</th>
                  <th>Clase</th>
                  <th>Fecha Ingreso</th>
                  <th>Fecha Inicio</th>
                  <th>Observación</th>
                  <th>Comentarios</th>
                  <th>Terminado</th>
                  <th>Fecha Envío</th>
                  <th>Movimiento</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {expedientesPagina.map((exp) => (
                  <tr key={exp.expediente_id}>
                    <td
                      className="expediente-clickable"
                      onClick={() => copiarExpediente(exp.numero)}
                    >
                      {exp.numero}
                    </td>
                    <td>{exp.asunto}</td>
                    <td>{exp.clase}</td>
                    <td>{formatDate(exp.fechaIngreso)}</td>
                    <td>{formatDate(exp.fechaInicio)}</td>
                    <td>{exp.observacion || "-"}</td>
                    <td>{exp.comentarios || "-"}</td>
                    <td>{exp.terminado ? "Sí" : "No"}</td>
                    <td>{formatDate(exp.fechaEnvio)}</td>
                    <td>
                      {exp.reingresos === 0
                        ? "Ingreso"
                        : `Reingreso ${exp.reingresos}`}
                    </td>
                    <td>
                      <button
                        className="icon-btn"
                        onClick={() =>
                          navigate(`/user/expedientes/${exp.expediente_id}`)
                        }
                      >
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Controles de paginación con íconos */}
            <div className="pagination">
              <button
                onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
                disabled={paginaActual === 1}
              >
                <FaArrowLeft />
              </button>
              <span>
                {paginaActual} / {totalPaginas}
              </span>
              <button
                onClick={() =>
                  setPaginaActual((p) => Math.min(p + 1, totalPaginas))
                }
                disabled={paginaActual === totalPaginas}
              >
                <FaArrowRight />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MisExpedientes;
