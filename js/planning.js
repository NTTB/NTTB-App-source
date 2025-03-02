/*********************************************************************************************

program: NTTB App
name: planning
type: JS
version: 0.26
date: 2024-09-19
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
        let fl_sort = false;
        let team_old = {};
        let t_list = [];
        let old_list = [];
        let plan_list = {};
        let statpln = [];
        let str2 = []; // statistics
        let pID_ix = [];
        let current_teams = [];
        let teams_nr = 0;
        let who = {};

        localStorage.setItem("nl_dwf_agenda", JSON.stringify(plan_list));

        if (localStorage.hasOwnProperty("nl_dwf_plannigsort")) {
            fl_sort = JSON.parse(localStorage.getItem("nl_dwf_plannigsort"));
        } else {
            localStorage.setItem("nl_dwf_plannigsort", JSON.stringify(fl_sort));
        }

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
            str1 += planning_lan_def.summary[language] + ':<div class="px-2">';
            old_list.forEach(old => {
                tmp = JSON.parse(old);
                str1 += '<div id="old_wed' + tmp.tID + '"></div>';
                teams_nr++;
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
                plan_list = JSON.parse(retApp.team);
                statpln = JSON.parse(retApp.stat);
                who = JSON.parse(retApp.who);

                agenda_matches.forEach(wed => { // nothing played yet;
                    if ($.inArray(wed.tID, current_teams) < 0) {
                        str1 += '<div id="old_wed' + wed.tID + '"></div>';
                        teams_nr++;
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

                // display Planning
                str1 += '</div>' + planning_lan_def.plan[language] + ':'; // see all

                if (teams_nr > 1) str1 += '<div onclick="flip_agenda_sort(' + fl_sort + ')" class="brdownb mb-1"><i class="icon material-icons iconCirclesmall">sort</i><span class="txtivi_th tdhead"> sorteer op datum of team</span></div>';

                str1 += '<div id="sorted_agenda">';
                if (fl_sort) {
                    str1 += display_agenda_items(agenda_teams);
                } else {
                    str1 += display_agenda_items(agenda_matches);
                }
                str1 += '</div>';

                str1 += '<div id="logs"></div>';
                $("#wedstrijdplaning").html(str1);
                display_wed_agenda(plan_list);

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

                if (typeof who[team_old.tID] !== 'undefined') {
                    if (who[team_old.tID].date !== '') {
                        str3 += '<div class="col-md-12 justify-content-start tb_wrapg">' + planning_lan_def.note1[language] + '<span class="dblueicon">' + team_old.team + '</span>' + planning_lan_def.note2[language] + who[team_old.tID].by.slice(0, -4) + planning_lan_def.note3[language] + who[team_old.tID].date + '</div>';


                        str3 += `<div onclick="reset_agenda(` + team_old.tID + `,'` + team_old.team + `')" class="col mr-3 tdbutton-o mb-3"><table><tr class="orangeicon"><td class="td1"><i class="icon material-icons tbm pr-3">cleaning_services</i></td><td style="line-height:1rem;padding:.4rem;">` + planning_lan_def.reset[language] + team_old.team + `</td></tr></table></div>`;
                    }
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
                            str2[retOld.ix] += '<details class="agdeta"><summary class="agsumm"><div style="display:inline;" class="mr-1">' + planning_lan_def.mplayed[language] + ':</summary>';
                            agenda_matches.forEach(wed => {
                                if (isOlder(wed.date)) {
                                    tmp = wed.wnr.toString();
                                    if (wed.pID === pID_ix[retOld.ix] && !isEmpty(PlayedBy[tmp])) {
                                        str2[retOld.ix] += '<div class="row mt-2 mx-1">';
                                        str2[retOld.ix] += '<div class="col-sm dblueicon">';
                                        str2[retOld.ix] += '<div style="white-space:nowrap;" class="tb_wrap mr-2"><small>';
                                        str2[retOld.ix] += lan_week_day(wed.date, language);
                                        str2[retOld.ix] += '</small></div>';

                                        if (wed.htm === wed.team) {
                                            tgt = wed.otm.replace(/'/g, "`") + '</strong> ' + planning_lan_def.home[language];;
                                        } else {
                                            tgt = wed.htm.replace(/'/g, "`") + '</strong> ' + planning_lan_def.out[language];;
                                        }

                                        str2[retOld.ix] += '<div style="white-space:nowrap;" class="blueicon tb_wrap"><small>' + planning_lan_def.against[language] + ' <strong>';
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
                            str2[retOld.ix] = '<table class="brdown mt-2 w-100"><thead><tr><th class="tdhead brdownb">' + planning_lan_def.name[language] + '</th><th class="tdhead brdownb tdr">' + planning_lan_def.played[language] + '</th><th class="tdhead brdownb tdr">' + planning_lan_def.planned[language] + '</th><th class="tdhead brdownb tdr">' + planning_lan_def.car[language] + '</th></tr></thead><tbody>';
                            Object.keys(statpld[retOld.ix]).forEach(key => {

                                lenlist = statpld[retOld.ix][key];
                                str2[retOld.ix] += '<tr>';
                                str2[retOld.ix] += '<td>' + lenlist.name + '</td>';
                                str2[retOld.ix] += '<td class="tdr pr-3">' + lenlist.nr + '</td>';
                                str2[retOld.ix] += '<td style="color:#00933E" class="tdr pr-3">' + lenlist.pr + '</td>';
                                str2[retOld.ix] += '<td style="color:black" class="tdr pr-3">' + lenlist.ar + '</td>';
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

var days_en = {
    'ma': 'Mon',
    'di': 'Tue',
    'wo': 'Wed',
    'do': 'Thu',
    'vr': 'Fri',
    'za': 'Sat',
    'zo': 'Sun'
}

/**
 * change week day name to English if this is selected language
 * 
 * @param {string} dt date in Dutch format
 * @param {integer} lan language
 * @returns string - date according to selected language
 */
