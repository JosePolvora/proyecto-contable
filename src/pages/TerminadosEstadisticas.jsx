import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./TerminadosUsuario.css"; // Usa el mismo estilo

const TerminadosEstadisticas = () => {
  const [resumenArray, setResumenArray] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/expedientes/historial")
      .then((res) => {
        if (res.data.ok) {
          const expedientes = res.data.body || [];
          // 🔹 Filtramos SOLO los terminados
          const terminados = expedientes.filter(
            (exp) => exp.terminado === true
          );
          // 🔹 Agrupamos por usuario
          const resumenPorUsuario = terminados.reduce((acc, exp) => {
            const nombreUsuario = `${exp.usuario?.nombre || ""} ${
              exp.usuario?.apellido || ""
            }`.trim();
            if (!nombreUsuario) return acc; // evita usuarios vacíos
            if (!acc[nombreUsuario]) acc[nombreUsuario] = 0;
            acc[nombreUsuario] += 1;
            return acc;
          }, {});
          const resumen = Object.entries(resumenPorUsuario).map(
            ([usuario, cantidad]) => ({ usuario, cantidad })
          );
          setResumenArray(resumen);
        }
      })
      .catch((err) => console.error("Error cargando terminados:", err))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <p className="sin-datos">Cargando estadísticas...</p>;
  if (resumenArray.length === 0)
    return <p className="sin-datos">No hay expedientes terminados por usuario</p>;

  return (
    <div className="estadisticas-container-terminados">
      <h2>Expedientes Terminados por Usuario ✅</h2>

      {/* Tabla */}
      <table className="estadisticas-table-terminados">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Terminados</th>
          </tr>
        </thead>
        <tbody>
          {resumenArray.map((r, i) => (
            <tr key={i}>
              <td>{r.usuario}</td>
              <td>{r.cantidad}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Gráfico */}
      <div className="grafico-container-terminados">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={resumenArray}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="usuario" tick={{ fill: "#f0f0f0" }} />
            <YAxis tick={{ fill: "#f0f0f0" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#222",
                borderRadius: "8px",
                border: "none",
              }}
            />
            <Bar dataKey="cantidad" fill="#00ff7f" radius={[10, 10, 0, 0]} /> {/* Verde para terminados */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TerminadosEstadisticas;
