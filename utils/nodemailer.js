import nodemailer from "nodemailer";

const SendVerifyMail = (email) => {
  const transporter = nodemailer.createTransport({
    host: process.env.ETHERIALHOST,
    port: process.env.ETHERIALPORT,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.ETHERILAUSERID,
      pass: process.env.ETHERIALPASSWORD,
    },
  });

  const mailoption = {
    from: process.env.FROMMAIL,
    to: "nayeem2281998@gmail.com",

    subject: "verify your mail",
    text: "hello",
    html: `<p>Hi ${email}, please click <a href="http://localhost:5173/login?email=${email}">here</a> to reset your password</p>`,
  };
  transporter.sendMail(mailoption, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("email has been verified", info.response);
    }
  });
};

export default SendVerifyMail;
