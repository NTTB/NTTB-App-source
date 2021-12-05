// Status: Partly redone.
declare function $(...args);

class PageMenuImpl {
  toggle() {
    // Classic mode
    $("body").toggleClass("menu-right-open");
  }

  close() {
    document.querySelector("body").classList.remove("menu-right-open");
  }

  open() {
    document.querySelector("body").classList.add("menu-right-open");
  }
}

export const PageMenu = new PageMenuImpl();