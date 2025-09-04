import { Resend } from "resend";

import { getActiveServices } from "../dynamicScheduling";

// Check if API key is configured
if (!process.env.RESEND_API_KEY) {
  console.error("RESEND_API_KEY environment variable is not set");
}

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  services: string[];
  professionalName: string;
}

export async function sendAppointmentEmails(data: EmailData) {
  try {
    console.log("Starting email sending process with data:", data);

    const {
      customerName,
      customerEmail,
      customerPhone,
      date,
      time,
      services,
      professionalName,
    } = data;

    // Convert service IDs to names
    const formattedServices = await formatServiceIds(services);

    // Validate required data
    if (!customerEmail || !customerName) {
      throw new Error("Missing required customer information");
    }

    if (!process.env.RESEND_API_KEY) {
      throw new Error("Resend API key is not configured");
    }

    // Send customer confirmation email
    const customerEmailResult = await resend.emails.send({
      from: "Armonía Corporal by Alejandra Duarte <noreply@alejandraduarte.uy>",
      to: [customerEmail],
      subject:
        "Confirmación de tu reserva | Armonía Corporal by Alejandra Duarte",
      html: generateCustomerEmailHTML({
        customerName,
        date,
        time,
        services: formattedServices,
        professionalName,
      }),
    });

    console.log("Customer email result:", customerEmailResult);

    // Send admin notification email
    const adminEmail =
      process.env.NEXT_PUBLIC_NOTIFICATION_EMAIL?.replace(/"/g, "") ||
      "noreply@alejandraduarte.uy";
    console.log("Admin email configured as:", adminEmail);

    const adminEmailResult = await resend.emails.send({
      from: "Armonía Corporal by Alejandra Duarte <noreply@alejandraduarte.uy>",
      to: [adminEmail],
      subject: "Nueva Reserva Registrada",
      html: generateAdminEmailHTML({
        customerName,
        customerEmail,
        customerPhone,
        date,
        time,
        services: formattedServices,
        professionalName,
      }),
    });

    console.log("Admin email result:", adminEmailResult);

    return {
      success: true,
      customerEmailId: customerEmailResult.data?.id,
      adminEmailId: adminEmailResult.data?.id,
    };
  } catch (error) {
    console.error("Error sending emails:", error);

    // Log detailed error information
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    // Return error details for debugging
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown email error",
      details: error,
    };
  }
}

// Legacy function signature for easy replacement
interface LegacyEmailParams {
  to: {
    email: string;
    hora: string;
    name: string;
    tipos: string[];
    phone: string;
    persona: string;
  }[];
}

export async function sendEmail({ to }: LegacyEmailParams) {
  if (to.length === 0) {
    throw new Error("No recipient data provided");
  }

  const recipient = to[0];
  const [date, time] = recipient.hora.split(" - ");

  return sendAppointmentEmails({
    customerName: recipient.name,
    customerEmail: recipient.email,
    customerPhone: recipient.phone,
    date: date || recipient.hora,
    time: time || "",
    services: recipient.tipos,
    professionalName: recipient.persona,
  });
}

