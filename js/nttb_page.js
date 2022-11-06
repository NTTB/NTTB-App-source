/*********************************************************************************************

program: NTTB App
name: nttb page
type: JS
version: 0.14
date: 2022-10-17
description: view NTTB info
author: JOFTT

************************************************************************************************/

function page_nttb() {
    if (arrow_menu === "NTTB") return;
    arrow_page('#nav-find'); // previous page set
    arrow_menu = "NTTB";
    $("#content").html(page_nttb_html); // load html
    $("body").toggleClass("menu-right-open"); // close menu
    $("#help").html(help_nttb); // load help
    nav_left("NTTB"); // deactivate menu NTTB
}

function sub_page_rss() {
    if (fl_sp_rss) { // rss once a session
        if (localStorage.getItem("nl_dwf_news_date") !== today) { // once a day only download
            let req_rss = call_REST('news', {}); //read RSS
            req_rss.done(function (data) {
                $("#news_today").html(data); // show news
                localStorage.setItem("nl_dwf_news", data);
                localStorage.setItem("nl_dwf_news_date", today);
            });
        } else {
            $("#news_today").html(localStorage.getItem("nl_dwf_news")); // show news
        }
        fl_sp_rss = false;
    }
}
/******************************************** nttb.html ***************************************** */
const help_nttb = `
<table class="table table-sm">
<tbody>
   <tr>
        <td><i class="icon material-icons">info</i></td>
        <td>De Nederlandse Tafeltennisbond (NTTB) is op 23 juni 1935 opgericht. De Tafeltennisbond is de overkoepelende organisatie voor tafeltennis in Nederland en is lid van sportkoepel NOC*NSF, de Europese Tafeltennis Unie (ETTU) en de Internationale Tafeltennis Federatie (ITTF). Tafeltennis is sinds 1988 een Olympische sport en ook onderdeel van de Paralympische Spelen.</td>
   </tr>
   <tr>
        <td><i class="icon material-icons">public</i></td>
        <td>Actueel Tafeltennisnieuws uit tafeltennis.nl website.</td>
   </tr>
   <tr>
        <td><i class="icon material-icons">date_range</i></td>
        <td>Actuele Evenementen uit tafeltennis.nl website.</</td>
</tr>
   <tr>
        <td><i class="icon material-icons">view_quilt</i></td>
        <td>Goedgekeurde materialen door NTTB en ITTF.</</td>
   </tr>
</tbody>
</table>
`;

