// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2"; // 👈 importamos SweetAlert2
// import "./Expedientes.css";

// const FormExpediente = () => {
//   const [expediente, setExpediente] = useState("");
//   const [asunto, setAsunto] = useState("");
//   const [clase, setClase] = useState("");
//   const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");
//   const [usuarios, setUsuarios] = useState([]);
//   const navigate = useNavigate();

//   const clases = [
//     "Auditoria",
//     "Derivacion",
//     "Ecodaic",
//     "Hospitales",
//     "Rendicion",
//     "Servicios Publicos",
//     "Otros",
//   ];

//   useEffect(() => {
//     axios
//       .get("http://localhost:3000/api/usuarios")
//       .then((res) => {
//         if (res.data.ok) {
//           setUsuarios(res.data.body);
//         }
//       })
//       .catch((err) => {
//         console.error("Error cargando usuarios:", err);
//       });
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!usuarioSeleccionado) {
//       Swal.fire({
//         icon: "warning",
//         title: "Seleccione un usuario válido",
//         confirmButtonText: "OK",
//       });
//       return;
//     }

//     try {
//       let historial = [];
//       let tipoMovimiento = "ingreso";

//       try {
//         // 👉 Buscar historial del expediente
//         const res = await axios.get(
//           `http://localhost:3000/api/expedientes/numero/${encodeURIComponent(
//             expediente
//           )}`
//         );

//         if (res.data.ok && res.data.body) {
//           historial = res.data.body;
//         }
//       } catch (err) {
//         if (err.response && err.response.status === 404) {
//           historial = []; // ✅ expediente no existe aún
//         } else {
//           throw err;
//         }
//       }

//       console.log("Historial recibido:", historial);

//       if (historial.length > 0) {
//         const ultimoMovimiento = historial[historial.length - 1];

//         // 👇 Resolver usuario actual
//         let usuarioActual = "otro usuario";
//         if (ultimoMovimiento?.usuario) {
//           usuarioActual = `${ultimoMovimiento.usuario.nombre} ${ultimoMovimiento.usuario.apellido}`;
//         } else if (ultimoMovimiento?.usuario_id) {
//           const u = usuarios.find(
//             (user) => user.usuario_id === ultimoMovimiento.usuario_id
//           );
//           if (u) {
//             usuarioActual = `${u.nombre} ${u.apellido}`;
//           }
//         }

//         // ⚡ SweetAlert2 en lugar de window.confirm
//         const { isConfirmed } = await Swal.fire({
//           title: "Expediente en uso",
//           text: `⚠️ Este expediente lo está trabajando ${usuarioActual}. ¿Desea cambiarlo de usuario?`,
//           icon: "warning",
//           showCancelButton: true,
//           confirmButtonText: "Sí, cambiar usuario",
//           cancelButtonText: "No, continuar como reingreso",
//           reverseButtons: true,
//         });

//         if (isConfirmed) {
//           // navigate(`/admin/expedientes/editar-usuario/${expediente}`);
//           navigate(`/admin/expedientes/editar-usuario/${ultimoMovimiento.expediente_id}`);


//           return; // ❌ no sigue cargando acá
//         }

//         // ❌ Si cancela → sigue como reingreso
//         tipoMovimiento =
//           historial.length === 1
//             ? "reingreso"
//             : `reingreso ${historial.length}`;
//       }

//       // 👉 Guardar expediente
//       const nuevoExpediente = {
//         numero: expediente,
//         asunto,
//         clase,
//         usuario_id: usuarioSeleccionado,
//         tipoMovimiento,
//         terminado: false,
//       };

//       await axios.post(
//         "http://localhost:3000/api/expedientes",
//         nuevoExpediente
//       );

//       await Swal.fire({
//         icon: "success",
//         title: "Éxito",
//         text:
//           historial.length > 0
//             ? `Expediente ${tipoMovimiento} registrado ✅`
//             : "Expediente registrado ✅",
//         timer: 2000,
//         showConfirmButton: false,
//       });

//       // limpiar formulario
//       setExpediente("");
//       setAsunto("");
//       setClase("");
//       setUsuarioSeleccionado("");
//     } catch (error) {
//       console.error("Error al registrar expediente:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Error al registrar expediente ❌",
//       });
//     }
//   };

//   return (
//     <div className="form-container">
//       <h2>Cargar Expediente</h2>
//       <form className="exp-form" onSubmit={handleSubmit}>
//         <div className="exp-input-group">
//           <label>N° Expediente</label>
//           <input
//             type="text"
//             value={expediente}
//             onChange={(e) => setExpediente(e.target.value)}
//             placeholder="Ej: 0425-505985/2024"
//             required
//           />
//         </div>

//         <div className="exp-input-group">
//           <label>Asunto</label>
//           <input
//             type="text"
//             value={asunto}
//             onChange={(e) => setAsunto(e.target.value)}
//             placeholder="Escriba el asunto"
//             required
//           />
//         </div>

//         <div className="exp-input-group">
//           <label>Clase</label>
//           <select
//             value={clase}
//             onChange={(e) => setClase(e.target.value)}
//             required
//           >
//             <option value="">Seleccione una clase</option>
//             {clases.map((c, idx) => (
//               <option key={idx} value={c}>
//                 {c}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="exp-input-group">
//           <label>Usuario</label>
//           <select
//             value={usuarioSeleccionado}
//             onChange={(e) => setUsuarioSeleccionado(e.target.value)}
//             required
//           >
//             <option value="">Seleccione un usuario</option>
//             {usuarios.map((u) => (
//               <option key={u.usuario_id} value={u.usuario_id}>
//                 {u.nombre} {u.apellido}
//               </option>
//             ))}
//           </select>
//         </div>

//         <button type="submit">Guardar Expediente</button>
//       </form>
//     </div>
//   );
// };

// export default FormExpediente;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Expedientes.css";

const FormExpediente = () => {
  const [expediente, setExpediente] = useState("");
  const [asunto, setAsunto] = useState("");
  const [clase, setClase] = useState("");
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  const clases = [
    "Auditoria",
    "Derivacion",
    "Ecodaic",
    "Hospitales",
    "Rendicion",
    "Servicios Publicos",
    "Otros",
  ];

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/usuarios")
      .then((res) => {
        if (res.data && res.data.ok && res.data.body) {
          const body = Array.isArray(res.data.body) ? res.data.body : [res.data.body];
          setUsuarios(body);
        } else if (Array.isArray(res.data)) {
          setUsuarios(res.data);
        }
      })
      .catch((err) => {
        console.error("Error cargando usuarios:", err);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación mínima: usuarioSeleccionado debe existir en el formulario
    if (!usuarioSeleccionado) {
      Swal.fire({
        icon: "warning",
        title: "Seleccione un usuario válido",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      // --- 1) Traer historial del expediente (si existe) ---
      let historial = [];
      let tipoMovimiento = "ingreso";

      try {
        const res = await axios.get(
          `http://localhost:3000/api/expedientes/numero/${encodeURIComponent(expediente)}`
        );

        // Normalizar respuesta: siempre convertir a array
        if (res.data) {
          if (res.data.ok && res.data.body) {
            historial = Array.isArray(res.data.body) ? res.data.body : [res.data.body];
          } else if (Array.isArray(res.data)) {
            historial = res.data;
          }
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          historial = []; // expediente no existe aún
        } else {
          throw err; // error real
        }
      }

      console.log("Historial recibido:", historial);

      // usuarioDestino será el usuario que guardaremos realmente
      let usuarioDestino = usuarioSeleccionado;

      // --- 2) Si hay historial, preguntar si se quiere cambiar usuario ---
      if (historial.length > 0) {
        const ultimoMovimiento = historial[historial.length - 1];

        // resolver nombre a mostrar del usuario que actualmente lo tiene
        let usuarioActual = "otro usuario";
        if (ultimoMovimiento?.usuario) {
          const u = ultimoMovimiento.usuario;
          usuarioActual = `${u.nombre || u.firstName || ""} ${u.apellido || u.lastName || ""}`.trim() || "otro usuario";
        } else {
          // intentar resolver por id buscando en la lista local de usuarios
          const prevUserId =
            ultimoMovimiento?.usuario_id ?? ultimoMovimiento?.usuarioId ?? ultimoMovimiento?.usuario?.id ?? null;
          if (prevUserId) {
            const u = usuarios.find(
              (user) => user.usuario_id === prevUserId || user.id === prevUserId
            );
            if (u) usuarioActual = `${u.nombre} ${u.apellido}`;
          }
        }

        const { isConfirmed } = await Swal.fire({
          title: "Expediente en uso",
          text: `⚠️ Este expediente lo está trabajando ${usuarioActual}. ¿Desea cambiarlo de usuario?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, cambiar usuario",
          cancelButtonText: "No, continuar como reingreso",
          reverseButtons: true,
        });

        if (isConfirmed) {
          // Navegar a edición (usar id disponible en el último movimiento)
          const expedienteIdForEdit =
            ultimoMovimiento?.expediente_id ?? ultimoMovimiento?.expedienteId ?? ultimoMovimiento?.expediente?.id ?? ultimoMovimiento?.id ?? expediente;

          navigate(`/admin/expedientes/editar-usuario/${expedienteIdForEdit}`);
          return; // no seguimos con el guardado acá
        } else {
          // Si el usuario eligió NO cambiar → mantenemos el usuario anterior
          const prevUserId =
            ultimoMovimiento?.usuario_id ?? ultimoMovimiento?.usuarioId ?? ultimoMovimiento?.usuario?.usuario_id ?? ultimoMovimiento?.usuario?.id ?? null;

          if (prevUserId) {
            usuarioDestino = prevUserId;
          } else {
            // Si no hay forma de resolver el anterior, dejamos el seleccionado en el form
            usuarioDestino = usuarioSeleccionado;
          }

          // tipo de movimiento para reingreso
          tipoMovimiento = historial.length === 1 ? "reingreso" : `reingreso ${historial.length}`;
        }
      }

      // --- 3) Construir payload final y guardarlo ---
      const nuevoExpediente = {
        numero: expediente,
        asunto,
        clase,
        usuario_id: usuarioDestino,
        tipoMovimiento,
        terminado: false,
      };

      await axios.post("http://localhost:3000/api/expedientes", nuevoExpediente);

      await Swal.fire({
        icon: "success",
        title: "Éxito",
        text: historial.length > 0 ? `Expediente ${tipoMovimiento} registrado ✅` : "Expediente registrado ✅",
        timer: 2000,
        showConfirmButton: false,
      });

      // limpiar formulario
      setExpediente("");
      setAsunto("");
      setClase("");
      setUsuarioSeleccionado("");
    } catch (error) {
      console.error("Error al registrar expediente:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al registrar expediente ❌",
      });
    }
  };

  return (
    <div className="form-container">
      <h2>Cargar Expediente</h2>
      <form className="exp-form" onSubmit={handleSubmit}>
        <div className="exp-input-group">
          <label>N° Expediente</label>
          <input
            type="text"
            value={expediente}
            onChange={(e) => setExpediente(e.target.value)}
            placeholder="Ej: 0425-505985/2024"
            required
          />
        </div>

        <div className="exp-input-group">
          <label>Asunto</label>
          <input
            type="text"
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            placeholder="Escriba el asunto"
            required
          />
        </div>

        <div className="exp-input-group">
          <label>Clase</label>
          <select value={clase} onChange={(e) => setClase(e.target.value)} required>
            <option value="">Seleccione una clase</option>
            {clases.map((c, idx) => (
              <option key={idx} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="exp-input-group">
          <label>Usuario</label>
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

        <button type="submit">Guardar Expediente</button>
      </form>
    </div>
  );
};

export default FormExpediente;
