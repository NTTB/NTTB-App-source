/*********************************************************************************************

program: NTTB App
name: planning
type: JS
version: 0.24
date: 2023-05-13
description: page and functions related to planning
author: JOFTT

************************************************************************************************/

/**
 *  edit wedstrijdplaning  
 */
function edit_agenda() {

    if (agenda_matches.length > 0) {
        let undr = 'style="text-decoration: underline;"';
        let str1 = ""; // planning
        let str3 = ''; // log
        let tmp;
        let plcn;
        let team_old = {};
        let same_day = 0;
        let t_list = [];
        let old_list = [];
        let p_list = {};
        let statpln = [];
        let str2 = []; // statistics
        let pID_ix = [];
        let current_teams = [];

        localStorage.setItem("nl_dwf_agenda", JSON.stringify(p_list));

        agenda_matches.forEach(wed => {
            if (!isOlder(wed.date)) {
                if (!t_list.includes(wed.tID)) {
                    t_list.push(wed.tID);
                }
            } else {
                team_old = {
                    tID: wed.tID,
                    pID: wed.pID,
                    comp: wed.c_comp
                };
                team_old.team = (wed.tID === wed.hid) ? wed.htm : wed.otm;
                tmp = JSON.stringify(team_old);
                if (!old_list.includes(tmp)) {
                    old_list.push(tmp);
                }
            }
        });

        if (old_list.length > 0) {
            str1 += 'Overzicht:<div class="px-2">'; // see A1
            old_list.forEach(old => {
                tmp = JSON.parse(old);
                str1 += '<div id="old_wed' + tmp.tID + '"></div>';
                current_teams.push(tmp.tID);
            });

        }

        let req_team = call_REST('get_team', { //get team list
            team: JSON.stringify(t_list),
            guest: 0
        });

        req_team.done(data => {
            let retApp = JSON.parse(data);
            if (ok_REST(retApp.error, retApp.username)) {
                p_list = JSON.parse(retApp.team);
                statpln = JSON.parse(retApp.stat);
                who = statpln = JSON.parse(retApp.who);

                agenda_matches.forEach(wed => { // nothing played yet;
                    if ($.inArray(wed.tID, current_teams) < 0) {
                        str1 += '<div id="old_wed' + wed.tID + '"></div>';
                        team_old = {
                            tID: wed.tID,
                            pID: wed.pID,
                            comp: wed.c_comp
                        };
                        team_old.team = (wed.tID === wed.hid) ? wed.htm : wed.otm;
                        tmp = JSON.stringify(team_old);
                        if (!old_list.includes(tmp)) {
                            old_list.push(tmp);
                        }
                        current_teams.push(wed.tID);
                    }
                });
                str1 += '</div>Planning:'; // see A1

                agenda_matches.forEach(wed => {
                    if (!isOlder(wed.date)) {
                        plcn = 'plcn' + wed.tID + wed.wnr;
                        if (same_day != wed.day) {
                            if (same_day != 0) {
                                str1 += '</div></div>';
                            }
                            str1 += '<div class="px-2">';
                            str1 += '<div style="width:100%" class="btn-poule card px-1" >';

                        } else if (!str1.includes(plcn)) {
                            str1 += '<hr style="border: 1px solid #007bff;">';
                        }
                        if (!str1.includes(plcn)) {
                            str1 += '<div id="plcn' + wed.tID + wed.wnr + '" >';
                            if (isEmpty(wed.cnf)) {

                                str1 += '<div class="row mt-2">';
                                str1 += '<div class="col-md-12 justify-content-start text-center ag_date">' + wed.date + '</div>';
                                str1 += '</div>'; //row

                                if (wed.htm === wed.team) {
                                    tgt = wed.otm + '</strong> thuis';
                                    apt = wed.htm;
                                } else {
                                    tgt = wed.htm + '</strong> uit';
                                    apt = wed.otm;
                                }
                                let wedname = wed.htm.replace(/'/g, "`") + " - " + wed.otm.replace(/'/g, "`");

                                str1 += '<div class="row mt-2">';
                                str1 += '<div class="col-md-12">' + apt + ' <span class="tb_wrapg">' + wed.c_comp + '</span></div>';
                                str1 += '</div>'; //row

                                str1 += '<div class="row mb-2">';
                                str1 += '<div class="col-md-6 blueicon">Tegen <strong>';
                                str1 += tgt;
                                str1 += '</div>';

                                str1 += '</div>'; //row

                                tmpid = wed.wnr + ',' + wed.tID + ',' + parseInt(localiSession.username);
                                agimatch = 'agimatch_' + wed.wnr + '_' + wed.tID + '_' + parseInt(localiSession.username);

                                str1 += '<div class="row mb-2">';
                                str1 += '<div class="col-12" >';
                                str1 += '<span id="ikga_' + wed.wnr + '_' + wed.tID + '" class="pb-2 dblueicon">Ik ga spelen:</span>';

                                str1 += '<span class="float-right" style="white-space:nowrap;">';
                                str1 += '<i onclick="add_caledar(\'' + wedname + "'," + wed.hta + "," + wed.loc + "," + wed.wnr + ",'" + wed.date + '\')" class="tbt icon material-icons iconCircle_nact">today</i>';
                                str1 += '&nbsp;&nbsp;<i id="' + agimatch + '_1" onclick="agenda_icon(1,' + tmpid + ')"  class="tbt icon material-icons greenicon iconCircle_nact">done</i>';
                                str1 += '&nbsp;&nbsp;<i id="' + agimatch + '_2" onclick="agenda_icon(2,' + tmpid + ')"  class="tbt icon material-icons yellowicon iconCircle_nact">timeline</i>';
                                str1 += '&nbsp;&nbsp;<i id="' + agimatch + '_3" onclick="agenda_icon(3,' + tmpid + ')"  class="tbt icon material-icons redicon iconCircle_nact">close</i>';
                                str1 += '&nbsp;&nbsp;<i id="' + agimatch + '_10" onclick="agenda_icon(10,' + tmpid + ')"  class="tbt icon material-icons grayicon iconCircle_nact">directions_car</i>';
                                str1 += '</span></div>'; // col
                                str1 += '</div>'; //row

                                str1 += '<div class="row pb-1 aglsrow">';
                                str1 += '<details class="agdeta"><summary class="agsumm"><div style="display:inline;" class="mr-1">Teamleden';
                                str1 += '<span id="dot_' + wed.wnr + '_' + wed.tID + '" class="float-right" style="white-space:nowrap;font-size:.2rem;"></span></div></summary>';
                                str1 += '<div id="team_' + wed.wnr + '_' + wed.tID + '" class="adlist mx-2"></div>';
                                str1 += '</details>';
                                str1 += '</div>'; //row

                            }
                            str1 += '</div>';
                        }
                        if (same_day != wed.day) {
                            same_day = wed.day;
                        }
                    }
                });
                str1 += '</div></div>';
                str1 += '<div id="logs"></div>';
                $("#wedstrijdplaning").html(str1);
                display_wed_agenda(p_list);

            }

            // old matches display

            old_list.forEach((old, ix) => {

                team_old = JSON.parse(old);
                str2[team_old.tID] = '<div style="width:100%; background-color:aliceblue;" class="btn-tm card px-1 pb-2" ><div>';
                str2[team_old.tID] += '<div class="row mt-2">';
                str2[team_old.tID] += '<div class="col-md-12 justify-content-start text-center ag_date">' + team_old.team + ' <span class="tb_wrapg">' + team_old.comp + '</span></div>';
                str2[team_old.tID] += '</div>';
                str2[team_old.tID] += '<div id="teamtab_' + team_old.tID + '"></div>';
                pID_ix[team_old.tID] = team_old.pID;

                if (who[team_old.tID] !== undefined) {
                    str3 += '<div class="col-md-12 justify-content-start tb_wrapg">De laatste wijziging in <span class="dblueicon">' + team_old.team + '</span> planning is aangebracht door ' + who[team_old.tID].by.slice(0, -4) + ' op ' + who[team_old.tID].date + '</div>';
                }

                let req_old = call_REST('get_whoplayed', { //get old matches
                    tID: team_old.tID,
                    pID: team_old.pID,
                    ix: team_old.tID
                });

                req_old.done(data => {
                    let retOld = JSON.parse(data);
                    if (ok_REST(retOld.error, retOld.username)) {
                        let PlayedBy = JSON.parse(retOld.playedby);
                        let statpld = JSON.parse(retOld.stat);
                        if (!jQuery.isEmptyObject(PlayedBy)) {
                            str2[retOld.ix] += '<div class="row aglsrow" style="margin-bottom: -.5rem;">';
                            str2[retOld.ix] += '<details class="agdeta"><summary class="agsumm"><div style="display:inline;" class="mr-1">Gespeelde wedstrijden</summary>';
                            agenda_matches.forEach(wed => {
                                if (isOlder(wed.date)) {
                                    tmp = wed.wnr.toString();
                                    if (wed.pID === pID_ix[retOld.ix] && !isEmpty(PlayedBy[tmp])) {
                                        str2[retOld.ix] += '<div class="row mt-2 mx-1">';
                                        str2[retOld.ix] += '<div class="col-sm dblueicon">';
                                        str2[retOld.ix] += '<div style="white-space:nowrap;" class="tb_wrap mr-2"><small>' + wed.date + '</small></div>';

                                        if (wed.htm === wed.team) {
                                            tgt = wed.otm.replace(/'/g, "`") + '</strong> thuis';
                                        } else {
                                            tgt = wed.htm.replace(/'/g, "`") + '</strong> uit';
                                        }

                                        str2[retOld.ix] += '<div style="white-space:nowrap;" class="blueicon tb_wrap"><small>tegen <strong>';
                                        str2[retOld.ix] += tgt;
                                        str2[retOld.ix] += '</small></div></div>';
                                        str2[retOld.ix] += '<div class="col-sm blackicon">';
                                        str2[retOld.ix] += PlayedBy[tmp];
                                        str2[retOld.ix] += '</div>';
                                        str2[retOld.ix] += '</div><hr style="margin:0">';
                                    }
                                }
                            });
                            str2[retOld.ix] += '</details>';
                            str2[retOld.ix] += '</div>';
                        }
                        str2[retOld.ix] += '</div></div>';
                        $("#old_wed" + retOld.ix).html(str2[retOld.ix]);

                        if (!isEmpty(statpld)) {

                            str2[retOld.ix] = '<table class="brdown mt-2 w-100"><thead><tr><th class="tdhead brdownb">naam</th><th class="tdhead brdownb tdr pl-3">gesp.</th><th class="tdhead brdownb tdr">gepl.</th><th class="tdhead brdownb tdr">auto</th></tr></thead><tbody>';
                            Object.keys(statpld[retOld.ix]).forEach(key => {

                                lenlist = statpld[retOld.ix][key];
                                str2[retOld.ix] += '<tr>';
                                str2[retOld.ix] += '<td>' + lenlist.name + '</td>';
                                str2[retOld.ix] += '<td class="tdr pl-3">' + lenlist.nr + '</td>';
                                str2[retOld.ix] += '<td style="color:#00933E" class="tdr pl-3">' + lenlist.pr + '</td>';
                                str2[retOld.ix] += '<td style="color:black" class="tdr pl-3">' + lenlist.ar + '</td>';
                                str2[retOld.ix] += '<tr>';

                            });
                            str2[retOld.ix] += '</tbody></table>';

                            $("#teamtab_" + retOld.ix).html(str2[retOld.ix]);
                        }

                    }
                });
            });

            if (!isEmpty(str3)) {
                $("#logs").html(str3);
            }
        });
    }

}

function display_wed_agenda(list) {
    localStorage.setItem("nl_dwf_agenda", JSON.stringify(list));
    let str;
    let tmpid;
    let agicon;
    let dot;
    let flag;

    agenda_matches.forEach(wed => {
        if (!isOlder(wed.date)) {
            str = '';
            dot = '';

            if (list[wed.tID] != null) {
                Object.values(list[wed.tID]).forEach(val => {
                    if (isEmpty(val.DWF) || val.DWF < 2) {
                        str += '<div class="row" >';
                        str += '<div class="col-12" >' + val.name.slice(0, -4);
                        tmpid = wed.wnr + ',' + wed.tID + ',' + val.bnr;
                        agicon = 'ag_icon_' + wed.wnr + '_' + wed.tID + '_' + val.bnr;

                        dot += agenda_dot(val.wnr, parseInt(wed.wnr), parseInt(wed.tID), parseInt(val.bnr));
                        $("#dot_" + wed.wnr + '_' + wed.tID).html(dot);

                        str += '<span class="float-right" style="white-space:nowrap;">';
                        str += '<i id="' + agicon + '_5" onclick="agenda_icon(5,' + tmpid + ')"  class="tbt icon material-icons dblueicon iconCircle_nact">clear_all</i>';
                        str += '&nbsp;&nbsp;<i id="' + agicon + '_1" onclick="agenda_icon(1,' + tmpid + ')" class="tbt icon material-icons greenicon iconCircle_nact">done</i>';
                        str += '&nbsp;&nbsp;<i id="' + agicon + '_2" onclick="agenda_icon(2,' + tmpid + ')" class="tbt icon material-icons yellowicon iconCircle_nact">timeline</i>';
                        str += '&nbsp;&nbsp;<i id="' + agicon + '_3" onclick="agenda_icon(3,' + tmpid + ')" class="tbt icon material-icons redicon iconCircle_nact">close</i>';
                        str += '&nbsp;&nbsp;<i id="' + agicon + '_10" onclick="agenda_icon(10,' + tmpid + ')" class="tbt icon material-icons grayicon iconCircle_nact">directions_car</i>';
                        str += '</span>'
                        str += '</div></div><hr style="margin-top:0;margin-bottom:0;">';

                    } else if (val.DWF >= 2) {
                        if (parseInt(val.bnr) == parseInt(localiSession.username)) {
                            $('#ikga_' + wed.wnr + '_' + wed.tID).text('Ik ga mee:');
                        }

                        str += '<div class="row" >';
                        str += '<div class="col-12 blackicon" ><i class="tbt icon material-icons mr-1">person_add_disabled</i>NPC - ' + val.name;
                        tmpid = wed.wnr + ',' + wed.tID + ',' + val.bnr;
                        agicon = 'ag_icon_' + wed.wnr + '_' + wed.tID + '_' + val.bnr;

                        str += '<span class="float-right" style="white-space:nowrap;">';
                        str += '<i id="' + agicon + '_5" onclick="agenda_icon(5,' + tmpid + ')"  class="tbt icon material-icons dblueicon iconCircle_nact">clear_all</i>';
                        str += '&nbsp;&nbsp;<i id="' + agicon + '_1" onclick="agenda_icon(1,' + tmpid + ')" class="tbt icon material-icons greenicon iconCircle_nact">done</i>';
                        str += '&nbsp;&nbsp;<i id="' + agicon + '_2" onclick="agenda_icon(2,' + tmpid + ')" class="tbt icon material-icons yellowicon iconCircle_nact">timeline</i>';
                        str += '&nbsp;&nbsp;<i id="' + agicon + '_3" onclick="agenda_icon(3,' + tmpid + ')" class="tbt icon material-icons redicon iconCircle_nact">close</i>';
                        str += '&nbsp;&nbsp;<i id="' + agicon + '_10" onclick="agenda_icon(10,' + tmpid + ')" class="tbt icon material-icons grayicon iconCircle_nact">directions_car</i>';
                        str += '</span>'
                        str += '</div></div><hr style="margin-top:0;margin-bottom:0;">';
                    }
                });

            }
            $("#team_" + wed.wnr + '_' + wed.tID).html(str);

        }
    });
    localStorage.setItem("nl_dwf_agenda", JSON.stringify(list));

    Object.keys(list).forEach(tID => {
        Object.values(list[tID]).forEach(val => {
            tmp = val.wnr;
            for (let wed in tmp) {
                if (!isNaN(wed)) {
                    flag = tmp[wed];
                    if (flag > 9) {
                        agenda_icon(10, parseInt(wed), parseInt(tID), val.bnr, list, false);
                        flag -= 10;
                    }
                    if (flag > 0) {
                        agenda_icon(flag, parseInt(wed), parseInt(tID), val.bnr, list, false);
                    }
                }
            }
        });
    });

}

function agenda_dot(tmpwnr, wnr, tID, bnr) {
    let dot = '';
    let flag = 0;
    let dotid = "dotid_" + wnr + '_' + tID + '_' + bnr;
    if (tmpwnr.length == 0) {
        dot += '<span id="' + dotid + '" class="iconCircle_white">o</span>';
    } else {
        fl = false;
        car = false;
        if (wnr in tmpwnr) {
            flag = parseInt(tmpwnr[wnr]);
            if (flag > 9) {
                flag -= 10;
            }

            if (flag == 0) {
                dot += '<span id="' + dotid + '" class="iconCircle_white">o</span>';
            } else if (flag == 1) {
                dot += '<span id="' + dotid + '" class="iconCircle_green">o</span>';
            } else if (flag == 2) {
                dot += '<span id="' + dotid + '" class="iconCircle_yellow">o</span>';
            } else if (flag == 3) {
                dot += '<span id="' + dotid + '" class="iconCircle_red">o</span>';
            }
        } else {
            dot += '<span id="' + dotid + '" class="iconCircle_white">o</span>';
        }
    }
    return dot;
}

function agenda_icon(icon, match, tID, bnr, i_list, fl_start = true) {
    if (i_list === undefined) {
        list = JSON.parse(localStorage.getItem("nl_dwf_agenda"));
    } else {
        list = i_list;
    }

    let wed = {};
    let flag = 0;
    let dotid = "#dotid_" + match + '_' + tID + '_' + bnr;

    if (icon == 1) { // play
        $('#ag_icon_' + match + '_' + tID + '_' + bnr + '_1').css({
            "backgroundColor": "#00933E",
            "color": "white"
        });
        $('#ag_icon_' + match + '_' + tID + '_' + bnr + '_2').css({
            "backgroundColor": "white",
            "color": "#F8622F"
        });
        $('#ag_icon_' + match + '_' + tID + '_' + bnr + '_3').css({
            "backgroundColor": "white",
            "color": "red"
        });

        if (bnr == parseInt(localiSession.username)) {
            $('#agimatch_' + match + '_' + tID + '_' + bnr + '_1').css({
                "backgroundColor": "#00933E",
                "color": "white"
            });
            $('#agimatch_' + match + '_' + tID + '_' + bnr + '_2').css({
                "backgroundColor": "white",
                "color": "#F8622F"
            });
            $('#agimatch_' + match + '_' + tID + '_' + bnr + '_3').css({
                "backgroundColor": "white",
                "color": "red"
            });
        }

    } else if (icon == 2) { // maybe
        $('#ag_icon_' + match + '_' + tID + '_' + bnr + '_1').css({
            "backgroundColor": "white",
            "color": "#00933E"
        });
        $('#ag_icon_' + match + '_' + tID + '_' + bnr + '_2').css({
            "backgroundColor": "#F8622F",
            "color": "white"
        });
        $('#ag_icon_' + match + '_' + tID + '_' + bnr + '_3').css({
            "backgroundColor": "white",
            "color": "red"
        });

        if (bnr == parseInt(localiSession.username)) {
            $('#agimatch_' + match + '_' + tID + '_' + bnr + '_1').css({
                "backgroundColor": "white",
                "color": "#00933E"
            });
            $('#agimatch_' + match + '_' + tID + '_' + bnr + '_2').css({
                "backgroundColor": "#F8622F",
                "color": "white"
            });
            $('#agimatch_' + match + '_' + tID + '_' + bnr + '_3').css({
                "backgroundColor": "white",
                "color": "red"
            });
        }

    } else if (icon == 3) { // not
        $('#ag_icon_' + match + '_' + tID + '_' + bnr + '_1').css({
            "backgroundColor": "white",
            "color": "#00933E"
        });
        $('#ag_icon_' + match + '_' + tID + '_' + bnr + '_2').css({
            "backgroundColor": "white",
            "color": "#F8622F"
        });
        $('#ag_icon_' + match + '_' + tID + '_' + bnr + '_3').css({
            "backgroundColor": "red",
            "color": "white"
        });

        if (bnr == parseInt(localiSession.username)) {
            $('#agimatch_' + match + '_' + tID + '_' + bnr + '_1').css({
                "backgroundColor": "white",
                "color": "#00933E"
            });
            $('#agimatch_' + match + '_' + tID + '_' + bnr + '_2').css({
                "backgroundColor": "white",
                "color": "#F8622F"
            });
            $('#agimatch_' + match + '_' + tID + '_' + bnr + '_3').css({
                "backgroundColor": "red",
                "color": "white"
            });
        }

    } else if (icon == 5) { // not
        $('#ag_icon_' + match + '_' + tID + '_' + bnr + '_1').css({
            "backgroundColor": "white",
            "color": "#00933E"
        });
        $('#ag_icon_' + match + '_' + tID + '_' + bnr + '_2').css({
            "backgroundColor": "white",
            "color": "#F8622F"
        });
        $('#ag_icon_' + match + '_' + tID + '_' + bnr + '_3').css({
            "backgroundColor": "white",
            "color": "red"
        });

        if (bnr == parseInt(localiSession.username)) {
            $('#agimatch_' + match + '_' + tID + '_' + bnr + '_1').css({
                "backgroundColor": "white",
                "color": "#00933E"
            });
            $('#agimatch_' + match + '_' + tID + '_' + bnr + '_2').css({
                "backgroundColor": "white",
                "color": "#F8622F"
            });
            $('#agimatch_' + match + '_' + tID + '_' + bnr + '_3').css({
                "backgroundColor": "white",
                "color": "red"
            });
        }
        let tmp = "#" + agenda_dot('', match, tID, bnr).split('"')[1];
        $(tmp).removeAttr('class').attr('class', '');
        $(tmp).addClass("iconCircle_white");


    } else if (icon == 10) { // car
        if ($('#ag_icon_' + match + '_' + tID + '_' + bnr + '_10').css("backgroundColor") === 'rgb(255, 255, 255)') {
            $('#ag_icon_' + match + '_' + tID + '_' + bnr + '_10').css({
                "backgroundColor": "black",
                "color": "white"
            });
            if (bnr == parseInt(localiSession.username)) {
                $('#agimatch_' + match + '_' + tID + '_' + bnr + '_10').css({
                    "backgroundColor": "black",
                    "color": "white"
                });
            }
        } else {
            $('#ag_icon_' + match + '_' + tID + '_' + bnr + '_10').css({
                "backgroundColor": "white",
                "color": "gray"
            });
            if (bnr == parseInt(localiSession.username)) {
                $('#agimatch_' + match + '_' + tID + '_' + bnr + '_10').css({
                    "backgroundColor": "white",
                    "color": "gray"
                });
            }
        }
    }

    if ($('#ag_icon_' + match + '_' + tID + '_' + bnr + '_1').css("backgroundColor") !== 'rgb(255, 255, 255)') {
        $(dotid).toggleClass($(dotid).attr('class') + ' iconCircle_green');
        flag = 1;
    } else if ($('#ag_icon_' + match + '_' + tID + '_' + bnr + '_2').css("backgroundColor") !== 'rgb(255, 255, 255)') {
        $(dotid).toggleClass($(dotid).attr('class') + ' iconCircle_yellow');
        flag = 2;
    } else if ($('#ag_icon_' + match + '_' + tID + '_' + bnr + '_3').css("backgroundColor") !== 'rgb(255, 255, 255)') {
        $(dotid).toggleClass($(dotid).attr('class') + ' iconCircle_red');
        flag = 3;
    }
    if ($('#ag_icon_' + match + '_' + tID + '_' + bnr + '_10').css("backgroundColor") !== 'rgb(255, 255, 255)') {
        flag += 10;
    }

    Object.values(list[tID]).forEach(val => {
        if (val.bnr == bnr) {
            if (isEmpty(val.wnr)) {
                wed[match] = flag;
            } else {
                wed = val.wnr;
                if (match in wed) {
                    wed[match] = flag;
                } else {
                    wed[match] = flag;
                }
            }
            val.wnr = wed;
        }
    });

    //send team agenda to dB
    localStorage.setItem("nl_dwf_agenda", JSON.stringify(list));
    if (fl_start) {

        let req_team = call_REST('put_team', {
            tID: tID,
            list: JSON.stringify(list[tID])
        });

        req_team.done(function (data) { });
    }
}

/**
 * open agenda screen
 */
function page_agenda() {
    $("body").toggleClass("menu-right-open");
    if (arrow_menu === "Planning") return;
    arrow_page(null);
    arrow_menu = "Planning";
    $("#content").html(page_agenda_html);
    add_header(naam_tabs_agenda); // add headers
    edit_agenda();
    $("#help").html(help_agenda);
    nav_left("Planning");
}

/***************** html as const to prevent cross origin protection ************************** */
const help_agenda = `
<div style="color:#10069F">
Op de dagen dat uw wedstrijden gepland staan is er een kaart beschikbaar waar alle wedstrijden chronologisch op te zien zijn. Hier kunt u aangeven op welke dagen u kunt spelen, twijfelt, of niet kunt spelen.
<br><br>
Door de kleine gekleurde balletjes <img src="./img/balrij.png" height="16"></img>is te zien hoeveel mensen al hebben gereageerd.
<br><br>
Wanneer je op het blokje <i class="tbt icon material-icons" style="color:#10069F;background-color:rgba(0, 123, 255, 0.1);">arrow_right</i> klikt, opent een lijst met teamleden inclusief voorkeur. Iedereen kan aanpassingen doorvoeren door op het juiste icoon te klikken:
<table class="table table-sm">
<tbody>
<tr>
<td><i class="tbt icon material-icons greenicon iconCircle_nact">done</i></td>
<td>ik ga spelen</td>
</tr><tr>
<td><i class="tbt icon material-icons yellowicon iconCircle_nact">timeline</i></td>
<td>ik twijfel nog  </td>
</tr><tr>
<td><i class="tbt icon material-icons redicon iconCircle_nact">close</i></td>
<td>ik kan niet spelen</td>
</tr><tr>
</tr><tr>
<td><i class="tbt icon material-icons dblueicon iconCircle_nact">clear_all</i></td>
<td>de ingevoerde voorkeuren wissen</td>
</tr><tr>
<td><i class="tbt icon material-icons grayicon iconCircle_nact">directions_car</i></td>
<td>Hier kunt u aangeven of u met de auto gaat (meerdere auto's mogelijk)</td>
</tr><tr>
<td><i class="tbt icon material-icons dblueicon iconCircle_nact">today</i></td>
<td>Verstuur een uitnodiging naar uw agenda</td>
</tr>
</tbody>
</table>
Binnen &eacute;&eacute;n kaart vallen alle wedstrijden op &eacute;&eacute;n dag van zowel reguliere als duocompetitie en zowel landelijke als regioswedstrijden (etc.) Als iemand zijn/haar aanwezigheid doorgeeft of wijzigt, zal dit niet direct invloed hebben op andere wedstrijden op dezelfde dag.
</div>

`;

const page_agenda_html = `
<div id='nav-agenda-head'></div>
<div id="page_agenda" class="card mx-1 my-2">
    <!--agenda start-->
        <div id="wedstrijdplaning"></div>
    <!--agenda end-->
</div>
`;
/*****************************************  html end ***************************************** */