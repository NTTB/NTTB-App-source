/*********************************************************************************************

program: NTTB App
name: drills
type: JS
version: 0.24
date: 2023-05-12
description: page and functions for training drills
author: JOFTT

************************************************************************************************/

function router_drills(ctx, tab, dr) {
    if (!fl_drill) {
        let rat = 0;
        if (!isEmpty(profile_set.rating)) {
            rat = parseInt(profile_set.rating);
        }

        let req_drill = call_REST('get_drill', {
            elo: rat,
            inspl: dr
        });

        req_drill.done(data => {
            let retApp = JSON.parse(data);
            if (ok_REST(retApp.error, retApp.username)) {
                let tmp = JSON.parse(retApp.drill);
                drill = JSON.parse(tmp.point);
                drill_header = {
                    nr: tmp.nr,
                    title: tmp.title,
                    level: level_drills[tmp.level],
                    typ: soort_drills[tmp.typ],
                    cat: cat_drills[tmp.cat],
                    comment: tmp.comment,
                    source: tmp.source
                }

                fl_drill = true;
                if (localStorage.getItem("nl_dwf_hand") === null) {
                    hnd = 1;
                    localStorage.setItem("nl_dwf_hand", hnd);
                } else {
                    hnd = localStorage.getItem("nl_dwf_hand");
                }
                if (tab) {
                    run_drills();
                } else {
                    drills(ctx);
                    $('#today_drill').text(drill_header.title);
                }
            }
        });

    } else {
        if (tab) {
            run_drills();
        } else {
            drills(ctx);
            $('#today_drill').text(drill_header.title);
        }
    }
}

function drill_next() {
    fl_drill = false;
    router_drills('', true, 0);
}

function makeShapes(c) {
    punkt = JSON.parse(JSON.stringify(drill[hnd])); // clone object
    Object.keys(punkt).forEach(ix => {
        punkt[ix].xt *= c;
        punkt[ix].yt *= c;
    });
}

function run_drills() {
    display_Fav_drills();

    let str = '<div onclick="add_Fav_drill(' + drill_header.nr + ', \'' + drill_header.title + '\')" class="row my-2"><div class="col-12"><i class="tbb icon material-icons orangeicon iconCircle_nact tbm mr-2">star_border</i><h6 class="orangeicon tb_wrap">' + drill_header.title + '</h6></div></div>';

    str += '<hr><div onclick="change_hand(0)" class="row mx-2 my-2"><div class="col-sm-12"><span class="tbb iconCircle_nact mr-2">&#x270B;</span><span id="tophand" class="tb_wrapg">' + hand[hnd].top + 'handig</span></div></div>';
    str += '<div><canvas id="drillsTab" ></canvas></div>';
    str += '<div onclick="change_hand(1)" class="row mx-2 my-2"><div class="col-sm-12"><span class="tbb iconCircle_nact  mr-2">&#x270B;</span><span id="downhand" class="tb_wrapg">' + hand[hnd].down + 'handig</span></div></div>';

    str += '<hr><div class="row mx-2 my-2"><div id="drillstrokes" class="col-sm-12"></div></div>';

    str += '<hr><button onclick="drill_next()" style="line-height:30px;padding:0;" class="btn btn-block btn-sm btn-outline-dark btn-radius mt-2"><div class="iconleft"><i class="icon material-icons pr-2">scatter_plot</i></div>andere oefening</button>';

    $("#drill_tab").html(str);
    strokes_drill();
    drills("drillsTab");
}

function change_hand(side) {
    if (side == 0) {
        if (hnd == 1) {
            hnd = 2;
        } else if (hnd == 2) {
            hnd = 1;
        } else if (hnd == 3) {
            hnd = 4;
        } else if (hnd == 4) {
            hnd = 3;
        }
    } else {
        if (hnd == 1) {
            hnd = 3;
        } else if (hnd == 2) {
            hnd = 4;
        } else if (hnd == 3) {
            hnd = 1;
        } else if (hnd == 4) {
            hnd = 2;
        }
        localStorage.setItem("nl_dwf_hand", hnd);
    }
    $('#tophand').text(hand[hnd].top + 'handig');
    $('#downhand').text(hand[hnd].down + 'handig');
    strokes_drill();
    drills("drillsTab");
}

