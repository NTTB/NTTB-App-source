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
    $("#content").html(page_gdpr_html); // load html
    $("#help").html(help_gdpr); // load help
    nav_left("Privacy"); // deactivate menu Privacy
    update_profile(true); // update fl_aconsent status
    if (fl_aconsent) {
        $("#avg_consent").show();
    } else {
        $("#O16_consent").text("Omdat jij nog geen 16 jaar bent, mag je niet zelf toestemming geven voor het gebruik van jouw persoonsgegevens. Dat kunnen alleen jouw ouders of je wettelijke vertegenwoordigers. Hiervoor moeten zij contact opnemen met het Bondsbureau van de NTTB.");
        $("#avg_consent").hide();
    }
}