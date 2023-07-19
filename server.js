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
      user: process.env.REMAIL, // email de votre votre compte google
      pass: process.env.PASSWORD, // password de votre compte google
    },
  });
  // chatgpt: Dans l'objet mail, vous avez défini from: email, ce qui signifie que l'email de l'expéditeur sera l'email fourni dans le corps de la demande. Gmail ignore cependant cette option et utilise toujours l'adresse e-mail du compte authentifié comme adresse d'expédition.
  let mail = {
    from: email, // sender email
    to: process.env.REMAIL, //recipient email
    subject: subject,
    text: message,
    // on peut remplacer l'attribut `text`par `html`si on veut que le cors de notre email supporte le HTML
    // html:  '<h1>This email use html</h1>'
  };

  transporter.sendMail(mail, (error, info) => {
    if (error) {
      console.log(error);
      res.json({ alert: "Opps! it seems like some err occured. Try again." });
    } else {
      console.log("Email: " + info.response);
      console.log(mail);

      res.json({ alert: "Your email has been sent", mail });
    }
  });
});

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
