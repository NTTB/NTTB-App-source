<script lang="ts">
  import { PageMenu } from "../../shared/page-menu";
  import { GdprApi } from "./gdpr-api";
  import { Profile } from "../../shared/profile";

  let showAge16Warning = false;
  let showSaveButton = false;

  let checkA = false; // 1
  let checkB = false; // 2
  let checkC = false; // 3
  let checkD = false; // 4
  let checkE = false; // 5
  let checkF = false; // 6
  let checkG = false; // 7
  let checkH = false; // 8

  let hasMatches = false;
  let hasNttbFunction = false;

  async function click_privacy() {
    if (!(await Profile.can("changeGdpr"))) return;
    let gdpr = "";
    if (checkA) gdpr += "a";
    if (checkB) gdpr += "b";
    if (checkC) gdpr += "c";
    if (checkD) gdpr += "d";
    if (checkE) gdpr += "e";
    if (checkF) gdpr += "f";
    if (checkG) gdpr += "g";
    if (checkH) gdpr += "h";

    await GdprApi.update(gdpr);
  }

  async function onComponentShow() {
    // Update the checks
    checkA = Profile.gdpr.includes("a");
    checkB = Profile.gdpr.includes("b");
    checkC = Profile.gdpr.includes("c");
    checkD = Profile.gdpr.includes("d");
    checkE = Profile.gdpr.includes("e");
    checkF = Profile.gdpr.includes("f");
    checkG = Profile.gdpr.includes("g");
    checkH = Profile.gdpr.includes("h");

    hasNttbFunction = await Profile.hasNttbFunction();
    hasMatches = await Profile.hasMatches();
    if (hasNttbFunction || hasMatches) {
      checkB = true;
    }
    if (hasNttbFunction) {
      checkF = true;
    }

    showSaveButton = await Profile.can("changeGdpr");
  }

  onComponentShow();
</script>

<div id="m_rght">
  <a
    href="#"
    on:click={PageMenu.open}
    class="menu-right nav-item nav-link"
    style="padding-left:5px;"
  >
    <i class="icon material-icons">more_vert</i>
  </a>
</div>

