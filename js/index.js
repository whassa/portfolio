// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);


window.addEventListener('resize', () => {
  // We execute the same script as before
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});


document.getElementById("theme-changer").onclick = function(e) {
  e.preventDefault();
  const checkbox = document.getElementById("theme-checkbox");
  const github = document.getElementById("github-logo");
  checkbox.checked = !checkbox.checked;
  if ( checkbox.checked ) {
    document.documentElement.className = "dark"; 
    setCookie('theme', "dark", 730);
    github.src = "img/GitHub-Mark-Light-32px.png"
  } else {
    document.documentElement.className = "light"; 
    setCookie('theme', "light", 730);
    github.src = "img/GitHub-Mark-32px.png"
  }
};



document.addEventListener('DOMContentLoaded', () => {
  const github = document.getElementById("github-logo");
  if (getCookie("theme") === "dark") {
    document.documentElement.className = "dark";
    github.src = "img/GitHub-Mark-Light-32px.png"
    document.getElementById("theme-checkbox").checked = true;
  } else {
    document.documentElement.className = "light";
    github.src = "img/GitHub-Mark-32px.png"
    document.getElementById("theme-checkbox").checked = false;
  }


  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {
    // Add a click event on each of them
    $navbarBurgers.forEach( el => {
      el.addEventListener('click', () => {

        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
      });
    });
  }
});

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
  return "";
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}