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
import "./PendientesUsuario.css";

const PendientesEstadisticas = () => {
  const [resumenArray, setResumenArray] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/expedientes/historial")
      .then((res) => {
        if (res.data.ok) {
          const expedientes = res.data.body || [];
          const pendientes = expedientes.filter(
            (exp) => exp.terminado === false
          );
          const resumenPorUsuario = pendientes.reduce((acc, exp) => {
            const nombreUsuario = `${exp.usuario?.nombre || ""} ${
              exp.usuario?.apellido || ""
            }`;
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
      .catch((err) => console.error("Error cargando pendientes:", err))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <p className="sin-datos">Cargando estadísticas...</p>;
  if (resumenArray.length === 0)
    return (
      <p className="sin-datos">No hay expedientes pendientes por usuario</p>
    );

  return (
    <div className="estadisticas-container">
      <h2>Expedientes Pendientes por Usuario</h2>

      {/* Tabla */}
      <table className="estadisticas-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Pendientes</th>
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
      <div className="grafico-container">
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

            <Bar dataKey="cantidad" fill="#ff8c42" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PendientesEstadisticas;