function strokes_drill() {
    let str = '<table><tbody>';
    let strok = drill[hnd];
    str
    Object.keys(strok).forEach(ix => {
        if (strok[ix].st != 0) {
            str += '<tr>';
            str += '<td class="mr-2"><span style="color:black" class="drill_cmn tbb iconCircle_drill">' + strok[ix].tx + '</span></td>';
            str += '<td>' + strokes_drills[strok[ix].st] + ' ' + strok[ix].cmn + '</td>';
            str += '</tr>';
        }
    });

    str += '</tbody></table>';
    $('#drillstrokes').html(str);
}

function info_drill() {
    let str = '';
    //<div class="row mx-2 my-2"><div class="col-sm-12"></div></div>';
    str += '<div class="row my-2"><div class="col-sm-12">';
    str += '<div class="drill_cart card">';
    str += '<div class="card-header"><h6 class="orangeicon">' + drill_header.title + '</h6></div>';

    str += '<div class="card-body"><div class="card-text drill_cmn">';
    let bal = drill_header.comment;
    bal = bal.split('[').join('<span class="tbb iconCircle_drill">')
    str += bal.split(']').join('</span>');
    str += '</div></div>';

    str += '<div class="card-footer">';
    str += '<table style="width:100%" class="brdown"><tbody>';
    str += '<tr><td>Niveau:</td><td class="drill_cat">' + drill_header.level + '</td></tr>';
    str += '<tr><td>Categorie:</td><td class="drill_cat">' + drill_header.typ + '</td></tr>';
    str += '<tr><td>Soort:</td><td class="drill_cat">' + drill_header.cat + '</td></tr>';
    if (!isEmpty(drill_header.source)) {
        str += '<tr><td>Bron:</td><td>' + drill_header.source + '</td></tr>';
    }
    str += '</tbody></table>';
    str += '<div class="drill_cat text-right">drill nr: ' + drill_header.nr + '</div>';
    str += '</div>'; // footer

    str += '</div>'; // card
    str += '</div></div>'; // col, row

    str += '<div class="row my-2"><div class="col-sm-12">De oefening betreft enkel de onderste speler in het plaatje. Wissel om de paar minuten van speler.<br>Vergeet niet eerst op te warmen. Zoek de warm-up oefening in het <i class="icon material-icons tbt">search</i> "zoek" tabblad onderdaan.</div></div>';
    str += '<div class="row my-2"><div class="col-sm-12">Volg de link om een demonstratie te zien van de slagen:&nbsp;<a href="http://elearning.tibhar.com/" target="_blank"><img style="height:.7rem;" src="./img/tibhar.png"></img>&nbsp;e-learning<span></a></div></div>'
    $('#drill_info').html(str);
}

function search_drill() {
    if ($('#drill_search').html() === '') {
        let i;
        let str = '';
        str += '<div class="row mt-1">&nbsp;&nbsp;Niveau:<div class="col-12"><select id="sel_level" class="selectpicker"  data-style="btn-sm btn-outline-primary btn-drillpic" data-width="100%">';

        Object.keys(level_drills).forEach(i => {
            str += '<option value="' + i + '" ';
            if (i == 1) {
                str += 'selected';
            }
            str += '>' + level_drills[i] + '</option>';
        });
        str += '</select></div></div>';

        str += '<div class="row mt-1">&nbsp;&nbsp;Categorie:<div class="col-12"><select id="sel_cat" multiple class="selectpicker" title="allemaal" data-style="btn-sm btn-outline-primary btn-drillpic" data-width="100%">';

        Object.keys(cat_drills).forEach(i => {
            str += '<option value="' + i + '">' + cat_drills[i] + '</option>';
        });
        str += '</select></div></div>';


        str += '<div class="row mt-1">&nbsp;&nbsp;Soort van oefening:<div class="col-12"><select style="border-radius:5px" id="sel_soort" multiple class="selectpicker" title="allemaal" data-style="btn-sm btn-outline-primary btn-drillpic" data-width="100%">';

        soort_d_order.forEach(i => {
            str += '<option value="' + i + '">' + soort_drills[i] + '</option>';
        });
        str += '</select></div></div>';

        str += `
    <div class="row mt-1">&nbsp;&nbsp;Selecteert een slag:
      <div class="col-12 w-100">
        <div class="btn-toolbar" role="toolbar">
          <div class="btn-group mt-1 w-100" role="group">
            <button id="backhand_c" type="button" class="w-100 btn btn-sm btn-secondary btn-rlleft" onclick="sethand_drills('BH')">backhand</button>
            <button id="forehand_c" type="button" class="w-100 btn btn-sm btn-secondary btn-rlright" onclick="sethand_drills('FH')" style="border-left: solid 1px white">forehand</button>
         </div>
        </div>
      </div>
    </div>
    `;
        str += `
    <div class="row mt-1">
      <div id="searchres_drill" class="col-sm-12 w-100">
      </div>
    </div>
    `;

        $('#drill_search').html(str);
        $('.selectpicker').selectpicker();
        $('select.selectpicker').on('change', function () {
            $('#backhand_c').removeClass('btn-primary');
            $('#backhand_c').addClass('btn-secondary');
            $('#forehand_c').removeClass('btn-primary');
            $('#forehand_c').addClass('btn-secondary');
        });
    }
}

