import * as nodemailer from 'nodemailer';

// send Email through nodemailer

export const sendEmail = async ({ to, subject, html = '', message = '' }) => {
  const config = {
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  };

  const transporter = nodemailer.createTransport(config);

  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject,
    html,
    text: message,
  });
};
