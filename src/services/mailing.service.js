import { createTransport } from "nodemailer";
import configEnv from "../config/env.js";

const transporter = createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: configEnv.GMAIL_ACCOUNT,
    pass: configEnv.GMAIL_PASS
  },
});

const createMsgRegister = (first_name) =>
  `<h1>Hola ${first_name}, ¡Bienvenido/a a Coderhouse!</h1>`;

const createMsgReset = (first_name) => {
  return `<p>¡Hola ${first_name}! Hacé click <a href="http://localhost:8080/new-pass">AQUÍ</a> 
    para restablecer tu contraseña.
    </p>`;
};

const createMsgUpdateActive = (first_name) => `<h1>Hola ${first_name}, hemos notado tu ausencia y queremos que regreses a nuestra plataforma! Inicia sesión y obtiene un beneficio por volver!`

const createMsgDeleteProduct = (first_name) => `<p>¡Hola ${first_name}!</p></br><p>Un tuyo producto ha sido eliminado</p>`
const createMsgUpdateProduct = (first_name) => `<p>¡Hola ${first_name}!</p></br><p>Un tuyo producto ha sido modificado</p>`

/**
 * 
 * @param {*} user 
 * @param {*} service register | resetPass | updateActive | deleteProduct | updateProduct
 * @param {*} token 
 * @returns 
 */
export const sendMail = async (user, service, token = null) => {
  try {
    const { first_name, email } = user;

    let msg = "";

    service === "register"
      ? (msg = createMsgRegister(first_name))
      : service === "resetPass"
      ? (msg = createMsgReset(first_name))
      : service === "updateActive"
      ? (msg = createMsgUpdateActive(first_name))
      : service === "deleteProduct"
      ? (msg = createMsgDeleteProduct(first_name))
      : service === "updateProduct"
      ? (msg = createMsgUpdateProduct(first_name))
      : (msg = "");

    let subj = "";

    subj =
      service === "register"
        ? "Bienvenido/a"
        : service === "resetPass"
        ? "Restablecimiento de contraseña"
        : service === "updateActive"
        ? "¡Volvé a nuestra plataforma y obtené este beneficio!"
        : service === "deleteProduct" || service === "updateProduct"
        ? "Aviso de movimientos en tus productos"
        : "";

    const gmailOptions = {
      from: configEnv.EMAIL_ADMIN,
      to: email,
      subject: subj,
      html: msg,
    };

    await transporter.sendMail(gmailOptions);
    if (token) return token
  } catch (error) {
    throw new Error(error);
  }
};