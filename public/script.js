const socket = io.connect("http://localhost:3000");

let area = document.getElementById("editing");
let buton = document.getElementById("btn");
let cikti = document.getElementById("cikti");
let Input = document.getElementById("Input-al");
let inputbtn = document.getElementById("input-button");
let language = document.getElementById("language");
let htmlSelect = document.getElementById("Html-Select");
let iframeCikti = document.getElementById("iframe-Cikti");
let odaId = document.getElementById("oda-id");
let textAlani = document.createElement("TEXTAREA");
let btnKopyala = document.getElementById("kopyala-btn");
let lineCounter = document.getElementById("lineCounter");
let InputAcBtn = document.getElementById("Input-al-btn");
let result_element = document.querySelector("#highlighting-content");
let result_elementt = document.querySelector("#highlighting");
let kayitEt = document.getElementById("kayit-et");
let kodGetir = document.getElementById("kodGetir");
let kullaniciBilgi = document.getElementById("KullaniciBilgi");

var joinArray = [];
var idYazdir = [];

if(area.value === ""){
  kayitEt.disabled= true;
}


area.addEventListener("input", () => {
 
  
    kayitEt.disabled= false;
  
  socket.emit(
    "kodlar",
    JSON.stringify({
      code: area.value,
      oda: joinArray[4],
    })
  );
});

socket.on("kod", (data) => {
  area.value = data;
  
  update(data)
  
});


buton.addEventListener("click", () => {
  cikti.innerHTML = "";
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
  cikti.innerHTML += "\n";
  cikti.innerHTML += data;
});

socket.on("hatalar", (data) => {
  if (language.value === "Python"){
 let bolmePy = data.split(",");
  let hata = bolmePy[1].split("^");
  cikti.innerHTML = hata[0] + hata[1];}
  else if (language.value === "Cpp") {
      let bolmeCpp = data.split(":");
      let hata = bolmeCpp[6].split("^");
      cikti.innerHTML = "line: " +bolmeCpp[3] + bolmeCpp[5]+ hata[0];
      
  } else if (language.value === "Cdil") {
    let bolmeC = data.split(":");
    cikti.innerHTML = bolmeC[1]+ bolmeC[2];
  }
  else{
   
    cikti.innerHTML += data;

  }
  
});

