import * as React from 'react';

interface AdminNotificationProps {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  services: string[];
  professionalName: string;
}

export function AdminNotification({
  customerName,
  customerEmail,
  customerPhone,
  date,
  time,
  services,
  professionalName,
}: AdminNotificationProps) {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Nueva Reserva - Armonía Corporal</title>
      </head>
      <body
        style={{
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#FDF8F3',
          margin: 0,
          padding: 20,
          color: '#374151',
        }}
      >
        <div
          style={{
            maxWidth: '500px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            border: '1px solid #E8D5C4',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: '#D4A574',
              color: '#ffffff',
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: 'bold',
              }}
            >
              💆‍♀️ Nueva Reserva Registrada
            </h1>
          </div>

          {/* Content */}
          <div style={{ padding: '25px' }}>
            <p
              style={{
                fontSize: '16px',
                margin: '0 0 20px 0',
                color: '#3D2E1F',
              }}
            >
              Se ha registrado una nueva cita con los siguientes detalles:
            </p>

            {/* Client Details */}
            <div
              style={{
                backgroundColor: '#FDF8F3',
                borderRadius: '6px',
                padding: '15px',
                marginBottom: '20px',
              }}
            >
              <h3
                style={{
                  margin: '0 0 15px 0',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Datos del Cliente
              </h3>
              
              <div style={{ lineHeight: '1.6' }}>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Nombre:</strong> {customerName}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Email:</strong>{' '}
                  <a
                    href={`mailto:${customerEmail}`}
                    style={{ color: '#D4A574', textDecoration: 'none' }}
                  >
                    {customerEmail}
                  </a>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Teléfono:</strong>{' '}
                  <a
                    href={`tel:${customerPhone}`}
                    style={{ color: '#D4A574', textDecoration: 'none' }}
                  >
                    {customerPhone}
                  </a>
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div
              style={{
                backgroundColor: '#FDF8F3',
                borderRadius: '6px',
                padding: '15px',
              }}
            >
              <h3
                style={{
                  margin: '0 0 15px 0',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Detalles de la Cita
              </h3>
              
              <div style={{ lineHeight: '1.6' }}>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Fecha:</strong> {date}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Hora:</strong> {time}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Tratamientos:</strong> {services.join(', ')}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Profesional:</strong> {professionalName}
                </div>
              </div>
            </div>

            {/* Action Notice */}
            <div
              style={{
                marginTop: '25px',
                padding: '15px',
                backgroundColor: '#fef3c7',
                border: '1px solid #f59e0b',
                borderRadius: '6px',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  color: '#92400e',
                  textAlign: 'center',
                }}
              >
                💡 <strong>Recordatorio:</strong> Confirma la disponibilidad y contacta al cliente si es necesario
              </p>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              backgroundColor: '#f9fafb',
              padding: '15px',
              textAlign: 'center',
              fontSize: '12px',
              color: '#6b7280',
              borderTop: '1px solid #e5e7eb',
            }}
          >
            Sistema de Reservas - Armonía Corporal
          </div>
        </div>
      </body>
    </html>
  );
}