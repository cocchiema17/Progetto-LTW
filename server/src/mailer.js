const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "app.finager@gmail.com",
    pass: "admin123!",
  },
});

const sendResetEmail = (to, token) => {
  return transporter.sendMail({
    from: "Finager Support <app.finager@gmail.com>", // sender address admin123!
    to,
    subject: "Reset your email", // Subject line
    text: "Reset your email",
    html: `<html><a href='http://localhost:8080/forgot?token=${token}' /></html>`,
  })
};

module.exports = sendResetEmail;