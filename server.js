const express = require("express");
const http = require("http");
const socket = require("socket.io");
const fs = require("fs");
const { isStringObject } = require("util/types");
const path = require("path");
var spawn = require("child_process").spawn;
const { v4: uuidv4 } = require("uuid");
const { deserialize } = require("v8");
const hljs = require('highlight.js');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();
const server = app.listen(3000);

app.use(express.static("public"));
const io = socket(server);

let rooms = [];

let dilGlobal = "";

let derleyiciKomut_Windows = {
  os_isim: "windows",
  terminal: "cmd",
  terminal_param: "/c",
  python: "py",
  c: "gcc C.c -o c.exe",
  cpp: "g++ Cpp.cpp -o a.exe",
  php: "php",
  java: "java"
}

let derleyiciKomut_Linux = {
  os_isim: "linux",
  terminal: "/bin/bash",
  terminal_param: "-c",
  python: "python3",
  c: "gcc C.c -o c.exe",
  cpp: "g++ Cpp.cpp -o a.exe",
  php: "php",
  java: "java"
}

let seciliKomutOS = derleyiciKomut_Windows;


app.get("/odaOlustur", (req, res) => {
  roomname = uuidv4();
  rooms.push(roomname);
  let toSend = { roomname: roomname };
  res.send(JSON.stringify(toSend));
});

app.get("/room/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/room.html"));
});

io.on("connection", (socket) => {
  socket.on("kodlar", (data) => {
    let code = JSON.parse(data);
    socket.to(code.oda).emit("kod", code.code); // to
    
  });
  socket.on("language-change", (data) => {
    let diller = JSON.parse(data);
    console.log(diller.dil);
    dilGlobal = diller.dil;
    io.sockets.in(diller.oda).emit("language-change", diller.dil);
  });

  // YENİ DEGİŞİKLİK BURASI

  //console.log(socket.id);

  /*

    socket.on('create-room', (roomname ) => {
      roomname = uuidv4();
      socket.join(roomname);
      console.log(roomname)
      rooms.push(roomname);

    }) */
  /*
  socket.on("oda-olustur", () => {
    io.of("/").adapter.on("create-room", (room) => {
      
      rooms.unshift(room);
      console.log(`room ${room} was created`);
      
    });
    io.of("/").adapter.on("join-room", (room, id) => {
      id = socket.id;
      console.log(`socket ${id} has joined room ${room}`);
    });
  });
*/

  socket.on("join", (data) => {
    for (let i = 0; i < rooms.length; i++) {
      if (data === rooms[i]) {
        socket.join(rooms[i]);
        socket.emit("join-room", rooms[i]);

        console.log(data);
        break;
      }
    }
  });

  socket.on("olustur", (data) => {
    function dilSecimi(dosyaAd, komut) {
      fs.writeFile(dosyaAd, data, (err) => {
        if (err) console.log(err);
        else console.log("dosya olusturuldu");
        var cp = spawn(seciliKomutOS.terminal, [seciliKomutOS.terminal_param, komut +" " + dosyaAd]);
        cp.stdout.on("data", function (data) {
          console.log(data);
          console.log(data.toString());
          socket.emit("cıktılar", data.toString());
        });

        cp.stderr.on("data", function (data) {
          socket.emit("hatalar", data.toString());
          console.log(data.toString());
        });

        cp.stdout.on("data", function (data) {});
        socket.on("input-gonder", (veri) => {
          cp.stdin.write(veri);
        });

        cp.stderr.on("data", function (data) {
          console.error(data.toString());
        });
      });
    }

    if (dilGlobal === "Python") {
      dilSecimi("deneme.py", seciliKomutOS.python);
    } else if (dilGlobal === "Java") {
      dilSecimi("java.java", seciliKomutOS.java);
    } else if (dilGlobal === "Php") {
      dilSecimi("php.php", seciliKomutOS.php);
    } else if (dilGlobal === "Html") {
      console.log("html secildi");
    } else if (dilGlobal === "Cdil") {
      fs.writeFile("C.c", data, (err) => {
        if (err) console.log(err);
        else console.log("dosya olusturuldu");
        if (fs.existsSync("./c.exe")) {
          fs.unlinkSync("./c.exe");}
          var cp =  spawn(seciliKomutOS.terminal, [seciliKomutOS.terminal_param, seciliKomutOS.c])
          cp.stdout.on("data", function (data) {
            console.log(data);
            console.log(data.toString());
            socket.emit("cıktılar", data.toString());
          });
          cp.stderr.on("data", function (data) {
            socket.emit("hatalar", data.toString());
            console.log(data.toString());
          });
          cp.stdout.on("data", function (data) {});
              socket.on("input-gonder", (veri) => {
                cp.stdin.write(veri);
              });
              cp.stderr.on("data", function (data) {
                console.error(data.toString());
              });
       
        setTimeout(function () {if (fs.existsSync("./c.exe")) {
          var cp = spawn(seciliKomutOS.terminal, [seciliKomutOS.terminal_param, (seciliKomutOS.os_isim == "windows" ? "c.exe" : "./c.exe")]);
          cp.stdout.on("data", function (data) {
            console.log(data);
            console.log(data.toString());
            socket.emit("cıktılar", data.toString());
          });

          cp.stderr.on("data", function (data) {
            socket.emit("hatalar", data.toString());
            console.log(data.toString());
          });
          socket.on("input-gonder", (veri) => {
            cp.stdin.write(veri);
          });

          cp.stderr.on("data", function (data) {
            console.error(data.toString());
          });}
        }, 2000);
      });
    } else if (dilGlobal === "Cpp") {
      
      fs.writeFile("Cpp.cpp", data, (err) => {
        if (err) console.log(err);
        else console.log("dosya olusturuldu");
        if (fs.existsSync("./a.exe")) {
        fs.unlinkSync("./a.exe");}

        var cp = spawn(seciliKomutOS.terminal, [seciliKomutOS.terminal_param, seciliKomutOS.cpp])
        cp.stdout.on("data", function (data) {
          console.log(data);
          console.log(data.toString());
          socket.emit("cıktılar", data.toString());
        });
        cp.stderr.on("data", function (data) {
          socket.emit("hatalar", data.toString());
          console.log(data.toString());
        });
        cp.stdout.on("data", function (data) {});
            socket.on("input-gonder", (veri) => {
              cp.stdin.write(veri);
            });
            cp.stderr.on("data", function (data) {
              console.error(data.toString());
            });
     
        
          setTimeout(function () {if (fs.existsSync("./a.exe")) {
            var cp = spawn(seciliKomutOS.terminal, [seciliKomutOS.terminal_param, (seciliKomutOS.os_isim == "windows" ? "a.exe" : "./a.exe")]);
          
            cp.stdout.on("data", function (data) {
              console.log(data);
              console.log(data.toString());
              socket.emit("cıktılar", data.toString());
            });
  
            cp.stderr.on("data", function (data) {
              socket.emit("hatalar", data.toString());
              console.log(data.toString());
            });
  
            cp.stdout.on("data", function (data) {});
            socket.on("input-gonder", (veri) => {
              cp.stdin.write(veri);
            });
  
            cp.stderr.on("data", function (data) {
              console.error(data.toString());
            }); }
          }, 2000);
       
        
      });
    } else {
      console.log("hatali");
    }
  });
});



