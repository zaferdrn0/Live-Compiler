const socket = io.connect("http://localhost:3000");


let area = document.getElementById("ahmet");
let buton = document.getElementById("btn");
let cikti = document.getElementById("cikti");
let Input = document.getElementById("Input-al");
let inputbtn = document.getElementById("input-button");
let language = document.getElementById("language");
let htmlSelect = document.getElementById("Html-Select");
let iframeCikti = document.getElementById("iframe-Cikti");
let odaId = document.getElementById("oda-id");
let textAlani = document.createElement('TEXTAREA');
let btnKopyala = document.getElementById('kopyala-btn')
let lineCounter = document.getElementById('lineCounter')
var joinArray = [];
var idYazdir = [];



area.addEventListener("input", () => {
  socket.emit("kodlar", JSON.stringify({
   
    code: area.value,
    oda:joinArray[4]
   
  }));
});

socket.on("kod", (data) => {
  area.value = data;
});

buton.addEventListener("click", () => {
  if (language.value !== "Html") {
    socket.emit("olustur", area.value);
    console.log(language.value);
    iframeCikti.srcdoc = " ";
  } else if (language.value === "Html") {
    socket.emit("olustur", area.value);
    iframeCikti.srcdoc = area.value;
    console.log("html kodları okundu");
  }
  

});

socket.on("cıktılar", (data) => {
  cikti.innerHTML = data;
});

socket.on("hatalar", (data) => {
  let bolme = data.split(",");
  let hata = bolme[1].split("^");
  cikti.innerHTML = hata[0] + hata[1];
});

function degerAlma(e) {
  var code = e.keyCode ? e.keyCode : e.which;

  if (code == 13) {
    socket.emit("input-gonder", Input.value + "\n");
    console.log(Input.value);
    Input.value = "";
  }
}



/*
inputbtn.addEventListener('click', data => {
    data = Input.value;
    socket.emit('input-gonder', data);
    console.log(data)
    Input.value ='';
})*/
function myFunction() {
  socket.emit("language-change", JSON.stringify({
    dil: language.value, 
    oda:joinArray[4]
  }))
  
  console.log(language.value);
  
 
}
socket.on("language-change", (dil) => {
  language.value = dil;
  if (language.value === "Html") {
    cikti.style.display = "none";
    iframeCikti.style.display = "block";
  } else {
    iframeCikti.srcdoc = " ";
      cikti.style.display = "block";
      iframeCikti.style.display = "none";
  }
  console.log(language.value);
});


document.addEventListener('DOMContentLoaded', function() {

  let queryString = window.location.href;
  console.log(queryString);
   joinArray = queryString.split('/');
  console.log(joinArray[4]);

  socket.emit('join', joinArray[4] )
 // socket.on ("join-room",(data)=> window.location.replace('/room/'+data));
}, false);



idYazdir = window.location.href.split('/');
odaId.innerText = idYazdir[4];


function kopyala(element){
 
  let kopyalaIdValue = odaId.innerText

  navigator.clipboard.writeText(kopyalaIdValue).then(() => {
    // Alert the user that the action took place.
    // Nobody likes hidden stuff being done under the hood!
    alert("Oda ID\' si kopyalandı");
});
}

//btnKopyala.onclick = function() {
  //window.alert('Oda Id\'si kopyalandı' + odaId.innerText);
//}


area.addEventListener('scroll', () => {
  lineCounter.scrollTop = area.scrollTop;
  lineCounter.scrollLeft = area.scrollLeft;
});

area.addEventListener('keydown', (e) => {
  let { keyCode } = e;
  let { value, selectionStart, selectionEnd } = area;
if (keyCode === 9) {  // TAB = 9
    e.preventDefault();
    area.value = value.slice(0, selectionStart) + '\t' + value.slice(selectionEnd);
    area.setSelectionRange(selectionStart+2, selectionStart+2)
  }
});
var lineCountCache = 0;
function line_counter() {
      var lineCount = area.value.split('\n').length;
      var outarr = new Array();
      if (lineCountCache != lineCount) {
         for (var x = 0; x < lineCount; x++) {
            outarr[x] = (x + 1) + '.';
         }
         lineCounter.value = outarr.join('\n');
      }
      lineCountCache = lineCount;
}
area.addEventListener('input', () => {
    line_counter();
});

/*
area.addEventListener('keydown', event => {
  
  if (event.key == 'Tab') {
    const start = area.selectionStart
    const end = area.selectionEnd

    area.value = area.value.substring(0, start) + '\t' + area.value.substring(end)

    event.preventDefault()
  }
})*/
