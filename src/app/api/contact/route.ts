import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { nombre, email, asunto, mensaje, seguridad_url } = await req.json();

    // Detección de bots (Honeypot)
    if (seguridad_url) {
      return NextResponse.json({ message: 'Bot detected' }, { status: 400 });
    }

    // Validación básica de campos
    if (!nombre || !email || !asunto || !mensaje) {
      return NextResponse.json({ message: 'Todos los campos son requeridos.' }, { status: 400 });
    }

    // Obtener variables de entorno
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || '465');
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const emailTo = process.env.EMAIL_TO || smtpUser;

    if (!smtpHost || !smtpUser || !smtpPass) {
      return NextResponse.json(
        { message: 'La configuración SMTP no está completa en el servidor.' },
        { status: 500 }
      );
    }

    // Configurar el transportador de Nodemailer
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true para puerto 465, false para otros
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Diseño elegante del correo electrónico (Premium, compatible con Outlook/Gmail)
    const emailHtml = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Nuevo mensaje de contacto</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style type="text/css">
    /* Estilos base para evitar problemas en clientes móviles */
    body {
      margin: 0;
      padding: 0;
      min-width: 100%;
      background-color: #f8fafc;
    }
    .content-table {
      width: 100%;
      max-width: 600px;
    }
    @media only screen and (max-width: 600px) {
      .inner-padding {
        padding: 30px 20px !important;
      }
      .logo-header {
        padding: 20px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" bgcolor="#f8fafc" cellpadding="0" cellspacing="0" border="0" style="table-layout: fixed; background-color: #f8fafc;">
    <tr>
      <td align="center" style="padding: 40px 10px;">
        <!--[if (gte mso 9)|(IE)]>
        <table width="600" align="center" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td>
        <![endif]-->
        <table class="content-table" align="center" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 6px 24px rgba(0, 0, 0, 0.07);">
          
          <!-- Cabecera / Logo Premium -->
          <tr>
            <td class="logo-header" align="center" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); background-color: #0f172a; padding: 35px 30px; text-align: center;">
              <!-- Logotipo con fallback de texto elegante -->
              <table cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                  <td align="center" style="padding-bottom: 12px;">
                    <img src="https://disenadorenmalaga.es/favicon.png" alt="Logo" width="40" height="40" style="display: block; width: 40px; height: 40px; border: 0; outline: none; text-decoration: none;" />
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <span style="color: #ffffff; font-size: 20px; font-weight: 800; letter-spacing: 1px; font-family: 'Outfit', sans-serif;">
                      FRANCISCO FERNÁNDEZ
                    </span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 4px;">
                    <span style="color: #E53B55; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;">
                      Fullstack Developer & Designer
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Cuerpo Principal -->
          <tr>
            <td class="inner-padding" style="padding: 45px 40px; background-color: #ffffff;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <h2 style="margin: 0 0 25px 0; color: #0f172a; font-size: 22px; font-weight: 700; line-height: 1.3; font-family: 'Outfit', sans-serif;">
                      Nuevo mensaje de contacto ✉️
                    </h2>
                    <p style="margin: 0 0 30px 0; color: #64748b; font-size: 15px; line-height: 1.6;">
                      Has recibido una nueva propuesta o consulta a través del formulario de tu portafolio web.
                    </p>
                  </td>
                </tr>
                
                <!-- Datos del Remitente -->
                <tr>
                  <td style="padding: 20px 24px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #f1f5f9;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding: 6px 0; color: #64748b; font-size: 14px; font-weight: 600; width: 90px; vertical-align: top;">Nombre:</td>
                        <td style="padding: 6px 0; color: #0f172a; font-size: 14px; font-weight: 500; vertical-align: top;">${nombre}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #64748b; font-size: 14px; font-weight: 600; vertical-align: top;">Email:</td>
                        <td style="padding: 6px 0; color: #0f172a; font-size: 14px; vertical-align: top;">
                          <a href="mailto:${email}" style="color: #7b1527; text-decoration: none; font-weight: 500;">${email}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #64748b; font-size: 14px; font-weight: 600; vertical-align: top;">Asunto:</td>
                        <td style="padding: 6px 0; color: #0f172a; font-size: 14px; font-weight: 600; vertical-align: top;">${asunto}</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Mensaje (Tarjeta Destacada) -->
                <tr>
                  <td style="padding-top: 35px;">
                    <span style="color: #64748b; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 10px;">
                      Mensaje recibido:
                    </span>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #faf5fa; border-radius: 8px; border-left: 4px solid #7b1527; border-collapse: separate;">
                      <tr>
                        <td style="padding: 24px; color: #1e293b; font-size: 15px; line-height: 1.7; white-space: pre-wrap; font-style: italic;">"${mensaje}"</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Botón de Acción Rápida (Responder) -->
                <tr>
                  <td align="center" style="padding-top: 35px;">
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="mailto:${email}?subject=Re: ${asunto}" style="height:48px;v-text-anchor:middle;width:200px;" arcsize="10%" stroke="f" fillcolor="#7b1527">
                      <w:anchorlock/>
                      <center style="color:#ffffff;font-family:sans-serif;font-size:15px;font-weight:bold;">Responder ahora</center>
                    </v:roundrect>
                    <![endif]-->
                    <!--[if !mso]><!-->
                    <a href="mailto:${email}?subject=Re: ${asunto}" style="display: inline-block; background-color: #7b1527; color: #ffffff; font-weight: 600; font-size: 15px; padding: 14px 30px; text-decoration: none; border-radius: 6px; box-shadow: 0 4px 6px rgba(123, 21, 39, 0.15);">
                      Responder ahora
                    </a>
                    <!--<![endif]-->
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Pie de página corporativo -->
          <tr>
            <td style="background-color: #f8fafc; padding: 25px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 6px 0; color: #94a3b8; font-size: 12px; line-height: 1.4;">
                Este correo ha sido generado de forma segura desde el formulario de contacto de tu sitio web profesional.
              </p>
              <p style="margin: 0; color: #b2c1d3; font-size: 11px;">
                © ${new Date().getFullYear()} Francisco Fernández. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
            </td>
          </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Enviar el correo electrónico
    await transporter.sendMail({
      from: `"${nombre}" <${smtpUser}>`, // Enviado desde tu SMTP con el nombre del usuario
      replyTo: email, // El botón responder responderá directamente al usuario
      to: emailTo,
      subject: `[Web Contact] ${asunto}`,
      html: emailHtml,
      text: `Nuevo mensaje de ${nombre} (${email}):\n\nAsunto: ${asunto}\n\nMensaje:\n${mensaje}`,
    });

    return NextResponse.json({ message: 'Mensaje enviado con éxito.' });
  } catch (error: any) {
    console.error('Error al enviar email:', error);
    return NextResponse.json(
      { message: 'Ocurrió un error al procesar tu solicitud de contacto.' },
      { status: 500 }
    );
  }
}