const page_nttb_html = `
<script src="https://apps.elfsight.com/p/platform.js" defer></script>
<style>.eapp-events-calendar-events-calendar-title {
    color: #10069F!important;
    margin-left: 0.7rem!important;
    font-size: 1.25rem!important;
    font-weight: 500!important;
    line-height: 1.2!important;
    display: inline!important;
}
</style>

<nav class="tabber tabber-bottom publish-tabs">
    <div class="nav nav-tabs" id="nav-tab" role="tablist">
        <a onclick="arrow_back('#nav-nttbinfo');" class="nav-item nav-link active" id="nav-nttbinfo-tab"  data-toggle="tab" href="#nav-nttbinfo" role="tab" aria-controls="nav-nttbinfo" aria-selected="true">
            <i class="icon material-icons">info</i>
            <p class="bottext_menu">info</p>
        </a>
        <a onclick="arrow_back('#nav-news');sub_page_rss()" class="nav-item nav-link" id="nav-news-tab" data-toggle="tab" href="#nav-news" role="tab" aria-controls="nav-news" aria-selected="false">
            <i class="icon material-icons">public</i>
            <p class="bottext_menu">op Web</p>
        </a>
        <a onclick="arrow_back('#nav-evenementen')" class="nav-item nav-link" id="nav-evenementen-tab" data-toggle="tab" href="#nav-evenementen" role="tab" aria-controls="nav-evenementen" aria-selected="false">
            <i class="icon material-icons">date_range</i>
            <p class="bottext_menu">evenementen</p>
        </a>
        <a onclick="arrow_back('#nav-material');" class="nav-item nav-link" id="nav-material-tab" data-toggle="tab" href="#nav-material" role="tab" aria-controls="nav-material" aria-selected="false">
            <i class="material-icons">view_quilt</i>
            <p class="bottext_menu">materiaal</p>
        </a>
    </div>
</nav>

<div id="m_rght">
    <a href="#" onclick="$('body').toggleClass('menu-right-open')" class="menu-right nav-item nav-link" style="padding-left:5px;">
        <i class="icon material-icons">more_vert</i>
    </a>
</div>

<div id="m_left" onclick="arrow_return()">
    <div class="nav-item nav-link" style="padding-right:5px">
        <i class="icon material-icons">arrow_back</i>
    </div>
</div>

<div class="tab-content h-100" id="nav-tabContent">

    <!-- info -->
    <div class="tab-pane fade show active" id="nav-nttbinfo" role="tabpanel" aria-labelledby="nav-nttbinfo-tab">
        <div class="content-sticky-footer">

            <div class="card card-data-item mx-2 mt-2 py-3">
                <div class="row pt-3 pl-3 mx-0">
                    <div class="col-4 text-center">
                        <a href="https://www.nttb.nl/" target="_blank" class="media user-column">
                            <img class="img-fluid" style="max-height:150px;" src="./img/nttb_n.png">
                        </a>
                    </div>

                    <div class="col-8 mb-4">
                        <div class="media-body align-self-center ">
                            <span style="font-size:5.9vw;">NEDERLANDSE TAFELTENNISBOND</span>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="container">
                    <div class="row mb-2">
                        <div class="col-md" style="display: flex;justify-content:space-around;">
                            <a href="https://www.facebook.com/NederlandseTafeltennisbond/" target="_blank" class="social"><img
                                    src="./img/facebook.png"></a>
                            <a href="https://www.linkedin.com/company/nederlandse-tafeltennisbond/" target="_blank" class="social"><img
                                    src="./img/linkedin.png"></a>
                            <a href="https://twitter.com/tafeltennis" target="_blank" class="social"><img src="./img/twitter.png"></a>
                            <a href="https://www.instagram.com/NTTB_tafeltennis/" target="_blank" class="social"><img
                                    src="./img/instagram.png"></a>
                            <a href="https://www.youtube.com/channel/UCl4lBjp5z1-YMniT9J-0dXw" target="_blank" class="social"><img
                                    src="./img/youtube.png"></a>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-md ml-2">
                            <h6 class="orangeicon">CONTACTGEGEVENS</h6>
                            <p><strong>De NTTB is gevestigd aan:</strong><br>
                                Kelvinbaan 48<br>
                                3439 MT Nieuwegein</p>
                            <p><strong>Postadres:</strong><br>
                                ​Postbus 2650<br>
                                3430 GB Nieuwegein</p>
                            <p><strong>Email:</strong> <a href="mailto:info@tafeltennis.nl">info@tafeltennis.nl</a><br>
                                <strong>Telefoon:</strong> 06 &#8211; 53 89 60 27</p>
                        </div>
                        <div class="col-md ml-2">
                            <h6 class="orangeicon">LINKS</h6>
                            <ul class="list">
                                <li class="item">
                                   <a class="link" href="https://tafeltennis.nl/" target="_blank">tafeltennis.nl</a>
                                </li>
                                <li class="item">
                                   <a class="link" href="https://www.nttb.nl/" target="_blank">nttb.nl</a>
                                </li>
                                <li class="item">
                                    <a class="link" href="https://pingpongbaas.club/" target="_blank">pingpongbaas.club</a>
                                </li>
                                <li class="item">
                                    <a class="link" href="https://www.ettu.org/en/" target="_blank">Europese Tafeltennis Unie (ETTU)</a>
                                </li>
                                <li class="item">
                                    <a class="link" href="https://www.ittf.com/" target="_blank">Internationale Tafeltennis Federatie (ITTF)</a>
                                </li>
                                <li class=" item">
                                    <a class="link" href="https://www.nttb-ranglijsten.nl/" target="_blank">Ranglijsten</a>
                                </li>
                                <li class="item">
                                    <a class="link" href="https://www.tafeltennismasterz.nl/" target="_blank">TafeltennisMasterz</a>
                                </li>
                                <li class="item">
                                    <a class="link" href="https://www.nttb-scheidsrechters.nl/" target="_blank">Tafeltennis
                                        Scheidsrechters</a>
                                </li>
                                <li class="item">
                                    <a class="link" href="https://tafeltennismarkt.nl/" target="_blank">Tafeltennismarkt</a>
                                </li>
                                <li class="item">
                                    <a class="link" href="https://www.nttb.nl/webshop" target="_blank">Webshop</a>
                                </li>
                            </ul>
                        </div>
                        <div class="col-md ml-2">
                            <h6 class="orangeicon">AFDELINGEN</h6>
                            <ul class="list">
                                <li class="item"><a class="link" href="https://holland-noord.nttb.nl/" target="_blank">Holland-Noord</a></li>
                                <li class="item"><a class="link" href="https://zuidwest.nttb.nl/" target="_blank">ZuidWest</a></li>
                                <li class="item"><a class="link" href="https://west.nttb.nl/" target="_blank">West</a></li>
                                <li class="item"><a class="link" href="https://noord.nttb.nl/" target="_blank">Noord</a></li>
                                <li class="item"><a class="link" href="https://limburg.nttb.nl/" target="_blank">Limburg</a></li>
                                <li class="item"><a class="link" href="https://gelre.nttb.nl/" target="_blank">Gelre</a></li>
                                <li class="item"><a class="link" href="https://midden.nttb.nl/" target="_blank">Midden</a></li>
                                <li class="item"><a class="link" href="https://oost.nttb.nl/" target="_blank">Oost</a></li>
                            </ul>
                        </div>
                    </div>
                    <br>
                </div>
            </div>
        </div>
    </div>
    
    <!--evenementen-->
    <div class="tab-pane fade " id="nav-evenementen" role="tabpanel" aria-labelledby="nav-evenementen-tab">
        <div class="content-sticky-footer">
            <div class="card card-data-item mx-2 mt-2 py-3">
                <div style="margin-top: -1.3rem;" class="row">     
                    <div class="elfsight-app-a8a47a41-6076-4398-bf1f-6e63583e042c"></div>
                </div>  
            </div>
        </div>
    </div>

    <!-- material content -->
    <div class="tab-pane fade" id="nav-material" role="tabpanel" aria-labelledby="nav-material-tab">
        <div class="content-sticky-footer">
            <div class="card card-data-item mx-2 mt-2 py-3">
                <div class="row my-3 mx-3">
                    <div class="col">
                        <h5 style="display: inline;" class="font-light"><span id="welkom">Goedgekeurde tafeltennismateriaal</span></h5>
                    </div>
                </div>
                <div class="col-md mx-2">
                    Tafeltennis wordt met allerlei soorten frames, rubbers en balletjes gespeeld.<br>Hier zijn links met lijsten van tafeltennismateriaal dat (inter)nationaal is goedgekeurd.
                </div>
                <hr>
                <div class="col-md ml-2">
                    <h6 class="orangeicon">LINKS</h6>
                    <ul class="list">
                        <li class="item">
                            <a class="link" href="https://equipments.ittf.com/#/equipments/racket_coverings/" target="_blank">ITTF goedgekeurde rubbers</a>
                        </li>
                        <li class="item">
                            <a class="link" href="https://equipments.ittf.com/#/equipments/tables/" target="_blank">ITTF goedgekeurde tafels</a>
                        </li>
                        <li class="item">
                            <a class="link" href="https://equipments.ittf.com/#/equipments/balls/" target="_blank">ITTF goedgekeurde ballen</a><br><small>Specifiek voor Landelijke competitie selecteer in de kolom:&nbsp;<strong>TYPE</strong> &#X1F449; <em>With Seam</em></small></li>
                        <li class="item">
                            <a class="link" href="https://www.nttb.nl/wp-content/uploads/2021/06/Toegestane-niet-celluloid-ballen-2012-2022.pdf" target="_blank">Toegestane niet-celluloid ballen</a>
                        </li>
                    </ul>                
                </div>
            </div>
        </div>
    </div>

    <!-- news content -->
    <div class="tab-pane fade" id="nav-news" role="tabpanel" aria-labelledby="nav-news-tab">
        <div class="content-sticky-footer">
            <div class="card card-data-item mx-2 mt-2 py-3">
                <div class="row my-3 mx-3">
                    <div class="col">
                        <h5 style="display: inline;" class="font-light"><span id="welkom">Tafeltennisnieuws</span></h5>
                    </div>
                </div>
                <div id="news_today">Geen nieuws</div>
            </div>
        </div>
    </div>

</div>
`;
/******************************************** nttb end ******************************************** */