function sethand_drills(x) {
    cls_id('searchres_drill');
    if (x === 'BH') {
        $('#backhand_c').removeClass('btn-secondary');
        $('#backhand_c').addClass('btn-primary');
        $('#forehand_c').removeClass('btn-primary');
        $('#forehand_c').addClass('btn-secondary');
    } else {
        $('#forehand_c').removeClass('btn-secondary');
        $('#forehand_c').addClass('btn-primary');
        $('#backhand_c').removeClass('btn-primary');
        $('#backhand_c').addClass('btn-secondary');
    }

    let req_sdrill = call_REST('get_sdrill', {
        hand: x,
        cat: JSON.stringify($('#sel_cat').val()),
        typ: JSON.stringify($('#sel_soort').val()),
        level: $('#sel_level').val()
    });

    req_sdrill.done(data => { // correct login communication
        let retApp = JSON.parse(data);
        if (ok_REST(retApp.error, retApp.username)) {
            let tmp = JSON.parse(retApp.drills);
            //console.log(tmp);
            let str = '<div class="drill_cart card mt-3">';
            str += '<div class="card-body"><div class="card-text">';
            if (!isEmpty(tmp)) {
                str += '<table class="brdown tab_agenda"><tbody>';
                Object.keys(tmp).forEach(ix => {
                    str += '<tr onclick="sel_view_drill(' + ix + ')">';
                    str += '<td><i class="icon material-icons mr-2">play_arrow</i></td><td>' + tmp[ix] + '</td>';
                    str += '</tr>';
                });
                str += '</tbody></table>';
            } else {
                str += 'geen oefening gevonden';
            }
            str += '</div></div></div>';
            $('#searchres_drill').html(str);
        }
    });

}

function sel_view_drill(nr) {
    $('.nav-tabs a[href="#nav-drill"]').tab('show');
    fl_drill = false;
    router_drills('', true, nr);
}

function display_Fav_drills() {
    fav_drills_list = JSON.parse(localStorage.getItem("nl_dwf_Favdrills"));

    if (!Array.isArray(fav_drills_list)) {
        fav_drills_list = [];
        $('#fav_drills').hide();
        return;
    }
    if (fav_drills_list.length == 0) {
        $('#fav_drills').hide();
        return;
    }
    let str = '<div class="container-fluid">';
    str += '<div class="row"><div class="col"><h6 class="font-light">Favoriete oefeningen:</h6></div></div>';

    str += '<div id="DrillsHandle" class="list_fav_drills list-group">';
    fav_drills_list.forEach((val, ix) => {

        str += '<div style="padding: .2rem .2rem .2rem .4rem" class="list-group-item">';
        str += '<table style="width:100%"><tbody><tr>';

        str += '<td class="drills-move mr-2 vbm td1" aria-hidden="true"><i class="icon material-icons">import_export</i></td>';
        str += '<td class="blueicon vbm" onclick="sel_view_drill(' + val.nr + ')">' + val.title + '</td>';

        str += '<td class="tdr"><i onclick="rm_Fav_drill(' + val.nr + ')" class="icon material-icons iconCircle_nact orangeicon vbm">delete</i></td>';
        str += '</tr></tbody></table>';
        str += '</div>';

    });
    str += '</div>';
    str += '</div>';
    $('#fav_drills').show();
    $('#fav_drills').html(str);

    // List with handle
    Sortable.create(DrillsHandle, {
        handle: '.drills-move',
        animation: 150,
        store: {
            get: function (sortable) {
                var order = localStorage.getItem('nl_dwf_drillshandle_list');
                return order ? order.split('|') : [];
            },
            set: function (sortable) {
                var order = sortable.toArray();
                localStorage.setItem('nl_dwf_drillshandle_list', order.join('|'));
            }
        }
    });


}

