var localiSession = {
  username: "0",
  password: "",
  platform: "test",
  token: "",
  debug: false
};

var profile_set = {
  LJ: "", //licentie jeugd
  LS: "", //licentie senioren
  age: "", //leeftijd categorie
  bonus: "", //bonus punten
  cards: "", //rood, gele kaarten
  club_cur: "", //huidige vereniging lidmatschaap
  club_old: "", //vorige clubs
  date: "", //datum van profile
  foto: "non", //foto bexist
  gdpr: "abc", // privacy string
  gender: "",
  ini_rat: "", //initiele rating
  ini_year: "", //initiele rating jaar
  kader: "", //kader funties
  merge: "", //meer bondsnummers
  name: "", //naam
  para: "", //para active
  position: "", //rang positie
  rang: "", // actuele rang
  ranking: "", //actuele rating positie
  rating: "", //rating
  email: "",
  sr: 0, // is active referee
  ws: 0, // is active wedstrijdsecretaris
  has_results: 0, // has ever play competition or turnament
  has_function: 0 // has ever any funtion within NTTB
  
};

var today;
var dt_sql;
var dt_sys;
var dt_year;
var dt_month;
var dt_day;

// when is app ready **********************/
var debug_date = new Date();
dt_sys = new Date(debug_date);
dt_year = dt_sys.getFullYear();
dt_month = dt_sys.getMonth() + 1;
dt_day = dt_sys.getDate();
dt_sql = dt_sys.toISOString().split("T")[0];
today = dt_sql;
/******************************************/

var api_url = "";
var arrow_menu = "";
var fl_aconsent = true; //if 18 year and older consent is active
var fl_sp_rss = true;

function update_profile(fl){
	if(fl) mng_gdpr_b();
}

function arrow_ini(){
	return true; // open-source test responce
}

function nav_left(active) {
	return true; // open-source test responce
}

function arrow_back(a) {
	return true; // open-source test responce
}

function arrow_return() {
	return true; // open-source test responce
}

function base64url(source) {
  // Encode in classical base64
  encodedSource = CryptoJS.enc.Base64.stringify(source);
  // Remove padding equal characters
  encodedSource = encodedSource.replace(/=+$/, "");
  // Replace characters according to base64url specifications
  encodedSource = encodedSource.replace(/\+/g, "-");
  encodedSource = encodedSource.replace(/\//g, "_");
  return encodedSource;
}

function isEmpty(val) {
  return val == null || val.length === 0 ? true : false;
}

/* ---- Notification ---- */
var timeOut_noti = "";
jQuery.fn.extend({
  notify: function (delay) {
    var node = $(this);
    var height = node.css("height");
    node.css("height", "0px");
    $(".notification").css("display", "none");
    node.css("display", "block");
    node.animate({
        height: height
      },
      200
    );
    clearTimeout(timeOut_noti);
    if (!isNaN(delay)) {
      timeOut_noti = setTimeout(function () {
        node.animate({
            height: "0px"
          },
          200,
          function () {
            node.css("display", "none");
            node.css("height", height);
            node.css("font-size", "2vw");
          }
        );
      }, delay);
    }

    event.preventDefault();
    return false;
  },
  unnotify: function () {
    var node = $(this)
      .parent()
      .parent();
    var height = node.css("height");
    node.animate({
        height: "0px"
      },
      200,
      function () {
        node.css("display", "none");
        node.css("height", height);
      }
    );
    event.preventDefault();
    return false;
  }
});

$(".notification-close").on("click", function () {
  clearTimeout(timeOut_noti);
  var node = $(this)
    .parent()
    .parent();
  var height = node.css("height");
  node.animate({
      height: "0px"
    },
    200,
    function () {
      node.css("display", "none");
      node.css("height", height);
    }
  );
});

function pad(num, size) {
  var s = "000000000" + num;
  return s.substr(s.length - size);
}

$('#publish').on('hidden.bs.modal', function () {
  $('.tabber-bottom').attr('style', 'bottom: -9px');
});

escape = function (str) {
  return str
    .replace(/[\\]/g, '\\\\')
    .replace(/[\"]/g, '\\\"')
    .replace(/[\/]/g, '\\/')
    .replace(/[\b]/g, '\\b')
    .replace(/[\f]/g, '\\f')
    .replace(/[\n]/g, '\\n')
    .replace(/[\r]/g, '\\r')
    .replace(/[\t]/g, '\\t');
};

function HTMLentities(str) {
  if (typeof (str) !== "string") return str;
  return $.trim(str
    .replace(/"/g, '&#34;')
    .replace(/[/]/g, '&#47;')
    .replace(/[']/g, '&#39;')
    .replace(/[\n]/g, '<br>')
    .replace(/[\r]/g, '')
    .replace(/[\t]/g, '&nbsp;&nbsp;')
  );
};

function ok_REST(error, user) { // control if REST responce is OK
  return true; // open-source test responce

  return (error === "OK" && parseInt(user) == parseInt(localiSession.username)) ? true : false;
}

function call_REST(rest, data, type = 'POST') { // general REST call with token
  
  data.jwt = localiSession.token;
  data.username = localiSession.username;

  let req_resnet = $.ajax({
    url: api_url + "?" + rest,
    data: data,
    type: type,
    crossDomain: true,
    cache: false
  });

  return req_resnet; // done, fail
}
