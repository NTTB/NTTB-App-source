/*********************************************************************************************

program: NTTB App
name: gdpr
type: JS
version: 0.18
date: 2024-03-25
description: store and recive gdpr consents
author: JOFTT

************************************************************************************************/

/**
 * GDPR selected options confirmation
 */
function click_privacy() {
    if (fl_aconsent) {
        let gdpr = "";
        for (i = 1; i <= 8; i++) { // collect privacy check boxes
            if ($("#privacy" + i).prop("checked")) {
                gdpr += String.fromCharCode(96 + i); // convert to letters
            }
        }

        if ((profile_set.has_results === "1" || profile_set.has_function === "1") && !gdpr.includes('b')) {
            gdpr += 'b'; // if any results exists or kader add 'b'
        }
        if (profile_set.has_function === "1" && !gdpr.includes('f')) {
            gdpr += 'f'; // if kader add 'f'
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
            $("#unsuccess_txtq").html("Verbindingsfout. Probeer het opnieuw.");
            $(".notification.top.red").notify(3000);
        });
    }
}

/**
 * open GDPR page & preparation
 */
function page_gdpr(fl = false) {
    $("body").toggleClass("menu-right-open"); // close menu
    if (arrow_menu === "Privacy") return; // Privacy is selected
    //arrow_ini(); // previous page set
    arrow_page(null);
    arrow_menu = "Privacy";
    $("#content").html(page_gdpr_html); // load html
    add_header(naam_tabs_gdpr); // add headers
    $("#help").html(help_gdpr); // load help
    nav_left("Privacy"); // deactivate menu Privacy
    update_profile(true, false); // update fl_aconsent status now and execute mng_gdpr_b()   
    $("#p_name").html(profile_set.name);
    $("#p_bnr").html(localiSession.username);

    if (fl) { // don't go back to TIN
        arrow_tab = JSON.parse(localStorage.getItem("nl_dwf_back_arrow"));
        arrow_tab.pop();
        localStorage.setItem("nl_dwf_back_arrow", JSON.stringify(arrow_tab));
    }
}

/**
 * GDPR questions management
 */
function mng_gdpr_b() {
    for (var i = 0; i < profile_set.gdpr.length; i++) { // 97=a		
        $("#privacy" + (profile_set.gdpr.charCodeAt(i) - 96)).prop("checked", true);
    }
    if (profile_set.has_results === "1" || profile_set.has_function === "1") { // B
        $('#anonimous_avg').text('Omdat u in een NTTB-competitie of NTTB-toernooi hebt gespeeld of binnen de NTTB een functie (hebt) bekleed, kunt u niet anoniem zijn op de gepubliceerde websites, apps en sociale media van de NTTB.');
        $('#privacy2').hide();
    } else {
        $('#anonimous_avg').text('Indien u geen functie binnen de NTTB bekleedt of hebt bekleedt of geen resultaten hebt behaald in competities en/of toernooien, en u op websites, apps en sociale media van de NTTB niet anoniem wenst te blijven kunt u dat hier aangeven.');
        $('#privacy2').show();
        if (profile_set.gdpr.includes('b')) {
            $('#privacy2').prop('checked', true);
        } else {
            $('#privacy2').prop('checked', false);
        }
    }
    if (profile_set.has_function === "1") { // F 
        $('#foto_avg').text('Omdat u een functie (hebt) uitoefenen binnen de NTTB, zoals bijvoorbeeld bestuursleden, bondsraadleden, commissieleden en werkgroepleden, gebruiken wij uw persoonsgegevens en uw foto om uw functie zichtbaar te maken op onze websites en u te voorzien van een e-mail van de organisatie.');
        $('#privacy6').hide();
    } else {
        $('#foto_avg').text('Het opnemen van mijn pasfoto of teamfoto op de website van de NTTB of organisaties waar de NTTB mee samenwerkt.');
        $('#anonprivacy6imous_vink').show();
        if (profile_set.gdpr.includes('f')) {
            $('#privacy6').prop('checked', true);
        } else {
            $('#privacy6').prop('checked', false);
        }
    }
    if (fl_aconsent) {
        $("#avg_consent").show();
    } else {
        $("#O16_consent").text("Omdat jij nog geen 16 jaar bent, mag je niet zelf toestemming geven voor het gebruik van jouw persoonsgegevens. Dat kunnen alleen jouw ouders of je wettelijke vertegenwoordigers. Hiervoor moeten zij contact opnemen met het Bondsbureau van de NTTB.");
        $("#avg_consent").hide();
    }
}

/**
 * open config page
 */
