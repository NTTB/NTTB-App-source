function page_dummy() {
  arrow_menu = "Dummy"; // Required because otherwise page_gdpr thinks it is navigating back to the original page
  setPageComponent("Dummy", { a: 12, b: 34 });
}

function page_empty() {
  arrow_menu = ""; // Required because otherwise page_gdpr thinks it is navigating back to the original page
  setPageComponent(undefined);
}