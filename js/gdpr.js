/*********************************************************************************************

program: NTTB App
name: gdpr
type: JS
version: 0.2
date: 2021-11-23
description: store and recive gdpr consents
author: JOFTT

************************************************************************************************/

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

function mng_gdpr_b() {
    for (var i = 0; i < profile_set.gdpr.length; i++) { // 97=a		
        $("#privacy" + (profile_set.gdpr.charCodeAt(i) - 96)).prop("checked", true);
    }
    if (profile_set.has_results === "1" || profile_set.has_function === "1") {
        $('#anonimous_avg').text('Omdat u in een NTTB-competitie of NTTB-toernooi hebt gespeeld of binnen de NTTB een functie (hebt) bekleed, kunt u niet anoniem zijn op de gepubliceerde websites, apps en sociale media van de NTTB.');
        $('#anonimous_vink').hide();
    } else {
        $('#anonimous_avg').text('Indien u geen functie binnen de NTTB bekleedt of hebt bekleedt of geen resultaten hebt behaald in competities en/of toernooien, en u op websites, apps en sociale media van de NTTB anoniem wenst te blijven kunt u dat hier aangeven.');
        $('#anonimous_vink').show();
        if (profile_set.gdpr.includes('b')) {
            $('#anonimous_vink').prop('checked', true);
        } else {
            $('#anonimous_vink').prop('checked', false);
        }
    }
}


/***************** html as const to prevent cross origin protection **************************** */

const help_gdpr = ` Als u ouder dan 16 jaar bent, kunnen via deze functie privacy toestemmingen aangepast worden. Past eerst de vinkjes aan en druk dan op de 'AKKOORD' knop nonderaan.<br>Voor meer informatie zie de privacy pagina op de <a href="https://www.nttb.nl/privacywet/" target="_blank">NTTB website</a>.`;

const page_gdpr_html = `
<div id="m_rght">
    <a href="#" onclick="$('body').toggleClass('menu-right-open')" class="menu-right nav-item nav-link"
        style="padding-left:5px;">
        <i class="icon material-icons">more_vert</i>
    </a>
</div>

<div id="page_gdpr" class="card card-data-item mx-2 mt-2">

    <div class="row pt-3 pl-3 mx-0">
        <div class="col-4 text-left">
            <a href="https://www.nttb.nl/" class="media user-column">
                <img class="img-fluid" style="max-height:150px;" src="./img/nttb_n.png">
            </a>
        </div>

        <div class="col-8 mb-4">
            <div class="media-body align-self-center ">
                <h1 style="font-size:4vw;">TOESTEMMINGSVERKLARING</h1>
                <h5 id="p_name" class="mt-2"></h5>
                <h5 id="p_bnr" class="mt-2"></h5>
            </div>
        </div>
    </div>
    <hr>

    <div class="container">
        <!--privacy start-->
        <div class="row">
            <div class="col-sm-12 gdpr_hr">
                <p style="color:black;font-weight:bold"">Wij willen u graag informeren over alle activiteiten van de NTTB, de verenigingen binnen de NTTB en de organisaties waarmee wij samenwerken<br>Onderdeel van het lidmaatschap van de NTTB is dat wij teamsamenstellingen en wedstrijduitslagen van competities en toernooien inclusief lidmaatschapsnummer, naam en persoonlijke resultaten op websites en apps van de NTTB plaatsen. Deze publicaties zijn tevens deelbaar op de sociale mediakanalen van de NTTB.                   
                <br>Wij vragen u toestemming om daarnaast deze gegevens te mogen delen met organisatoren die in samenwerking met of in opdracht van de NTTB evenementen organiseren.</p>

                <div id="O16_consent" class="my-2" style="color:#c82333;font-weight:bold">Ik geef de NTTB toestemming voor de hieronder aangekruiste gegevensverwerkingen:</div>
            </div>
        </div>
       
        <div class="mt-2">
            <strong>A)</strong> Het beschikbaar stellen van mijn naam, verenigingsnaam, geboortedatum en geslacht aan organisatoren van evenementen die niet door de NTTB of haar verenigingen worden georganiseerd, zodat zij u kunnen uitnodigen voor deelname aan deze evenementen.
        </div>
        <div class="gdpr_hr">
            <input type="checkbox" class="form-control" name="privacy1" id="privacy1">
        </div>

        <div class="mt-2">
            <strong>B)</strong> <span id="anonimous_avg"></span>
        </div>
        <div class="gdpr_hr">
             <input id="anonimous_vink" style="display:none" type="checkbox" class="form-control" name="privacy2" id="privacy2">
        </div>
          
        <div class="mt-2">
            <strong>C)</strong> Mij benaderen voor onderzoeken in het belang van leden van de NTTB.
        </div>
        <div class="gdpr_hr">
            <input type="checkbox" class="form-control" name="privacy3" id="privacy3">
        </div>

        <div class="mt-2">
            <strong>D)</strong> Publiceren van foto’s/afbeeldingen en films van mij op websites, apps en sociale media van de NTTB of van organisaties waar de NTTB mee samenwerkt. Dit geldt ook voor foto’s/afbeeldingen en films waarop ook sponsors van tafeltennisverenigingen en/of de NTTB staan. Door deel te nemen aan een wedstrijd of toernooi, of zich toegang te verschaffen tot een speellocatie waarin foto- of filmopnamen worden gemaakt, geeft u eveneens toestemming voor publicatie van de beelden.
        </div>
        <div class="gdpr_hr">
            <input type="checkbox" class="form-control" name="privacy4" id="privacy4">
        </div>
  
        <div class="mt-2">
            <strong>E)</strong> Het beschikbaar stellen van mijn naam en e-mailadres aan sponsoren van de NTTB zodat zij mij kunnen benaderen voor aan de sport tafeltennis gerelateerde aanbiedingen en producten.
        </div>
        <div class="gdpr_hr">
            <input type="checkbox" class="form-control" name="privacy5" id="privacy5">
        </div>
   
        <div class="mt-2">
            <strong>F)</strong> Het opnemen van mijn pasfoto of teamfoto op de website van de NTTB of organisaties waar de NTTB mee samenwerkt.
        </div>
        <div class="gdpr_hr">
            <input type="checkbox" class="form-control" name="privacy6" id="privacy6">
        </div>

        <div class="mt-2">
            <strong>G)</strong> Mijn naam en e-mailadres via de afgeschermde website van de NTTB beschikbaar stellen zodat andere leden mij kunnen benaderen.
        </div>
        <div class="gdpr_hr">
            <input type="checkbox" class="form-control" name="privacy7" id="privacy7">
        </div>

        <div class="mt-2">
            <strong>H)</strong> Mij na beëindiging van mijn lidmaatschap te benaderen voor bijvoorbeeld een reünie of bijzondere gebeurtenis.
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