function page_config() {
    $("body").toggleClass("menu-right-open"); // close menu
    if (arrow_menu === "Instellingen") return; // config is selected
    arrow_page(null);
    arrow_menu = "Instellingen";
    $("#content").html(page_config_html); // load html
    add_header(naam_tabs_config); // add headers
    $("#help").html(help_config); // load help
    nav_left("Instellingen"); // deactivate menu Instellingen  
    activate_tester(); // activate options for tester
    let str = "DWF: " + main_version + ' / Jacek Offierski';
    str += "<br>Scorebord: " + sb_version + ' / Jacek Offierski';

    prime_club_set();
    if (tester.includes(parseInt(localiSession.username))) str += '<br>Boot: ' + localStorage.getItem("bootver");
    $("#config_ver").html(str);
    $("#wss_change").val(isWS);
    $("#config1_lan").html(config_lan.config1_lan[language]);
    $("#config2_lan").html(config_lan.config2_lan[language]);
    $("#config3_lan").html(config_lan.config3_lan[language]);
}

/**
 * open config page not log-in
 */
function page_config_nli() {
    $("body").toggleClass("menu-right-open"); // close menu
    if (arrow_menu === "Instellingen") return; // config is selected
    arrow_page(null);
    arrow_menu = "Instellingen";
    $("#content").html(page_config_html_nli); // load html
    add_header(naam_tabs_config); // add headers
    $("#help").html(help_config); // load help
    nav_left("Instellingen"); // deactivate menu Instellingen  
    let str = "DWF: " + main_version + ' / Jacek Offierski';
    str += "<br>Scorebord: " + sb_version + ' / Jacek Offierski';
    prime_club_set();
    $("#config_ver").html(str);
}

/**
 * select one of club to be primary
 */
function prime_club_set() {
    let i = 0;
    let str = '';
    if (localStorage.getItem("nl_dwf_priclub") !== null) prime_club = localStorage.getItem("nl_dwf_priclub");

    if (profile_set.club_mem[prime_club] !== undefined) {
        str += '<div class="row tdbutton-o mx-1 mb-1"><div class="col-12 col mr-3 tabszf pl-1"><i class="icon material-icons my-1 mr-2 tbm">store</i>' + profile_set.club_mem[prime_club] + '</div></div>';
    }
    Object.keys(profile_set.club_mem).forEach(key => {
        if (key !== prime_club) {
            str += '<div onclick="set_primclub(' + key + ')" class="row tdbutton mx-1 mb-1"><div class="col-12 col mr-3 tabszf pl-1"><i class="icon material-icons my-1 mr-2 tbm">store</i>' + profile_set.club_mem[key] + '</div></div>';
        }
        i++;
    });
    if (i > 1) {
        $("#prime_club_select").html(str);
        $("#prime_club_config").show();
    } else {
        $("#prime_club_config").hide();
    }
}

function set_primclub(x) {
    let y = x.toString();
    localStorage.setItem("nl_dwf_priclub", y);
    prime_club = y;
    prime_club_set();
}

/**
 * confirmation remove account
 */
function remove_account() {
    let message = "Nadat u op <strong>Bevestig</strong> hebt gedrukt, wordt uw applicatie-account verwijderd van dit apparaat en ook van de server. U kunt altijd een nieuw account aanvragen via het inlogscherm. ";
    modal_notification(message, do_remove_account, "APPLICATIEACCOUNT VERWIJDEREN", "Terug,Bevestig");
}

/**
 * call remove account API if confirm
 * 
 * @param {number} buttonIndex 1-back, 2-confirmed 
 */
function do_remove_account(buttonIndex) {
    if (buttonIndex == 2) {

        let req_del = call_REST('del_account', { // save gdpr on server
            ver: push_version
        });

        req_del.done(function (data) {
            retApp = JSON.parse(data);
            if (ok_REST(retApp.error, retApp.username)) {
                localStorage.clear();
                if (navigator.app != null) navigator.app.exitApp(); // Android exit app
                click_signonoff();
            } else {
                $("#unsuccess_txtq").html("Fout tijdens account verwijderen. Probeer het opnieuw.");
                $(".notification.top.red").notify(3000);
            }
        });

        req_del.fail(function () {
            $("#unsuccess_txtq").html("Verbindingsfout. Probeer het opnieuw.");
            $(".notification.top.red").notify(3000);
        });
    }
}

/**
 * confirmation for clean local storage data
 */
function clean_local_data() {
    let message = "Nadat u op <strong>Opschonen</strong> hebt gedrukt, worden alle applicatiegegevens op dit apparaat opgeschoond. U wordt uitgelogd, maar u kunt direct inloggen met uw bestaande bondsnummer en wachtwoord.";
    modal_notification(message, do_clean_local_data, "APPARAATGEGEVENS OPRUIMEN", "Terug,Opschonen");
}

