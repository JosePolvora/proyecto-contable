import React, { useState } from "react";
import axios from "axios";
import "./UploadExcel.css";

const UploadExcel = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Por favor, seleccioná un archivo Excel antes de subirlo.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await axios.post(
        "https://santaisabel2.online/api/expedientes/upload-excel",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setResult(response.data);
      setError("");
    } catch (err) {
      console.error("Error al subir el archivo:", err);
      if (err.response) {
        setError(
          `Error del servidor (${err.response.status}): ${
            err.response.data.message || "Error desconocido."
          }`
        );
      } else {
        setError("Ocurrió un error al conectar con el servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <h2>Carga Masiva de Expedientes</h2>
      <div className="upload-container">
        <div className="upload-box">
          <input
            type="file"
            accept=".xls,.xlsx"
            onChange={handleFileChange}
            className="file-input"
          />

          <button
            onClick={handleUpload}
            disabled={loading}
            className={`upload-btn ${loading ? "disabled" : ""}`}
          >
            {loading ? "Subiendo..." : "Subir Archivo"}
          </button>

          {error && <p className="error-msg">{error}</p>}

          {result && (
            <div className="result-container">
              <h3>Resultado del procesamiento:</h3>
              <ul>
                {result.result.map((item, index) => (
                  <li
                    key={index}
                    className={
                      item.status.includes("nuevo") ? "nuevo" : "reingreso"
                    }
                  >
                    Expediente <strong>{item.numero}</strong>: {item.status}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadExcel;

// const fs = require("fs");
// const XLSX = require("xlsx");
// const dbcontable = require("../models/index.model");

// exports.uploadFile = async (req, res) => {
//   try {
//     const file = req.files?.file;

//     if (!file) {
//       return res.status(400).json({ message: "No se subió ningún archivo." });
//     }

//     // 📁 Asegurar que exista la carpeta uploads
//     const dir = "./uploads";
//     if (!fs.existsSync(dir)) fs.mkdirSync(dir);

//     // 📄 Guardar temporalmente el archivo
//     const tempFilePath = `${dir}/${file.name}`;
//     fs.writeFileSync(tempFilePath, file.data);

//     // 📘 Leer el archivo Excel
//     const workbook = XLSX.readFile(tempFilePath);
//     const firstSheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[firstSheetName];
//     const jsonData = XLSX.utils.sheet_to_json(worksheet);

//     // 🧩 Adaptar columnas del Excel a los campos del modelo
//     const formattedData = jsonData.map((row) => ({
//       numero: row["EXPEDIENTE"]?.toString().trim(),
//       asunto: row["ASUNTO"]?.trim(),
//       clase: row["CLASE"]?.trim(),
//       usuario_id: parseInt(row["USUARIO"]) || null,
//       tipoMovimiento: "ingreso",
//       terminado: false,
//     }));

//     const result = [];
//     let contadorNuevos = 0;
//     let contadorReingresos = 0;
//     let contadorErrores = 0;

//     // 🔄 Procesar fila por fila
//     for (const obj of formattedData) {
//       const { numero } = obj;
//       if (!numero) continue; // Evita filas vacías

//       const existente = await dbcontable.Expediente.findOne({
//         where: { numero },
//       });

//       if (existente) {
//         const nuevoReingreso = (existente.reingresos || 0) + 1;

//         const updateData = {
//           asunto: obj.asunto || existente.asunto,
//           clase: obj.clase || existente.clase,
//           tipoMovimiento: `reingreso ${nuevoReingreso}`,
//           terminado: false,
//           fechaReingreso: new Date(),
//           reingresos: nuevoReingreso,
//           // 👇 Mantener siempre el usuario original si ya existía
//           usuario_id: existente.usuario_id || obj.usuario_id || null,
//         };

//         await existente.update(updateData);
//         contadorReingresos++;

//         result.push({
//           numero,
//           status: existente.usuario_id
//             ? `reingreso (usuario original conservado: ${existente.usuario_id})`
//             : `reingreso (usuario asignado por primera vez a ${
//                 obj.usuario_id || "N/A"
//               })`,
//         });
//       } else {
//         // ✅ Validar existencia del usuario antes de crear (opcional)
//         if (obj.usuario_id) {
//           const usuarioExiste = await dbcontable.Usuario.findByPk(
//             obj.usuario_id
//           );
//           if (!usuarioExiste) {
//             result.push({
//               numero,
//               status: `❌ usuario ${obj.usuario_id} no existe, expediente omitido`,
//             });
//             contadorErrores++;
//             continue;
//           }
//         }

//         // 🆕 Nuevo expediente
//         await dbcontable.Expediente.create(obj);
//         contadorNuevos++;

//         result.push({
//           numero,
//           status: `nuevo (usuario asignado: ${obj.usuario_id || "N/A"})`,
//         });
//       }
//     }

//     // 🧹 Eliminar el archivo temporal
//     fs.unlinkSync(tempFilePath);

//     // ✅ Respuesta final con resumen
//     res.status(200).json({
//       message: "Archivo procesado correctamente",
//       resumen: {
//         nuevos: contadorNuevos,
//         reingresos: contadorReingresos,
//         errores: contadorErrores,
//       },
//       result,
//     });
//   } catch (error) {
//     console.error("Error al procesar el archivo:", error);
//     res.status(500).json({
//       message: "Error al procesar el archivo",
//       error: error.message,
//     });
//   }
// };