function lan_week_day(dt, lan) {
    if (int(lan) == 1) {
        let x = dt.slice(0, 2);
        return dt.replace(x, days_en[x]);
    } else {
        return dt;
    }
}

/** */
function flip_agenda_sort() {
    let fl_sort = JSON.parse(localStorage.getItem("nl_dwf_plannigsort"));
    fl_sort = !fl_sort;
    localStorage.setItem("nl_dwf_plannigsort", JSON.stringify(fl_sort));
    edit_agenda();
}

function display_agenda_items(agenda) {
    let same_day = 0;
    let plcn, tgt, apt;
    let str1 = '';
    agenda.forEach(wed => {
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
                    str1 += '<div class="col-md-12 justify-content-start text-center ag_date ' + ((wed.move) ? 'redicon' : '') + '">' + lan_week_day(wed.date, language);
                    if (wed.move) str1 += ' <i class="material-icons" style="vertical-align:middle;font-size:1rem">mobiledata_off</i>';
                    str1 += '</div>';
                    str1 += '</div>'; //row

                    if (wed.htm === wed.team) {
                        tgt = wed.otm + '</strong> ' + planning_lan_def.home[language];
                        apt = wed.htm;
                    } else {
                        tgt = wed.htm + '</strong> ' + planning_lan_def.out[language];
                        apt = wed.otm;
                    }
                    let wedname = wed.htm.replace(/'/g, "`") + " - " + wed.otm.replace(/'/g, "`");

                    str1 += '<div class="row mt-2">';
                    str1 += '<div class="col-md-12">' + apt + ' <span class="tb_wrapg">' + wed.c_comp + '</span></div>';
                    str1 += '</div>'; //row

                    str1 += '<div class="row mb-2">';
                    str1 += '<div class="col-md-6 blueicon">' + planning_lan_def.against[language] + ' <strong>';
                    str1 += tgt;
                    str1 += '</div>';

                    str1 += '</div>'; //row

                    tmpid = wed.wnr + ',' + wed.tID + ',' + parseInt(localiSession.username);
                    agimatch = 'agimatch_' + wed.wnr + '_' + wed.tID + '_' + parseInt(localiSession.username);

                    str1 += '<div class="row mb-2">';
                    str1 += '<div class="col-12" >';
                    str1 += '<span id="ikga_' + wed.wnr + '_' + wed.tID + '" class="pb-2 dblueicon">' + planning_lan_def.iplay[language] + ':</span>';

                    str1 += '<span class="float-right" style="white-space:nowrap;">';
                    str1 += '<i onclick="add_caledar(\'' + wedname + "'," + wed.hta + "," + wed.loc + "," + wed.wnr + ",'" + wed.date + '\')" class="tbt icon material-icons iconCircle_nact">today</i>';
                    str1 += '&nbsp;&nbsp;<i id="' + agimatch + '_1" onclick="agenda_icon(1,' + tmpid + ')"  class="tbt icon material-icons greenicon iconCircle_nact">done</i>';
                    str1 += '&nbsp;&nbsp;<i id="' + agimatch + '_2" onclick="agenda_icon(2,' + tmpid + ')"  class="tbt icon material-icons yellowicon iconCircle_nact">timeline</i>';
                    str1 += '&nbsp;&nbsp;<i id="' + agimatch + '_3" onclick="agenda_icon(3,' + tmpid + ')"  class="tbt icon material-icons redicon iconCircle_nact">close</i>';
                    str1 += '&nbsp;&nbsp;<i id="' + agimatch + '_10" onclick="agenda_icon(10,' + tmpid + ')"  class="tbt icon material-icons grayicon iconCircle_nact">directions_car</i>';
                    str1 += '</span></div>'; // col
                    str1 += '</div>'; //row

                    str1 += '<div class="row pb-1 aglsrow">';
                    str1 += '<details class="agdeta"><summary class="agsumm"><div style="display:inline;" class="mr-1">' + planning_lan_def.team[language] + ':';
                    str1 += '<span id="dot_' + wed.wnr + '_' + wed.tID + '" class="float-right" style="white-space:nowrap;font-size:.2rem;"></span></div></summary>';
                    str1 += '<div id="team_' + wed.wnr + '_' + wed.tID + '" class="mx-2"></div>';
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
    return str1;
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
            action: 'add',
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
    if (typeof language === 'undefined') language = 0;
    if (planning_lan_def.title[language] === 'undefined') {
        if (!localStorage.hasOwnProperty('nl_dwf_languageboot') || localStorage.getItem('nl_dwf_languageboot') == 0) do_reboot(3);
    }
    $("#content").html(page_agenda_html);
    naam_tabs_agenda['#nav-agenda'] = planning_lan_def.title[language];
    add_header(naam_tabs_agenda); // add headers
    edit_agenda();
    $("#help").html(help_agenda[language]);
    nav_left("Planning");
}

var loc_team;
/**
 * confirmation reset planning
 */
function reset_agenda(tID, team) {
    loc_team = tID;
    let message = planning_lan_def.confirm1[language];
    modal_notification(message, do_reset_agenda, planning_lan_def.reset[language] + team, planning_lan_def.confirm0[language]);
}

/**
 * call reset planning API if confirm
 * 
 * @param {number} buttonIndex 1-back, 2-confirmed 
 */
function do_reset_agenda(buttonIndex) {
    if (buttonIndex == 2) {

        let req_team = call_REST('put_team', {
            tID: loc_team,
            action: 'reset',
            list: ''
        });

        req_team.done(function (data_del) {
            let retApp = JSON.parse(data_del);
            if (ok_REST(retApp.error, retApp.username)) {
                localStorage.setItem("nl_dwf_agenda", JSON.stringify({}));
                page_home();
            }
        });
    }
}

/***************** html  ************************** */
var help_agenda = [
    `<div style="color:#10069F">
Op de dagen dat uw wedstrijden gepland staan is er een kaart beschikbaar waar alle wedstrijden chronologisch op te zien zijn. Hier kunt u aangeven op welke dagen u kunt spelen, u twijfelt, of u niet kunt spelen.
<br><br>
Door de kleine gekleurde balletjes <img src="./img/balrij.png" height="16"></img>is te zien hoeveel mensen al hebben gereageerd.
<br><br>
Wanneer je op het blokje <i class="tbt icon material-icons" style="color:#10069F;background-color:rgba(0, 123, 255, 0.1);font-size:1rem;">arrow_right</i> klikt, opent een lijst met teamleden inclusief hun voorkeur. Iedereen kan aanpassingen doorvoeren door op het juiste icoon te klikken:
<table class="table table-sm">
<tbody>
<tr>
<td><i class="tbt icon material-icons greenicon iconCircle_nact">done</i></td>
<td class="tab_middle">ik ga spelen</td>
</tr><tr>
<td><i class="tbt icon material-icons yellowicon iconCircle_nact">timeline</i></td>
<td class="tab_middle">ik twijfel nog  </td>
</tr><tr>
<td><i class="tbt icon material-icons redicon iconCircle_nact">close</i></td>
<td class="tab_middle">ik kan niet spelen</td>
</tr><tr>
</tr><tr>
<td><i class="tbt icon material-icons dblueicon iconCircle_nact">clear_all</i></td>
<td class="tab_middle">de ingevoerde voorkeuren wissen</td>
</tr><tr>
<td><i class="tbt icon material-icons grayicon iconCircle_nact">directions_car</i></td>
<td class="tab_middle">Hier kunt u aangeven of u met de auto gaat (meerdere auto's mogelijk)</td>
</tr><tr>
<td><i class="tbt icon material-icons dblueicon iconCircle_nact">today</i></td>
<td class="tab_middle">Verstuur een uitnodiging naar uw agenda</td>
</tr>
</tbody>
</table>
Eén kaart bevat alle wedstrijden van één dag van alle competities die u speelt of waarop u NPC bent. Als u merde competities hebt, is het mogelijk om ze te sorteren op datum of team.<br>Als iemand zijn/haar aanwezigheid doorgeeft of wijzigt, zal dit niet direct invloed hebben op andere wedstrijden op dezelfde dag.<br>Als de <span style="color:red">wedstrijddatum</span> rood is en met icon<i class="material-icons redicon" style="vertical-align:middle;font-size:1rem">mobiledata_off</i> betekent dit dat de wedstrijd verplaatst is.<br><br>Als er een nieuwe speler aan het team wordt toegevoegd of als er een wedstrijd wordt gepland voor een andere datum, enzovoort, kan de hele agenda met één knop <i class="icon material-icons orangeicon vbm" style="font-size:1rem">cleaning_services</i> worden opgeschoond en opnieuw worden ingesteld.
</div>`,




    `<div style="color:#10069F">
On the days that your matches are scheduled, a card is available showing all matches chronologically. Here you can indicate on which days you can play, are unsure, or cannot play.
<br><br>
The small colored balls <img src="./img/balrij.png" height="16"></img>show how many people have already responded.
<br><br>
When you click on the block <i class="tbt icon material-icons" style="color:#10069F;background-color:rgba(0, 123, 255, 0.1);font-size:1rem;">arrow_right</i>, a list of team members including their preferences will open. Everyone can make changes by clicking on the correct icon:
<table class="table table-sm">
<tbody>
<tr>
<td><i class="tbt icon material-icons greenicon iconCircle_nact">done</i></td>
<td class="tab_middle">I will play</td>
</tr><tr>
<td><i class="tbt icon material-icons yellowicon iconCircle_nact">timeline</i></td>
<td class="tab_middle">I am still unsure</td>
</tr><tr>
<td><i class="tbt icon material-icons redicon iconCircle_nact">close</i></td>
<td class="tab_middle">I cannot play</td>
</tr><tr>
</tr><tr>
<td><i class="tbt icon material-icons dblueicon iconCircle_nact">clear_all</i></td>
<td class="tab_middle">clear the entered preferences</td>
</tr><tr>
<td><i class="tbt icon material-icons grayicon iconCircle_nact">directions_car</i></td>
<td class="tab_middle">Here you can indicate if you are going with your car (multiple selections are possible)</td>
</tr><tr>
<td><i class="tbt icon material-icons dblueicon iconCircle_nact">today</i></td>
<td class="tab_middle">Send an invitation to your agenda</td>
</tr>
</tbody>
</table>
All matches of the comprtition that you play on a single day or you are NPC, are summarized on a single card.<br>If someone reports or changes his/her presence, this will not directly affect other matches on the same day.<br>If <span style="color:red">match date</span> is red with icon<i class="material-icons redicon" style="vertical-align:middle;font-size:1rem">mobiledata_off</i> it means the match has been moved.<br><br>When new player is add to the team or match is plan for other date planning etc., with single button <i class="icon material-icons orangeicon vbm" style="font-size:1rem">cleaning_services</i> the whole agenda can be cleaned and reseted.
</div>`
];

var page_agenda_html = `
<div id='nav-agenda-head'></div>
<div id="page_agenda" class="card mx-1 my-2">
    <!--agenda start-->
        <div id="wedstrijdplaning"></div>
    <!--agenda end-->
</div>
`;

var planning_lan_def = {
    "title": {
        0: "Plan Wedstrijden",
        1: "Plan Matches"
    },
    "mplayed": {
        0: "Gespeelde wedstrijden",
        1: "Matches played"
    },
    "team": {
        0: "Teamleden",
        1: "Team members"
    },
    "summary": {
        0: "Overzicht",
        1: "Overview"
    },
    "plan": {
        0: "Planning",
        1: "Planning"
    },
    "iplay": {
        0: "Ik ga spelen",
        1: "I will play"
    },
    "home": {
        0: "thuis",
        1: "home"
    },
    "out": {
        0: "uit",
        1: "out"
    },
    "name": {
        0: "naam",
        1: "name"
    },
    "played": {
        0: "gesp.",
        1: "played"
    },
    "planned": {
        0: "gepl.",
        1: "planned"
    },
    "car": {
        0: "auto",
        1: "driving"
    },
    "against": {
        0: "Tegen",
        1: "Against"
    },
    "note1": { // De laatste wijziging in Team 7 planning is aangebracht door Jacek op 13-09-2024 15:37
        0: "De laatste wijziging in ",
        1: "The last change to "
    },
    "note2": {
        0: " planning is aangebracht door ",
        1: " schedule was made by "
    },
    "note3": {
        0: " op ",
        1: " on "
    },
    "reset": {
        0: "Planning opnieuw instellen voor ",
        1: "Reset Planning of "
    }, "confirm0": {
        0: "Terug,Bevestig",
        1: "Back,Confirm"
    },
    "confirm1": {
        0: "Nadat je de reset van de planning voor dit team hebt bevestigd, worden alle selecties ongedaan gemaakt.",
        1: "After you confirm planning reset for this team, all selections will be undone."
    }



}

/*****************************************  html end ***************************************** */