/**
 * clean local storage data
 * 
 * @param {number} buttonIndex 1-back, 2-confirmed 
 */
function do_clean_local_data(buttonIndex) {
    if (buttonIndex == 2) {
        localStorage.clear();
        if (navigator.app != null) navigator.app.exitApp(); // Android exit app
        click_signonoff();
    }
}

/**
 * confirmation for re-boot
 */
function device_clean_reboot() {
    let message = "Nadat je op <strong>Opschonen</strong> hebt gedrukt, worden alle applicatiegegevens op dit apparaat opgeschoond en wordt de applicatie opnieuw geladen op dit apparaat. U hoeft niet opnieuw in te loggen.";
    modal_notification(message, do_reboot, "APPARAAT OPSCHONEN", "Terug,Opschonen");
}

/**
* clean local storage data and re-boot
* 
* @param {number} buttonIndex 1-back, 2-confirmed 
*/
function do_reboot(buttonIndex) {
    if (buttonIndex == 2) {
        localStorage.clear();
        localStorage.setItem('nl_dwf_profile', JSON.stringify(profile_set));
        localStorage.setItem("username", localiSession.username);
        localStorage.setItem('nl_dwf_sessionInfo', JSON.stringify(localiSession));
        localStorage.setItem('nl_dwf_loginStatus', "true");
        boot();
    }
}

/**
 * change language flip-flop
 */
function change_language() {
    language = (int(language) == 0) ? 1 : 0;
    let req_club = call_REST('put_dwfsetting', {
        user: localiSession.username,
        lan: language
    });

    req_club.done(data => {
        let retApp = JSON.parse(data);
        if (retApp.error === "OK") {
            $("#config1_lan").html(config_lan.config1_lan[language]);
            $("#config2_lan").html(config_lan.config2_lan[language]);
            $("#config3_lan").html(config_lan.config3_lan[language]);
        }
    });

}

/***************** html  **************************** */

var config_lan = {
    "config1_lan": {
        0: "CHANGE LANGUAGE TO:",
        1: "TAAL WIJZIGEN NAAR:"
    },
    "config2_lan": {
        0: "English",
        1: "Nederlands"
    },
    "config3_lan": {
        0: "Language will be changed only for the <strong>Event Scoresheet</strong> function.",
        1: "Deze functie verandert alleen de taal voor het <strong>Digitaal Wedstrijdformulier</strong>."
    }
};