function add_Fav_drill(nr, title) {
    fav_drills_list = JSON.parse(localStorage.getItem('nl_dwf_Favdrills'));
    if (!Array.isArray(fav_drills_list)) {
        fav_drills_list = [];
    }

    let fl_is = true;
    fav_drills_list.forEach(val => {
        if (val.nr === nr) {
            fl_is = false;
        }
    });

    if (fl_is) {
        fav_drills_list.push({
            nr: nr,
            title: title
        });
        localStorage.setItem('nl_dwf_Favdrills', JSON.stringify(fav_drills_list));
    }
    display_Fav_drills();
}

function rm_Fav_drill(x) {
    let fl_is = -1;
    fav_drills_list.forEach((val, key) => {
        if (val.nr === x) {
            fl_is = key;
        }
    });

    if (fl_is >= 0) {

        fav_drills_list.splice(fl_is, 1);
        localStorage.setItem('nl_dwf_Favdrills', JSON.stringify(fav_drills_list));
    }
    display_Fav_drills();
}

function cSave() {
    //console.log("Save: ", shapes);
    let points = {};
    points.dr = drill;
    points.pnt = punkt;
    $('#viewsave').html(JSON.stringify(points));
    drills('tt_drills');
}

function storein() {
    //drill[hnd] = punkt;  // zoek oplossing
    $('#strokes_in').val(JSON.stringify(drill));
}

function dCopy(from) {
    console.log("Copy: ", from);
    drill[hnd] = drill[from];
    $('#strokes_in').val(JSON.stringify(drill));
    drills('tt_drills');
}


