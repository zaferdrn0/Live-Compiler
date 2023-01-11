import { User } from "./user.js";
import mongoose from "mongoose";
import express, { json } from "express";
import session from "express-session";

const app = express();
app.listen(3000, () => {
  console.log("Uygulama 3000 portunu dinliyor...");
});
app.use(express.static("public"));
await mongoose.connect("mongodb://localhost:27017");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB bağlantı hatası:"));

// parse application/json
app.use(express.json());

app.use(
  session({
    secret: "my-secret",
    resave: false,
    saveUninitialized: true,
  })
);



app.post("/register", (req, res) => {
  console.log(req.body);
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;

  User.findOne(
    { $or: [{ email: email }, { username: username }] },
    (err, user) => {
      if (err) {
        let hataMesaji = JSON.stringify({
          success: false,
          message: "Bir hata oluştu",
        });
        return res.send(hataMesaji);
      }
      if (user) {
        let epostaHata = JSON.stringify({
          success: false,
          message: "Bu e-posta veya kullanıcı adı kayıtlı",
        });
        return res.send(epostaHata);
      }
      const yeniKullanici = new User({
        username: username,
        email: email,
        password: password
      });
      yeniKullanici.kodlar.Python.push('abc');
      yeniKullanici.save();

      return res.send(JSON.stringify({ yonlendir: "/giris.html" }));
    }
  );
});

app.post("/login", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  try {
    let user = await User.findOne({ email: email, password: password });
    if (!user) {
        let yanlisGiris = JSON.stringify({
          success: false,
          message: "Eposta veya şifre yanlis",
        });
        return res.send(yanlisGiris);
      }
  
      req.session.user = user;
      return res.status(301).send({yonlendir: "/room.html"});
  } catch (error) {
    let hataMesaji = JSON.stringify({
        success: false,
        message: "Bir hata oluştu",
      });
      return res.send(hataMesaji);
  }
});

app.get('/test', async (req, res )=> {
    console.log(req.session.user);
    let toReturn = {...req.session.user};
    return res.status(200).send(JSON.stringify(req.session.user));
});

export {db};