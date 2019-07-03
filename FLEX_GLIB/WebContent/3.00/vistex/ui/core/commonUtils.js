sap.ui.define([vistexConfig.rootFolder + "/ui/core/global"], function (global) {

    var commonUtils = {
        server: {
            initialCall: true
        },
        navigation: false,
        enableBuffer: false,
        busyIndicatorCount: 0,
        startLoader: function () {
            //if(vui5.fromOtherApp == true && parent.vui5.showBusyIndicator == true)
            //{

            //parent.commonUtils.stopLoader();
            //            }
            var parentvui5 = parent.global ? parent.global.vui5 : parent.vui5;
            if (global.vui5.fromOtherApp && parentvui5 && parent.commonUtils && parentvui5.showBusyIndicator) {
                parent.commonUtils.stopLoader();
            }
            sap.ui.core.BusyIndicator.show();
        },
        stopLoader: function () {
            sap.ui.core.BusyIndicator.hide();
        },
        paramsUnserialize: function (p) {
            if (p.indexOf('?') === -1) {
                return;
            }
            var ret = {},
                q = p.indexOf('?') > -1 ? p.split('?')[1] : p.split('?')[0],
                seg = q.split('&'),
                len = seg.length, i = 0, s;
            for (; i < len; i++) {
                if (!seg[i]) {
                    continue;
                }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        },
        //*****Rel 60E_SP6 - ECIP #16807*/
        getRegionValue: function () {

            var date = new Date();
            var diff = (date.getHours() - date.getUTCHours() + 24) % 24;
            var regions = vui5.cons.regions;
            var region = regions[diff];
            return region;

        },
        /**/
        addQueryParams: function (url,
                                  params) {

            if (url.indexOf('?') === -1) {
                url += '?';
            }
            else {
                url += '&';
            }
            url += params;
            return url;
        },
        _findKey: function (obj, value) {
            var key = null;
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    if (obj[prop] === value) {
                        key = prop;
                    }
                }
            }
            return key;
        },
        getAvatarURI: function (name, shape) {
            if (name) {


                var colours = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#cc9900",
                              "#486784", "#ffcc66", "#16a085", "#27ae60", "#2980b9",
                              "#2c3e50", "#f1c40f", "#e67e22", "#95a5a6", "#f39c12",
                              "#d35400", "#16a085", "#bdc3c7", "#c0392b", "#7f8c8d", "#bbbb77"];
                var initials = name.split(' ').map(function (str) { return str ? str[0].toUpperCase() : ""; }).join('');
                var charIndex = initials.charCodeAt(0) - 65;
                var colourIndex = charIndex % 21;
                var colourInd = colourIndex;
                if (!isNaN(initials.charCodeAt(1))) {

                    var charIndex1 = initials.charCodeAt(1) - 65;
                    var colourIndex1 = charIndex1 % 21;
                    var colourInd = colourIndex + colourIndex1;
                    colourInd = colourInd % 21;
                }
                if (!isNaN(initials.charCodeAt(2))) {
                    initials = initials[0] + initials[1];
                }
                var canvas = document.createElement('canvas');
                var radius = 30;
                var margin = 5;
                canvas.width = radius * 2 + margin * 2;
                canvas.height = radius * 2 + margin * 2;
                // Get the drawing context
                var ctx = canvas.getContext('2d');
                ctx.beginPath();

                if (shape == "square") {
                    ctx.rect(margin + 4, margin + 3, radius + margin * 4, radius + margin * 4);
                    ctx.closePath();
                    ctx.fillStyle = colours[colourInd];
                    ctx.fill();
                    ctx.fillStyle = "white";
                    ctx.font = "bold 20px Arial";
                    ctx.textAlign = 'center';
                    ctx.fillText(initials, radius + 5, radius * 4 / 3 + margin - 4);
                }
                else {
                    ctx.arc(radius + margin - 1, radius + margin - 1, radius, 0, 2 * Math.PI, false);
                    ctx.closePath();
                    ctx.fillStyle = colours[colourInd];
                    ctx.fill();
                    ctx.fillStyle = "white";
                    ctx.font = "bold 20px Arial";
                    ctx.textAlign = 'center';
                    ctx.fillText(initials, radius + 5, radius * 4 / 3 + margin - 2);
                }

                return canvas.toDataURL();
            }
        },

        getParams: function (param) {
            var sPageURL = window.location.search.substring(1);
            var sURLVariables = sPageURL.split('&');
            for (var i = 0; i < sURLVariables.length; i++) {
                var sParameterName = sURLVariables[i].split('=');
                if (sParameterName[0] == param) {
                    return sParameterName[1];
                }
            }

        },

        getUrlParameters: function (oController) {

            var commonUtils = this, oUrlParams = {}, componentData, hashUrl, hashUrlPath, hashUrlParams;
            componentData = oController.getOwnerComponent().getComponentData();

            global.vui5.headerLess = this.getParams("sap-ushell-config") === "headerless";

            if (location.hash.indexOf("#/") !== -1) {
                hashUrl = location.hash.replace("#/", "");
            }
            else {
                hashUrl = location.hash.replace("#", "");
            }

            if (hashUrl.indexOf(global.vui5.cons.applicationIdentifier.dashboard) !== -1) {
                oUrlParams['$DSHBD'] = hashUrl.split("/")[1];
                if (oUrlParams['$DSHBD'].indexOf("?")) {
                    oUrlParams['$DSHBD'] = oUrlParams['$DSHBD'].split("?")[0];
                }
            }
                //*****Rel 60E_SP6
            else if (componentData && componentData.startupParameters['DSHBD']) {
                oUrlParams['$DSHBD'] = componentData.startupParameters['DSHBD'][0];
            }
            //*****

            //*****Rel 60E_SP6 - Vizi Chart Support from Workspace
            if (hashUrl.indexOf('RPTVW') !== -1) {
                oUrlParams['$RPTVW'] = hashUrl.split("/")[1];
                if (oUrlParams['$RPTVW'].indexOf("?")) {
                    oUrlParams['$RPTVW'] = oUrlParams['$RPTVW'].split("?")[0];
                }
            }
            else if (componentData && componentData.startupParameters['RPTVW']) {
                oUrlParams['$RPTVW'] = componentData.startupParameters['RPTVW'][0];
            }
            //*****

            hashUrlPath = hashUrl.split("?")[0];
            if (hashUrl.indexOf("?") !== -1) {
                hashUrlParams = commonUtils._getQueryParams(hashUrl.split("?")[1]);
            }

            if (jQuery.sap.getUriParameters().get("WRKSP")) {
                oUrlParams['$WRKSP'] = jQuery.sap.getUriParameters().get("WRKSP");
            }
            else if (componentData && componentData.startupParameters.WRKSP) {
                oUrlParams['$WRKSP'] = componentData.startupParameters.WRKSP[0];
                vui5.session.fromFioriLaunchpad = true;
            }
            else if (hashUrlParams && hashUrlParams['WRKSP']) {
                oUrlParams['$WRKSP'] = hashUrlParams['WRKSP'];
            }

            if (jQuery.sap.getUriParameters().get("selections")) {
                oUrlParams['$selections'] = jQuery.sap.getUriParameters().get("selections");
            }
            else if (componentData && componentData.startupParameters.selections) {
                oUrlParams['$selections'] = componentData.startupParameters.selections[0];
                vui5.session.fromFioriLaunchpad = true;
            }
            else if (hashUrlParams && hashUrlParams['selections']) {
                oUrlParams['$selections'] = hashUrlParams['selections'];
            }

            if (jQuery.sap.getUriParameters().get("OBJID")) {
                oUrlParams['$OBJID'] = jQuery.sap.getUriParameters().get("OBJID");
            }
            else if (componentData && componentData.startupParameters.OBJID) {
                oUrlParams['$OBJID'] = componentData.startupParameters.OBJID[0];
            }
            else if (oController.getDocumentNumberFromUrl()) {
                oUrlParams['$OBJID'] = oController.getDocumentNumberFromUrl();
            }
            else if (hashUrlParams && hashUrlParams['OBJID']) {
                oUrlParams['$OBJID'] = hashUrlParams['OBJID'];
            }

            if (jQuery.sap.getUriParameters().get("CONTR")) {
                oUrlParams['$CONTR'] = jQuery.sap.getUriParameters().get("CONTR");
            }
            else if (componentData && componentData.startupParameters.CONTR) {
                oUrlParams['$CONTR'] = componentData.startupParameters.CONTR[0];
            }

            else if (hashUrlParams && hashUrlParams['CONTR']) {
                oUrlParams['$CONTR'] = hashUrlParams['CONTR'];
            }

            if (jQuery.sap.getUriParameters().get("MAILI")) {
                oUrlParams['$MAILI'] = jQuery.sap.getUriParameters().get("MAILI");
            }
            else if (componentData && componentData.startupParameters.MAILI) {
                oUrlParams['$MAILI'] = componentData.startupParameters.MAILI[0];
            }
            else if (hashUrlParams && hashUrlParams['MAILI']) {
                oUrlParams['$MAILI'] = hashUrlParams['MAILI'];
            }

            if (jQuery.sap.getUriParameters().get("ACNUM")) {
                oUrlParams['$ACNUM'] = jQuery.sap.getUriParameters().get("ACNUM");
            }
            else if (componentData && componentData.startupParameters.ACNUM) {
                oUrlParams['$ACNUM'] = componentData.startupParameters.ACNUM[0];
            }
            if (componentData && componentData.startupParameters.DSHBD) {
                oUrlParams['$DSHBD'] = componentData.startupParameters.DSHBD[0];
            }
            else if (hashUrlParams && hashUrlParams['ACNUM']) {
                oUrlParams['$ACNUM'] = hashUrlParams['ACNUM'];
            }

            if (jQuery.sap.getUriParameters().get("MODE")) {
                oUrlParams['$MODE'] = jQuery.sap.getUriParameters().get("MODE");
            }
            else if (hashUrlParams && hashUrlParams['mode']) {
                oUrlParams['$MODE'] = hashUrlParams['mode'];
            }
            /**** Rel 60E SP6 - Supporting Reporting View from Fiori Launchpad - Start ***/
            if (componentData && componentData.startupParameters.RPTVW) {
                oUrlParams['$RPTVW'] = componentData.startupParameters.RPTVW[0];
            }
            /**** Rel 60E SP6 - Supporting Reporting View from Fiori Launchpad - End ***/

            if (jQuery.sap.getUriParameters().get("GUIID")) {
                global.vui5.server.url.guiId = jQuery.sap.getUriParameters().get("GUIID");
                global.vui5.fromOtherApp = true;

            }
            else if (hashUrlParams && hashUrlParams['GUIID']) {
                global.vui5.server.url.guiId = hashUrlParams['GUIID'];
                global.vui5.fromOtherApp = true;
            }

            return oUrlParams;

        }
        ,
        sessionTimeReset: function () {
            /***Rel 60E SP6 ECIP #19825 - Start **/
            /*if (!global.vui5.fromOtherApp) {
                global.vui5.session.scounter = global.vui5.session.ccounter = global.vui5.session.maxTime;
            }
            else if (parent.sessionTimeReset) {
                parent.sessionTimeReset();
            }
            // if (global.vui5.fromOtherApp == undefined || global.vui5.fromOtherApp == false) {
            global.vui5.session.scounter =  global.vui5.session.ccounter = global.vui5.session.maxTime;
            //}
            //else {
            // parent.sessionTimeReset();
            //}*/

            if (parent.sessionTimeReset) {
                parent.sessionTimeReset();
            }
            else {
                global.vui5.session.ccounter = global.vui5.session.maxTime;
            }
            /***Rel 60E SP6 ECIP #19825 - End **/
        },
        //*****Rel 60E_SP5
        convertToSimpleDate: function (date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('');
        },
        convertToSimpleTime: function (time) {
            var hours = '' + time.getHours(),
                minutes = '' + time.getMinutes(),
                seconds = '' + time.getSeconds();

            if (hours.length < 2) hours = '0' + hours;
            if (minutes.length < 2) minutes = '0' + minutes;
            if (seconds.length < 2) seconds = '0' + seconds;

            return [hours, minutes, seconds].join('');
        },
        //*****
        applyTheme: function (lv_theme) {


            var theme = lv_theme;

            if (theme === undefined || theme === 'sap_bluecrystal') {
                //theme = 'sap_belize';
                theme = sap.ui.getVersionInfo().version < "1.40" ? 'sap_bluecrystal' : 'sap_belize';
            }

            if (jQuery.sap.getUriParameters().get("sap-ui-theme")) {
                theme = jQuery.sap.getUriParameters().get("sap-ui-theme").split("@")[0];
            }

            if (global.vui5.session.fromFioriLaunchpad || sap.ui.getCore().getConfiguration().getTheme() === theme) {
                return;
            }
            if (theme.indexOf("sap_") != 0) {
                sap.ui.getCore().setThemeRoot(theme, global.vui5.themeRoot + "/UI5/");
            }

            sap.ui.getCore().applyTheme(theme);
        }
        ,
        prepareSearchFields: function (fields) {

            return this.selectionsFill([], fields);
        }
        ,
        checkEndsWith: function (suffix, string) {
            var d = string.length - suffix.length;
            return d >= 0 && string.lastIndexOf(suffix) === d;
        },
        checkStartsWith: function (prefix, string) {
            if (prefix && string) {
                var l = string.length - prefix.length;
                return l >= 0 && string.substring(0, prefix.length) === prefix;
            }
        },


        selectionsFill: function (lt_selections,
                                  fields) {

            var searchData = {};
            var low;
            /**** Rel 60E SP6 ECDM #4437 - Start **/
            var search_value_length;
            /**** Rel 60E SP6 ECDM #4437 - End **/
            for (var i = 0; i < fields.length; i++) {
                /* Temp Changes */
                // var tabname = fields[i].TABNAME.replace("/IRM/", "");
                var tabname = fields[i].TABNAME;
                tabname = tabname.substr(tabname.lastIndexOf("/") + 1, tabname.length);
                searchData[fields[i].FLDNAME + "-" + tabname] = [];

                var selections = underscoreJS.where(lt_selections, {
                    'SELNAME': fields[i].FLDNAME,
                    'TABNAME': fields[i].TABNAME
                });
                if (selections.length == 0) {
                    selections = underscoreJS.where(lt_selections, {
                        'SHLPFIELD': fields[i].FLDNAME,
                        'TABNAME': fields[i].TABNAME
                    });
                    if (selections.length == 0) {
                        selections = underscoreJS.where(lt_selections, {
                            'FIELDNAME': fields[i].FLDNAME,
                            'TABNAME': fields[i].TABNAME
                        });
                    }
                    //**Rel 60E SP6 QA 9220 - Start
                    if (selections.length == 0) {
                        selections = underscoreJS.where(lt_selections, {
                            'SHLPFIELD': fields[i].FLDNAME,
                            'SHLPNAME': fields[i].TABNAME
                        });
                    }
                    //**Rel 60E SP6 QA 9220 - Start
                }
                /* Temp Changes */

                if (selections.length > 0) {

                    for (var j = 0; j < selections.length; j++) {

                        var object = underscoreJS.clone(selections[j]);

                        delete object['KIND'];
                        object['SHLPFIELD'] = object['SELNAME'] = object['FIELDNAME'] = fields[i]['FLDNAME'];
                        /* Temp Changes */
                        object['TABNAME'] = fields[i]['TABNAME'];
                        /* Temp Changes */

                        if (!object['SHLPNAME']) {
                            object['SHLPNAME'] = '';
                        }

                        if (fields[i]['ELTYP'] === global.vui5.cons.element.dropDown && fields[i]['MULTISELECT'] == 'X') {

                            if (searchData[fields[i]['FLDNAME'] + "-" + tabname].length == 0) {
                                low = [];
                                low.push(object['LOW']);
                                object['LOW'] = low;

                                searchData[fields[i]['FLDNAME'] + "-" + tabname].push(object);
                            }
                            else {
                                searchData[fields[i]['FLDNAME'] + "-" + tabname][0].LOW.push(object['LOW']);
                            }
                        }
                        else {
                            /*** Rel 60E SP6 - Task #43154 - Search Molecule Ranges code Finetune - Start **/

                            if (object['TEXT'] === undefined) {
                                var value = "";
                                var operation = object['OPTION'];
                                if (object['OPTION'] == "GE") {
                                    value = value + ">=";
                                }
                                else if (object['OPTION'] == "LE") {
                                    value = value + "<=";
                                }
                                else if (object['OPTION'] == "GT") {
                                    value = value + ">";
                                }
                                else if (object['OPTION'] == "LT") {
                                    value = value + "<";
                                }
                                else if (object['OPTION'] == "EQ") {
                                    value = value + "=";
                                }

                                if (object['OPTION'] == "BT") {
                                    value = object['LOW'] + "..." + object['HIGH'];
                                }
                                else if (object['OPTION'] == "CP") {
                                    operation = "Contains";
                                    value = '*' + object['LOW'] + '*';
                                }
                                else if (object['OPTION'] == "SW") { // only in
                                    // case of
                                    // saved
                                    // variant
                                    operation = "StartsWith";
                                    value = object['LOW'] + '*';
                                }
                                else if (object['OPTION'] == "EW") { // only in
                                    // case of
                                    // saved
                                    // variant
                                    operation = "EndsWith";
                                    value = '*' + object['LOW'];
                                }
                                else {
                                    value = value + object['LOW'];
                                }

                                if (object['SIGN'] == "E") {
                                    value = "!(" + value + ")";
                                }
                                object['TEXT'] = value;
                            }
                            if (object['OPTION'] === "CP") {
                                object['OPTION'] = "Contains";
                            }
                            else if (object['OPTION'] === "SW") {
                                object['OPTION'] = "StartsWith";
                            }
                            else if (object['OPTION'] === "EW") {
                                object['OPTION'] = "EndsWith";
                            }
                                /*** Rel 60E SP7 - Empty NonEmpty Support - Start***/
                            else if (object['OPTION'] === "NV") {
                                object['OPTION'] = "Empty";
                                if (object['SIGN'] === 'I') {
                                    object['TEXT'] = "<" + sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("CONDITIONPANEL_OPTIONEmpty") + ">";
                                } else {
                                    object['TEXT'] = "!(<" + sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("CONDITIONPANEL_OPTIONEmpty") + ">)";
                                }
                            }
                            /*** Rel 60E SP7 - Empty NonEmpty Support - End***/


                            /*** Rel 60E SP6 - Task #43154 - Search Molecule Ranges code Finetune - End **/
                            searchData[fields[i]['FLDNAME'] + "-" + tabname].push(object);
                        }
                    }
                }
                else {
                    if (fields[i]['DATATYPE'] === global.vui5.cons.dataType.date) {
                        /* Temp Changes */
                        searchData[fields[i].FLDNAME + "-" + tabname].push({
                            "SHLPNAME": fields[i].SHLPNAME,
                            "FIELDNAME": fields[i].FLDNAME,
                            "SHLPFIELD": fields[i].FLDNAME,
                            "SELNAME": fields[i].FLDNAME,
                            /* Temp Changes */
                            "TABNAME": fields[i].TABNAME,
                            /* Temp Changes */
                            "OPTION": "",
                            "LOW": "",
                            "HIGH": "",
                            "SIGN": "",
                            //*****Rel 60E_SP6 - Sanofi Req
                            "LOW_TXT": "",
                            "HIGH_TXT": ""
                            //*****
                        });
                    }
                    else {
                        switch (fields[i].ELTYP) {
                            case global.vui5.cons.element.input:
                            case global.vui5.cons.element.valueHelp:
                                if (!fields[i]['MULTISELECT'] || fields[i]['MULTISELECT'] == '') {
                                    searchData[fields[i].FLDNAME + "-" + tabname].push({
                                        "SHLPNAME": fields[i].SHLPNAME,
                                        "FIELDNAME": fields[i].FLDNAME,
                                        "SHLPFIELD": fields[i].FLDNAME,
                                        "SELNAME": fields[i].FLDNAME,
                                        /* Temp Changes */
                                        "TABNAME": fields[i].TABNAME,
                                        /* Temp Changes */
                                        "OPTION": "",
                                        "LOW": "",
                                        "HIGH": "",
                                        "SIGN": "",
                                        //*****Rel 60E_SP6 - Sanofi Req
                                        "LOW_TXT": "",
                                        "HIGH_TXT": "",
                                        "TEXT": ""
                                        //*****
                                    });
                                }
                                break;
                            case global.vui5.cons.element.dropDown:
                                low = '';
                                if (fields[i]['MULTISELECT'] == 'X') {
                                    low = [];
                                }
                                searchData[fields[i].FLDNAME + "-" + tabname].push({
                                    "SHLPNAME": fields[i].SHLPNAME,
                                    "FIELDNAME": fields[i].FLDNAME,
                                    "SHLPFIELD": fields[i].FLDNAME,
                                    "SELNAME": fields[i].FLDNAME,
                                    /* Temp Changes */
                                    "TABNAME": fields[i].TABNAME,
                                    /* Temp Changes */
                                    "OPTION": "",
                                    "LOW": low,
                                    "HIGH": "",
                                    "SIGN": "",
                                    //*****Rel 60E_SP6 - Sanofi Req
                                    "LOW_TXT": "",
                                    "HIGH_TXT": ""
                                    //*****
                                });
                                break;
                            case global.vui5.cons.element.checkBox:
                                searchData[fields[i].FLDNAME + "-" + tabname].push({
                                    "SHLPNAME": fields[i].SHLPNAME,
                                    "FIELDNAME": fields[i].FLDNAME,
                                    "SHLPFIELD": fields[i].FLDNAME,
                                    "SELNAME": fields[i].FLDNAME,
                                    /* Temp Changes */
                                    "TABNAME": fields[i].TABNAME,
                                    /* Temp Changes */
                                    "OPTION": "",
                                    "LOW": "",
                                    "HIGH": "",
                                    "SIGN": "",
                                    //*****Rel 60E_SP6 - Sanofi Req
                                    "LOW_TXT": "",
                                    "HIGH_TXT": ""
                                    //*****
                                });
                                break;
                        }
                    }
                }
            }
            return searchData;
        }
        ,
        selectionsPrepare: function (selections) {

            var lt_selections = [];
            for (var i in selections) {
                for (var j = 0; j < selections[i].length; j++) {
                    var object = {};
                    object = underscoreJS.clone(selections[i][j]);

                    if ((underscoreJS.isEmpty(object['LOW']) && (object.OPTION || object.SIGN)) || object['LOW']
                        //*****Rel 60E_SP6 - Sanofi Req
                         || object['TEXT'])
                        //*****
                        /*if (object['LOW'])*/ {
                        if (object['FIELDNAME'] && object['FIELDNAME'] != '') {
                            object['SHLPFIELD'] = object['SELNAME'] = object['FIELDNAME'];
                        }
                        else if (object['SHLPFIELD'] && object['SHLPFIELD'] != '') {
                            object['SELNAME'] = object['FIELDNAME'] = object['SHLPFIELD'];
                        }
                        else if (object['SELNAME'] && object['SELNAME'] != '') {
                            object['SHLPFIELD'] = object['FIELDNAME'] = object['SELNAME'];
                        }
                        /*if (object.OPTION == '') {
                            object.OPTION = 'EQ';
                            object.SIGN = 'I';
                        }*/
                        if (!object['SHLPNAME']) {
                            object['SHLPNAME'] = '';
                        }
                        if (underscoreJS.isArray(object['LOW'])) {
                            for (var lowIndex = 0; lowIndex < object['LOW'].length; lowIndex++) {
                                var newObject = underscoreJS.clone(object);
                                newObject['LOW'] = object['LOW'][lowIndex];
                                lt_selections.push(newObject);
                            }
                        }
                        else {
                            /*** Rel 60E SP6 - Task #43154 - Search Molecule Ranges code Finetune - Start **/
                            /*if (object.OPTION == "Contains" || object.OPTION == "StartsWith" || object.OPTION == "EndsWith") {
                                object.OPTION = 'CP';
                                object.LOW = object.TEXT;
                            }*/

                            if (object['OPTION'] === "Contains") {
                                object['OPTION'] = "CP";
                            }
                            else if (object['OPTION'] === "StartsWith") {
                                object['OPTION'] = 'SW';
                            }
                            else if (object['OPTION'] === "EndsWith") {
                                object['OPTION'] = "EW";
                            }
                                /*** Rel 60E SP7 - Empty NonEmpty Support - Start***/
                            else if (object['OPTION'] === "Empty") {
                                object['OPTION'] = "NV";
                            }
                            /*** Rel 60E SP7 - Empty NonEmpty Support - End***/
                            /*** Rel 60E SP6 - Task #43154 - Search Molecule Ranges code Finetune - End **/

                            lt_selections.push(object);
                        }
                    }
                }
            }
            return lt_selections;
        }
        ,
        moveObjectByProperty: function (source,
                                        dest,
                                        ignoreFields,
                                        fieldPrefix) {

            if (!dest) {
                dest = {};
            }
            if (!ignoreFields) {
                ignoreFields = [];
            }
            if (!fieldPrefix) {
                fieldPrefix = '';
            }
            for (var k in source) {
                if (source.hasOwnProperty(k) && (ignoreFields && ignoreFields.indexOf(fieldPrefix ? (fieldPrefix + '.' + k) : k) === -1)) {
                    if (underscoreJS.isObject(source[k]) && !underscoreJS.isArray(source[k])) {
                        if (!dest[k]) {
                            dest[k] = {};
                        }
                        this.moveObjectByProperty(source[k], dest[k], ignoreFields, fieldPrefix ? (fieldPrefix + '.' + k) : k);
                    }
                    else {
                        dest[k] = source[k];
                    }
                }
            }
        }
        ,
        defaultFieldsAppend: function (fcat) {

            var sLocale = sap.ui.getCore().getConfiguration().getLanguage();
            if (sLocale.length > 2) {
                sLocale = sLocale.substring(0, 2);
            }
            var bundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls");
            var postn = fcat.length;
            var maxHits = {
                "FLDNAME": "MAXHITS",
                "TABNAME": "1",
                "LABEL": bundle.getText("MaxHits"),
                "ELTYP": "A",
                "SDSCR": global.vui5.cons.fieldValue.value,
                "DISABLED": "",
                "INTLEN": 10,
                "POSTN": postn,
                "OUTPUTLEN": "000010",
                "NO_OUT": "",
                "DATATYPE": global.vui5.cons.dataType.number,
                "INTTYPE": global.vui5.cons.intType.number
            };
            maxHits.ONCHANGE = this.maxHitsOnChange;

            var field = underscoreJS.findWhere(fcat, {
                FLDNAME: "MAXHITS"
            });
            if (!field) {
                fcat.push(maxHits);
            }
            return fcat;
        },

        _getQueryParams: function (urlParams) {
            urlParams = urlParams.split("+").join(" ");

            var params = {}, tokens, re = /[?&]?([^=]+)=([^&]*)/g;

            while (tokens = re.exec(urlParams)) {
                params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
            }

            return params;
        },
        /***Rel 60E SP7 - QA #12546 - Handling Double Click on Buttons - Start ***/
        debounce: function (func, wait, actionObject) {
            var objDefer = $.Deferred(), promise; 
        	var context = this, args = arguments;
        	if(global.debounceObject === actionObject) {
        		clearTimeout(global.timeout);
        	}
        	global.debounceObject = actionObject;
        	
            global.timeout = setTimeout(function () {
                promise = func.apply(context, args);
                promise.then(function(response) {
                	objDefer.resolve(response);
                }).fail(function(response) {
                	objDefer.reject(response);
                })
            }, wait);
            return objDefer.promise();
        	
        }
        /***Rel 60E SP7 - QA #12546 - Handling Double Click on Buttons - End ***/
    };
    $(document).ready(function () {
        $(this).mousemove(function (e) {
            if (global.vui5.session.ccounter > 15) {
                commonUtils.sessionTimeReset();
            }
        });
        $(this).keypress(function (e) {
            if (global.vui5.session.ccounter > 15) {
                commonUtils.sessionTimeReset();
            }
        });

    });

    return commonUtils;
});