function drills(id = '') {
    let wdth, hght;
    if (id === "drillsImg") {
        hght = 360;
        wdth = parseInt(hght / 1.5);
    } else {
        wdth = window.innerWidth - 70;
        if (wdth > 400) {
            wdth = 400;
        }
        hght = parseInt(wdth * 1.5);
    }
    if ($("#" + id).length == 0) {
        return;
    }
    canvas_drill = document.getElementById(id);
    ctx_drill = canvas_drill.getContext("2d");
    ctx_drill.textAlign = 'center';

    ctx_drill.canvas.height = hght;
    ctx_drill.canvas.width = wdth;

    var arrow_shape = [
        [-10, -4],
        [-8, 0],
        [-10, 4],
        [2, 0]
    ];
    var scale = hght / 600;
    var r = 13 * scale;
    var coff = r * 0.33 * scale;

    ctx_drill.font = "bold " + parseInt(12 * scale) + "px Courier";

    /*var dragIndex;
    var dragging;
    var mouseX;
    var mouseY;
    var dragHoldX;
    var dragHoldY;
    var numShapes;*/
    var numTxt;


    /* init();

     function init() {*/
    makeShapes(scale);
    numTxt = punkt.length;
    if (numTxt > 1) {
        drawScreen();
    }
    //}

    function drawScreen() {
        var canvasPic = new Image();
        storein();
        canvasPic.onload = function () {
            ctx_drill.drawImage(canvasPic, 0, 0, 400 * scale, 600 * scale);
            drawShapes();
        }
        canvasPic.src = './img/table.png';

    }

    function drawShapes() {
        let i, x1, x2, y1, y2, inter;
        for (i = 0; i < (numTxt - 1); i++) {
            drawball(punkt[i].xt, punkt[i].yt, punkt[i].tx, punkt[i].cs, parseInt(punkt[i].st));

            inter = intersection(punkt[i + 1].xt, punkt[i + 1].yt, punkt[i].xt, punkt[i].yt, r + 20);
            x1 = inter[0];
            y1 = inter[1];

            inter = intersection(punkt[i].xt, punkt[i].yt, punkt[i + 1].xt, punkt[i + 1].yt, r + 20);
            x2 = inter[0];
            y2 = inter[1];

            drawLineArrow(x1, y1, x2, y2, parseInt(punkt[i].lt), punkt[i].cl);
        }

        drawball(punkt[numTxt - 1].xt, punkt[numTxt - 1].yt, punkt[numTxt - 1].tx, punkt[numTxt - 1].cs, parseInt(punkt[numTxt - 1].st));

    }

    function drawball(x, y, tx, color, st) {
        ctx_drill.beginPath();
        let grd = ctx_drill.createRadialGradient(x - coff, y - coff, 0, x - coff, y - coff, r * 1.33);
        if (st == 0) {
            ctx_drill.fillStyle = 'rgba(0,0,0,0)'; // transparent
        } else {
            grd.addColorStop(1, "#FF9100");
            grd.addColorStop(0, "white");
            ctx_drill.fillStyle = grd;
        }
        ctx_drill.arc(x, y, r, 0, 2 * Math.PI, false);
        ctx_drill.fill();
        ctx_drill.fillStyle = dr_colors[color]; //'#1E3442';
        if (st > 0) {
            ctx_drill.fillText(tx, x - (3 * scale), y + (3 * scale));
        }
        ctx_drill.closePath();
    }

    function intersection(x2, y2, x, y, rad) {
        let t;
        let ux = x2 - x;
        let uy = y2 - y;
        let a = ux * ux + uy * uy;
        let c = x * x + y * y + x * x + y * y - 2 * (x * x + y * y) - rad * rad;
        let deter = -4 * a * c;
        let e = Math.sqrt(deter);
        ux = (e) / (2 * a);
        uy = (-e) / (2 * a);
        if (0 <= ux && ux <= 1) {
            t = ux;
        } else {
            t = uy;
        }

        return [Math.round((x2 - x) * t + x), Math.round((y2 - y) * t + y)];
    }

    function drawFilledPolygon(shape) {
        ctx_drill.beginPath();
        ctx_drill.moveTo(shape[0][0], shape[0][1]);

        for (p in shape) {
            if (p > 0) {
                ctx_drill.lineTo(shape[p][0], shape[p][1]);
            }
        }
        ctx_drill.lineTo(shape[0][0], shape[0][1]);
        ctx_drill.fill();
    }

    function translateShape(shape, x, y) {
        let rv = [];
        for (p in shape)
            rv.push([shape[p][0] + x, shape[p][1] + y]);
        return rv;
    }

    function rotateShape(shape, ang) {
        let rv = [];
        for (p in shape)
            rv.push(rotatePoint(ang, shape[p][0], shape[p][1]));
        return rv;
    }

    function rotatePoint(ang, x, y) {
        return [
            (x * Math.cos(ang)) - (y * Math.sin(ang)),
            (x * Math.sin(ang)) + (y * Math.cos(ang))
        ];
    }

    function drawLineArrow(x1, y1, x2, y2, lt, col) {
        if (lt > 0) {
            ctx_drill.beginPath();
            ctx_drill.fillStyle = dr_colors[col]; //'#1E3442';
            ctx_drill.strokeStyle = dr_colors[col]; //"#1E3442"
            if (lt == 3 || lt == 4) { // dashed line
                ctx_drill.setLineDash([10, 5]);
            } else {
                ctx_drill.setLineDash([]);
            }

            ctx_drill.moveTo(x1, y1);
            ctx_drill.lineTo(x2, y2);
            ctx_drill.stroke();
            let ang = Math.atan2(y2 - y1, x2 - x1);
            drawFilledPolygon(translateShape(rotateShape(arrow_shape, ang), x2, y2));
            if (lt == 2 || lt == 4) { // two side arrow
                ang = Math.atan2(y1 - y2, x1 - x2);
                drawFilledPolygon(translateShape(rotateShape(arrow_shape, ang), x1, y1));
            }
            ctx_drill.closePath();
        }
    }
    /*
        function mouseDownListener(evt) {

            //pay attention to the layering order of the objects so that if a mouse down occurs over more than object,
            //only the top most one will be dragged.
            let highestIndex = -1;

            //getting mouse position correctly, being mindful of resizing that may have occured in the browser:
            let bRect = canvas_drill.getBoundingClientRect();
            let ym = evt.clientY || evt.targetTouches[0].pageY;
            let xm = evt.clientX || evt.targetTouches[0].pageX;
            mouseX = (xm - bRect.left) * (canvas_drill.width / bRect.width);
            mouseY = (ym - bRect.top) * (canvas_drill.height / bRect.height);

            //find which shape was clicked
            for (let i = 0; i < numTxt; i++) {
                if (hitTest(punkt[i], mouseX, mouseY)) {
                    dragging = true;
                    if (i > highestIndex) {
                        //pay attention to the point on the object where the mouse is "holding" the object:
                        dragHoldX = mouseX - punkt[i].xt;
                        dragHoldY = mouseY - punkt[i].yt;
                        highestIndex = i;
                        dragIndex = i;
                    }
                }
            }
            if (dragging) {
                if (!fl_local) {
                    window.addEventListener("mousemove", mouseMoveListener, false);
                }
                window.addEventListener("touchmove", mouseMoveListener, false);
            }
            if (!fl_local) {
                canvas_drill.removeEventListener("mousedown", mouseDownListener, false);
                window.addEventListener("mouseup", mouseUpListener, false);
            }
            canvas_drill.removeEventListener("touchstart", mouseDownListener, false);
            window.addEventListener("touchend", mouseUpListener, false);

            //code below prevents the mouse down from having an effect on the main browser window:
            if (evt.preventDefault) {
                evt.preventDefault();
            } //standard
            else if (evt.returnValue) {
                evt.returnValue = false;
            } //older IE
            return false;
        }

        function mouseUpListener(evt) {
            if (!fl_local) {
                canvas_drill.addEventListener("mousedown", mouseDownListener, false);
                window.removeEventListener("mouseup", mouseUpListener, false);
            }
            canvas_drill.addEventListener("touchstart", mouseDownListener, false);
            window.removeEventListener("touchend", mouseUpListener, false);
            if (dragging) {
                dragging = false;
                if (!fl_local) {
                    window.removeEventListener("mousemove", mouseMoveListener, false);
                }
                window.removeEventListener("touchmove", mouseMoveListener, false);
            }
        }

        function mouseMoveListener(evt) {
            let shapeRad = r;
            let minX = shapeRad;
            let maxX = canvas_drill.width - shapeRad;
            let minY = shapeRad;
            let maxY = canvas_drill.height - shapeRad;
            let ym = evt.clientY || evt.targetTouches[0].pageY;
            let xm = evt.clientX || evt.targetTouches[0].pageX;

            //getting mouse position correctly 
            let bRect = canvas_drill.getBoundingClientRect();
            mouseX = (xm - bRect.left) * (canvas_drill.width / bRect.width);
            mouseY = (ym - bRect.top) * (canvas_drill.height / bRect.height);

            //clamp x and y positions to prevent object from dragging outside of canvas
            let posX = mouseX - dragHoldX;
            posX = (posX < minX) ? minX : ((posX > maxX) ? maxX : posX);
            let posY = mouseY - dragHoldY;
            posY = (posY < minY) ? minY : ((posY > maxY) ? maxY : posY);

            punkt[dragIndex].xt = Math.round(posX);
            punkt[dragIndex].yt = Math.round(posY);

            drawScreen();
        }

    function hitTest(punkt, mx, my) {
        let dx = mx - punkt.xt;
        let dy = my - punkt.yt;
        return (dx * dx + dy * dy < r * r);
    }*/
}
/*************** table draw end ******************** */
/*************** table draw funtcions ***************** */

