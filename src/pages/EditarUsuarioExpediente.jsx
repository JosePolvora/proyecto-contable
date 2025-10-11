import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./EditarUsuarioExpediente.css";

const EditarUsuarioExpediente = () => {
  const { id } = useParams();
  const [expediente, setExpediente] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");
  const navigate = useNavigate();

  // 📌 Cargar expediente actual
  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/expedientes/${id}`)
      .then((res) => {
        if (res.data.ok && res.data.body) {
          const exp = res.data.body;
          setExpediente(exp);
          setUsuarioSeleccionado(exp.usuario_id);
        }
      })
      .catch((err) => {
        console.error("Error cargando expediente:", err);
        Swal.fire("Error", "No se pudo cargar el expediente ❌", "error");
      });
  }, [id]);

  // 📌 Cargar usuarios
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/usuarios")
      .then((res) => {
        if (res.data.ok) {
          setUsuarios(res.data.body);
        }
      })
      .catch((err) => {
        console.error("Error cargando usuarios:", err);
      });
  }, []);

  // 📌 Guardar cambios
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!usuarioSeleccionado) {
      Swal.fire("Atención", "Debe seleccionar un usuario válido ⚠️", "warning");
      return;
    }

    try {
      await axios.put(
        `http://localhost:3000/api/expedientes/${expediente.expediente_id}`,
        { usuario_id: usuarioSeleccionado }
      );

      Swal.fire({
        icon: "success",
        title: "Usuario actualizado ✅",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/admin/expedientes");
    } catch (err) {
      console.error("Error actualizando usuario:", err);
      Swal.fire("Error", "No se pudo actualizar el usuario ❌", "error");
    }
  };

  if (!expediente) {
    return <p>Cargando expediente...</p>;
  }

  return (
    <div className="editar-expediente-container">
      <h2 className="editar-expediente-title">Editar Usuario del Expediente</h2>
      <form className="editar-expediente-form" onSubmit={handleUpdate}>
        <div className="editar-expediente-group">
          <label className="editar-expediente-label">N° Expediente</label>
          <input
            className="editar-expediente-input"
            type="text"
            value={expediente.numero}
            disabled
          />
        </div>

        <div className="editar-expediente-group">
          <label className="editar-expediente-label">Asunto</label>
          <input
            className="editar-expediente-input"
            type="text"
            value={expediente.asunto}
            disabled
          />
        </div>

        <div className="editar-expediente-group">
          <label className="editar-expediente-label">Clase</label>
          <input
            className="editar-expediente-input"
            type="text"
            value={expediente.clase}
            disabled
          />
        </div>

        <div className="editar-expediente-group">
          <label className="editar-expediente-label">Usuario asignado</label>
          <select
            className="editar-expediente-select"
            value={usuarioSeleccionado}
            onChange={(e) => setUsuarioSeleccionado(e.target.value)}
            required
          >
            <option value="">Seleccione un usuario</option>
            {usuarios.map((u) => (
              <option key={u.usuario_id} value={u.usuario_id}>
                {u.nombre} {u.apellido}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="editar-expediente-button">
          Actualizar Usuario
        </button>
      </form>
    </div>
  );
};

export default EditarUsuarioExpediente;
