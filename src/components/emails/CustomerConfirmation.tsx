import * as React from "react";
import { getBusinessConfig } from "@/config/business.config";

interface CustomerConfirmationProps {
  customerName: string;
  date: string;
  time: string;
  services: string[];
  hairdresserName: string;
  phone: string;
  email: string;
}

export function CustomerConfirmation({
  customerName,
  date,
  time,
  services,
  hairdresserName,
}: CustomerConfirmationProps) {
  const config = getBusinessConfig();
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Confirmación de Reserva - {config.name}</title>
      </head>
      <body
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f7f7f7",
          margin: 0,
          padding: 0,
          lineHeight: 1.6,
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            margin: "20px auto",
            backgroundColor: "#ffffff",
            border: "1px solid #dddddd",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Header with Logo */}
          <div
            style={{
              background: "linear-gradient(135deg, #1f2937 0%, #374151 100%)",
              padding: "30px 20px",
              textAlign: "center",
              color: "#ffffff",
            }}
          >
            {/* Logo placeholder - replace with actual logo */}
            <div
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#ffffff",
                borderRadius: "50%",
                margin: "0 auto 15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                fontWeight: "bold",
                color: "#1f2937",
              }}
            >
              BS
            </div>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                margin: "0 0 5px 0",
                letterSpacing: "1px",
              }}
            >
              {config.name}
            </h1>
            <p
              style={{
                fontSize: "16px",
                margin: 0,
                opacity: 0.9,
              }}
            >
              Tu estilo, nuestra pasión
            </p>
          </div>

          {/* Main Content */}
          <div style={{ padding: "30px" }}>
            {/* Greeting */}
            <div
              style={{
                textAlign: "center",
                marginBottom: "30px",
              }}
            >
              <h2
                style={{
                  fontSize: "24px",
                  color: "#1f2937",
                  margin: "0 0 10px 0",
                }}
              >
                ¡Hola, {customerName}! 👋
              </h2>
              <p
                style={{
                  fontSize: "16px",
                  color: "#6b7280",
                  margin: 0,
                }}
              >
                Tu reserva ha sido confirmada exitosamente
              </p>
            </div>

            {/* Appointment Details Card */}
            <div
              style={{
                backgroundColor: "#f9fafb",
                border: "2px solid #e5e7eb",
                borderRadius: "12px",
                padding: "25px",
                marginBottom: "25px",
              }}
            >
              <h3
                style={{
                  fontSize: "18px",
                  color: "#1f2937",
                  margin: "0 0 20px 0",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                📅 Detalles de tu Cita
              </h3>

              <div style={{ display: "grid", gap: "15px" }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span style={{ fontSize: "18px" }}>📅</span>
                  <div>
                    <strong style={{ color: "#374151" }}>Fecha:</strong>
                    <span style={{ marginLeft: "8px", color: "#6b7280" }}>
                      {date}
                    </span>
                  </div>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span style={{ fontSize: "18px" }}>⏰</span>
                  <div>
                    <strong style={{ color: "#374151" }}>Hora:</strong>
                    <span style={{ marginLeft: "8px", color: "#6b7280" }}>
                      {time}
                    </span>
                  </div>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span style={{ fontSize: "18px" }}>✂️</span>
                  <div>
                    <strong style={{ color: "#374151" }}>Servicios:</strong>
                    <span style={{ marginLeft: "8px", color: "#6b7280" }}>
                      {services.join(", ")}
                    </span>
                  </div>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span style={{ fontSize: "18px" }}>👨‍💼</span>
                  <div>
                    <strong style={{ color: "#374151" }}>Profesional:</strong>
                    <span style={{ marginLeft: "8px", color: "#6b7280" }}>
                      {hairdresserName}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div
              style={{
                backgroundColor: "#fef3c7",
                border: "1px solid #f59e0b",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "25px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: "#92400e",
                  textAlign: "center",
                }}
              >
                ⚠️ <strong>Importante:</strong> Si necesitas cancelar o
                reprogramar, contáctanos con al menos 2 horas de anticipación
              </p>
            </div>

            {/* Contact Information */}
            <div style={{ textAlign: "center", marginTop: "30px" }}>
              <p
                style={{
                  fontSize: "16px",
                  color: "#374151",
                  margin: "0 0 15px 0",
                }}
              >
                ¿Necesitas hacer algún cambio?
              </p>
              <div
                style={{
                  display: "inline-block",
                  backgroundColor: "#1f2937",
                  color: "#ffffff",
                  padding: "12px 24px",
                  borderRadius: "25px",
                  textDecoration: "none",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                📞 (+598) 099 250 338
              </div>
              <p
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  margin: "15px 0 0 0",
                }}
              >
                Atención: Lunes a Sábado 9:00 - 20:00
              </p>
            </div>

            {/* Thank You */}
            <div
              style={{
                textAlign: "center",
                marginTop: "35px",
                paddingTop: "25px",
                borderTop: "1px solid #e5e7eb",
              }}
            >
              <p
                style={{
                  fontSize: "18px",
                  color: "#1f2937",
                  margin: "0 0 10px 0",
                  fontWeight: "bold",
                }}
              >
                ¡Gracias por elegirnos! 🙏
              </p>
              <p
                style={{
                  fontSize: "16px",
                  color: "#6b7280",
                  margin: 0,
                }}
              >
                Nos vemos pronto en {config.name}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              backgroundColor: "#f3f4f6",
              padding: "20px",
              textAlign: "center",
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <p
              style={{
                fontSize: "12px",
                color: "#6b7280",
                margin: "0 0 5px 0",
              }}
            >
              © {new Date().getFullYear()} {config.name} | {config.location.city}, {config.location.country}
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "#9ca3af",
                margin: 0,
              }}
            >
              Todos los derechos reservados
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
