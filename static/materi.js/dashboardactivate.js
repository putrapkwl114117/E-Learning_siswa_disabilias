document.addEventListener("DOMContentLoaded", function (event) {
  const showNavbar = (
    toggleId,
    navId,
    bodyId,
    headerId,
    middleSectionClass,
    mainBeforeClass,
    cardClass,
    additionalClasses
  ) => {
    const toggle = document.getElementById(toggleId),
      nav = document.getElementById(navId),
      bodypd = document.getElementById(bodyId),
      headerpd = document.getElementById(headerId),
      middleSection = document.querySelector(middleSectionClass),
      mainBefore = document.querySelector(mainBeforeClass),
      cards = document.querySelectorAll(cardClass),
      additionalElements = document.querySelectorAll(additionalClasses);

    if (
      toggle &&
      nav &&
      bodypd &&
      headerpd &&
      middleSection &&
      mainBefore &&
      cards.length > 0
    ) {
      toggle.addEventListener("click", () => {
        nav.classList.toggle("show");
        toggle.classList.toggle("bx-x");
        bodypd.classList.toggle("body-pd");
        headerpd.classList.toggle("body-pd");

        if (nav.classList.contains("show")) {
          bodypd.classList.add("sidebar-active");
          headerpd.classList.add("sidebar-active");
          middleSection.classList.add("sidebar-active");
          mainBefore.classList.add("sidebar-active");
          cards.forEach((card) => {
            card.classList.add("sidebar-active");
          });
          additionalElements.forEach((el) => {
            el.classList.add("sidebar-active");
          });
        } else {
          bodypd.classList.remove("sidebar-active");
          headerpd.classList.remove("sidebar-active");
          middleSection.classList.remove("sidebar-active");
          mainBefore.classList.remove("sidebar-active");
          cards.forEach((card) => {
            card.classList.remove("sidebar-active");
          });
          additionalElements.forEach((el) => {
            el.classList.remove("sidebar-active");
          });
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
    ".mainbefore",
    ".cardb",
    ".container3, .container1, .container2, .table-container, .card-container, .taskFormContainer"
  );

  const linkColor = document.querySelectorAll(".nav_link");

  function colorLink() {
    if (linkColor) {
      linkColor.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
    }
  }
  linkColor.forEach((l) => l.addEventListener("click", colorLink));

  const viewBtn = document.getElementById("viewbtn");
  if (viewBtn) {
    viewBtn.addEventListener("click", function () {
      var cardsContainer = document.getElementById("cards-container");
      var cards = document.querySelectorAll(".cardb");
      var content = document.getElementById("content");

      if (content) {
        content.classList.add("hidden");
      }
      this.classList.add("hidden");

      if (cardsContainer) {
        cardsContainer.style.display = "flex";
      }

      cards.forEach(function (card) {
        setTimeout(function () {
          card.style.opacity = 1;
          card.style.transform = "scale(1)";
        }, 1);
      });
    });
  }
});
