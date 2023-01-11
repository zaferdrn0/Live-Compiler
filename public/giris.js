let email = document.getElementById('email');
let sifre = document.getElementById('sifre');

function handleFormSubmit(event) {
    event.preventDefault();
  
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
  
      body: JSON.stringify({
          email: email.value,
          password: sifre.value})
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.yonlendir != undefined) window.location.replace(data.yonlendir);
        console.log(data);
        alert(JSON.stringify(data, ['message']));
      })
      .catch(function (err) {
        console.log("Fetch Error :-S", err);
      });
     
  
    return false;
  }