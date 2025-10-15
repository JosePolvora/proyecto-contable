import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
//import "./EditarUsuario.css"; // puedes crear el CSS como quieras

const EditarUsuario = () => {
  const { id } = useParams(); // id del expediente
  const navigate = useNavigate();

  const [expediente, setExpediente] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");

  // 📌 Cargar expediente actual
  useEffect(() => {
    axios
      .get(`https://santaisabel2.online/api/expedientes/${id}`)
      .then((res) => {
        if (res.data.ok && res.data.body) {
          const exp = res.data.body;
          setExpediente(exp);
          setUsuarioSeleccionado(exp.usuario_id);
        } else {
          Swal.fire("Error", "No se encontró el expediente", "error");
          navigate(-1);
        }
      })
      .catch((err) => {
        console.error("Error cargando expediente:", err);
        Swal.fire("Error", "No se pudo cargar el expediente", "error");
        navigate(-1);
      });
  }, [id, navigate]);

  // 📌 Cargar usuarios
  useEffect(() => {
    axios
      .get("https://santaisabel2.online/api/usuarios")
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
  const handleActualizar = async (e) => {
    e.preventDefault();

    if (!usuarioSeleccionado) {
      Swal.fire("Atención", "Debe seleccionar un usuario válido ⚠️", "warning");
      return;
    }

    try {
      await axios.put(`https://santaisabel2.online/api/expedientes/${expediente.expediente_id}`, {
        usuario_id: usuarioSeleccionado,
      });

      Swal.fire({
        icon: "success",
        title: "Usuario actualizado ✅",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/admin/expedientes"); // volver al historial
    } catch (err) {
      console.error("Error actualizando usuario:", err);
      Swal.fire("Error", "No se pudo actualizar el usuario ❌", "error");
    }
  };

  if (!expediente) {
    return <p>Cargando expediente...</p>;
  }

  return (
    <div className="editar-container">
      <h2>Editar Usuario del Expediente</h2>
      <form className="exp-form" onSubmit={handleActualizar}>
        <div className="exp-input-group">
          <label>N° Expediente</label>
          <input type="text" value={expediente.numero} readOnly />
        </div>

        <div className="exp-input-group">
          <label>Asunto</label>
          <input type="text" value={expediente.asunto} readOnly />
        </div>

        <div className="exp-input-group">
          <label>Clase</label>
          <input type="text" value={expediente.clase} readOnly />
        </div>

        <div className="exp-input-group">
          <label>Usuario asignado</label>
          <select
            value={usuarioSeleccionado}
            onChange={(e) => setUsuarioSeleccionado(e.target.value)}
            required
          >
            <option value="">Seleccione un usuario</option>
            {usuarios.map((u) => (
              <option key={u.usuario_id ?? u.id} value={u.usuario_id ?? u.id}>
                {u.nombre} {u.apellido}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Actualizar Usuario</button>
      </form>
    </div>
  );
};

export default EditarUsuario;
