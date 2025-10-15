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
    <div>
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