/* types of lines: 
1 - solid line arrow on the end
2 - solid line arrow on both ends
3 - dashed line arrow on the end
4 - dashed line arrow on both ends
*/
/*
function makeShapesx(c) { // drill graphic shapes definitions
    drillx = {
        "1": [{
                "tx": 1,
                "xt": 87 * c,
                "yt": 531 * c,
                "st": "11",
                "si": 30,
                "cs": 0,
                "cmn": "",
                "lt": "1",
                "cl": 0
            },
            {
                "tx": 2,
                "xt": 306 * c,
                "yt": 64 * c,
                "st": "11",
                "si": 30,
                "cs": 0,
                "cmn": "",
                "lt": "1",
                "cl": 0
            },
            {
                "tx": 3,
                "xt": 305 * c,
                "yt": 530 * c,
                "st": "10",
                "si": 30,
                "cs": 0,
                "cmn": "",
                "lt": "1",
                "cl": 0
            },
            {
                "tx": 4,
                "xt": 92 * c,
                "yt": 61 * c,
                "st": "10",
                "si": 30,
                "cs": 0,
                "cmn": "",
                "lt": "1",
                "cl": 0
            },
            {
                "tx": 5,
                "xt": 90 * c,
                "yt": 531 * c,
                "st": "0",
                "si": 30,
                "cs": 0,
                "cmn": "",
                "lt": "0",
                "cl": 0
            }
        ],
        "2": [{
                "tx": 1,
                "xt": 87 * c,
                "yt": 531 * c,
                "st": "11",
                "si": 30,
                "cs": 0,
                "cmn": "",
                "lt": "1",
                "cl": 0
            },
            {
                "tx": 2,
                "xt": 306 * c,
                "yt": 64 * c,
                "st": "10",
                "si": 30,
                "cs": 0,
                "cmn": "",
                "lt": "1",
                "cl": 0
            },
            {
                "tx": 3,
                "xt": 305 * c,
                "yt": 530 * c,
                "st": "10",
                "si": 30,
                "cs": 0,
                "cmn": "",
                "lt": "1",
                "cl": 0
            },
            {
                "tx": 4,
                "xt": 92 * c,
                "yt": 61 * c,
                "st": "11",
                "si": 30,
                "cs": 0,
                "cmn": "",
                "lt": "1",
                "cl": 0
            },
            {
                "tx": 5,
                "xt": 90 * c,
                "yt": 531 * c,
                "st": "0",
                "si": 30,
                "cs": 0,
                "cmn": "",
                "lt": "0",
                "cl": 0
            }
        ],
        "3": [{
                "tx": 1,
                "xt": 305 * c,
                "yt": 530 * c,
                "st": "11",
                "si": 30,
                "cs": 0,
                "cmn": "",
                "lt": "1",
                "cl": 0
            },
            {
                "tx": 2,
                "xt": 92 * c,
                "yt": 63 * c,
                "st": "10",
                "si": 30,
                "cs": 0,
                "cmn": "",
                "lt": "1",
                "cl": 0
            },
            {
                "tx": 3,
                "xt": 93 * c,
                "yt": 529 * c,
                "st": "10",
                "si": 30,
                "cs": 0,
                "cmn": "",
                "lt": "1",
                "cl": 0
            },
            {
                "tx": 4,
                "xt": 305 * c,
                "yt": 65 * c,
                "st": "11",
                "si": 30,
                "cs": 0,
                "cmn": "",
                "lt": "1",
                "cl": 0
            },
            {
                "tx": 5,
                "xt": 304 * c,
                "yt": 530 * c,
                "st": "0",
                "si": 30,
                "cs": 0,
                "cmn": "",
                "lt": "0",
                "cl": 0
            }
        ],
        "4": [{
                "tx": 1,
                "xt": 305 * c,
                "yt": 530 * c,
                "st": "11",
                "si": 30,
                "cs": 0,
                "cmn": "",
                "lt": "1",
                "cl": 0
            },
            {
                "tx": 2,
                "xt": 92 * c,
                "yt": 63 * c,
                "st": "11",
                "si": 30,
                "cs": 0,
                "cmn": "",
                "lt": "1",
                "cl": 0
            },
            {
                "tx": 3,
                "xt": 93 * c,
                "yt": 529 * c,
                "st": "10",
                "si": 30,
                "cs": 0,
                "cmn": "",
                "lt": "1",
                "cl": 0
            },
            {
                "tx": 4,
                "xt": 305 * c,
                "yt": 65 * c,
                "st": "10",
                "si": 30,
                "cs": 0,
                "cmn": "",
                "lt": "1",
                "cl": 0
            },
            {
                "tx": 5,
                "xt": 304 * c,
                "yt": 530 * c,
                "st": "0",
                "si": 30,
                "cs": 0,
                "cmn": "",
                "lt": "0",
                "cl": 0
            }
        ]
    }
};*/

