// importing packages
import express from "express";
import "dotenv/config";
import nodemailer from "nodemailer";

const app = express();

app.use(express.static("public"));
app.use(express.json()); // enables form sharing

app.post("/message", (req, res) => {
  const { hisname, email, subject, message } = req.body;

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, // 587 -> TLS & 465 -> SSL
    auth: {
      user: process.env.EMAIL, // email de votre votre compte google
      pass: process.env.PASSWORD, // password de votre compte google
    },
  });
  // chatgpt: https://chat.openai.com/share/22aee45f-4000-4d4c-b838-e5daec60d65e
  let fullMessage = `
    <p>Message de : ${hisname}</p>
    <p>Email: ${email}</p>
    <p>Message: <br/>${message}</p>
`;
  console.log("fullMessage:", fullMessage);
  let mail = {
    from: process.env.EMAIL,
    replyTo: email, // sender email
    to: process.env.EMAIL, //recipient email
    subject: subject,
    html: fullMessage,
    // on peut remplacer l'attribut `text`par `html`si on veut que le cors de notre email supporte le HTML
    // html:  '<h1>This email use html</h1>'
  };

  transporter.sendMail(mail, (error, info) => {
    if (error) {
      console.log(error);
      res.json({ alert: "Opps! it seems like some err occured. Try again." });
    } else {
      console.log("Email: " + info.response);
      console.log("email :", mail);

      res.json({ alert: "Your email has been sent", mail });
    }
  });
});

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