// HTML Email Templates
function generateCustomerEmailHTML({
  customerName,
  date,
  time,
  services,
  professionalName,
}: {
  customerName: string;
  date: string;
  time: string;
  services: string[];
  professionalName: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación de Reserva - Baraja Studio</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f7f7f7; margin: 0; padding: 0; line-height: 1.6;">
        <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <div style="background-color: #000000; padding: 30px 20px; text-align: center; color: #ffffff;">
            <div style="width: 80px; height: 80px; background-color: #000000; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
              <img src="https://alejandraduarte.uy/logo.png" 
                   alt="Baraja Studio Logo" 
                   style="width: 60px; height: 60px; object-fit: cover;" />
            </div>
            <h1 style="font-size: 28px; font-weight: bold; margin: 0 0 5px 0; letter-spacing: 1px;">
              Baraja Studio
            </h1>
          </div>

          <!-- Main Content -->
          <div style="padding: 30px;">
            <!-- Greeting -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="font-size: 24px; color: #1f2937; margin: 0 0 10px 0;">
                ¡Hola, ${customerName}! 👋
              </h2>
              <p style="font-size: 16px; color: #6b7280; margin: 0;">
                Tu reserva ha sido confirmada exitosamente
              </p>
            </div>

            <!-- Appointment Details -->
            <div style="background-color: #f9fafb; border: 2px solid #e5e7eb; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
              <h3 style="font-size: 18px; color: #1f2937; margin: 0 0 20px 0; text-align: center; font-weight: bold;">
                 Detalles de tu Cita
              </h3>

              <div style="display: grid; gap: 15px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div style="font-size: 18px">
                    <strong style="color: #374151;">Fecha:</strong>
                    <span style="margin-left: 8px; color: #6b7280;">${date}</span>
                  </div>
                </div>

                <div style="display: flex; align-items: center; gap: 10px;">
                  <div style="font-size: 18px">
                    <strong style="color: #374151;">Hora:</strong>
                    <span style="margin-left: 8px; color: #6b7280;">${time}</span>
                  </div>
                </div>

                <div style="display: flex; align-items: center; gap: 10px;">
                  <div style="font-size: 18px">
                    <strong style="color: #374151;">Servicios:</strong>
                    <span style="margin-left: 8px; color: #6b7280;">${services.join(", ")}</span>
                  </div>
                </div>

                <div style="display: flex; align-items: center; gap: 10px;">
                  <div style="font-size: 18px">
                    <strong style="color: #374151;">Profesional:</strong>
                    <span style="margin-left: 8px; color: #6b7280;">${professionalName}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Contact Info -->
            <div style="text-align: center; margin-top: 30px;">
              <p style="font-size: 16px; color: #374151; margin: 0 0 15px 0;">
                ¿Necesitas hacer algún cambio?
              </p>
              <div style="display: inline-block; background-color: #1f2937; color: #ffffff; padding: 12px 24px; border-radius: 25px; font-size: 16px; font-weight: bold;">
                (+598) 099 579 767
              </div>
              <p style="font-size: 14px; color: #6b7280; margin: 15px 0 0 0;">
                Atención: 10:00 - 20:00
              </p>
            </div>

            <!-- Thank You -->
            <div style="text-align: center; margin-top: 35px; padding-top: 25px; border-top: 1px solid #e5e7eb;">
              <p style="font-size: 18px; color: #1f2937; margin: 0 0 10px 0; font-weight: bold;">
                ¡Gracias por elegirnos! 🙏
              </p>
              <p style="font-size: 16px; color: #6b7280; margin: 0;">
                Nos vemos pronto en Baraja Studio
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #6b7280; margin: 0 0 5px 0;">
              © 2025 Baraja Studio | Maldonado, Uruguay
            </p>
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">
              Todos los derechos reservados
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function generateAdminEmailHTML({
  customerName,
  customerEmail,
  customerPhone,
  date,
  time,
  services,
  professionalName,
}: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  services: string[];
  professionalName: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nueva Reserva - Baraja Studio</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 20px; color: #374151;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border: 1px solid #d1d5db; border-radius: 8px; overflow: hidden;">
          
          <!-- Header -->
          <div style="background-color: #dc2626; color: #ffffff; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 20px; font-weight: bold;">
              🚨 Nueva Reserva Registrada
            </h1>
          </div>

          <!-- Content -->
          <div style="padding: 25px;">
            <p style="font-size: 16px; margin: 0 0 20px 0; color: #1f2937;">
              Se ha registrado una nueva cita con los siguientes detalles:
            </p>

            <!-- Client Details -->
            <div style="background-color: #f3f4f6; border-radius: 6px; padding: 15px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 15px 0; font-size: 14px; font-weight: bold; color: #374151; text-transform: uppercase; letter-spacing: 0.5px;">
                Datos del Cliente
              </h3>
              
              <div style="line-height: 1.6;">
                <div style="margin-bottom: 8px;">
                  <strong>Nombre:</strong> ${customerName}
                </div>
                <div style="margin-bottom: 8px;">
                  <strong>Email:</strong> <a href="mailto:${customerEmail}" style="color: #2563eb; text-decoration: none;">${customerEmail}</a>
                </div>
                <div style="margin-bottom: 8px;">
                  <strong>Teléfono:</strong> <a href="tel:${customerPhone}" style="color: #2563eb; text-decoration: none;">${customerPhone}</a>
                </div>
              </div>
            </div>

            <!-- Appointment Details -->
            <div style="background-color: #f3f4f6; border-radius: 6px; padding: 15px;">
              <h3 style="margin: 0 0 15px 0; font-size: 14px; font-weight: bold; color: #374151; text-transform: uppercase; letter-spacing: 0.5px;">
                Detalles de la Cita
              </h3>
              
              <div style="line-height: 1.6;">
                <div style="margin-bottom: 8px;">
                  <strong>Fecha:</strong> ${date}
                </div>
                <div style="margin-bottom: 8px;">
                  <strong>Hora:</strong> ${time}
                </div>
                <div style="margin-bottom: 8px;">
                  <strong>Servicios:</strong> ${services.join(", ")}
                </div>
                <div style="margin-bottom: 8px;">
                  <strong>Profesional:</strong> ${professionalName}
                </div>
              </div>
            </div>

            <!-- Action Notice -->
            <div style="margin-top: 25px; padding: 15px; background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px;">
              <p style="margin: 0; font-size: 14px; color: #92400e; text-align: center;">
                💡 <strong>Recordatorio:</strong> Confirma la disponibilidad y contacta al cliente si es necesario
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb;">
            Sistema de Reservas - Baraja Studio
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Converts service IDs to their corresponding names
 */
async function formatServiceIds(serviceIds: string[]): Promise<string[]> {
  try {
    const allServices = await getActiveServices();

    return serviceIds.map((serviceId) => {
      const service = allServices.find(
        (s) => s.id === serviceId || s.name === serviceId,
      );
      return service ? service.name : serviceId;
    });
  } catch (error) {
    console.error("Error formatting service IDs:", error);
    // Return the original IDs if formatting fails
    return serviceIds;
  }
}