function degerAlma(e) {
  var code = e.keyCode ? e.keyCode : e.which;

  if (code == 13) {
    socket.emit("input-gonder", Input.value + "\n");
    cikti.innerHTML += Input.value; 
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
  socket.emit(
    "language-change",
    
    JSON.stringify({
      dil: language.value,
      oda: joinArray[4],
    })
  );

  console.log("Dilin değeri"+language.value);
  area.innerHTML = "";
}
socket.on("language-change",  (dil) => {
  language.value = dil;
  
  if (language.value === "Python") {
      
    document.getElementById("highlighting-content").classList.remove('language-html');
    document.getElementById("highlighting-content").classList.remove('language-php');
    document.getElementById("highlighting-content").classList.remove('language-java');
    document.getElementById("highlighting-content").classList.remove('language-c');
    document.getElementById("highlighting-content").classList.remove('language-cpp');
    document.getElementById("highlighting-content").classList.add('language-py');
   /* let pyGiris ='print("Hello, World!")';
    area.innerHTML = pyGiris;
    update(pyGiris);*/
    area.disabled =false;
   
  } else if (language.value === "Cpp") {
    document.getElementById("highlighting-content").classList.remove('language-html');
    document.getElementById("highlighting-content").classList.remove('language-php');
    document.getElementById("highlighting-content").classList.remove('language-java');
    document.getElementById("highlighting-content").classList.remove('language-c');
    document.getElementById("highlighting-content").classList.remove('language-py');
    document.getElementById("highlighting-content").classList.add('language-cpp');
   /* let cppGiris = `#include <iostream>
    using namespace std;
    
    int main() {
      cout << "Hello World!";
      return 0;
    }
     `;
   
    area.innerHTML = cppGiris; 
    update(cppGiris);*/
    area.disabled =false;
    
  } else if (language.value === "Html") {
    document.getElementById("highlighting-content").classList.remove('language-cpp');
    document.getElementById("highlighting-content").classList.remove('language-php');
    document.getElementById("highlighting-content").classList.remove('language-java');
    document.getElementById("highlighting-content").classList.remove('language-c');
    document.getElementById("highlighting-content").classList.remove('language-py');
    document.getElementById("highlighting-content").classList.add('language-html');
    /*let htmlGiris = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        
    </body>
    </html> `;
    area.innerHTML = htmlGiris;
    update(htmlGiris);*/
    area.disabled =false;
  } else if (language.value === "Php") {
    //area.innerHTML = ` `;
    area.disabled =false;
  } else if (language.value === "Java") {
    document.getElementById("highlighting-content").classList.remove('language-html');
    document.getElementById("highlighting-content").classList.remove('language-php');
    document.getElementById("highlighting-content").classList.remove('language-cpp');
    document.getElementById("highlighting-content").classList.remove('language-c');
    document.getElementById("highlighting-content").classList.remove('language-py');
    document.getElementById("highlighting-content").classList.add('language-java');
 /*  let javaGiris = `class Simple{  
    public static void main(String args[]){  
     System.out.println("Hello Java");  
    }  
}  `;
    area.innerHTML = javaGiris;
    update(javaGiris);*/
    area.disabled =false;
  } else if (language.value === "C") {
    document.getElementById("highlighting-content").classList.remove('language-html');
    document.getElementById("highlighting-content").classList.remove('language-php');
    document.getElementById("highlighting-content").classList.remove('language-cpp');
    document.getElementById("highlighting-content").classList.remove('language-java');
    document.getElementById("highlighting-content").classList.remove('language-py');
    document.getElementById("highlighting-content").classList.add('language-c');
   /* area.innerHTML = `
 
    #include <stdio.h>
    int main() {
       // printf() displays the string inside quotation
       printf("Hello, World!");
       return 0;
    }
     `;*/
     area.disabled =false;
  }
  
});

socket.on("language-change", (dil) => {
  language.value = dil;
  if (language.value === "Html") {
    cikti.style.display = "none";
    iframeCikti.style.display = "block";
  } else {
    iframeCikti.srcdoc = " ";
    cikti.innerHTML = "";
    cikti.style.display = "block";
    iframeCikti.style.display = "none";
  }
  
  console.log(language.value);
});





document.addEventListener(
  "DOMContentLoaded",
  function () {
    let queryString = window.location.href;
    console.log(queryString);
    joinArray = queryString.split("/");
    console.log(joinArray[4]);

    socket.emit("join", joinArray[4]);
    // socket.on ("join-room",(data)=> window.location.replace('/room/'+data));
  },
  false
);

idYazdir = window.location.href.split("/");
odaId.innerText = idYazdir[4];

function kopyala(element) {
  let kopyalaIdValue = odaId.innerText;

  navigator.clipboard.writeText(kopyalaIdValue).then(() => {
    // Alert the user that the action took place.
    // Nobody likes hidden stuff being done under the hood!
    alert("Oda ID' si kopyalandı");
  });
}

//btnKopyala.onclick = function() {
//window.alert('Oda Id\'si kopyalandı' + odaId.innerText);
//}

area.addEventListener("scroll", () => {
  lineCounter.scrollTop = area.scrollTop;
  lineCounter.scrollLeft = area.scrollLeft;
});

/*area.addEventListener("keydown", (e) => {
  let { keyCode } = e;
  let { value, selectionStart, selectionEnd } = area;
  if (keyCode === 9) {
    // TAB = 9
    e.preventDefault();
    area.value =
      value.slice(0, selectionStart) + "\t" + value.slice(selectionEnd);
    area.setSelectionRange(selectionStart + 2, selectionStart + 2);
  }
});*/
var lineCountCache = 0;
function line_counter() {
  var lineCount = area.value.split("\n").length;
  var outarr = new Array();
  if (lineCountCache != lineCount) {
    for (var x = 0; x < lineCount; x++) {
      outarr[x] = x + 1 + ".";
    }
    lineCounter.value = outarr.join("\n");
  }
  lineCountCache = lineCount;
}

area.addEventListener("input", () => {
  line_counter();
  //burdan aşşagısı yeni
});
var t= setInterval(line_counter,1000);

/*
area.addEventListener('keydown', event => {
  
  if (event.key == 'Tab') {
    const start = area.selectionStart
    const end = area.selectionEnd

    area.value = area.value.substring(0, start) + '\t' + area.value.substring(end)

    event.preventDefault()
  }
})*/

InputAcBtn.addEventListener("click", () => {
  Input.style.display = "block";
});






// RENKLENDİRME KODLARI BASLANGIC

function update(text) {
  let result_element = document.querySelector("#highlighting-content");
  // Handle final newlines (see article)
  if(text[text.length-1] == "\n") {
    text += " ";
  }
  // Update code
  result_element.innerHTML = text.replace(new RegExp("&", "g"), "&amp;").replace(new RegExp("<", "g"), "&lt;"); /* Global RegExp */
  // Syntax Highlight
  Prism.highlightElement(result_element);
}

function sync_scroll(element) {
  /* Scroll result to scroll coords of event - sync with textarea */
  let result_element = document.querySelector("#highlighting");
  // Get and set x and y
  result_element.scrollTop = element.scrollTop;
  result_element.scrollLeft = element.scrollLeft;
}

function check_tab(element, event) {
  let code = element.value;
  if(event.key == "Tab") {
    /* Tab key pressed */
    event.preventDefault(); // stop normal
    let before_tab = code.slice(0, element.selectionStart); // text before tab
    let after_tab = code.slice(element.selectionEnd, element.value.length); // text after tab
    let cursor_pos = element.selectionStart + 1; // where cursor moves after tab - moving forward by 1 char to after tab
    element.value = before_tab + "\t" + after_tab; // add tab char
    // move cursor
    element.selectionStart = cursor_pos;
    element.selectionEnd = cursor_pos;
    update(element.value); // Update text to include indent
  }
}
// RENKLENDİRME KODLARI BİTİS




window.onload = function() {
  fetch("/odayaGir", {
method: "GET",
headers: {
"Content-Type": "application/json",
},
})
.then(function (response) {
  return response.json();
})
.then(function (data) {
  if(data.yonlendir != undefined) window.location.replace(data.yonlendir);
  if(data.cikis != undefined) window.location.replace(data.cikis);
  console.log(data);
  //alert(JSON.stringify(data,['message'].['username']));
})
.catch(function (err) {
  console.log("Fetch Error :-S", err);
});

return false;
}


function kodKayitEt(){
  fetch("/kodKayit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    
    body: JSON.stringify({
        kod: area.value,
        dil: language.value,})
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //if(data.yonlendir != undefined) window.location.replace(data.yonlendir);
      console.log(data);
      alert(JSON.stringify(data, ['message']));
      
    })
    .catch(function (err) {
      console.log("Fetch Error :-S", err);
    });

  return false;
}

function kodGetirr(){
  fetch("/kodGetir", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    
    body: JSON.stringify({
       })
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //if(data.yonlendir != undefined) window.location.replace(data.yonlendir);
      console.log(data);
    // let kodgoruntule =
     //alert(kodgoruntule);
    })
    .catch(function (err) {
      console.log("Fetch Error :-S", err);
    });

  return false;

}
