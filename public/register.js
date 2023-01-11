let username = document.getElementById('KullaniciAdi');
let email = document.getElementById('email');
let sifre = document.getElementById('sifre');

function handleFormSubmit(event) {
  event.preventDefault();

  fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: 'follow',
    reffererPolicy: 'no-referrer',

    body: JSON.stringify({
        username: username.value,
        email: email.value,
        password: sifre.value})
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if(data.yonlendir != undefined) window.location.replace(data.yonlendir);
      console.log(data);
      alert(JSON.stringify(data, ['message']));
    })
    .catch(function (err) {
      console.log("Fetch Error :-S", err);
    });

  return false;
}