// Veritabanı islemleri
const Schema = mongoose.Schema;
const userSchema = new Schema({
    id:{type:Schema.ObjectId},
  username: { type: String, maxLength:15 },
  email: { type: String, maxLength:100},
  password: { type: String, maxLength:150 },
  kodlar:{
    Python:[],
    Cpp:[],
    Html:[],
    Java:[],
    Php:[],
    Cdil:[]
  },
  type:{type:String, default:"normal"}
});

const User = mongoose.model("user", userSchema, 'compiler'); 

async function VeritabanıBaglanti(){
  await mongoose.connect("mongodb://localhost:27017");
}
VeritabanıBaglanti();

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
      //yeniKullanici.kodlar.Python.push('abc');
      yeniKullanici.save();

      return res.send(JSON.stringify({ yonlendir: "/index.html" }));
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
      return res.status(301).send({yonlendir: "/odaKur.html"});
  } catch (error) {
    let hataMesaji = JSON.stringify({
        success: false,
        message: "Bir hata oluştu",
      });
      return res.send(hataMesaji);
  }
});

app.get('/odayaGir', async (req, res )=> {
  if (!req.session.user) {
    return res.status(301).send("session olusmadı");
  }
  
  console.log(req.session.user);
    //let toReturn = {...req.session.user};
    return res.send(JSON.stringify({kullaniciAdi: req.session.user.username,
      message: req.session.user}));
});

app.post('/kodKayit', async (req, res) => {
  let baslik = req.body.baslik;
  let kod = req.body.kod;
  let data = JSON.stringify({kod: kod,baslik: baslik});
  let email = req.session.user.email;
  let user = await User.findOne({ email: email});
  let kodlar = user.kodlar[dilGlobal];
  if(user){
    for(let i = 0; i <kodlar.length; i++){
      let jsonOb = JSON.parse(kodlar[i]);
      if(jsonOb.baslik == baslik){
        return res.send(JSON.stringify({
          success: false,
          message: "Ayni baslik daha önce kullanilmiştir !"
        }))
      }}

    user.kodlar[dilGlobal].push(data);
      user.save();
      return res.send(JSON.stringify({
        success: true,
        message: "Kodunuz Başarıyla kayıt edildi !",
      }));
    
  
}
});


app.post('/kodGetir', async (req, res) => {

let email = req.session.user.email;
console.log(email);
let user = await User.findOne({ email: email});
let kodlar = user.kodlar[dilGlobal];
if(user){
 return res.send(kodlar);
}

});

app.post('/kodEkranaBas', async (req, res) => {
  let baslik = req.body.baslik;
  let user = await User.findOne({ email: req.session.user.email});
  let kodlar = user.kodlar[dilGlobal];
  if(user){
 
    for(let i = 0; i <kodlar.length; i++){
      let jsonOb = JSON.parse(kodlar[i]);
      if(jsonOb.baslik == baslik){
       return res.send((JSON.stringify(jsonOb.kod)))
        //console.log(JSON.stringify({kod:JSON.parse(kodlar[i]).kod}));
      }
    } 
}
});

app.post('/kodSilme', async (req, res) =>{
  let baslik  = req.body.baslik;
  let email = req.session.user.email;
  let user = await User.findOne({email: email});
  let kullanici = user.kodlar[dilGlobal]
  if(user){
    
    for(let i = 0; i < kullanici.length; i++){
      let jsonobjesi = JSON.parse(kullanici[i])
      
        
      if(jsonobjesi.baslik === baslik){
        kullanici.splice(i,1);
        user.save();
        return res.send(JSON.stringify({success:true, message:"Kodunuz Başarıyla Silinmiştir"}))
        
      }
    }
  }
});

app.post('/cikisYapp', async (req, res) =>{
  req.session.destroy(err => {
    if (err) {
        console.log("hatali");
    }
    res.clearCookie('connect.sid');
    console.log('calisti')
    return res.send(JSON.stringify({yonlendir: "/"}));
});
});