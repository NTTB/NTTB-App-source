type PageMenuNav = "Home" | "Privacy" | "Ledenpas" | "Scoreboard" | "Oefeningen" | "Planning" | "NTTB";

class PageMenuImpl {
  private _currentPage: PageMenuNav = "Home";
  get currentPage(): PageMenuNav {
    // Original global value `arrow_menu`
    return this._currentPage;
  }

  set currentPage(v: PageMenuNav) {
    // Original global value `arrow_menu`
    // TODO: Should also enable/disable the relevant buttons
    // TODO: Should also set the help page (Originally `$("#help").html(help_gdpr); // load help`)
    this._currentPage = v;
  }

  close() {
    // $("body").toggleClass("menu-right-open"); // close menu
    console.warn("PageMenuImpl.close() -- Not implemented");
  }

  open() {
    // $("body").toggleClass("menu-right-open"); // close menu
    console.warn("PageMenuImpl.open() -- Not implemented");
  }
}

export const PageMenu = new PageMenuImpl();