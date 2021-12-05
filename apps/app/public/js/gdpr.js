// Status
// 1. Updated the page_gdpr() so that it uses the component intead of HTML
// 2. Removed the old submit.
// 3. Kept the original way of setting the HTML
// 4. The code for menu has been kept.
// 5. mng_gdpr_b has been removed since it's now part of the component.


function click_privacy() {
  if (fl_aconsent) {
    let gdpr = "";
    for (i = 1; i <= 8; i++) { // collect privacy check boxes
      if ($("#privacy" + i).prop("checked")) {
        gdpr += String.fromCharCode(96 + i); // convert to letters
      }
    }
    if (profile_set.has_results === "1" && !gdpr.includes('b')) {
      gdpr += 'b'; // if any results exists or kader add 'b'
    }

    localiSession = JSON.parse(localStorage.getItem("nl_dwf_sessionInfo")); // Rest call prep
    let req_gdpr = call_REST('gdpr', { // save gdpr on server
      gdpr: gdpr
    });

    req_gdpr.done(function (data) {
      retApp = JSON.parse(data);
      if (ok_REST(retApp.error, retApp.username)) {
        $("#success_txtq").html("AVG is succesvol geregistreerd!");
        $(".notification.top.green").notify(3000);
        profile_set.gdpr = gdpr;
        localStorage.setItem("nl_dwf_profile", JSON.stringify(profile_set));
      } else {
        $("#unsuccess_txtq").html("Fout tijdens AVG registratie!");
        $(".notification.top.red").notify(3000);
      }
    });

    req_gdpr.fail(function () {
      $("#unsuccess_txtq").html("Connectiefout");
      $(".notification.top.red").notify(3000);
    });
  }
}

function page_gdpr() {
  $("body").toggleClass("menu-right-open"); // close menu
  if (arrow_menu === "Privacy") return; // Privacy is selected
  arrow_ini(); // previous page set
  arrow_menu = "Privacy";
  setPageComponent("GDPR");
  const help_gdpr = ` Als u ouder dan 16 jaar bent, kunnen via deze functie privacy toestemmingen aangepast worden. Past eerst de vinkjes aan en druk dan op de 'AKKOORD' knop nonderaan.<br>Voor meer informatie zie de privacy pagina op de <a href="https://www.nttb.nl/privacywet/" target="_blank">NTTB website</a>.`;
  $("#help").html(help_gdpr); // load help
  nav_left("Privacy"); // deactivate menu Privacy
  update_profile(true); // update fl_aconsent status
}

function mng_gdpr_b() {
  // TODO: Remove this function once `update_profile(true)` can wait with updating.
  // Original intent: Update the gdpr values
}


/***************** html as const to prevent cross origin protection **************************** */

