function addClickEvent(selector) {
  document.querySelectorAll(selector).forEach(function (element) {
    element.addEventListener("click", function () {
      document.querySelectorAll(selector).forEach(function (el) {
        el.classList.remove("act");
      });
      this.classList.add("act");
    });
  });
}

addClickEvent("#header-nav>dd");
addClickEvent("main .year");
