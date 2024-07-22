//jQuery time
var current_fs, next_fs, previous_fs; // fieldsets
var left, opacity, scale; // fieldset properties which we will animate
var animating; // flag to prevent quick multi-click glitches

document.querySelectorAll(".next").forEach(function (element) {
  element.addEventListener("click", function () {
    if (animating) return false;
    animating = true;

    current_fs = this.parentElement;
    next_fs = current_fs.nextElementSibling;

    // check if next_fs exists
    if (!next_fs) return;

    // activate next step on progressbar using the index of next_fs
    var fieldsetIndex = Array.from(
      document.querySelectorAll("fieldset")
    ).indexOf(next_fs);
    var progressbarItems = document.querySelectorAll("#progressbar li");
    if (fieldsetIndex >= 0 && fieldsetIndex < progressbarItems.length) {
      progressbarItems[fieldsetIndex].classList.add("active");
    }

    // show the next fieldset
    next_fs.style.display = "block";
    // hide the current fieldset with style
    var current_opacity = 1;
    var animationInterval = setInterval(function () {
      if (current_opacity <= 0) {
        clearInterval(animationInterval);
        current_fs.style.opacity = 0;
        current_fs.style.display = "none";
        animating = false;
      } else {
        scale = 1 - (1 - current_opacity) * 0.2;
        left = current_opacity * 50 + "%";
        opacity = 1 - current_opacity;
        current_fs.style.transform = "scale(" + scale + ")";
        current_fs.style.position = "absolute";
        next_fs.style.left = left;
        next_fs.style.opacity = opacity;
        current_opacity -= 0.05;
      }
    }, 15);
  });
});

document.querySelectorAll(".previous").forEach(function (element) {
  element.addEventListener("click", function () {
    if (animating) return false;
    animating = true;

    current_fs = this.parentElement;
    previous_fs = current_fs.previousElementSibling;

    // check if previous_fs exists
    if (!previous_fs) return;

    // de-activate current step on progressbar
    var fieldsetIndex = Array.from(
      document.querySelectorAll("fieldset")
    ).indexOf(current_fs);
    var progressbarItems = document.querySelectorAll("#progressbar li");
    if (fieldsetIndex >= 0 && fieldsetIndex < progressbarItems.length) {
      progressbarItems[fieldsetIndex].classList.remove("active");
    }

    // show the previous fieldset
    previous_fs.style.display = "block";
    // hide the current fieldset with style
    var current_opacity = 1;
    var animationInterval = setInterval(function () {
      if (current_opacity <= 0) {
        clearInterval(animationInterval);
        current_fs.style.opacity = 0;
        current_fs.style.display = "none";
        animating = false;
      } else {
        scale = 0.8 + (1 - current_opacity) * 0.2;
        left = (1 - current_opacity) * 50 + "%";
        opacity = 1 - current_opacity;
        current_fs.style.left = left;
        previous_fs.style.transform = "scale(" + scale + ")";
        previous_fs.style.opacity = opacity;
        current_opacity -= 0.05;
      }
    }, 15);
  });
});

// Get the modal
var modal = document.getElementById("myModal4");

// Get the button that opens the modal
var btn = document.getElementById("tambahSiswaButton");

// When the user clicks the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
