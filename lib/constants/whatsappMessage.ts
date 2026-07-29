export const WHATSAPP_NUMBER = '56926932373';

/** Mensaje con precio, condiciones y datos de transferencia. */
export const MENSAJE_ACCESO = `📚 El acceso cuesta $5.990 e incluye 10 días de la App ProfeTomy, donde podrás realizar simulaciones del examen teórico Clase B.

✅ También tendrás acceso a las clases en vivo por TikTok (@ProfeTomy) y al grupo de WhatsApp durante todo agosto.

⚠️ IMPORTANTE: El material y el acceso a la plataforma solo serán enviados una vez recibido el comprobante de la transferencia. Si no envías el comprobante, no se enviará ningún acceso ni material.

❤️ Una vez realizada la transferencia, envíame el comprobante por este chat.

📌 Datos de transferencia:
Tomás Chavarría
Banco Estado
Cuenta Corriente
33000072856
RUT: 20.328.964-2.`;

/** Igual al anterior, precedido por el correo con el que se registró la persona. */
export const mensajeAccesoConCorreo = (email: string) =>
  `Hola Profe Tomy, acabo de crear mi cuenta con el correo ${email}.\n\n${MENSAJE_ACCESO}`;

export const linkWhatsapp = (mensaje: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
