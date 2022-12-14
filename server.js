const express = require("express");
const http = require("http");
const socket = require("socket.io");
const fs = require("fs");
const { isStringObject } = require("util/types");
const path = require("path");
var spawn = require("child_process").spawn;
const { v4: uuidv4 } = require("uuid");
const { deserialize } = require("v8");

const app = express();
const server = app.listen(3000);

app.use(express.static("public"));
const io = socket(server);

let rooms = [];

let dilGlobal = "";

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
    io.sockets.in(code.oda).emit("kod", code.code);
  });
  socket.on("language-change", (data) => {
    let diller = JSON.parse(data);
    console.log(diller.dil);
    dilGlobal = diller.dil;
    io.sockets.in(diller.oda).emit("language-change", diller.dil);
  });

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

        var cp = spawn(process.env.comspec, ["/c", komut, dosyaAd]);
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
      dilSecimi("deneme.py", "py");
    } else if (dilGlobal === "Java") {
      dilSecimi("java.java", "java");
    } else if (dilGlobal === "Php") {
      dilSecimi("php.php", "php");
    } else if (dilGlobal === "Html") {
      console.log("html secildi");
    } else if (dilGlobal === "C"){
      fs.writeFile("C.c", data, (err) => {
        if (err) console.log(err);
        else console.log("dosya olusturuldu");
        
         spawn(process.env.comspec, ["/c", "gcc", "C.c"]);
        setTimeout(function () {
          var cp = spawn(process.env.comspec, ["/c", "", "a.exe"]);
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
        });},1000);
      });
    } else if(dilGlobal ==="C++"){
      fs.writeFile("Cpp.cpp", data, (err) => {
        if (err) console.log(err);
        else console.log("dosya olusturuldu");
        
        var cp = spawn(process.env.comspec, ["/c", "g++", "Cpp.cpp"]);
        setTimeout(function () {
          var cp = spawn(process.env.comspec, ["/c", "", "a.exe"]);
          
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
        });},2000);
      });
    } else {
      console.log("hatali");
    }
  });
});

/*

fs.writeFile("deneme.py", data, (err) => {
  if (err) console.log(err);
  else console.log("dosya olusturuldu");

  var cp = spawn(process.env.comspec, ["/c", "py", "deneme.py"]);
  cp.stdout.on("data", function (data) {
    console.log(data.toString());
    socket.emit("cıktılar", data.toString());
  });

  cp.stderr.on("data", function (data) {
    socket.emit("hatalar", data.toString());
    console.log(data.toString());
  });

  cp.stdout.on("data", function (data) {});

  socket.on("input-gonder", (veri) => {
    console.log("calistim");
    console.log(veri);
    cp.stdin.write(veri);
  });

  cp.stderr.on("data", function (data) {
    console.error(data.toString());
  });
});
*/

/*
      fs.writeFile("java.java", data, (err) => {
        if (err) console.log(err);
        else console.log("dosya olusturuldu");

        var cp = spawn(process.env.comspec, ["/c", "java", "java.java"]);
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
      });*/
