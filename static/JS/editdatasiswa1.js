// jQuery time
var current_fs, next_fs, previous_fs; // fieldsets
var animating; // flag to prevent quick multi-click glitches

document.querySelectorAll(".next").forEach(function (element) {
  element.addEventListener("click", function () {
    if (animating) return false;
    animating = true;

    current_fs = this.closest("fieldset");
    next_fs = current_fs.nextElementSibling;

    // check if next_fs exists
    if (!next_fs) return;

    // activate next step on progressbar using the index of next_fs
    var progressbarItems = document.querySelectorAll("#progressbar li");
    progressbarItems.forEach(function (item, index) {
      if (item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (
        index ===
        Array.from(document.querySelectorAll("fieldset")).indexOf(next_fs)
      ) {
        item.classList.add("active");
      }
    });

    // show the next fieldset
    next_fs.style.display = "block";
    // hide the current fieldset with style
    current_fs.style.display = "none";

    animating = false;
  });
});

document.querySelectorAll(".previous").forEach(function (element) {
  element.addEventListener("click", function () {
    if (animating) return false;
    animating = true;

    current_fs = this.closest("fieldset");
    previous_fs = current_fs.previousElementSibling;

    // check if previous_fs exists
    if (!previous_fs) return;

    // de-activate current step on progressbar
    var progressbarItems = document.querySelectorAll("#progressbar li");
    progressbarItems.forEach(function (item, index) {
      if (
        index ===
        Array.from(document.querySelectorAll("fieldset")).indexOf(current_fs)
      ) {
        item.classList.remove("active");
      }
      if (
        index ===
        Array.from(document.querySelectorAll("fieldset")).indexOf(previous_fs)
      ) {
        item.classList.add("active");
      }
    });

    // show the previous fieldset
    previous_fs.style.display = "block";
    // hide the current fieldset with style
    current_fs.style.display = "none";

    animating = false;
  });
});

// Get the modal
var modal = document.querySelector(".modal1");

// Get the button that opens the modal
var btns = document.querySelectorAll(".edit");

// When the user clicks the button, open the modal
btns.forEach(function (btn) {
  btn.onclick = function () {
    modal.style.display = "block";
  };
});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
