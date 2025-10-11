import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // importamos SweetAlert2
import { FaSearch } from "react-icons/fa"; // icono lupa
import "./Reingresos.css";

const Reingresos = () => {
  const [reingresos, setReingresos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [checked, setChecked] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;

  const usuarioId = Number(localStorage.getItem("usuarioId"));

  // === Cargar expedientes ===
  useEffect(() => {
    if (!usuarioId) return;

    axios
      .get(`http://localhost:3000/api/expedientes/usuario/${usuarioId}`)
      .then((res) => {
        if (res.data.ok) {
          const soloReingresos = (res.data.body || [])
            .filter((exp) => exp.reingresos > 0)
            .sort(
              (a, b) => new Date(b.fechaReingreso) - new Date(a.fechaReingreso)
            );
          setReingresos(soloReingresos);
        } else {
          setReingresos([]);
        }
      })
      .catch((err) => {
        console.error("Error cargando reingresos:", err);
        setReingresos([]);
      });
  }, [usuarioId]);

  // === Cargar checkboxes desde localStorage ===

  useEffect(() => {
    const stored = localStorage.getItem("checkedReingresos");
    if (stored) setChecked(JSON.parse(stored));
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // === Copiar con SweetAlert2 ===
  const handleCopy = (numero) => {
    navigator.clipboard
      .writeText(numero)
      .then(() =>
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
        })
      )
      .catch(() =>
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo copiar ❌",
        })
      );
  };

  // === Manejo de checkboxes ===
  const handleCheck = (expedienteId, index) => {
    setChecked((prev) => {
      const newChecked = {
        ...prev,
        [expedienteId]: {
          ...prev[expedienteId],
          [index]: !prev[expedienteId]?.[index],
        },
      };
      localStorage.setItem("checkedReingresos", JSON.stringify(newChecked));
      return newChecked;
    });
  };

  // Filtrar por búsqueda
  const filteredReingresos = reingresos.filter((exp) =>
    exp.numero.toString().includes(searchTerm)
  );

  // Paginación
  let currentItems;
  let totalPages;

  if (searchTerm.trim() !== "") {
    currentItems = filteredReingresos;
    totalPages = 1;
  } else {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    currentItems = filteredReingresos.slice(indexOfFirstItem, indexOfLastItem);
    totalPages = Math.ceil(filteredReingresos.length / itemsPerPage);
  }

  return (
    <div>
      {/* Barra de búsqueda con icono */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por número de expediente"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <FaSearch className="search-icon" />
      </div>

      <div className="exp-table-container-re">
        <h2>Historial de Reingresos</h2>

        {filteredReingresos.length === 0 ? (
          <p>No tienes expedientes reingresados.</p>
        ) : (
          <>
            <table className="exp-table-re">
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Asunto</th>
                  <th>Fecha Reingreso</th>
                  <th>Cantidad de Reingresos</th>
                  {[...Array(6)].map((_, i) => (
                    <th key={i}>
                      {i < 5 ? `${i + 1}° Reingreso` : "Archivado"}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {currentItems.map((exp) => (
                  <tr key={exp.expediente_id}>
                    <td
                      style={{
                        cursor: "pointer",
                        color: "#333",
                        fontWeight: "bold",
                      }}
                      onClick={() => handleCopy(exp.numero)}
                    >
                      {exp.numero || "-"}
                    </td>
                    <td>{exp.asunto || "-"}</td>
                    <td>{formatDate(exp.fechaReingreso)}</td>
                    <td>{exp.reingresos}</td>
                    {[...Array(6)].map((_, i) => (
                      <td key={i}>
                        <input
                          type="checkbox"
                          checked={checked[exp.expediente_id]?.[i] || false}
                          onChange={() => handleCheck(exp.expediente_id, i)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div style={{ marginTop: "15px", textAlign: "center" }}>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    style={{
                      margin: "0 5px",
                      padding: "5px 10px",
                      cursor: "pointer",
                      backgroundColor:
                        i + 1 === currentPage ? "#ffa500" : "#f2f2f2",
                      border: "none",
                      borderRadius: "4px",
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Reingresos;
