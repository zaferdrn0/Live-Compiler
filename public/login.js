const socket = io.connect("http://localhost:3000");
const idGiris = document.getElementById("id-Alma");
const btnGiris = document.getElementById("Giris");
const btnOlustur = document.getElementById("Olustur");

btnOlustur.onclick = () => {
  fetch("/odaOlustur")
    .then((response) => response.json())
    .then((data) => window.location.replace("/room/" + data.roomname));
  //socket.emit("join-room");
};

btnGiris.onclick = () => {
  socket.emit("join", idGiris.value);

  socket.on("join-room", (data) => window.location.replace("/room/" + data));
};