<div id="page_gdpr" class="card card-data-item mx-2 mt-2">
  <div class="row pt-3 pl-3 mx-0">
    <div class="col-4 text-left">
      <a href="https://www.nttb.nl/" class="media user-column">
        <img
          class="img-fluid"
          style="max-height:150px;"
          src="./img/nttb_n.png"
          alt="Logo NTTB"
        />
      </a>
    </div>

    <div class="col-8 mb-4">
      <div class="media-body align-self-center ">
        <h1 style="font-size:4vw;">TOESTEMMINGSVERKLARING</h1>
        <h5 id="p_name" class="mt-2" />
        <h5 id="p_bnr" class="mt-2" />
      </div>
    </div>
  </div>
  <hr />

  <div class="container">
    <!--privacy start-->
    <div class="row">
      <div class="col-sm-12 gdpr_hr">
        <p style="color:black;font-weight:bold">
          Wij willen u graag informeren over alle activiteiten van de NTTB, de
          verenigingen binnen de NTTB en de organisaties waarmee wij samenwerken<br
          />Onderdeel van het lidmaatschap van de NTTB is dat wij
          teamsamenstellingen en wedstrijduitslagen van competities en
          toernooien inclusief lidmaatschapsnummer, naam en persoonlijke
          resultaten op websites en apps van de NTTB plaatsen. Deze publicaties
          zijn tevens deelbaar op de sociale mediakanalen van de NTTB.
          <br />Wij vragen u toestemming om daarnaast deze gegevens te mogen
          delen met organisatoren die in samenwerking met of in opdracht van de
          NTTB evenementen organiseren.
        </p>

        <div
          id="O16_consent"
          class="my-2"
          style="color:#c82333;font-weight:bold"
        >
          {#if showAge16Warning}
            Omdat jij nog geen 16 jaar bent, mag je niet zelf toestemming geven
            voor het gebruik van jouw persoonsgegevens. Dat kunnen alleen jouw
            ouders of je wettelijke vertegenwoordigers. Hiervoor moeten zij
            contact opnemen met het Bondsbureau van de NTTB.
          {:else}
            Ik geef de NTTB toestemming voor de hieronder aangekruiste
            gegevensverwerkingen:
          {/if}
        </div>
      </div>
    </div>

    <div class="mt-2">
      <strong>A)</strong> Het beschikbaar stellen van mijn naam, verenigingsnaam,
      geboortedatum en geslacht aan organisatoren van evenementen die niet door de
      NTTB of haar verenigingen worden georganiseerd, zodat zij u kunnen uitnodigen
      voor deelname aan deze evenementen.
    </div>
    <div class="gdpr_hr">
      <input
        type="checkbox"
        class="form-control"
        name="privacy1"
        id="privacy1"
        bind:checked={checkA}
      />
    </div>

    <div class="mt-2">
      <strong>B)</strong>
      {#if hasMatches || hasNttbFunction}
        Omdat u in een NTTB-competitie of NTTB-toernooi hebt gespeeld of binnen
        de NTTB een functie (hebt) bekleed, kunt u niet anoniem zijn op de
        gepubliceerde websites, apps en sociale media van de NTTB.
      {:else}
        Indien u geen functie binnen de NTTB bekleedt of hebt bekleedt of geen
        resultaten hebt behaald in competities en/of toernooien, en u op
        websites, apps en sociale media van de NTTB anoniem wenst te blijven
        kunt u dat hier aangeven.
      {/if}
    </div>
    <div class="gdpr_hr">
      {#if !(hasMatches || hasNttbFunction)}
        <input
          style="display:none"
          type="checkbox"
          class="form-control"
          name="i"
          id="privacy2"
          bind:checked={checkB}
        />
      {/if}
    </div>

    <div class="mt-2">
      <strong>D)</strong> Publiceren van foto’s/afbeeldingen en films van mij op
      websites, apps en sociale media van de NTTB of van organisaties waar de NTTB
      mee samenwerkt. Dit geldt ook voor foto’s/afbeeldingen en films waarop ook
      sponsors van tafeltennisverenigingen en/of de NTTB staan. Door deel te nemen
      aan een wedstrijd of toernooi, of zich toegang te verschaffen tot een speellocatie
      waarin foto- of filmopnamen worden gemaakt, geeft u eveneens toestemming voor
      publicatie van de beelden.
    </div>
    <div class="gdpr_hr">
      <input
        type="checkbox"
        class="form-control"
        name="privacy4"
        id="privacy4"
        bind:checked={checkD}
      />
    </div>

    <div class="mt-2">
      <strong>E)</strong> Het beschikbaar stellen van mijn naam en e-mailadres aan
      sponsoren van de NTTB zodat zij mij kunnen benaderen voor aan de sport tafeltennis
      gerelateerde aanbiedingen en producten.
    </div>
    <div class="gdpr_hr">
      <input
        type="checkbox"
        class="form-control"
        name="privacy5"
        id="privacy5"
        bind:checked={checkE}
      />
    </div>

    {#if hasNttbFunction}
      <div class="mt-2">
        <strong>F)</strong> Omdat u een functie (hebt) uitoefenen binnen de NTTB,
        zoals bijvoorbeeld bestuursleden, bondsraadleden, commissieleden en werkgroepleden,
        gebruiken wij uw persoonsgegevens en uw foto om uw functie zichtbaar te maken
        op onze websites en u te voorzien van een e-mailadres van de organisatie.
      </div>
      <div class="gdpr_hr" />
    {:else}
      <div class="mt-2">
        <strong>F)</strong> Het opnemen van mijn pasfoto of teamfoto op de website
        van de NTTB of organisaties waar de NTTB mee samenwerkt.
      </div>
      <div class="gdpr_hr">
        <input
          type="checkbox"
          class="form-control"
          name="privacy6"
          id="privacy6"
          bind:checked={checkF}
        />
      </div>
    {/if}

    <div class="mt-2">
      <strong>G)</strong> Mijn naam en e-mailadres via de afgeschermde website van
      de NTTB beschikbaar stellen zodat andere leden mij kunnen benaderen.
    </div>
    <div class="gdpr_hr">
      <input
        type="checkbox"
        class="form-control"
        name="privacy7"
        id="privacy7"
        bind:checked={checkG}
      />
    </div>

    <div class="mt-2">
      <strong>H)</strong> Mij na beëindiging van mijn lidmaatschap te benaderen voor
      bijvoorbeeld een reünie of bijzondere gebeurtenis.
    </div>
    <div class="gdpr_hr">
      <input
        type="checkbox"
        class="form-control"
        name="privacy8"
        id="privacy8"
        bind:checked={checkH}
      />
    </div>

    {#if showSaveButton}
      <div id="avg_consent" class="row mt-4">
        <div class="col-md-12">
          <span style="color:#c82333;;font-weight: bold"
            >Mijn toestemming geldt alleen voor de hiervoor aangevinkte en
            beschreven redenen, gegevens en organisaties.
            <br />Voor nieuwe gegevensverwerkingen zal de NTTB mij opnieuw om
            toestemming vragen.
            <br />Ik mag mijn toestemming op elk moment intrekken.
          </span><br /><br />
          <button
            on:click={click_privacy}
            type="submit"
            name="privacy_change"
            id="privacy_change"
            tabindex="4"
            class="btn btn-danger btn-lg btn-block btn-radius "
            ><i class="material-icons">assignment_turned_in</i>
            Akkoord</button
          >
        </div>
      </div>
    {/if}
    <br />
  </div>
  <!--privacy end-->
</div>
