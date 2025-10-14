import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!usuario || !clave) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, complete todos los campos",
      });
      return;
    }

    // try {
    //   const response = await fetch("http://localhost:3000/api/usuarios/login", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ usuario, clave }),
    //   });

    try {
      const response = await fetch(
        "https://santaisabel2.online/api/usuarios/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usuario, clave }),
        }
      );

      const data = await response.json();

      if (data.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("rol", data.usuario.rol);
        localStorage.setItem("nombre", data.usuario.nombre);
        localStorage.setItem("usuarioId", data.usuario.id);

        Swal.fire({
          icon: "success",
          title: "Login exitoso ✅",
          text: `Bienvenido ${data.usuario.nombre}`,
          timer: 2000,
          showConfirmButton: false,
        });

        if (data.usuario.rol === "admin") {
          navigate("/admin/expedientes");
        } else {
          navigate("/user/expedientes/asignados");
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message,
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor",
      });
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Iniciar Sesión</h2>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-input-group">
          <label className="login-label">Usuario</label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="Ingrese su usuario"
            className="login-input"
          />
        </div>

        <div className="login-input-group">
          <label className="login-label">Contraseña</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"} // 🔹 alterna tipo
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              placeholder="Ingrese su contraseña"
              className="login-input"
            />
            {/* <button
              type="button"
              className="show-password-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button> */}

            <button
              type="button"
              className="show-password-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <button type="submit" className="login-button">
          Iniciar Sesión
        </button>
      </form>

      <div className="login-back-home">
        <Link to="/" className="login-back-link">
          Ir al Inicio
        </Link>
      </div>
    </div>
  );
};

export default Login;
