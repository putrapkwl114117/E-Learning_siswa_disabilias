document.addEventListener("DOMContentLoaded", function (event) {
  const showNavbar = (
    toggleId,
    navId,
    bodyId,
    headerId,
    middleSectionClass,
    mainBeforeClass
  ) => {
    const toggle = document.getElementById(toggleId),
      nav = document.getElementById(navId),
      bodypd = document.getElementById(bodyId),
      headerpd = document.getElementById(headerId),
      middleSection = document.querySelector(middleSectionClass),
      mainBefore = document.querySelector(mainBeforeClass);

    // Validate that all variables exist
    if (toggle && nav && bodypd && headerpd && middleSection && mainBefore) {
      toggle.addEventListener("click", () => {
        // show navbar
        nav.classList.toggle("show");
        // change icon
        toggle.classList.toggle("bx-x");
        // add padding to body
        bodypd.classList.toggle("body-pd");
        // add padding to header
        headerpd.classList.toggle("body-pd");

        // Move middle section and mainbefore when navbar is toggled
        if (nav.classList.contains("show")) {
          middleSection.style.marginLeft = "200px";
          mainBefore.style.marginLeft = "200px";
        } else {
          middleSection.style.marginLeft = "0";
          mainBefore.style.marginLeft = "0";
        }
      });
    }
  };

  showNavbar(
    "header-toggle",
    "nav-bar",
    "body-pd",
    "header",
    ".middle-section",
    ".mainbefore"
  );

  /*===== LINK ACTIVE =====*/
  const linkColor = document.querySelectorAll(".nav_link");

  function colorLink() {
    if (linkColor) {
      linkColor.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
    }
  }
  linkColor.forEach((l) => l.addEventListener("click", colorLink));

  // Your code to run since DOM is loaded and ready
});