// config page
var page_config_html = `
<div id="page_config" class="card card-data-item">
    <div class="content-sticky-footer">
        <div id='nav-config-head'></div>
        <div class="card card-data-item mx-2 mt-3">

            <div class="row mx-1 mb-1">
                <div style="font-weight:bold;">PRIVACY INSTELLINGEN</div>
            </div>
            <div onclick="page_gdpr()" class="row tdbutton mx-1">
                <div class="col-12 tabszf pl-1"><i
                        class="icon material-icons my-1 mr-2 tbm">assignment_turned_in</i>Toestemmingsverklaring
                    aanpassen
                </div>
            </div>
            <div class="config_txt mx-1">Als u ouder bent dan 16 jaar, dan kunt u via deze functie de toestemming rondom
                privacy aanpassen.</div>
            <hr>

            <div class="row mx-1 mt-3">
                <h6 id="config1_lan" style="font-weight:bold;"></h6>
            </div>
            <div onclick="change_language()" class="row tdbutton mx-1">
                <div class="col-12 tabszf pl-1">
                    <i class="icon material-icons my-1 mr-2 tbm">language</i>
                    <span id="config2_lan"></span>
                </div>
            </div>
            <div id="config3_lan" class="config_txt mx-1"></div>
            <hr>

            <div class="row mx-1 mt-3">
                <h6 style="font-weight:bold;">E-MAIL WIJZIGEN</h6>
                <div class="input-group" style="border:solid 1px #007bff;border-radius:0.25rem;">
                    <input id="email_change" type="email" class="form-control input_fill"
                        placeholder="plaats hier uw nieuwe e-mailadres" aria-label="email">
                    <div class=" input-group-prepend">
                        <span class="input-group-text"><i class="material-icons">email</i></span>
                    </div>
                </div>
            </div>
            <div onclick="change_email()" class="row tdbutton mx-1 mt-1">
                <div class="col-12 tabszf pl-1"><i
                        class="icon material-icons my-1 mr-2 tbm">published_with_changes</i>E-mail aanpassen</div>
            </div>
            <div class="config_txt mx-1">Heeft u een nieuw of ander e-mailadres? Vul hier uw nieuwe e-mailadres in en
                drukt
                op "E-mail aanpassen". Dit e-mailadres wordt direct doorgevoerd in de NTTB-ledenadministratie.</div>
            <hr>

            <div id="prime_club_config">
                <div class="row mx-1 mt-3">
                    <h6 style="font-weight:bold;">SELECTEER UW PRIMAIRE VERENIGING</h6>
                </div>
                <div id="prime_club_select"></div>
                <div class="config_txt mx-1">Kies de vereniging die u altijd als eerste wilt zien.</div>
                <hr>
            </div>

            <div class="row mx-1 mt-3">
                <h6 style="font-weight:bold;">APPLICATIE-ACCOUNT VERWIJDEREN</h6>
            </div>
            <div onclick="remove_account()" class="row tdbutton mx-1">
                <div class="col-12 tabszf pl-1"><i class="icon material-icons my-1 mr-2 tbm">clear_all</i>Wis account
                </div>
            </div>
            <div class="config_txt mx-1">Het verwijderen van de applicatie-account wist alle gegevens die door deze
                applicatie worden gebruikt en u wordt direct uitgelogd uit de applicatie.<br>LET OP: Het
                NTTB-lidmaatschap
                wordt niet opgezegd. Het NTTB-lidmaatschap kan alleen via de ledenadministratie van uw vereniging worden
                stopgezet.</div>
            <hr>

            <div class="row mx-1 mt-3">
                <h6 style="font-weight:bold;">APPARAATGEGEVENS OPRUIMEN</h6>
            </div>
            <div onclick="device_clean_reboot()" class="row tdbutton mx-1">
                <div class="col-12 tabszf pl-1"><i class="icon material-icons my-1 mr-2 tbm">cleaning_services</i>Apparaat opschonen</div>
            </div>
            <div class="config_txt mx-1">Deze functie ruimt alle gegevens op die deze applicatie gebruikt binnen dit apparaat.<br>LET OP: Deze functie verwijdert uw applicatie-account niet. Dit is enkel een reset van de applicatie zelf.</div>
            <hr>

            <div class="row mx-1 mt-3">
                <h6 style="font-weight:bold;">APPLICATIEVERSIE EN VERSIEHISTORIE</h6>
            </div>

            <div onclick="window.open('https://www.nttb-ranglijsten.nl/extra/update.php', '_blank')"
                class="row tdbutton mx-1">
                <div class="col-12 tabszf pl-1"><i class="icon material-icons my-1 mr-2 tbm">public</i>Bekijk
                    versiehistorie
                </div>
            </div>
            <div class="row mx-1 mt-0 config_txt" id="config_ver"></div>
            <hr>

            <div id="debug_view" class="row mt-3"></div>
        </div>
    </div>
</div>
`;

// config when not log-in
var page_config_html_nli = ` 
<div id="page_config" class="card card-data-item">
    <div class="content-sticky-footer">
        <div id='nav-config-head'></div>
        <div class="card card-data-item mx-2 mt-3">

            <div onclick="window.open('https://www.nttb-ranglijsten.nl/extra/update.php', '_blank')"
                class="row tdbutton mx-1">
                <div class="col-12 tabszf pl-1"><i class="icon material-icons my-1 mr-2 tbm">public</i>Bekijk
                    versiehistorie
                </div>
            </div>
            <div class="row mx-1 mt-0 config_txt" id="config_ver"></div>
            <hr>

        </div>
    </div>
</div>
`;

// page config self explain. No help.
var help_config = ``;

// GDPR page help
var help_gdpr = `Als u ouder bent dan 16 jaar, dan kunt u via deze functie de toestemming rondom privacy aanpassen.<br>Past eerst de vinkjes aan en druk dan op de 'AKKOORD' knop nonderaan.<br>Voor meer informatie zie de privacy pagina op de <a href="https://www.nttb.nl/privacywet/" target="_blank">NTTB website</a>.`;

