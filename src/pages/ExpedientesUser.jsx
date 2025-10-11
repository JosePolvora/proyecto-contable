import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./ExpedientesUser.css";

const FormSeguimiento = () => {
  const { id } = useParams(); // ID del expediente desde la URL
  const navigate = useNavigate();

  const [expediente, setExpediente] = useState(null);
  const [fechaInicio, setFechaInicio] = useState("");
  const [observacion, setObservacion] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [terminado, setTerminado] = useState(false);
  const [fechaEnvio, setFechaEnvio] = useState("");

  const estados = [
    "Devolucion",
    "Controlado - Op",
    "Retenido",
    "Patrimonial",
    "Tesoreria",
    "Corregido",
    "Solicitado",
    "Archivado",
    "Autorizar gasto",
    "Rendicion",
    "Falta Credito",
  ];

  // 🔹 Cargar datos del expediente al montar el componente
  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/expedientes/${id}`)
      .then((res) => {
        const data = res.data.body;
        if (!data) {
          Swal.fire({
            icon: "error",
            title: "Expediente no encontrado ❌",
            text: "El expediente no existe",
            timer: 2000,
            showConfirmButton: false,
          });
          navigate("/user/expedientes/asignados");
          return;
        }

        setExpediente(data);
        setFechaInicio(data.fechaInicio || "");
        setObservacion(data.observacion || "");
        setComentarios(data.comentarios || "");
        setTerminado(!!data.terminado);
        setFechaEnvio(data.fechaEnvio || "");
      })
      .catch((err) => {
        console.error("Error cargando expediente:", err);
        Swal.fire({
          icon: "error",
          title: "Error ❌",
          text: "No se pudo cargar el expediente",
        });
      });
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!expediente) return;

    const actualizado = {
      numero: expediente.numero,
      asunto: expediente.asunto,
      clase: expediente.clase,
      usuario_id: expediente.usuario_id,
      tipoMovimiento: expediente.tipoMovimiento || "ingreso",
      fechaInicio: fechaInicio || new Date().toISOString().split("T")[0],
      observacion,
      comentarios,
      terminado,
      fechaEnvio: fechaEnvio || new Date().toISOString().split("T")[0],
    };

    try {
      await axios.put(
        `http://localhost:3000/api/expedientes/${id}`,
        actualizado
      );

      Swal.fire({
        icon: "success",
        title: "Expediente actualizado ✅",
        text: `El expediente ${expediente.numero} se actualizó correctamente`,
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/user/expedientes/asignados"); // volver a la lista
    } catch (error) {
      console.error("Error al actualizar expediente:", error);
      Swal.fire({
        icon: "error",
        title: "Error ❌",
        text: "No se pudo actualizar el expediente",
      });
    }
  };

  if (!expediente) return <p>Cargando expediente...</p>;

  return (
    <div className="form-user-container">
      <h2>Expediente N° {expediente.numero}</h2>
      <form onSubmit={handleSubmit}>
        <div className="exp-user-input-group">
          <label>Fecha Inicio de Trabajo</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>

        <div className="exp-user-input-group">
          <label>Observación / Estado</label>
          <select
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
          >
            <option value="">Seleccione una opción</option>
            {estados.map((e, idx) => (
              <option key={idx} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>

        <div className="exp-user-input-group">
          <label>Comentarios</label>
          <textarea
            value={comentarios}
            onChange={(e) => setComentarios(e.target.value)}
            placeholder="Escriba los comentarios"
          />
        </div>

        <div className="exp-user-input-group">
          <label>
            <input
              type="checkbox"
              checked={terminado}
              onChange={(e) => setTerminado(e.target.checked)}
            />{" "}
            TERMINADO
          </label>
        </div>

        <div className="exp-user-input-group">
          <label>Fecha de Envío</label>
          <input
            type="date"
            value={fechaEnvio}
            onChange={(e) => setFechaEnvio(e.target.value)}
          />
        </div>

        <button type="submit">Guardar Seguimiento</button>
      </form>
    </div>
  );
};

export default FormSeguimiento;