/**
 * open drill screen
 */
function page_drills(fl) {
    if (fl) $("body").toggleClass("menu-right-open");
    if (arrow_menu === "Oefeningen") return;
    arrow_page('#nav-drill');
    arrow_menu = "Oefeningen";
    $("#content").html(page_drills_html);
    add_header(naam_tabs_drills); // add headers
    router_drills('', true, 0);
    $("#help").html(help_drills);
    nav_left("Oefeningen");
}

/***************** html as const to prevent cross origin protection ************************** */
const help_drills = `
<div style="color:#0254B7" class="py-2">
<span class="tbb iconCircle_nact  mr-2">&#x270B;</span>voor andere handigheid.<br>
<span ><i class="icon material-icons orangeicon iconCircle_nact mr-2 mt-2">star_border</i></span>voor een oefening bewaren in favorieten.
</div>
`;

const page_drills_html = `
<nav class="tabber tabber-bottom publish-tabs">
    <div class="nav nav-tabs" id="nav-tab" role="tablist">
        <a onclick="arrow_back('#nav-drill');" class="nav-item nav-link active" id="nav-drill-tab" data-toggle="tab"
            href="#nav-drill" role="tab" aria-controls="nav-drill" aria-selected="true">
            <i class="icon material-icons">scatter_plot</i>
            <p class="bottext_menu">drill</p>
        </a>
        <a onclick="arrow_back('#nav-dinfo');info_drill()" class="nav-item nav-link" id="nav-dinfo-tab"
            data-toggle="tab" href="#nav-dinfo" role="tab" aria-controls="nav-dinfo" aria-selected="false">
            <i class="icon material-icons">info_outline</i>
            <p class="bottext_menu">info</p>
        </a>
        <a onclick="arrow_back('#nav-dsearch');search_drill()" class="nav-item nav-link" id="nav-dsearch-tab"
            data-toggle="tab" href="#nav-dsearch" role="tab" aria-controls="nav-dsearch" aria-selected="false">
            <i class="icon material-icons">search</i>
            <p class="bottext_menu">zoek</p>
        </a>
    </div>
</nav>


<div class="tab-content h-100" id="nav-wssContent">

    <!-- drill view -->
    <div class="tab-pane fade show active" id="nav-drill" role="tabpanel" aria-labelledby="nav-drill-tab">
        <div class="content-sticky-footer">
            <div id='nav-drill-head'></div>
            <div id="fav_drills" style="display:none;" class="card my-2"></div>
            <div class="card my-2">
                <div class="container-fluid">
                    <div id="drill_tab"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- drill_info -->
    <div class="tab-pane fade" id="nav-dinfo" role="tabpanel" aria-labelledby="nav-dinfo-tab">
        <div class="content-sticky-footer">
            <div id='nav-dinfo-head'></div>
            <div class="card my-2">
                <div class="container-fluid">
                    <div id="drill_info"></div>
                </div>

            </div>
        </div>
    </div>

    <!-- drill search -->
    <div class="tab-pane fade " id="nav-dsearch" role="tabpanel" aria-labelledby="nav-dsearch-tab">
        <div class="content-sticky-footer">
            <div id='nav-dsearch-head'></div>
            <div class="card my-2">
                <div class="container-fluid">
                    <div id="drill_search"></div>
                </div>
            </div>
        </div>
    </div>

</div>
`;

/********************************** html drills end ***************************************** */