// GDPR page
var page_gdpr_html = `
<div id="page_gdpr" class="card card-data-item">
    <div id='nav-gdpr-head'></div>
    <div class="row pl-3 mx-0 mt-3">
        <div class="mr-3">
            <h5 id="p_name" class="mt-2"></h5>
        </div>
        <div>
            <h5 id="p_bnr" class="orangeicon mt-2"></h5>
        </div>
    </div>
    <hr>

    <div class="container">
        <!--privacy start-->
        <div class="row">
            <div class="col-sm-12 gdpr_hr">
                <p style="color:black;font-weight:bold"">Wij willen u graag informeren over alle activiteiten van de NTTB, de verenigingen binnen de NTTB en de organisaties waarmee wij samenwerken<br>Onderdeel van het lidmaatschap van de NTTB is dat wij teamsamenstellingen en wedstrijduitslagen van competities en toernooien inclusief lidmaatschapsnummer, naam en persoonlijke resultaten op websites en apps van de NTTB plaatsen. Deze publicaties zijn tevens deelbaar op de sociale mediakanalen van de NTTB.                   
                <br>
                Wij vragen u toestemming om daarnaast deze gegevens te mogen delen met organisatoren die in samenwerking met of in opdracht van de NTTB evenementen organiseren.</p>

                <div id="O16_consent" class="my-2" style="color:#c82333;font-weight:bold">Ik geef de NTTB toestemming voor de hieronder aangekruiste gegevensverwerkingen:</div>
            </div>
        </div>
       
        <div class="mt-2">
            Het beschikbaar stellen van mijn naam, verenigingsnaam, geboortedatum en geslacht aan organisatoren van evenementen die niet door de NTTB of haar verenigingen worden georganiseerd, zodat zij u kunnen uitnodigen voor deelname aan deze evenementen.
        </div>
        <div class="gdpr_hr">
            <input type="checkbox" class="form-control" name="privacy1" id="privacy1">
        </div>

        <div class="mt-2">
            <span id="anonimous_avg"></span>
        </div>
        <div class="gdpr_hr">
             <input style="display:none" type="checkbox" class="form-control" name="privacy2" id="privacy2">
        </div>
          
        <div style="display:none" class="mt-2">
            Mij benaderen voor onderzoeken in het belang van leden van de NTTB.
        </div>
        <div style="display:none" class="gdpr_hr">
            <input type="checkbox" class="form-control" name="privacy3" id="privacy3">
        </div>

        <div class="mt-2">
            Publiceren van foto’s/afbeeldingen en films van mij op websites, apps en sociale media van de NTTB of van organisaties waar de NTTB mee samenwerkt. Dit geldt ook voor foto’s/afbeeldingen en films waarop ook sponsors van tafeltennisverenigingen en/of de NTTB staan. Door deel te nemen aan een wedstrijd of toernooi, of zich toegang te verschaffen tot een speellocatie waarin foto- of filmopnamen worden gemaakt, geeft u eveneens toestemming voor publicatie van de beelden.
        </div>
        <div class="gdpr_hr">
            <input type="checkbox" class="form-control" name="privacy4" id="privacy4">
        </div>
  
        <div class="mt-2">
            Het beschikbaar stellen van mijn naam en e-mail aan sponsoren van de NTTB zodat zij mij kunnen benaderen voor aan de sport tafeltennis gerelateerde aanbiedingen en producten.
        </div>
        <div class="gdpr_hr">
            <input type="checkbox" class="form-control" name="privacy5" id="privacy5">
        </div>
   
        <div class="mt-2">
            <span id="foto_avg"></span>
        </div>
        <div class="gdpr_hr">
            <input type="checkbox" class="form-control" name="privacy6" id="privacy6">
        </div>

        <div class="mt-2">
            Mijn naam en e-mail via de afgeschermde website van de NTTB beschikbaar stellen zodat andere leden mij kunnen benaderen.
        </div>
        <div class="gdpr_hr">
            <input type="checkbox" class="form-control" name="privacy7" id="privacy7">
        </div>

        <div class="mt-2">
            Mij na beëindiging van mijn lidmaatschap te benaderen voor bijvoorbeeld een reünie of bijzondere gebeurtenis.
        </div>
        <div class="gdpr_hr">
            <input type="checkbox" class="form-control" name="privacy8" id="privacy8">
        </div>

        <div id="avg_consent" class="row mt-4">
            <div class="col-md-12">
                <span style="color:#c82333;;font-weight: bold">Mijn toestemming geldt alleen voor de hiervoor aangevinkte en beschreven redenen, gegevens en organisaties. 
                <br>Voor nieuwe gegevensverwerkingen zal de NTTB mij opnieuw om toestemming vragen.
                <br>Ik mag mijn toestemming op elk moment intrekken.
                </span><br><br>
                <button onclick="click_privacy()" type="submit" name="privacy_change" id="privacy_change" tabindex="4" class="btn btn-danger btn-lg btn-block btn-radius "><i class="material-icons">assignment_turned_in</i> Akkoord</button>
            </div>
        </div>
        <br>
    </div>
    <!--privacy end-->
</div>
`;
/******************************************* html end ***************************************** */