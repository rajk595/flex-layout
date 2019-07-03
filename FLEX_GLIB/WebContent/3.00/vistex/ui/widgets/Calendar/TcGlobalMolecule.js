var ganttChart = function() {
    return this.init.apply(this, arguments);
};
(function(ganttChart) {
    $.ajax({
        url: jQuery.sap.getModulePath(vistexConfig.rootFolder + ".ui.widgets.Calendar") + "/template.html",
        async: false,
    }).done(function(result) {
        ganttChart.prototype.template = result;
    });
    ganttChart.prototype.templates = {
        parentClass: '<tr class="{{parentClass}}"></tr>',
        colPrepare: '<td class="vColumnsDataPrepare" id="vColumnsDataPrepare"><span id="contentDisplay">{{colName}}</span></td>',
        colPrepareCheckbox: '<td class="vColumnsDataPrepare" id="vColumnsDataPrepare"><div class="checkbox" id="checkbox--{{ID}}"><label><input type="checkbox" value=""><span class="cr" id="cr"><i class="cr-icon glyphicon glyphicon-ok"></i></span></label></div><a id="rowDetail"><span id="contentDisplay">{{colName}}</span><a></td>',
        columnsPrepareTr: '<tr class="treegrid-{{ID}}"></tr>',
        columnsPrepareTd: '<td><span class="vColumnsPrepare"  id="vColumnsPrepare">{{colData}}</span></td>',
        parentNullTemplate: '<tr class="treegrid-{{parentClass}}"><td class="vBars"   colspan="{{span}}"><div class="powertip righttable--{{ID}} taskBars" data-title="{{obj}}" id="righttable--{{ID}}" style="left:{{leftValue}}px;width:{{width}}px;background:{{divColor}};"><div class="circleBase type2 borderColor" style="border-color:{{borderColor}}"></div><div id="divStart" class ="divStart">{{startDateValue}}</div><div id="divEnd" class ="divEnd" style="left:{{divEndLeftValue}}px;">{{endDateValue}}</div><div id="divDescr" class="divDescr"><p>{{obj}}</p></div><div class="circleBase type3 borderColor" style="left:{{circleBaseLeft}}px;border-color:{{borderColor}}"></div></td></tr>',
        overlapParentNullTemplate: '<tr class="treegrid-{{parentClass}}"><td class="vBars"   colspan="{{span}}"><div class="powertip righttable--{{ID}} taskBars" data-title="{{obj}}" id="righttable--{{ID}}" style="left:{{leftValue}}px;width:{{width}}px;background:{{divColor}};"><div class="circleBase type2 borderColor" style="border-color:{{borderColor}}"></div><div id="divStart" class ="divStart">{{startDateValue}}</div><div id="divEnd" class ="divEnd"  style="left:{{divEndLeftValue}}px;">{{endDateValue}}</div><div id="divDescr" class="divDescr"><p>{{obj}}</p></div><div class="circleBase type3 borderColor" style="left:{{circleBaseLeft}}px;border-color:{{borderColor}}"></div></div></td></tr>',
        parentNullTemplateNodiv: '<tr class="treegrid-{{parentClass}}"><td class="vBars"   colspan="{{span}}"></td></tr>',
        newParentNullTemplate: '<tr class="{{parentClass}}"><td class = "New" id="New" colspan="{{span}}"></td></tr>',
        trRow: '<tr class="{{ParentClass}}"><td colspan="{{ColSpan}}"><div>{{Object}}</div></td></tr>',
        prepareTaskDiv: '<tr class="{{parentClass}}"><td id="vTitleNew" colspan="{{span}}"><div  class="powertip righttable--{{ID}} taskBars" id="righttable--{{ID}}" data-title="{{objData}}" style="left:{{leftValue}}px;width:{{width}}px;background:{{divColor}};"><div class="circleBase type2 borderColor" style="border-color:{{borderColor}};"></div><div id="divStart" class ="divStart">{{startDateValue}}</div><div id="divEnd" class ="divEnd" style="left:{{divEndLeftValue}}px;">{{endDateValue}}</div><div id="divDescr" class="divDescr"><p>{{objData}}</p></div><div class="circleBase type3 borderColor" style="left:{{circleBaseLeft}}px;border-color:{{borderColor}};"></div></div></td></tr>',
        treeTableColumns: '<td class="columnHeader" id="columnHeader"><span id="treeColumns" class="treeColumns">{{treeColumns}}</span></td>',
        tooltipTemplate: '<table class="vResizingDrag" id="vResizingDrag">',
        tooltipTemplateTableBody: '<tr><td class="text-right">{{description}}&nbsp:&nbsp</td><td class="text-left">{{value}}</td></tr>',
        eventsPrepareTemplate: "<div id='event--{{count}}'  class='newDiv event'  style='background-color:{{divColor}}!important;width:{{width}}px;left:{{leftValue}}px;'></div>",
        getYearHeaderTemplate: '<tr id="vyear"></tr>',
        getYearContentTemplate: '<th class="timelineHeader text-center" colspan="{{span}}"><div class="eventsCount" id="eventsCount"><i id="markerIcon" class="fa fa-map-marker" aria-hidden="true"></i><span id ="count" class ="count">{{eventsCount}}</span></div><p class="headerDescription" id="headerDescription">{{description}}</p><div class="seperatorBar" id="seperatorBar"></div><div class="vLine" id="vLine"></div></th>',
        getDaysContentTemplate: '<th class="timelineHeader text-center" colspan="{{span}}"><p class="headerDescription" id="headerDescription">{{description}}</p><p id="weekName" class="weekName">{{weekName}}</p><div class="vLine" id="vLine"></div></th>',
        getHalfYearTemplate: '<tr id="vhalf"></tr>',
        getQuartersTemplate: '<tr id="vquarter"></tr>',
        getMonthsTemplate: '<tr id="vmonth"></tr>',
        getWeeksTemplate: '<tr id="vweek"></tr>',
        getDaysTemplate: '<tr id="vday"></tr>',
        headerDescription: '<h4 id= "text-left tooltipHeaderText" class= "text-left tooltipHeaderText">{{description}}</h4><br>',
        eventsToolTip: '<div id="eventTooltip" class="eventTooltip"></div>',
        ascendingIconTemplate: "<i class='fa fa-long-arrow-down' aria-hidden='true'  id='sortasc'></i>",
        descendingIconTemplate: "<i class='fa fa-long-arrow-up' aria-hidden='true'  id='sortdesc'></i>",
        secondondaryChart: '<div id="secondaryChart" class="secondaryChart"></div>',
        secondondaryChartTree: '<div class="secondaryChartTree" id="secondaryChartTree"></div>',
        secondondaryChartTable: '<div class="secondaryChartTable" id="secondaryChartTable"></div>',
        secondondaryChartTreeHead: '<div id="secondaryChartTreeHead" class="secondaryChartTreeHead"> <div id="headerWrapper" class="headerWrapper"><div class="TitleHeader" id="TitleHeader"><span id="chartName" class="chartName"></span></div></div><table class="table tree-3 table-bordered fixed"><thead><tr></tr></thead></table></div>',
        secondaryChartTreeBody: '<div id="secondaryChartTreeBody" class="secondaryChartTreeBody"><table class="table tree-3 table-bordered fixed"><tbody></tbody></table></div>',
        secondaryChartTableHead: '<div id="secondaryChartTableHead" class="secondaryChartTableHead"><table class="table tree-3 table-bordered fixed"><thead></thead></table></div>',
        secondaryChartTableBody: '<div id="secondaryChartTableBody" class="secondaryChartTableBody"></div>',
        secondaryChartTableBodyTableContent: '<table class="table tree-3 table-bordered fixed"><tbody class="text-center"></tbody></table>',
        secondaryChartSplitterDiv: "<div id='splitterDiv' class='splitterDiv vx-splitter vx-timelinepanel-splitter vx-box-item vx-splitter-default vx-splitter-vertical vx-unselectable'> <i class='fa fa-arrow-circle-left' id = 'circleLeft' aria-hidden='true'></i></div>",
        secondaryChartClockDiv: "<div class='clockDiv' id='clockDiv'></div>",
        secondaryChartEventsDiv: "<div class='eventsDiv' id='eventsDiv'></div>",
        popoverTemplateMultipleContent: '<div class="multipleContentDiv--{{IDX}}" id="multipleContentDiv--{{IDX}}" style="height:{{heightValue}}px"></div>',
        popoverTemplateLeftBar: "<div style='height:{{heightValue}}px' class='leftBar--{{IDX}}' id='leftBar--{{IDX}}'><p class='periodName' id='periodName' style='margin-top:{{pMarginTopValue}}px'>{{periodName}}</p></div>",
        popoverTemplateRightBar: "<div class='rightBar' id='rightBar--{{idx}}' style='top:{{topValue}}px'><span id ='eventName' class ='eventName'><a style='color:{{eventColorDisplay}}!important;'>{{eventName}}</a></span><br/><br/><p id='startDate' class='startDate'>{{start}}</p><p id='endDate' class='endDate'>{{end}}</p><p id='duration' class='duration'>Duration :{{duration}} </p></div>",
        extraColumnHead: "<td class='columnHeader' id='columnHeader' style='width: 45px;'></td>",
        extraColumnBody: "<td style='width: 45px;'><i id='faeye' class='fa fa-eye' aria-hidden='true'></i></td>",
        extraColumnBodyEditMode: "<td style='width: 45px;'><i id='faeye' class='fa fa-pencil' aria-hidden='true'></i></td>",
        overlapDivContent: '<div  class="powertip righttable--{{ID}} taskBars" data-title="{{objData}}" id="righttable--{{ID}}"  style="left:{{leftValue}}px;width:{{width}}px;background:{{divColor}};"><div class="circleBase type2 borderColor" style="border-color:{{borderColor}};"></div><div id="divStart" class ="divStart">{{startDateValue}}</div><div id="divEnd" class ="divEnd" style="left:{{divEndLeftValue}}px;">{{endDateValue}}</div><div id="divDescr" class="divDescr"><p>{{objData}}</p></div><div class="circleBase type3 borderColor" style="left:{{circleBaseLeft}}px;border-color:{{borderColor}};"></div></div>'
    }
    ganttChart.prototype.init = function(node, arguments1) {

        $('#calendarContainer').append(this.template);
        this.previousId;
        this.arr;
        this.events = [];
        this.levels = [];
        this.Columns = [];
        this.zoomCount = 0;
        this.previousClass;
        this.previousSelectedClass;
        this.previousMajorClass;
        this.arrTemp = [];
        this.undoCounter = 0;
        this.redoCounter = 0;
        this.taskBuffer = [];
        this.trClass;
        this.data_p = [];
        this.previousValue;
        this.scale = {};
        this.element = null;
        this.redoCounterBuffer = [];
        this.originalThwidth;
        this.xcount = 0;
        this.quickInfo = [];
        this.quickInfo1 = [];
        this.dateFormat = "";
        this.primaryObjectTitle = "";
        this.barData_p = [];
        this.CALENDARSETTINGS = {}
        self = this;
        self.fullscreen = false;
        self.renderFirstTime = true;
        self.sendData = [];
        self.asc = "X";
        self.prevScaleZoomIn = 0;
        self.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        self.weekNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        self.levelNames = ['Years', 'Half Year', 'Quarter', 'Months', 'Weeks', 'Days'];
        self.levelsCounter = 0;
        this.inputNode = $(node);
        this.render();
    }
    ganttChart.prototype.render = function() {
            this.domNode = $(this.template);
            this.inputNode.after(this.domNode);
        },
        ganttChart.prototype.chartRender = function(oControl, bars, columns, events, barData_p, CALENDARSETTINGS, INTERNALSETTINGSFORCALENDAR, dateFormat, primaryObjectTitle, document_mode, levels, requestHeaderData, data_s, secondaryObjectTitle, barData_s, /*requestQuickinfo,*/ levels_s, events_s) {
            self.control = oControl;

            self.start_p = self.changeDatesToUIFormat(oControl.start_p)
            self.end_p = self.changeDatesToUIFormat(oControl.end_p)
            self.levels_p = levels;
            self.data_p = bars;
            self.events_p = events;
            self.columns_p = columns;
            self.barData_p = barData_p;
            self.primaryObjectTitle = primaryObjectTitle;


            self.CALENDARSETTINGS = CALENDARSETTINGS;
            self.INTERNALSETTINGSFORCALENDAR = INTERNALSETTINGSFORCALENDAR;
            self.dateFormat = dateFormat;
            self.appToolbarHeight = $(".appToolbar").height();
            self.appToolbarWidth = $(".appToolbar").width();
            
            self.wrapperHeight =/* $('#wrapper').height()*/$(window).height() ||  $(window).height();
            self.reqhgt = self.wrapperHeight - self.appToolbarHeight;
            

            self.start_s = self.changeDatesToUIFormat(oControl.start_s)
            self.end_s = self.changeDatesToUIFormat(oControl.end_s)
            self.document_mode = document_mode;
            self.secondaryObjectTitle = secondaryObjectTitle;
            self.data_s = data_s;
//QA#11191            
            ( _.filter(self.data_p,{'TREE_PARENTID':'null'}).length == self.data_p.length) ? self.allParents_p='X':self.allParents_p = ''
//            
            self.barData_s = barData_s;
            self.events_s = events_s;
            self.levels_s = levels_s;
            self.columns_s = requestHeaderData;
            self.combinedEvents = [];
            self.performCombinedEventsFunction()
            for (var f = 0; f < self.data_p.length; f++) {
                self.data_p[f].ORIGINALSTART = self.data_p[f].START;
                self.data_p[f].ORIGINALEND = self.data_p[f].END
                self.data_p[f].CHARTID = "1"
                if (self.data_p[f].REFERENCE != '') {}
            }
            if (self.levels_p[0].TEXT == 'Periods') {
                for (var x = 0; x < self.levels_p.length; x++) {
                    self.levels_p[x].TEXT = self.levelNames[x]
                }
            }
            if (!underscoreJS.isEmpty(self.columns_s)) {
                self.secondInstanceExists = "X";
                ( _.filter(self.data_s,{'TREE_PARENTID':'null'}).length == self.data_s.length) ? self.allParents_s='X':self.allParents_s = ''
                for (var f = 0; f < self.data_s.length; f++) {
                    self.data_s[f].ORIGINALSTART = self.data_s[f].START;
                    self.data_s[f].ORIGINALSTART = self.data_s[f].END
                    self.data_s[f].CHARTID = "2"
                    if (self.data_s[f].REFERENCE != '') {}
                }
                if (self.levels_s[0].TEXT == 'Periods') {
                    for (var x = 0; x < self.levels_s.length; x++) {
                        self.levels_s[x].TEXT = self.levelNames[x]
                    }
                }
            }
            if (self.levels_p) {
                self.generateheader(self);
            }
            self.zoomCount = self.CALENDARSETTINGS.ZOOMCOUNT;
        }
    ganttChart.prototype.changeDatesToUIFormat = function(dateValue) {
        if (dateValue.search('-') != -1) {
            var dates = dateValue.split('-');
            dateValue = dates[1] + '/' + dates[2] + '/' + dates[0];
        }
        return dateValue;
    }
    ganttChart.prototype.zoomThroughScale = function(currentLevel) {

        if (self.prevScaleZoomIn != "") {
            if (self.prevScaleZoomIn > currentLevel) {
                self.scaleZoomOut(self.prevScaleZoomIn, currentLevel)
            } else {
                self.scaleZoomIn(self.prevScaleZoomIn, currentLevel)
            }
            self.prevScaleZoomIn = currentLevel;
        } else {
            self.scaleZoomIn(self.prevScaleZoomIn, currentLevel)
            self.prevScaleZoomIn = currentLevel;
        }

    }
    ganttChart.prototype.performCombinedEventsFunction = function() {
        var eventsPS = underscoreJS.union(self.events_p, self.events_s);
        for (var p = 0; p < eventsPS.length; p++) {
            eventsPS[p].START = self.changeDatesToUIFormat(eventsPS[p].START)
            eventsPS[p].END = self.changeDatesToUIFormat(eventsPS[p].END)
        }
        var fevents = underscoreJS.clone(self.events_p);
        var sevents = underscoreJS.clone(self.events_s);
        var restArr = [];
        var commonArr = [];
        var fl = fevents.length;
        var sl = sevents.length;
        if (underscoreJS.isEmpty(sevents)) {
            for (var i = 0; i < (self.events_p.length); i++) {
                self.events_p[i].RENDEREDID = "a" + i
            }
        } else { //only single evnetnts
            if (fl > sl) {
                var commonArr = underscoreJS.reject(fevents, function(item) {
                    return !underscoreJS.find(sevents, {
                        'NAME': item.NAME,
                        'START': item.START,
                        'END': item.END
                    });
                });
                var restArr = underscoreJS.reject(fevents, function(item) {
                    return underscoreJS.find(sevents, {
                        'NAME': item.NAME,
                        'START': item.START,
                        'END': item.END
                    });
                });
                for (var i = 0; i < (commonArr.length); i++) {
                    commonArr[i].RENDEREDID = "c" + i
                }
                for (var i = 0; i < (restArr.length); i++) {
                    restArr[i].RENDEREDID = "a" + i
                }
                self.events_p = [];
                self.events_p.push(restArr);
                self.events_p.push(commonArr);
                self.events_p = underscoreJS.flatten(self.events_p)
                for (var x = 0; x < fevents.length; x++) {
                    for (var y = 0; y < sevents.length; y++) {
                        if ((fevents[x].NAME.toLowerCase() === sevents[y].NAME.toLowerCase()) && (new Date(fevents[x].START).getTime() === new Date(sevents[y].START).getTime()) && (new Date(fevents[x].END).getTime() === new Date(sevents[y].END).getTime())) {
                            //fevents.splice(x, 1);
                            sevents.splice(y, 1);
                        }
                    }
                }
                for (var i = 0; i < (sevents.length); i++) {
                    sevents[i].RENDEREDID = "b" + i
                }
                self.events_s = [];
                self.events_s.push(sevents);
                self.events_s.push(commonArr);
                self.events_s = underscoreJS.flatten(self.events_s)
            } else {
                var commonArr = underscoreJS.reject(sevents, function(item) {
                    return !underscoreJS.find(fevents, {
                        'NAME': item.NAME,
                        'START': item.START,
                        'END': item.END
                    });
                });
                var restArr = underscoreJS.reject(sevents, function(item) {
                    return underscoreJS.find(fevents, {
                        'NAME': item.NAME,
                        'START': item.START,
                        'END': item.END
                    });
                });
                for (var i = 0; i < (commonArr.length); i++) {
                    commonArr[i].RENDEREDID = "c" + i
                }
                for (var i = 0; i < (restArr.length); i++) {
                    restArr[i].RENDEREDID = "b" + i
                }
                self.events_s = [];
                self.events_s.push(restArr);
                self.events_s.push(commonArr);
                self.events_s = underscoreJS.flatten(self.events_s)
                for (var x = 0; x < sevents.length; x++) {
                    for (var y = 0; y < fevents.length; y++) {
                        if ((sevents[x].NAME.toLowerCase() === fevents[y].NAME.toLowerCase()) && (new Date(sevents[x].START).getTime() === new Date(fevents[y].START).getTime()) && (new Date(sevents[x].END).getTime() === new Date(fevents[y].END).getTime())) {
                            fevents.splice(y, 1);
                        }
                    }
                }
                for (var i = 0; i < (fevents.length); i++) {
                    fevents[i].RENDEREDID = "a" + i
                }
                self.events_p = [];
                self.events_p.push(fevents);
                self.events_p.push(commonArr);
                self.events_p = underscoreJS.flatten(self.events_p)
            }
        }
    }
    ganttChart.prototype.generateheader = function(self) {
            var scalearr = [];
            for (var p = 0; p < self.levels_p.length; p++) {
                scalearr.push(self.levels_p[p].TEXT);
            }
            if (self.secondInstanceExists == "X") {
                var from = new Date(self.start_p);
                var to = new Date(self.end_p);
                var colspan = self.getSpan(from, to) + 1;
                //secondchart case consedering the thwidth,from both of the charts
                var from1 = new Date(self.start_s);
                var to1 = new Date(self.end_s);
                var colspan1 = self.getSpan(from1, to1) + 1;
                colspan = Math.min(colspan, colspan1)
                self.originalThwidth = Math.ceil(($('#calendarComponent').width()) / colspan); // setting the originalthwidth  // cannot fetch below primarycharttable width
            } else {
                var from = new Date(self.start_p);
                var to = new Date(self.end_p);
                var colspan = self.getSpan(from, to) + 1;
                self.originalThwidth = Math.ceil(($('#calendarComponent').width()) / colspan); // setting the originalthwidth  // cannot fetch below primarycharttable width
            }
            self.previousThwidth = self.originalThwidth;
            var tempVar = self.originalThwidth;
            for (var i = 1; i < (scalearr.length + 1); i++) { // scale is an object which consits of period name and the widths. 
                self.scale[i] = scalearr[i - 1];
                self.scale['w' + i] = tempVar;
                tempVar = tempVar * 2; // each zoom we will double the width;
            }

            self.headerPrepare(new Date(self.start_p), new Date(self.end_p), scalearr[Number(self.CALENDARSETTINGS.ZOOMCOUNT - 1)], "primaryChart", self.levels_p);
            self.headerPrepare(new Date(self.start_p), new Date(self.end_p), scalearr[Number(self.CALENDARSETTINGS.ZOOMCOUNT)], "primaryChart", self.levels_p);
            $('#primaryChart').height(self.reqhgt);
            $('#secondaryChart').height(self.reqhgt);
            ////////////////////////////////////////////////////////////////////////////////
            var reqObject = self.CALENDARSETTINGS;
            if (reqObject.SPLITVIEW || reqObject.OVERLAPMODE) { // handling splitmode
                underscoreJS.filter(underscoreJS.union(self.data_p, self.data_s), function(f, i, l) {
                    f.EXPANDED = true;
                })
                if (reqObject.OVERLAPMODE) {
                    self.segregateElements()
                }
                if (reqObject.SPLITVIEW && !underscoreJS.isEmpty(self.columns_s)) {
                    self.secondInstanceExists = "X";
                } else {
                    self.secondInstanceExists = "";
                    $('#secondaryChart').remove();
                }
                self.renderFirstTime = true;
            }
            ///////////////////////////////////////////
            $(document).off('keydown').on('keydown', function(evt) {

                if (evt.keyCode == 90 && (evt.ctrlKey)) { // undo ctrl + z
                    self.undoMove();
                    evt.preventDefault();
                } else if (evt.keyCode == 89 && (evt.ctrlKey)) { // undo ctrl + y
                    self.redoMove();
                    evt.preventDefault();

                }

            });

            self.getChartPrepare(from, to);
        },
        ganttChart.prototype.segregateElements = function() {
            //////////////////no Levels
            var elements = underscoreJS.filter(self.data_p, {
                'REFERENCE': ''
            });
            var elements1 = underscoreJS.filter(self.data_s, {
                'REFERENCE': ''
            });
            if (elements.length == self.data_p.length) {
                self.noChilds = true;
                self.hideTree = true;
            }
            if (elements1.length == self.data_s.length) {
                self.noChilds1 = true;
                self.hideTree1 = true;
            }
            ////// one or more levels    	 
            //// one may have overlap, one doesnt have overlap, so considering different
            var elements = self.data_p
            for (var z = 0; z < elements.length; z++) {
                if (elements[z].REFERENCE == '') {
                    if (elements[z + 1]) {
                        if (elements[z + 1].REFERENCE == '') {
                            elements[z + 1].EXPANDED = false;
                            continue;
                        }
                    }
                    elements[z].EXPANDED = false;
                }
            }
            /////data_s
            var elements = self.data_s
            for (var z = 0; z < elements.length; z++) {
                if (elements[z].REFERENCE == '') {
                    if (elements[z + 1]) {
                        if (elements[z + 1].REFERENCE == '') {
                            elements[z + 1].EXPANDED = false;
                            continue;
                        }
                    }
                    elements[z].EXPANDED = false;
                }
            }
        }
    ganttChart.prototype.convertToRequiredFormat = function(limiter, oDate) {
            if (limiter == null) {
                var Years = oDate.substring(0, 4);
                var Months = oDate.substring(4, 6);
                var Days = oDate.substring(6, 8);
                var mydate = new Date(Months + "/" + Days + "/" + Years);
                return self.genericDateFunction(mydate);
            } else {
                return self.genericDateFunction(new Date(oDate));
            }
        },
        ganttChart.prototype.columnsDataPrepare = function(parentClass, singleObject, functionFrom, columns) {
            var template = self.templates;
            var pClass = template.parentClass;
            pClass = pClass.replace('{{parentClass}}', parentClass);
            $("#" + functionFrom + "Tree table tbody").append(pClass);
            var class1 = '#' + functionFrom + 'Tree table tbody tr.' + parentClass.split(' ').join('.');
            for (var z = 0; z < columns.length; z++) {
                if (singleObject.REFERENCE == '') {
                    var colData = template.colPrepare
                    if (z == 0) {
                        colData = colData.replace('{{colName}}', singleObject['DOCID'] || '');
                    } else {
                        colData = colData.replace('{{colName}}', '');
                    }
                    $(class1).append(colData);
                } else {
                    if (columns[z].FIELDNAME == 'DATAB' || columns[z].FIELDNAME == 'DATBI') {
                        if (singleObject[columns[z].FIELDNAME] == undefined) {
                            var colData = template.colPrepare
                            colData = colData.replace('{{colName}}', '');
                            $(class1).append(colData);
                        } else {
                            var oDate = singleObject[columns[z].FIELDNAME];
                            if (oDate != "") {
                                var limiter = oDate.match(/\-|\*|\.|\,|\-|\//); //supports / , . * -
                                self.reqdate = self.convertToRequiredFormat(limiter, oDate);
                            } else {
                                self.reqdate = '';
                            }
                            if (z == 0) {
                                var colData = template.colPrepareCheckbox
                                colData = colData.replace('{{ID}}', singleObject['TREE_ID']).replace('{{colName}}', self.reqdate);
                                $(class1).append(colData);
                            } else {
                                var colData = template.colPrepare
                                colData = colData.replace('{{colName}}', self.reqdate || '');
                                $(class1).append(colData);
                            }
                        }
                    } else {
                        if (z == 0) {
                            var colData = template.colPrepareCheckbox
                            colData = colData.replace('{{colName}}', singleObject[columns[z].FIELDNAME] || '').replace('{{ID}}', singleObject['TREE_ID']);
                            $(class1).append(colData);
                        } else {
                            var colData = template.colPrepare
                            colData = colData.replace('{{colName}}', singleObject[columns[z].FIELDNAME] || '');
                            $(class1).append(colData);
                        }
                    }
                }
            }
        }
//QA#11191        
    ganttChart.prototype.columnswithnullparentid = function(singleObject, functionFrom, columns) {
    
    	 var templates = self.templates;
         var columnsPrepareTr = templates.columnsPrepareTr;
         columnsPrepareTr = columnsPrepareTr.replace("{{ID}}", (singleObject['TREE_ID']))
         $('#' + functionFrom + 'Tree table tbody').append(columnsPrepareTr);
         for (var z = 0; z < columns.length; z++) {
         
        	 if(z == 0){
        		 if (columns[z].FIELDNAME == 'DATAB' || columns[z].FIELDNAME == 'DATBI') { // since if we change in object,its effecting ovearll objectDATAB DATBI
                     var oDate = singleObject[columns[z].FIELDNAME];
                     if (oDate != undefined) {
                         if (oDate != "") {
                             var limiter = oDate.match(/\-|\*|\.|\,|\-|\//); //supports / , . * -
                             self.reqdate = self.convertToRequiredFormat(limiter, oDate);
                         } else {
                             self.reqdate = '';
                         }
                     } else {
                         self.reqdate = '';
                     }
                    
                     var colData = templates.colPrepareCheckbox
                     colData = colData.replace('{{ID}}', singleObject['TREE_ID']).replace('{{colName}}', self.reqdate);
                     $('#' + functionFrom + 'Tree table tbody tr.treegrid-' + (singleObject['TREE_ID'])).append(colData);
                 
             }else{
            	 
            	    var colData = templates.colPrepareCheckbox
                    colData = colData.replace('{{ID}}', singleObject['TREE_ID']).replace('{{colName}}', singleObject[columns[z].FIELDNAME]);
                    $('#' + functionFrom + 'Tree table tbody tr.treegrid-' + (singleObject['TREE_ID'])).append(colData);
                
             }
        	 
        	           	 
        		 
        	 }else{
        		 
        		 if (columns[z].FIELDNAME == 'DATAB' || columns[z].FIELDNAME == 'DATBI') { // since if we change in object,its effecting ovearll objectDATAB DATBI
                     if (singleObject[columns[z].FIELDNAME] == undefined) {
                         var columnsPrepareTd = templates.columnsPrepareTd;
                         columnsPrepareTd = columnsPrepareTd.replace("{{colData}}", '');
                         $('#' + functionFrom + 'Tree table tbody tr.treegrid-' + (singleObject['TREE_ID'])).append(columnsPrepareTd);
                     } else {
                         var oDate = singleObject[columns[z].FIELDNAME];
                         if (oDate != undefined) {
                             if (oDate != "") {
                                 var limiter = oDate.match(/\-|\*|\.|\,|\-|\//); //supports / , . * -
                                 self.reqdate = self.convertToRequiredFormat(limiter, oDate);
                             } else {
                                 self.reqdate = '';
                             }
                         } else {
                             self.reqdate = '';
                         }
                         var columnsPrepareTd = templates.columnsPrepareTd;
                         columnsPrepareTd = columnsPrepareTd.replace("{{colData}}", self.reqdate);
                         $('#' + functionFrom + 'Tree table tbody tr.treegrid-' + (singleObject['TREE_ID'])).append(columnsPrepareTd);
                     }
                 } else{
             
                     var columnsPrepareTd = templates.columnsPrepareTd;
                     columnsPrepareTd = columnsPrepareTd.replace("{{colData}}", singleObject[columns[z].FIELDNAME]);
                     $('#' + functionFrom + 'Tree table tbody tr.treegrid-' + (singleObject['TREE_ID'])).append(columnsPrepareTd);
               
                	 
                 }
        		 
        		 
        		 
        	 }
        	  }
    	
    }    
//
    ganttChart.prototype.columnsPrepare = function(singleObject, functionFrom, columns) {
        var templates = self.templates;
        var columnsPrepareTr = templates.columnsPrepareTr;
        columnsPrepareTr = columnsPrepareTr.replace("{{ID}}", (singleObject['TREE_ID']))
        $('#' + functionFrom + 'Tree table tbody').append(columnsPrepareTr);
        for (var z = 0; z < columns.length; z++) {
            if (singleObject.TREE_PARENTID == 'null') { /////specifies it is parent level
                var columnsPrepareTd = templates.columnsPrepareTd;
                if (z == 0) {
                	columnsPrepareTd = columnsPrepareTd.replace("{{colData}}", singleObject['DOCID']);
                } else {
              //added for promos having parent id null and DATAB DATBI configurd   
                	if (columns[z].FIELDNAME == 'DATAB' || columns[z].FIELDNAME == 'DATBI') { // since if we change in object,its effecting ovearll objectDATAB DATBI
                        if (singleObject[columns[z].FIELDNAME] == undefined) {
                            var columnsPrepareTd = templates.columnsPrepareTd;
                            columnsPrepareTd = columnsPrepareTd.replace("{{colData}}", '');
                        } else {
                            var oDate = singleObject[columns[z].FIELDNAME];
                            if (oDate != undefined) {
                                if (oDate != "") {
                                    var limiter = oDate.match(/\-|\*|\.|\,|\-|\//); //supports / , . * -
                                    self.reqdate = self.convertToRequiredFormat(limiter, oDate);
                                } else {
                                    self.reqdate = '';
                                }
                            } else {
                                self.reqdate = '';
                            }
                            var columnsPrepareTd = templates.columnsPrepareTd;
                            columnsPrepareTd = columnsPrepareTd.replace("{{colData}}", self.reqdate);
                        }
                    }else{
                    	var columnsPrepareTd = templates.columnsPrepareTd;
                        columnsPrepareTd = columnsPrepareTd.replace("{{colData}}", singleObject[columns[z].FIELDNAME]);
                    }
           // added to here     	
                	
                }
                $('#' + functionFrom + 'Tree table tbody tr.treegrid-' + (singleObject['TREE_ID'])).append(columnsPrepareTd);
            } else {
                if (columns[z].FIELDNAME == 'DATAB' || columns[z].FIELDNAME == 'DATBI') { // since if we change in object,its effecting ovearll objectDATAB DATBI
                    if (singleObject[columns[z].FIELDNAME] == undefined) {
                        var columnsPrepareTd = templates.columnsPrepareTd;
                        columnsPrepareTd = columnsPrepareTd.replace("{{colData}}", '');
                        $('#' + functionFrom + 'Tree table tbody tr.treegrid-' + (singleObject['TREE_ID'])).append(columnsPrepareTd);
                    } else {
                        var oDate = singleObject[columns[z].FIELDNAME];
                        if (oDate != undefined) {
                            if (oDate != "") {
                                var limiter = oDate.match(/\-|\*|\.|\,|\-|\//); //supports / , . * -
                                self.reqdate = self.convertToRequiredFormat(limiter, oDate);
                            } else {
                                self.reqdate = '';
                            }
                        } else {
                            self.reqdate = '';
                        }
                        var columnsPrepareTd = templates.columnsPrepareTd;
                        columnsPrepareTd = columnsPrepareTd.replace("{{colData}}", self.reqdate);
                        $('#' + functionFrom + 'Tree table tbody tr.treegrid-' + (singleObject['TREE_ID'])).append(columnsPrepareTd);
                    }
                } else if (singleObject['DOCID'] != "" && columns[z].FIELDNAME == columns[0].FIELDNAME) {
                    var colData = templates.colPrepareCheckbox
                    colData = colData.replace('{{ID}}', singleObject['TREE_ID']).replace('{{colName}}', singleObject[columns[z].FIELDNAME]);
                    $('#' + functionFrom + 'Tree table tbody tr.treegrid-' + (singleObject['TREE_ID'])).append(colData);
                } else {
                    var columnsPrepareTd = templates.columnsPrepareTd;
                    columnsPrepareTd = columnsPrepareTd.replace("{{colData}}", singleObject[columns[z].FIELDNAME]);
                    $('#' + functionFrom + 'Tree table tbody tr.treegrid-' + (singleObject['TREE_ID'])).append(columnsPrepareTd);
                }
            }
        }
    }
    ganttChart.prototype.prepareLinks = function() {
        if (self.data_s.length > 0) {
            var objectsWithKnuma = underscoreJS.reject(self.data_p, {
                "REFERENCE": ""
            });
            for (var i = 0; i < objectsWithKnuma.length; i++) {
                var reqobjects = underscoreJS.filter(self.data_s, {
                    "REFERENCE": objectsWithKnuma[i].REFERENCE
                });
                for (var j = 0; j < reqobjects.length; j++) {
                    Ganttalendar.prototype.drawLink(
                        $("#primaryChartTableBody #righttable--" + (objectsWithKnuma[i].TREE_ID)).data({
                            'id': objectsWithKnuma[i].DOCID,
                            'RenderID': objectsWithKnuma[i].TREE_ID
                        }),
                        $("#primaryChartTableBody #righttable--" + reqobjects[j].TREE_ID).data({
                            'id': reqobjects[j].DOCID,
                            'RenderID': reqobjects[j].TREE_ID
                        }),
                        "")
                }
            }
        }
    }
    ganttChart.prototype.getChartPrepare = function(from, to) {
        console.log(' Start of GetChartPrepare');
        //self.control.addBusyIndicator()
        var reqObject = self.CALENDARSETTINGS;
        self.originalThwidth = self.scale['w' + (self.CALENDARSETTINGS.ZOOMCOUNT)];
        $('g').remove();
        $('#primaryChartTableBody .gantt.unselectable.hasSVG').remove();
        self.getChartViewContent()
        if (self.searchText) {
            self.filterTasks(self.searchText)
        }
        
        //self.control.removeBusyIndicator()
    }
    ganttChart.prototype.performOverLappingFunction = function(obj, i, from) {
        var presentObj = obj;
        if (from == 'primaryChart') {
            var prevObj = self.bufferedTreeData[i - 1];
        } else {
            var prevObj = self.bufferedRequestData[i - 1];
        }
        if (prevObj != undefined) {
            if (new Date(prevObj.END) > new Date(presentObj.START)) {
                self.newArr = [];
                self.newArr.push(presentObj);
                return true;
            } else {
                return false;
            }
        } else {
            self.newArr = [];
            self.newArr.push(presentObj)
            return true;
        }
    }
    /*ganttChart.prototype.addExtraTreeColumn = function() {
        if (self.columns_p.length == $('#primaryChartTreeHead table tr td').length) {
            $('#primaryChartTreeHead table tr').prepend(self.templates.extraColumnHead)
            if (self.document_mode != "A") {
                $('#primaryChartTreeBody table tr').prepend(self.templates.extraColumnBodyEditMode)
            } else {
                $('#primaryChartTreeBody table tr').prepend(self.templates.extraColumnBody)
            }
            $($('#primaryChartTreeHead table tr td:nth-child(2) div')[1]).remove(); //removing resizable-w handle
            $('#primaryChartTreeBody tr').each(function() {
                if ($(this).hasClass('treegrid-expanded')) {
                    if (isNaN(Number(this.children[1].innerText))) {
                        this.children[0].innerHTML = ""
                    }
                }
            })
        }
        $('#secondaryChartTreeHead table tr').prepend(self.templates.extraColumnHead)
        if (self.document_mode != "A") {
            $('#secondaryChartTreeBody table tr').prepend(self.templates.extraColumnBodyEditMode)
        } else {
            $('#secondaryChartTreeBody table tr').prepend(self.templates.extraColumnBody)
        }
        $($('#secondaryChartTreeHead table tr td:nth-child(2) div')[1]).remove(); //removing resizable-w handle
        $('#secondaryChartTreeBody tr').each(function() {
            if ($(this).hasClass('treegrid-expanded')) {
                if (isNaN(Number(this.children[1].innerText))) {
                    this.children[0].innerHTML = ""
                }
            }
        })
        $('[id*=faeye]').off('click').on('click', function(e) {
            var id = "000" + this.parentElement.parentElement.getAttribute('class').split('-')[1];
            var treeId = id.slice(0, 4);
            var obj = underscoreJS.find(self.data_p, {
                "TREE_ID": treeId
            });
            self.control.openAdditionalInfo(obj);
        })
    }*/
    ganttChart.prototype.preparePopover = function() {
        $('#popoverContent').empty();
        var leftForPopover = self.appToolbarWidth - $('#popoverDiv').width();
        $("#angleLeftPopover").css({
            'position': 'absolute',
            'z-index': ' 999',
            'height': '26px',
            'width': '30px',
            'margin-top': '-3px',
            'background': 'rgb(114, 158, 182)'
        })
        var htmlContent = "";
        var counter = 0;
        var dummyEventsArr = [];
        var requiredLevel;
        var idxCount = 0;
        for (var c = 0; c < 2; c++) {
            if (c == 0) {
                requiredLevel = underscoreJS.find(self.levels_p, {
                    "TEXT": self.scale[(self.CALENDARSETTINGS.ZOOMCOUNT)]
                }); //gives year, half year 
                dummyEventsArr.push(self.events_p);
                dummyEventsArr = underscoreJS.flatten(dummyEventsArr);
            } else {
                requiredLevel = underscoreJS.find(self.levels_s, {
                    "TEXT": self.scale[(self.CALENDARSETTINGS.ZOOMCOUNT)]
                }); //gives year, half year 
                var temp = [];
                var temp = self.events_s;
                dummyEventsArr = [];
                for (var x = ((temp.length) - 1); x >= 0; x--) {
                    var obj = underscoreJS.filter(self.events_p, {
                        "RENDEREDID": temp[x].RENDEREDID,
                    })
                    if (underscoreJS.isEmpty(obj)) {
                        dummyEventsArr.push(temp[x]);
                    }
                }
                dummyEventsArr = underscoreJS.flatten(dummyEventsArr);
            }
            if (requiredLevel) {
                for (var i = 0; i < requiredLevel.DTLS.length; i++) {
                    var endDateInLevels = new Date(requiredLevel.DTLS[i].BISTG);
                    var startDateInLevels = new Date(requiredLevel.DTLS[i].VONTG);
                    if (requiredLevel.DTLS[i - 1]) {
                        var previousYear = new Date(requiredLevel.DTLS[i - 1].BISTG);
                        var presentYear = new Date(requiredLevel.DTLS[i].BISTG);
                        var eventsArr = underscoreJS.filter(dummyEventsArr, function(f, ind, l) {
                            return (new Date(f.END).setHours(5, 30, 0, 0) > previousYear) && (new Date(f.END).setHours(5, 30, 0, 0) <= presentYear);
                        });
                    } else {
                        var eventsArr = underscoreJS.filter(dummyEventsArr, function(f, ind, l) {
                            return (new Date(f.END).setHours(5, 30, 0, 0) <= endDateInLevels) && (new Date(f.START).setHours(5, 30, 0, 0) >= startDateInLevels)
                        }); //works for 2015  //for first
                    }
                    if (eventsArr.length > 0) {
                        var popoverTemplateMultipleContent = self.templates.popoverTemplateMultipleContent;
                        popoverTemplateMultipleContent = popoverTemplateMultipleContent.replace('{{IDX}}', i).replace('{{IDX}}', i).replace('{{heightValue}}', (eventsArr.length * 125));
                        var popoverTemplateLeftBar = self.templates.popoverTemplateLeftBar;
                        popoverTemplateLeftBar = popoverTemplateLeftBar.replace("{{heightValue}}", (eventsArr.length * 125)).replace("{{IDX}}", i).replace('{{IDX}}', i).replace('{{pMarginTopValue}}', (eventsArr.length * 125) / 2).replace('{{periodName}}', requiredLevel.DTLS[i].DESCR);
                        $('#popoverContent').append(popoverTemplateMultipleContent);
                        var content = '';
                        for (var j = 0; j < eventsArr.length; j++) {
                            var oDate = eventsArr[j].START;
                            var limiter = oDate.match(/\-|\*|\.|\,|\-|\//); //supports / , . * -
                            var reqdate = self.convertToRequiredFormat(limiter, oDate);
                            var oDate1 = eventsArr[j].END;
                            var limiter1 = oDate1.match(/\-|\*|\.|\,|\-|\//); //supports / , . * -
                            var duration = self.getSpan(new Date(oDate), new Date(oDate1)) + 1;
                            var reqdate1 = self.convertToRequiredFormat(limiter1, oDate1);
                            var popoverTemplateRightBar = self.templates.popoverTemplateRightBar
                            popoverTemplateRightBar = popoverTemplateRightBar.replace("{{topValue}}", j * 125)
                                .replace('{{start}}', reqdate)
                                .replace('{{end}}', reqdate1)
                                .replace('{{idx}}', eventsArr[j].RENDEREDID)
                                .replace("{{duration}}", (duration > 1) ? (duration + ' Days') : (duration + ' Day'))
                                .replace('{{eventName}}', eventsArr[j].NAME)
                                .replace('{{eventColorDisplay}}', eventsArr[j].COLOR)
                            /*
                            added here*/
                            if (j != 0) {
                                popoverTemplateRightBar = popoverTemplateRightBar + "<hr style=top:" + ((j * 125) - 15) + "px>"
                            }
                            content = content + popoverTemplateRightBar;
                            idxCount = idxCount + 1;
                        }
                        $("#multipleContentDiv--" + i + ":nth-last-child(1)").append(popoverTemplateLeftBar + content);
                    }
                }
            }
        }
        if (!self.INTERNALSETTINGSFORCALENDAR.SWITCHSTATE) {
            $('#popoverDiv').hide();
            $('[id*=eventsDiv]').css('visibility','hidden');
        }
        $('[id*=eventName] a').click(function() {
            var event = this.parentElement.parentElement.getAttribute('id').split('--')[1];
            var obj = underscoreJS.find(self.events_p, {
                'RENDEREDID': event
            });
            if (obj) {
                var indexInEvents = obj.RENDEREDID;
                var selectedEvent = Number($('#primaryChartTableBody #event--' + indexInEvents + '').css('left').slice(0, -2)) - 10;
                $('#primaryChartTableBody').animate({
                    scrollLeft: selectedEvent + 'px'
                });
                $('#primaryChartTableBody #eventsDiv').css('visibility','visible');
                $('#primaryChartTableBody #event--' + indexInEvents + '').effect('highlight', {
                    "color": 'yellow'
                }, 4000);
            }
            if (self.secondInstanceExists == "X") {
                var obj = underscoreJS.find(self.events_s, {
                    'RENDEREDID': event
                });
                if (obj) {
                    var indexInEvents = obj.RENDEREDID;
                    var selectedEvent = Number($('#secondaryChartTableBody #event--' + indexInEvents + '').css('left').slice(0, -2)) - 10;
                    $('#secondaryChartTableBody').animate({
                        scrollLeft: selectedEvent + 'px'
                    });
                    $('#secondaryChartTableBody #eventsDiv').css('visibility','visible');
                    $('#secondaryChartTableBody #event--' + indexInEvents + '').effect('highlight', {
                        "color": 'yellow'
                    }, 4000);
                }
            }
            $(this).parent().effect('highlight', {
                "color": 'yellow'
            }, 4000);
        })
    }
    ganttChart.prototype.toggleBothCharts = function() {
        if ($('#primaryChartTree').is(':visible') || $('#secondaryChartTree').is(':visible')) {
            $('#primaryChartTree,#secondaryChartTree').hide();
            $('#primaryChart #splitterDiv,#secondaryChart #splitterDiv').css('left', '0px') /*.draggable('disable')*/ ;
            $('#primaryChartTable,#secondaryChartTable').css('margin-left', '0px');
            $('#primaryChartTable,#secondaryChartTable').css('left', $('#splitterDiv').width() + 'px');
            $('#primaryChartTable,#secondaryChartTable').width($('#calendarComponent').width());
            $('#primaryChartTableBody,#secondaryChartTableBody').width($('#calendarComponent').width() - 10)
            self.hideTree = true;
            self.hideTree1 = true;
            $('#primaryChart #circleLeft,#secondaryChart #circleLeft').prop('class', 'fa fa-arrow-circle-right')
        } else {
            $('#primaryChartTree,#secondaryChartTree').show();
            $('#primaryChart #circleLeft,#secondaryChart #circleLeft').prop('class', 'fa fa-arrow-circle-left')
            $('#primaryChart #splitterDiv,#secondaryChart #splitterDiv').draggable('enable');
            $('#primaryChartTable,#secondaryChartTable').css('left', $('#primaryChartTree').width() + $('#primaryChart #splitterDiv').width())
            $('#primaryChart #splitterDiv,#secondaryChart #splitterDiv').css('left', $('#primaryChartTree').width());
            $('#primaryChartTableBody,#secondaryChartTableBody').width($('#calendarComponent').width() - $('#primaryChartTree').width() - $('#splitterDiv').width())
            $('#primaryChartTreeHead #headerWrapper').css({
                "width": $('#primaryChartTreeHead table').width()
            })
            $('#secondaryChartTreeHead #headerWrapper').css({
                "width": $('#secondaryChartTreeHead table').width()
            })
            self.hideTree1 = false
            self.hideTree = false
        }
    }

    ganttChart.prototype.togglePrimaryChart=function() {
        if ($('#primaryChartTree').is(':visible')) {
            $('#primaryChartTree').hide();
            $('#primaryChart #splitterDiv').css('left', '0px') /*.draggable('disable')*/ ;
            $('#primaryChartTable').css('margin-left', '0px');
            $('#primaryChartTable').css('left', $('#splitterDiv').width() + 'px');
            $('#primaryChartTable').width($('#calendarComponent').width());
            $('#primaryChartTableBody').width($('#calendarComponent').width() - 10)
            $('#primaryChart #circleLeft').prop('class', 'fa fa-arrow-circle-right')
            self.hideTree = true
        } else {
            $('#primaryChartTree').show();
            $('#primaryChart #circleLeft').prop('class', 'fa fa-arrow-circle-left')
            $('#primaryChart #splitterDiv').draggable('enable');
            $('#primaryChartTable').css('left', $('#primaryChartTree').width() + $('#primaryChart #splitterDiv').width())
            $('#primaryChart #splitterDiv').css('left', $('#primaryChartTree').width());
            $('#primaryChartTableBody').width($('#calendarComponent').width() - $('#primaryChartTree').width() - $('#splitterDiv').width())
            $('#primaryChartTreeHead #headerWrapper').css({
                "width": $('#primaryChartTreeHead table').width()
            });
            self.hideTree = false;
        }
    }

    ganttChart.prototype.toggleSecondaryChart=function() {
        if ($('#secondaryChartTree').is(':visible')) {
            $('#secondaryChartTree').hide();
            $('#secondaryChart #splitterDiv').css('left', '0px') /*.draggable('disable')*/ ;
            $('#secondaryChartTable').css('margin-left', '0px');
            $('#secondaryChartTable').css('left', $('#secondaryChart #splitterDiv').width() + 'px');
            $('#secondaryChartTable').width($('#calendarComponent').width());
            $('#secondaryChartTableBody').width($('#calendarComponent').width() - 10);
            $('#secondaryChart #circleLeft').prop('class', 'fa fa-arrow-circle-right');
            self.hideTree1 = true;
        } else {
            $('#secondaryChartTree').show();
            $('#secondaryChart #circleLeft').prop('class', 'fa fa-arrow-circle-left')
            $('#secondaryChart #splitterDiv').draggable('enable');
            $('#secondaryChartTable').css('left', $('#secondaryChartTree').width() + $('#secondaryChart #splitterDiv').width())
            $('#secondaryChart #splitterDiv').css('left', $('#secondaryChartTree').width());
            $('#secondaryChartTableBody').width($('#calendarComponent').width() - $('#secondaryChartTree').width() - $('#secondaryChart #splitterDiv').width())
            $('#secondaryChartTreeHead #headerWrapper').css({
                "width": $('#secondaryChartTreeHead table').width()
            })
            self.hideTree1 = false;
        }
    }

    ganttChart.prototype.toggleEvents=function() {
        if ($('#popoverDiv').is(":visible")) {
            $('#popoverDiv').hide("slide", {
                direction: "right"
            }, 600);
            self.INTERNALSETTINGSFORCALENDAR.SWITCHSTATE = false;
        } else {
            $('#popoverDiv').show("slide", {
                direction: "right"
            }, 600);
            self.INTERNALSETTINGSFORCALENDAR.SWITCHSTATE = true;
        }
    }

    ganttChart.prototype.toggleCalendar=function() {
        if (!$("body").hasClass("caltoggle")) {
            $("body").addClass("caltoggle");
            $("#primaryChartTree, #primaryChartTreeHead, #primaryChartTreeHead table, #primaryChartTreeBody, #primaryChartTreeBody table").css("width", "600px");
            $("#primaryChartTree").show();
            $("#primaryChart #splitterDiv").css("left", "600px");
            $("#primaryChartTable").css("left", "606px");
            $("#primaryChartTable, #primaryChartTableBody").width($('#primaryChart').width() - $('#primaryChart #splitterDiv').width() - $('#primaryChartTree').width())
            $("#primaryChartTable").css("margin-left", "0px");
            //added for secondary chary
            $("#secondaryChartTree, #secondaryChartTreeHead, #secondaryChartTreeHead table, #secondaryChartTreeBody, #secondaryChartTreeBody table").css("width", "600px");
            $("#secondaryChartTree").show();
            $("#secondaryChart #splitterDiv").css("left", "600px");
            $("#secondaryChartTable").css("left", "606px");
            $("#secondaryChartTable, #secondaryChartTableBody").width($('#secondaryChart').width() - $('#secondaryChart #splitterDiv').width() - $('#secondaryChartTree').width())
            $("#secondaryChartTable").css("margin-left", "0px");
        } else {
            $("body").removeClass("caltoggle");
            $("#primaryChartTree, #primaryChartTreeHead, #primaryChartTreeHead table, #primaryChartTreeBody, #primaryChartTreeBody table").css("width", "270px");
            $("#primaryChartTree").show();
            $("#primaryChart #splitterDiv").css("left", "270px");
            $("#primaryChartTable").css("left", "276px");
            $("#primaryChartTable").css("margin-left", "0px");
            $("#primaryChartTable, #primaryChartTableBody").width($('#primaryChart').width() - $('#primaryChart #splitterDiv').width() - $('#primaryChartTree').width())
            //added for secondary chary
            $("#secondaryChartTree, #secondaryChartTreeHead, #secondaryChartTreeHead table, #secondaryChartTreeBody, #secondaryChartTreeBody table").css("width", "270px");
            $("#secondaryChartTree").show();
            $("#secondaryChart #splitterDiv").css("left", "270px");
            $("#secondaryChartTable").css("left", "276px");
            $("#secondaryChartTable").css("margin-left", "0px");
            $("#secondaryChartTable, #secondaryChartTableBody").width($('#secondaryChart').width() - $('#secondaryChart #splitterDiv').width() - $('#secondaryChartTree').width())
        }
    }

    ganttChart.prototype.hideTreeGroup = function() {
        var reqObject = self.CALENDARSETTINGS;
        if (!reqObject.OVERLAPMODE) { // not in overlap mode
            var hiddenElements = underscoreJS.filter(underscoreJS.union(self.data_p, self.data_s), {
                'EXPANDED': false
            })
            for (var z = 0; z < hiddenElements.length; z++) {
                $('#secondaryChart tr.treegrid-parent-' + hiddenElements[z].TREE_ID + '').hide();
                $('#primaryChart tr.treegrid-parent-' + hiddenElements[z].TREE_ID + '').hide()
            }
            var selectedelements = underscoreJS.filter(underscoreJS.union(self.data_p, self.data_s), {
                "SELECTED": true
            })
            for (var z = 0; z < selectedelements.length; z++) {
                $('#checkbox--' + selectedelements[z].TREE_ID + ' input').attr('checked', 'true')
                $('.treegrid-' + selectedelements[z].TREE_ID + '').addClass('rowColor')
            }
        } else {
            var hiddenElements = underscoreJS.filter(underscoreJS.union(self.data_p, self.data_s), function(f, i, l) {
                return f.EXPANDED == false && f.REFERENCE == '' && f.TREE_PARENTID == 'null' // works for trade calendar
            })
            for (var z = 0; z < hiddenElements.length; z++) {
                if ($('.treegrid-' + hiddenElements[z].TREE_ID + '').hasClass('treegrid-collapsed')) {
                    $('#secondaryChartTable tr.treegrid-parent-' + hiddenElements[z].TREE_ID + '').hide();
                    $('#primaryChartTable tr.treegrid-parent-' + hiddenElements[z].TREE_ID + '').hide()
                }
            }
        }
    }
    ganttChart.prototype.commonFunctions = function() {
        var reqObject = self.CALENDARSETTINGS;
        self.resizingDragFunc();
        self.eventsRegister();
        self.tooltipFunctions();
        if (self.noChilds && reqObject.OVERLAPMODE) {
            self.hideTree = true;
            $('#primaryChart #circleLeft').hide();
        }
        if (self.noChilds1 && reqObject.OVERLAPMODE) {
            self.hideTree1 = true;
            $('#secondaryChart #circleLeft').hide();
        }
        self.onClickOkSettings();
        if (self.document_mode != 'A') {
            $('#calendarComponent td .checkbox').css('display', 'inline')
        } else {
            $('#calendarComponent td .checkbox').hide();
        }
        if ((new Date(self.start_p).getTime() == new Date(self.start_s).getTime()) && (new Date(self.end_p).getTime() == new Date(self.end_s).getTime())) {
            $('#secondaryChartTable').width($('#primaryChartTable').width());
            if ($('#primaryChart').is(':visible')) {
                $('#secondaryChartTable').css('left', $('#primaryChartTable').css('left').slice(0, -2) + 'px');
                $('#secondaryChartTable').css('margin-left', $('#primaryChartTable').css('margin-left').slice(0, -2) + 'px')
                $('#secondaryChartTableBody').css('left', $('#primaryChartTableBody').css('left').slice(0, -2) + 'px');
            }
        }
        if (reqObject.OVERLAPMODE) {
            $('#primaryChartTree ' + '[class*=treegrid-parent-] .treegrid-expander.glyphicon').hide()
            $('#secondaryChartTree ' + '[class*=treegrid-parent-] .treegrid-expander.glyphicon').hide()
        } else {
            $('#secondaryChartTree ' + '[class*=treegrid-parent-] .treegrid-expander.glyphicon').show()
            $('#primaryChartTree ' + '[class*=treegrid-parent-] .treegrid-expander.glyphicon').show()
        }
        $('#secondaryChart #clockDiv').height($('#secondaryChartTableBody table').height())
        $('#primaryChart #clockDiv').height($('#primaryChartTableBody table').height())
        self.renderFirstTime = false;
        $("#popoverDiv #angleRight").off('click').on('click', function(e) {
            $('#popoverDiv').hide("slide", {
                direction: "right"
            }, 600);
            $('#primaryChartTableBody #eventsDiv').css('visibility','hidden');
            $('#secondaryChartTableBody #eventsDiv').css('visibility','hidden');
            self.INTERNALSETTINGSFORCALENDAR.SWITCHSTATE = false;
        })
        $("#angleLeftPopover").off('click').on('click', function(e) {
            $('#popoverDiv').show("slide", {
                direction: "right"
            }, 600);
            $('#primaryChartTableBody #eventsDiv').css('visibility','visible');
            $('#secondaryChartTableBody #eventsDiv').css('visibility','visible');
            self.INTERNALSETTINGSFORCALENDAR.SWITCHSTATE = true;
        })
        setTimeout(function() {
            if ($('#calendarComponent').position()) {
                $('#popoverDiv').css({
                    'left': ($('#calendarComponent').position().left + $("#calendarComponent").width() - $("#popoverDiv").width()) + 'px',
                    'margin-top': '-3px'
                });
                $("#angleLeftPopover").css('left', ($('#calendarComponent').position().left + $("#calendarComponent").width() - $("#angleLeftPopover").width()) + 'px');
            }
        }, 500)
        $('[id*=divDescr] p').off('mouseenter').on('mouseenter', function(e) {
            var divWidth = $(this).parent().parent().width();
            var pWidth = $(this).width();
            if (pWidth > divWidth) {
                $(this).css({
                    'transition': 'margin-left 18s',
                    '-webkit-transition': ' margin-left 18s',
                    'margin-left': -divWidth + 15 + 'px'
                })
            }
        })
        $('[id*=divDescr] p').off('mouseleave').on('mouseleave', function(e) {
            var divWidth = $(this).parent().parent().width();
            var pWidth = $(this).width();
            if (pWidth > divWidth) {
                $(this).css({
                    'margin-left': '0px',
                    'transition': 'margin-left 0s',
                    '-webkit-transition': ' margin-left 0s'
                });
            }
        })
        //-----------------------    
        if (underscoreJS.isEmpty(self.events_p)) {
            $('#calendarComponent #popoverDiv,#angleLeftPopover').hide();
            $('#calendarComponent #primaryChart #eventsDiv').css('visibility','hidden');
        } else if (underscoreJS.isEmpty(self.events_s)) {
            $('#calendarComponent #secondaryChart #eventsDiv').css('visibility','hidden');
        }
        $('.powertip').powerTip({
            placement: 'n',
            followMouse: true
        });
        setTimeout(function() {
            if ($('#calendarComponent').position()) {
                $('#popoverDiv').css({
                    'left': ($('#calendarComponent').position().left + $("#calendarComponent").width() - $("#popoverDiv").width()) + 'px',
                    'margin-top': '-3px'
                });
                $("#angleLeftPopover").css('left', ($('#calendarComponent').position().left + $("#calendarComponent").width() - $("#angleLeftPopover").width()) + 'px');
            }
        }, 700)
        console.log('end of getchart prepatre')
    }
    ganttChart.prototype.prepareSecondInstance = function() {
        var reqObject = self.CALENDARSETTINGS;
        var from = new Date(self.start_s)
        var to = new Date(self.end_s)
        if (self.renderFirstTime) {
            $('#calendarComponent #secondaryChartTable').remove();
            $('#calendarComponent').append(self.templates.secondondaryChart);
            $('#calendarComponent #secondaryChart').append(self.templates.secondondaryChartTree);
            $('#calendarComponent #secondaryChart').append(self.templates.secondondaryChartTable);
            $('#secondaryChartTree').append(self.templates.secondondaryChartTreeHead);
            $('#secondaryChartTree').append(self.templates.secondaryChartTreeBody);
            $('#secondaryChartTable').append(self.templates.secondaryChartTableHead);
            $('#secondaryChartTable').append(self.templates.secondaryChartTableBody);
            $('#secondaryChart').width($("#primaryChart").width());
            $('#secondaryChartTable').width($('#secondaryChart').width() - $('#secondaryChartTree').width());
            var secondaryChartEventsDiv = self.templates.secondaryChartEventsDiv;
            $('#secondaryChartTableBody').append(secondaryChartEventsDiv);
            var secondaryChartTableBodyTableContent = self.templates.secondaryChartTableBodyTableContent;
            $('#secondaryChartTableBody').append(secondaryChartTableBodyTableContent);
            var secondaryChartClockDiv = self.templates.secondaryChartClockDiv;
            $('#secondaryChartTableBody').append(secondaryChartClockDiv);
        }
        if ((new Date(self.start_p).getTime() == new Date(self.start_s).getTime()) && (new Date(self.end_p).getTime() == new Date(self.end_s).getTime())) {
            $('#secondaryChartTableHead table thead').empty()
            $('#secondaryChartTableHead table thead').append($('#primaryChartTableHead table thead').html()) /// if same time scale no need to perform logic
            $('#secondaryChart #eventsDiv').empty();
            $('#secondaryChart #eventsDiv').append($('#primaryChart #eventsDiv').html())
            $('#secondaryChart #eventsDiv').css({
                'height': $('#primaryChart #eventsDiv').height(),
                'width': $('#primaryChart #eventsDiv').width()
            })
        } else {
            self.headerPrepare(from, to, self.scale[self.CALENDARSETTINGS.ZOOMCOUNT], "secondaryChart", self.levels_s)
            self.headerPrepare(from, to, self.scale[self.CALENDARSETTINGS.ZOOMCOUNT + 1], "secondaryChart", self.levels_s)
            self.eventsPrepare(from, to, "secondaryChart", self.events_s);
        }
        var span = self.getSpan(from, to) + 1;
        $("#secondaryChartTable table").width((span * self.originalThwidth))
        var functionFrom = 'secondaryChart';
        if (!(new Date(self.start_p).getTime() == new Date(self.start_s).getTime()) && (new Date(self.end_p).getTime() == new Date(self.end_s).getTime())) {
            $('#secondaryChart #splitterDiv').remove();
        }
        var splitter = self.templates.secondaryChartSplitterDiv;
        $('#secondaryChart').append(splitter);
        if (!$("#secondaryChartTree").is(':visible')) {
            $("#secondaryChart #circleLeft").prop('class', 'fa fa-arrow-circle-right');
        }
        for (var i = 0; i < self.data_s.length; i++) {
            if (self.data_s[i].EXPANDED == false && reqObject.OVERLAPMODE) {
                id = self.data_s[i].TREE_ID;
                var from = new Date(self.start_s);
                var to = new Date(self.end_s);
                var span = self.getSpan(from, to) + 1;
                if (self.data_s[i].TREE_PARENTID == 'null' && $('.treegrid-' + id).hasClass('treegrid-collapsed')) {
                    var parentNullTemplateNodiv = self.templates.parentNullTemplateNodiv;
                    parentNullTemplateNodiv = parentNullTemplateNodiv.replace('{{parentClass}}', (self.data_s[i].TREE_ID))
                        .replace('{{span}}', span)
                    $('#secondaryChartTable table tbody').append(parentNullTemplateNodiv);
                }
                if (self.noChilds1) {
                    self.bufferedRequestData = [];
                    underscoreJS.filter(self.data_s, function(f, i, l) {
                        if (f.REFERENCE != '') {
                            self.bufferedRequestData.push(f)
                        }
                    })
                    self.bufferedRequestData.sort(function(a, b) {
                        return (new Date(a['START']) - new Date(b['START'])) && (new Date(a['END']) - new Date(b['END']))
                    })
                } else {
                    var elements = underscoreJS.filter(self.data_s, {
                        "TREE_PARENTID": id
                    })
                    self.bufferedRequestData = [];
                    underscoreJS.filter(elements, function(f, i, l) {
                        if (f.REFERENCE != '') {
                            self.bufferedRequestData.push(f)
                        }
                    })
                    self.bufferedRequestData.sort(function(a, b) {
                        return (new Date(a['START']) - new Date(b['START'])) && (new Date(a['END']) - new Date(b['END']))
                    })
                }
                if (self.renderFirstTime) {
                    self.columnsDataPrepare('treegrid-' + id + ' treegrid-parent-' + self.data_s[i].TREE_PARENTID + ' treegrid-parent-' + self.data_s[i].TREE_PARENTID, self.data_s[i], functionFrom, self.columns_s);
                }
                for (var k = 0; k < self.bufferedRequestData.length; k++) {
                    var startDate = new Date(self.bufferedRequestData[k].START);
                    var dspan = (self.getSpan(from, startDate) == 0) ? (self.getSpanForBuffer(from, startDate)) : self.getSpan(from, startDate);
                    var thwidth = self.originalThwidth; //gives each span width;
                    var leftValue = dspan * self.originalThwidth;
                    var endDate = new Date(self.bufferedRequestData[k].END);
                    var dspan1 = self.getSpan(from, endDate) + 1;
                    var width = (dspan1 * self.originalThwidth) - leftValue;
                    var performedFlag = self.performOverLappingFunction(self.bufferedRequestData[k], k, functionFrom);
                    var title = self.bufferedRequestData[k].DOCID;
                    var obj = underscoreJS.findWhere(self.barData_s, {
                        'DOCID': title
                    });
                    if (obj) {
                        obj = obj.DESCR
                    } else {
                        obj = ""
                    }
                    if (performedFlag) {
                        var overlapParentNullTemplate = self.templates.overlapParentNullTemplate;
                        overlapParentNullTemplate = overlapParentNullTemplate.replace("{{parentClass}}", (self.bufferedRequestData[k].TREE_ID) + ' treegrid-parent-' + id + ' treegrid-parent-' + underscoreJS.find(self.data_s, {
                                'TREE_ID': id
                            }).TREE_PARENTID)
                            .replace("{{span}}", span)
                            .replace("{{ID}}", (self.bufferedRequestData[k].TREE_ID))
                            .replace("{{ID}}", (self.bufferedRequestData[k].TREE_ID))
                            .replace("{{leftValue}}", leftValue)
                            .replace("{{width}}", width)
                            .replace("{{divColor}}", (self.bufferedRequestData[k].COLOR))
                            .replace("{{startDateValue}}", self.genericDateFunction(new Date((self.bufferedRequestData[k].START))))
                            .replace("{{obj}}", obj)
                            .replace("{{obj}}", obj)
                            .replace("{{divEndLeftValue}}", width)
                            .replace("{{borderColor}}", (self.bufferedRequestData[k].COLOR))
                            .replace("{{borderColor}}", (self.bufferedRequestData[k].COLOR))
                            .replace("{{circleBaseLeft}}", width - $('.circleBase.type2').outerWidth())
                            .replace("{{endDateValue}}", self.genericDateFunction(new Date((self.bufferedRequestData[k].END))))
                        $('#secondaryChartTable table tbody').append(overlapParentNullTemplate);
                    } else {
                        var overlapDivContent = self.templates.overlapDivContent;
                        overlapDivContent = overlapDivContent.replace("{{ID}}", (self.bufferedRequestData[k].TREE_ID))
                            .replace("{{ID}}", (self.bufferedRequestData[k].TREE_ID))
                            .replace("{{leftValue}}", leftValue)
                            .replace("{{width}}", width)
                            .replace("{{divColor}}", (self.bufferedRequestData[k].COLOR))
                            .replace("{{startDateValue}}", self.genericDateFunction(new Date((self.bufferedRequestData[k].START))))
                            .replace("{{objData}}", obj)
                            .replace("{{objData}}", obj)
                            .replace("{{divEndLeftValue}}", width)
                            .replace("{{borderColor}}", (self.bufferedRequestData[k].COLOR))
                            .replace("{{borderColor}}", (self.bufferedRequestData[k].COLOR))
                            .replace("{{circleBaseLeft}}", width - $('.circleBase.type2').outerWidth())
                            .replace("{{endDateValue}}", self.genericDateFunction(new Date((self.bufferedRequestData[k].END))))
                        if (underscoreJS.find(self.data_s, {
                                "TREE_ID": id
                            }).EXPANDED) {
                            $('#secondaryChartTable table tbody tr.treegrid-' + self.bufferedRequestData[k].TREE_ID + ' td').append(overlapDivContent);
                        } else {
                            $($('#secondaryChartTable table tbody tr.treegrid-parent-' + (id) + ' td')[0]).append(overlapDivContent);
                        }
                        // }
                    }
                    /*     if (underscoreJS.find(self.data_s,{"TREE_ID":id}).EXPANDED && underscoreJS.find(self.data_s,{"TREE_ID":id}).TREE_PARENTID != 'null') {
                       	   $('#secondaryChartTree table tbody tr.treegrid-'+self.data_s[i].TREE_ID+'').outerHeight(($('#secondaryChartTree table tbody tr').height() * ( (1)) ))
                         } else {
                      	   $('#secondaryChartTree table tbody tr.treegrid-'+id+'').outerHeight($('#secondaryChartTable table tbody tr.treegrid-parent-'+id+'').length*self.trHeight)
                         }         
                    */
                    var tds = $('#secondaryChartTableBody table tbody tr.treegrid-parent-' + id + '').length;
                    if (tds >= self.bufferedRequestData.length) {
                        $($('#secondaryChartTree table tbody tr.treegrid-' + id + '')[0]).outerHeight(self.bufferedRequestData.length * self.trHeight)
                    } else {
                        $($('#secondaryChartTree table tbody tr.treegrid-' + id + '')[0]).outerHeight($('#secondaryChartTableBody table tbody tr.treegrid-parent-' + id + '').length * self.trHeight)
                    }
                    i = i + 1;
                    if (leftValue < 0) {
                        $('#righttable--' + self.bufferedRequestData[k].TREE_ID + ' #divDescr').css('margin-left', Math.abs(leftValue) + 'px')
                    }
                }
            } else {
                var startDate = new Date(self.data_s[i].START);
                var dspan = (self.getSpan(from, startDate) == 0) ? (self.getSpanForBuffer(from, startDate)) : self.getSpan(from, startDate);
                var thwidth = self.originalThwidth; //gives each span width;
                var leftValue = dspan * self.originalThwidth;
                var endDate = new Date(self.data_s[i].END);
                var dspan1 = self.getSpan(from, endDate) + 1;
                var color = self.data_s[i].COLOR;
                var width = (dspan1 * self.originalThwidth) - leftValue;
                if (self.data_s[i].TREE_PARENTID == 'null') {
                    if (self.renderFirstTime) {
           self.allParents_s == 'X' ?   self.columnswithnullparentid(self.data_s[i], functionFrom, self.columns_s) : self.columnsPrepare(self.data_s[i], functionFrom, self.columns_s); ;
                    }
                    var majorParent = (self.data_s[i].TREE_ID);
                    var title = self.data_s[i].DOCID;
                    var obj = underscoreJS.findWhere(self.barData_s, {
                        'DOCID': title
                    }); //got issue in promotions
                    if (obj) {
                        obj = obj.DESCR;
                    } else {
                        obj = "";
                    }
                    if (self.data_s[i].REFERENCE != '') { //yes to display bars in promotions case
                        var parentNullTemplate = self.templates.parentNullTemplate;
                        parentNullTemplate = parentNullTemplate.replace('{{parentClass}}', (self.data_s[i].TREE_ID))
                            .replace('{{span}}', span)
                            .replace('{{ID}}', (self.data_s[i].TREE_ID))
                            .replace('{{ID}}', (self.data_s[i].TREE_ID))
                            .replace('{{leftValue}}', leftValue)
                            .replace('{{width}}', width)
                            .replace('{{divColor}}', color)
                            .replace('{{obj}}', obj)
                            .replace('{{obj}}', obj)
                            .replace("{{startDateValue}}", self.genericDateFunction(new Date(self.data_s[i].START)))
                            .replace("{{divEndLeftValue}}", width)
                            .replace("{{circleBaseLeft}}", width - $('.circleBase.type2').outerWidth())
                            .replace("{{endDateValue}}", self.genericDateFunction(new Date(self.data_s[i].END)));
                        $('#secondaryChartTable table tbody').append(parentNullTemplate);
                    } else {
                        var parentNullTemplateNodiv = self.templates.parentNullTemplateNodiv;
                        parentNullTemplateNodiv = parentNullTemplateNodiv.replace('{{parentClass}}', (self.data_s[i].TREE_ID))
                            .replace('{{span}}', span)
                        $('#secondaryChartTable table tbody').append(parentNullTemplateNodiv);
                        if (reqObject.OVERLAPMODE || !reqObject.SPLITVIEW) {
                            $('#secondaryChartTree table tbody tr.treegrid-' + self.data_s[i].TREE_ID + ' td').outerHeight(self.trHeight)
                        } else {
                            $('#secondaryChartTree table tbody tr.treegrid-' + self.data_s[i].TREE_ID + ' td').outerHeight(self.trHeight)
                        }
                    }
                } else {
                    var parentClass = "treegrid-" + (self.data_s[i].TREE_ID) + " treegrid-parent-" + (self.data_s[i].TREE_PARENTID) + " treegrid-parent-" + majorParent + ""
                    if (self.renderFirstTime) {
                        self.columnsDataPrepare(parentClass, self.data_s[i], functionFrom, self.columns_s);
                    }
                    var title = self.data_s[i].DOCID;
                    var obj = underscoreJS.findWhere(self.barData_s, {
                        'DOCID': title
                    });
                    if (obj) {
                        obj = obj.DESCR
                    } else {
                        obj = ""
                    }
                    if (self.data_s[i].REFERENCE == "") {
                        var trTemplate = self.templates.trRow;
                        trTemplate = trTemplate.replace('{{ParentClass}}', parentClass).replace('{{ColSpan}}', span).replace('{{Object}}', obj);
                        $('#secondaryChartTable table tbody').append(trTemplate);
                        if (underscoreJS.find(self.data_s, {
                                "TREE_ID": self.data_s[i].TREE_ID
                            }).EXPANDED) {
                            $('tr.treegrid-parent-' + self.data_s[i].TREE_ID + '').show();
                        }
                        $('#secondaryChartTree table tbody tr.treegrid-' + self.data_s[i].TREE_ID + ' td').outerHeight($('#secondaryChartTable table tbody tr td').outerHeight())
                    } else if (self.data_s[i].DOCID != "") {
                        var prepareTaskDiv = self.templates.prepareTaskDiv;
                        prepareTaskDiv = prepareTaskDiv.replace("{{parentClass}}", parentClass)
                            .replace("{{span}}", span)
                            .replace("{{ID}}", (self.data_s[i].TREE_ID))
                            .replace("{{ID}}", (self.data_s[i].TREE_ID))
                            .replace("{{leftValue}}", leftValue)
                            .replace("{{width}}", width)
                            .replace("{{divColor}}", color)
                            .replace("{{startDateValue}}", self.genericDateFunction(new Date(self.data_s[i].START)))
                            .replace("{{objData}}", obj)
                            .replace("{{objData}}", obj)
                            .replace("{{borderColor}}", color)
                            .replace("{{borderColor}}", color)
                            .replace("{{divEndLeftValue}}", width)
                            .replace("{{circleBaseLeft}}", width - $('.circleBase.type2').outerWidth())
                            .replace("{{endDateValue}}", self.genericDateFunction(new Date(self.data_s[i].END)))
                        $('#secondaryChartTable table tbody').append(prepareTaskDiv);
                    }
                }
                if (leftValue < 0) {
                    $('#righttable--' + self.data_s[i].TREE_ID + ' #divDescr').css('margin-left', Math.abs(leftValue) + 'px')
                    if (new Date(self.start_s) > endDate) {
                        $('#righttable--' + self.data_s[i].TREE_ID).hide()
                    }
                }
            }
        }
        if (self.renderFirstTime) {
            $('.tree').treegrid();
            $('#secondaryChartTree .tree-3').treegrid({
                onChange: function() {
                    if ($(this).treegrid('isExpanded')) {
                        var element = $(this);
                        var className = element.attr('class');
                        var reqClass = className.split(' ')[0];
                        var t = reqClass.split('-');
                        var parentClass = t[0] + '-parent-' + t[1];
                        $('#secondaryChart ' + '.' + parentClass).show();
                        underscoreJS.find(self.data_s, {
                            'TREE_ID': t[1]
                        })['EXPANDED'] = true
                        if ($('#secondaryChart ' + '.' + parentClass + '.treegrid-collapsed').length) {
                            var innerTrs = $('#secondaryChart ' + '.' + parentClass + '.treegrid-collapsed');
                            for (var m = 0; m < innerTrs.length; m++) {
                                var toHideTrClass = '.' + $(innerTrs[m]).attr('class').split(' ')[0].split('-').join('-parent-');
                                $('#secondaryChart ' + toHideTrClass).hide();
                            }
                        }
                        $('#secondaryChart #clockDiv').css('height', $('#secondaryChartTableBody table').height());
                    } else {
                        var element = $(this);
                        var className = element.attr('class');
                        var reqClass = className.split(' ')[0];
                        var t = reqClass.split('-');
                        var parentClass = t[0] + '-parent-' + t[1];
                        $('#secondaryChart ' + '.' + parentClass).hide();
                        underscoreJS.find(self.data_s, {
                            'TREE_ID': t[1]
                        })['EXPANDED'] = false
                        $('#secondaryChart #clockDiv').css('height', $('#secondaryChartTableBody table').height());
                    }
                },
                expanderExpandedClass: 'glyphicon glyphicon-triangle-bottom',
                expanderCollapsedClass: 'glyphicon glyphicon-triangle-right'
            });
            underscoreJS.each(self.columns_s, function(f, i, l) {
                var treeTableColumns = self.templates.treeTableColumns;
                treeTableColumns = treeTableColumns.replace("{{treeColumns}}", f.DESCR)
                $('#secondaryChartTree table thead tr').append(treeTableColumns);
            });
            var noOfColumns = self.columns_s.length;
            if (noOfColumns == 1) {
                $('#secondaryChartTreeHead table').css('min-width', noOfColumns * 280);
                $('#secondaryChartTreeBody table').css('min-width', noOfColumns * 280);
            } else {
                $('#secondaryChartTreeHead table').css('min-width', noOfColumns * 180);
                $('#secondaryChartTreeBody table').css('min-width', noOfColumns * 180);
            }
        }
        if ($('#secondaryChart #chartName')[0]) {
            $('#secondaryChart #chartName')[0].innerHTML = self.secondaryObjectTitle; //for header and count
        }
    }
    ganttChart.prototype.continueMaxMinFun = function(oEvt) { // oEvt gets 1 or 2 or 3
        var from = new Date(self.start_p);
        var to = new Date(self.end_p);
        var span = self.getSpan(from, to) + 1;
        if (self.zoomCount > 0) {
            switch (oEvt) {
                case '1':
                    self.originalThwidth = self.previousThwidth /** Math.pow(2, self.zoomCount)*/ * 0.5;
                    break;
                case '2':
                    self.originalThwidth = self.previousThwidth /** Math.pow(2, self.zoomCount)*/ ;
                    break;
                case '3':
                    self.originalThwidth = self.previousThwidth /** Math.pow(2, self.zoomCount)*/ * 2;
                    break;
            }
        } else {
            switch (oEvt) {
                case '1':
                    self.originalThwidth = self.previousThwidth * 0.75;
                    break;
                case '2':
                    self.originalThwidth = self.previousThwidth;
                    break;
                case '3':
                    self.originalThwidth = self.previousThwidth * 2;
                    break;
            }
        }
        var ic = self.originalThwidth;
        for (var prop in (self.scale)) {
            if (prop == "w1" || prop == "w2" || prop == "w3" || prop == "w4" || prop == "w5" || prop == "w6") {
                self.scale[prop] = ic;
                ic = ic * 2;
            }
        }
        self.getChartPrepare(from, to);
    }
    ganttChart.prototype.switchCharts = function() {
        var primary = $($('#calendarComponent>div')[2]);
        var secondary = $($('#calendarComponent>div')[3]);
        secondary.insertBefore(primary);
    }
    ganttChart.prototype.getChartViewContent = function(id, element) {
        self.isCalled = false; // flag to set ,to call the common function calls only once ,when in splitview
        var parentNode;
        var parentId = "null";
        var childNode;
        $('#primaryChartTable').width($('#primaryChart').width() - $('#primaryChartTree').width());
        var from = new Date(self.start_p);
        var to = new Date(self.end_p);
        var span = self.getSpan(from, to) + 1;
        $("#primaryChartTable table").width((span * self.originalThwidth));
        $('#eventsDiv').empty();
        self.eventsPrepare(from, to, "primaryChart", self.events_p)
        self.clearData();
        var reqObject = self.CALENDARSETTINGS;
        if (reqObject.OVERLAPMODE || !reqObject.SPLITVIEW || reqObject.LINKVIEW) {
            self.trHeight = '26';
            $($("#primaryChartTree table tbody tr,#secondaryChartTree table tbody tr")).outerHeight(self.trHeight)
        } else {
            self.trHeight = '18'
            $($("#primaryChartTree table tbody tr,#secondaryChartTree table tbody tr")).outerHeight(self.trHeight)
        }
        var functionFrom = 'primaryChart';
        for (var i = 0; i < self.data_p.length; i++) {
            if (self.data_p[i].EXPANDED == false && reqObject.OVERLAPMODE) {
                id = self.data_p[i].TREE_ID;
                var from = new Date(self.start_p);
                var to = new Date(self.end_p);
                var span = self.getSpan(from, to) + 1;
                if (self.data_p[i].TREE_PARENTID == 'null' && $('.treegrid-' + id).hasClass('treegrid-collapsed')) {
                    var parentNullTemplateNodiv = self.templates.parentNullTemplateNodiv;
                    parentNullTemplateNodiv = parentNullTemplateNodiv.replace('{{parentClass}}', (self.data_p[i].TREE_ID))
                        .replace('{{span}}', span)
                    $('#primaryChartTable table tbody').append(parentNullTemplateNodiv);
                }
                if (self.noChilds) {
                    self.bufferedTreeData = [];
                    underscoreJS.filter(self.data_p, function(f, i, l) {
                        if (f.REFERENCE != '') {
                            self.bufferedTreeData.push(f)
                        }
                    })
                    self.bufferedTreeData.sort(function(a, b) {
                        return (new Date(a['START']) - new Date(b['START'])) && (new Date(a['END']) - new Date(b['END']))
                    })
                } else {
                    var elements = underscoreJS.filter(self.data_p, {
                        "TREE_PARENTID": id
                    })
                    self.bufferedTreeData = [];
                    underscoreJS.filter(elements, function(f, i, l) {
                        if (f.REFERENCE != '') {
                            self.bufferedTreeData.push(f)
                        }
                    })
                    self.bufferedTreeData.sort(function(a, b) {
                        return (new Date(a['START']) - new Date(b['START'])) && (new Date(a['END']) - new Date(b['END']))
                    })
                }
                self.isCalled = false; // flag to set ,to call the common function calls only once ,when in splitview
                var parentNode;
                var parentId = "null";
                var childNode;
                $("#primaryChartTable table").width((span * self.originalThwidth));
                var functionFrom = 'primaryChart';
                if (self.renderFirstTime) {
                    self.columnsDataPrepare('treegrid-' + id + ' treegrid-parent-' + self.data_p[i].TREE_PARENTID + ' treegrid-parent-' + self.data_p[i].TREE_PARENTID, self.data_p[i], functionFrom, self.columns_p);
                }
                for (var k = 0; k < self.bufferedTreeData.length; k++) {
                    var startDate = new Date(self.bufferedTreeData[k].START);
                    var dspan = (self.getSpan(from, startDate) == 0) ? (self.getSpanForBuffer(from, startDate)) : self.getSpan(from, startDate);
                    var thwidth = self.originalThwidth; //gives each span width;
                    var leftValue = dspan * self.originalThwidth;
                    var endDate = new Date(self.bufferedTreeData[k].END);
                    var dspan1 = self.getSpan(from, endDate) + 1;
                    var width = (dspan1 * self.originalThwidth) - leftValue;
                    var performedFlag = self.performOverLappingFunction(self.bufferedTreeData[k], k, functionFrom);
                    var title = self.bufferedTreeData[k].DOCID;
                    var obj = underscoreJS.findWhere(self.barData_p, {
                        'DOCID': title
                    });
                    if (obj) {
                        obj = obj.DESCR
                    } else {
                        obj = ""
                    }
                    if (performedFlag) {
                        var overlapParentNullTemplate = self.templates.overlapParentNullTemplate;
                        overlapParentNullTemplate = overlapParentNullTemplate.replace("{{parentClass}}", (self.bufferedTreeData[k].TREE_ID) + ' treegrid-parent-' + id + ' treegrid-parent-' + underscoreJS.find(self.data_p, {
                                'TREE_ID': id
                            }).TREE_PARENTID)
                            .replace("{{span}}", span)
                            .replace("{{ID}}", (self.bufferedTreeData[k].TREE_ID))
                            .replace("{{ID}}", (self.bufferedTreeData[k].TREE_ID))
                            .replace("{{leftValue}}", leftValue)
                            .replace("{{width}}", width)
                            .replace("{{divColor}}", (self.bufferedTreeData[k].COLOR))
                            .replace("{{startDateValue}}", self.genericDateFunction(new Date((self.bufferedTreeData[k].START))))
                            .replace("{{obj}}", obj)
                            .replace("{{obj}}", obj)
                            .replace("{{borderColor}}", (self.bufferedTreeData[k].COLOR))
                            .replace("{{borderColor}}", (self.bufferedTreeData[k].COLOR))
                            .replace("{{divEndLeftValue}}", width)
                            .replace("{{circleBaseLeft}}", width - $('.circleBase.type2').outerWidth())
                            .replace("{{endDateValue}}", self.genericDateFunction(new Date((self.bufferedTreeData[k].END))))
                        $('#primaryChartTable table tbody').append(overlapParentNullTemplate);
                    } else {
                        var overlapDivContent = self.templates.overlapDivContent;
                        overlapDivContent = overlapDivContent.replace("{{ID}}", (self.bufferedTreeData[k].TREE_ID))
                            .replace("{{ID}}", (self.bufferedTreeData[k].TREE_ID))
                            .replace("{{leftValue}}", leftValue)
                            .replace("{{width}}", width)
                            .replace("{{divColor}}", (self.bufferedTreeData[k].COLOR))
                            .replace("{{startDateValue}}", self.genericDateFunction(new Date((self.bufferedTreeData[k].START))))
                            .replace("{{objData}}", obj)
                            .replace("{{objData}}", obj)
                            .replace("{{borderColor}}", (self.bufferedTreeData[k].COLOR))
                            .replace("{{borderColor}}", (self.bufferedTreeData[k].COLOR))
                            .replace("{{divEndLeftValue}}", width)
                            .replace("{{circleBaseLeft}}", width - $('.circleBase.type2').outerWidth())
                            .replace("{{endDateValue}}", self.genericDateFunction(new Date((self.bufferedTreeData[k].END))))
                        if (underscoreJS.find(self.data_p, {
                                "TREE_ID": id
                            }).EXPANDED) {
                            $('#primaryChartTable table tbody tr.treegrid-' + self.bufferedTreeData[k].TREE_ID + ' td').append(overlapDivContent);
                        } else {
                            $($('#primaryChartTable table tbody tr.treegrid-parent-' + (id) + ' td')[0]).append(overlapDivContent);
                        }
                    }
                    var tds = $('#primaryChartTableBody table tbody tr.treegrid-parent-' + id + '').length;
                    if (tds >= self.bufferedTreeData.length) {
                        $($('#primaryChartTree table tbody tr.treegrid-' + id + '')[0]).outerHeight(self.bufferedTreeData.length * self.trHeight)
                    } else {
                        $($('#primaryChartTree table tbody tr.treegrid-' + id + '')[0]).outerHeight($('#primaryChartTableBody table tbody tr.treegrid-parent-' + id + '').length * self.trHeight)
                    }
                    i = i + 1;
                    if (leftValue < 0) {
                        $('#righttable--' + self.bufferedTreeData[k].TREE_ID + ' #divDescr').css('margin-left', Math.abs(leftValue) + 'px')
                    }
                }
            } else {
                var startDate = new Date(self.data_p[i].START);
                var dspan = (self.getSpan(from, startDate) == 0) ? (self.getSpanForBuffer(from, startDate)) : self.getSpan(from, startDate);
                var thwidth = self.originalThwidth; //gives each span width;
                var leftValue = dspan * self.originalThwidth;
                var endDate = new Date(self.data_p[i].END);
                var dspan1 = self.getSpan(from, endDate) + 1;
                var width = (dspan1 * self.originalThwidth) - leftValue;
                var color = self.data_p[i].COLOR;
                if (self.data_p[i].TREE_PARENTID == 'null') {
                    if (self.renderFirstTime) {
    //QA#11191                    
     self.allParents_p == 'X' ? self.columnswithnullparentid(self.data_p[i], functionFrom, self.columns_p) : self.columnsPrepare(self.data_p[i], functionFrom, self.columns_p);;
    //                    
                    	
                    }
                    var majorParent = (self.data_p[i].TREE_ID);
                    var title = self.data_p[i].DOCID;
                    var obj = underscoreJS.findWhere(self.barData_p, {
                        'DOCID': title
                    }); //got issue in promotions
                    if (obj) {
                        obj = obj.DESCR;
                    } else {
                        obj = "";
                    }
                    if (self.data_p[i].REFERENCE != '') { //yes to display bars in promotions case
                        var parentNullTemplate = self.templates.parentNullTemplate;
                        parentNullTemplate = parentNullTemplate.replace('{{parentClass}}', (self.data_p[i].TREE_ID))
                            .replace('{{span}}', span)
                            .replace('{{ID}}', (self.data_p[i].TREE_ID))
                            .replace('{{ID}}', (self.data_p[i].TREE_ID))
                            .replace('{{leftValue}}', leftValue)
                            .replace('{{width}}', width)
                            .replace('{{divColor}}', color)
                            .replace('{{obj}}', obj)
                            .replace('{{obj}}', obj)
                            .replace("{{startDateValue}}", self.genericDateFunction(new Date(self.data_p[i].START)))
                            .replace("{{divEndLeftValue}}", width)
                            .replace("{{borderColor}}", color)
                            .replace("{{borderColor}}", color)
                            .replace("{{circleBaseLeft}}", width - $('.circleBase.type2').outerWidth())
                            .replace("{{endDateValue}}", self.genericDateFunction(new Date(self.data_p[i].END)));
                        $('#primaryChartTable table tbody').append(parentNullTemplate);
                    } else {
                        var parentNullTemplateNodiv = self.templates.parentNullTemplateNodiv;
                        parentNullTemplateNodiv = parentNullTemplateNodiv.replace('{{parentClass}}', (self.data_p[i].TREE_ID))
                            .replace('{{span}}', span)
                        $('#primaryChartTable table tbody').append(parentNullTemplateNodiv);
                        if (reqObject.OVERLAPMODE || !reqObject.SPLITVIEW) {
                            $('#primaryChartTree table tbody tr.treegrid-' + self.data_p[i].TREE_ID + ' td').outerHeight(self.trHeight)
                        } else {
                            $('#primaryChartTree table tbody tr.treegrid-' + self.data_p[i].TREE_ID + ' td').outerHeight(self.trHeight)
                        }
                    }
                } else {
                    var parentClass = "treegrid-" + (self.data_p[i].TREE_ID) + " treegrid-parent-" + (self.data_p[i].TREE_PARENTID) + " treegrid-parent-" + (id || majorParent) + ""
                    if (self.renderFirstTime) {
                        self.columnsDataPrepare(parentClass, self.data_p[i], functionFrom, self.columns_p);
                    }
                    var title = self.data_p[i].DOCID;
                    var obj = underscoreJS.findWhere(self.barData_p, {
                        'DOCID': title
                    });
                    if (obj) {
                        obj = obj.DESCR
                    } else {
                        obj = ""
                    }
                    if ( /*self.data_p[i].TITLE == "" || */ (self.data_p[i].REFERENCE == "")) {
                        var trTemplate = self.templates.trRow;
                        trTemplate = trTemplate.replace('{{ParentClass}}', parentClass).replace('{{ColSpan}}', span).replace('{{Object}}', obj);
                        $('#primaryChartTable table tbody').append(trTemplate);
                        if (underscoreJS.find(self.data_p, {
                                "TREE_ID": self.data_p[i].TREE_ID
                            }).EXPANDED) {
                            $('tr.treegrid-parent-' + self.data_p[i].TREE_ID + '').show();
                        }
                        $('#primaryChartTree table tbody tr.treegrid-' + self.data_p[i].TREE_ID + ' td').outerHeight(self.trHeight)
                    } else if (self.data_p[i].REFERENCE != "") {
                        var prepareTaskDiv = self.templates.prepareTaskDiv;
                        prepareTaskDiv = prepareTaskDiv.replace("{{parentClass}}", parentClass)
                            .replace("{{span}}", span)
                            .replace("{{ID}}", (self.data_p[i].TREE_ID))
                            .replace("{{ID}}", (self.data_p[i].TREE_ID))
                            .replace("{{leftValue}}", leftValue)
                            .replace("{{width}}", width)
                            .replace("{{divColor}}", color)
                            .replace("{{startDateValue}}", self.genericDateFunction(new Date(self.data_p[i].START)))
                            .replace("{{objData}}", obj)
                            .replace("{{objData}}", obj)
                            .replace("{{divEndLeftValue}}", width)
                            .replace("{{borderColor}}", color)
                            .replace("{{borderColor}}", color)
                            .replace("{{circleBaseLeft}}", width - 15)
                            .replace("{{endDateValue}}", self.genericDateFunction(new Date(self.data_p[i].END)))
                        $('#primaryChartTable table tbody').append(prepareTaskDiv);
                        if (!self.CALENDARSETTINGS.SPLITVIEW) {
                            var foundObjects = underscoreJS.filter(self.data_s, {
                                "REFERENCE": self.data_p[i].DOCID
                            });
                            if (foundObjects.length > 0) {
                                for (var t = 0; t < foundObjects.length; t++) {
                                    var startDate = new Date(foundObjects[t].START);
                                    var Dspan = (self.getSpan(from, startDate) == 0) ? (self.getSpanForBuffer(from, startDate)) : self.getSpan(from, startDate);
                                    var thwidth = self.originalThwidth; //gives each span width;
                                    var childLeftValue = Dspan * self.originalThwidth;
                                    var endDate = new Date(foundObjects[t].END);
                                    var dspan1 = self.getSpan(from, endDate) + 1;
                                    var color = foundObjects[t].COLOR;
                                    var childWidth = (dspan1 * self.originalThwidth) - childLeftValue;
                                    parentClass = "treegrid-" + (foundObjects[t].TREE_ID) + " treegrid-parent-" + (self.data_p[i].TREE_ID) + " treegrid-parent-" + (self.data_p[i].TREE_PARENTID) + " treegrid-parent-" + majorParent;
                                    if (self.renderFirstTime) {
                                        self.columnsDataPrepare(parentClass, foundObjects[t], functionFrom, self.columns_p);
                                    }
                                    var title = foundObjects[t].DOCID;
                                    var obj = underscoreJS.findWhere(self.barData_s, {
                                        'DOCID': title
                                    });
                                    if (obj) {
                                        var objData = obj.DESCR;
                                    } else {
                                        var objData = '';
                                    }
                                    var prepareTaskDiv = self.templates.prepareTaskDiv;
                                    prepareTaskDiv = prepareTaskDiv.replace("{{parentClass}}", parentClass)
                                        .replace("{{span}}", span)
                                        .replace("{{ID}}", (foundObjects[t].TREE_ID))
                                        .replace("{{ID}}", (foundObjects[t].TREE_ID))
                                        .replace("{{leftValue}}", childLeftValue)
                                        .replace("{{width}}", childWidth)
                                        .replace("{{divColor}}", color)
                                        .replace("{{startDateValue}}", self.genericDateFunction(new Date(foundObjects[t].START)))
                                        .replace("{{objData}}", objData)
                                        .replace("{{objData}}", objData)
                                        .replace("{{divEndLeftValue}}", childWidth)
                                        .replace("{{borderColor}}", color)
                                        .replace("{{borderColor}}", color)
                                        .replace("{{circleBaseLeft}}", childWidth - $('.circleBase.type2').outerWidth())
                                        .replace("{{endDateValue}}", self.genericDateFunction(new Date(foundObjects[t].END)))
                                    $('#primaryChartTable table tbody').append(prepareTaskDiv);
                                    //$('#righttable--' + foundObjects[t].TREE_ID + ' #divDescr').css('margin-left', Math.abs(childLeftValue) + 'px')
                                    if(childLeftValue<0){
                              $('#righttable--' + foundObjects[t].TREE_ID + ' #divDescr').css('margin-left', Math.abs(childLeftValue) + 'px')
                                       }
                                
                                }
                            }
                        }
                    }
                }
                if (leftValue < 0) {
                    $('#righttable--' + self.data_p[i].TREE_ID + ' #divDescr').css('margin-left', Math.abs(leftValue) + 'px')
                    if (new Date(self.start_p) > endDate) {
                        $('#righttable--' + self.data_p[i].TREE_ID).hide()
                    }
                }
            }
        }
        /////////common for all     
        if ($('#chartName')[0]) {
            if (self.CALENDARSETTINGS.SPLITVIEW) {
                $('#primaryChart #chartName')[0].innerHTML = self.primaryObjectTitle; //for header and count
            } else {
                $('#primaryChart #chartName')[0].innerHTML = self.primaryObjectTitle + "  /  " + self.secondaryObjectTitle; //for header and count
            }
        }
        if (self.renderFirstTime) {
            $('.tree').treegrid();
            $('#primaryChartTree .tree-2').treegrid({
                onChange: function() {
                    if ($(this).treegrid('isExpanded')) {
                        var element = $(this);
                        var className = element.attr('class');
                        var reqClass = className.split(' ')[0];
                        var t = reqClass.split('-');
                        var parentClass = t[0] + '-parent-' + t[1];
                        underscoreJS.find(underscoreJS.union(self.data_p, self.data_s), {
                            'TREE_ID': t[1]
                        })['EXPANDED'] = true;
                        $('#primaryChart ' + '.' + parentClass).show();
                        if ($('#primaryChart ' + '.' + parentClass + '.treegrid-collapsed').length) {
                            var innerTrs = $('#primaryChart ' + '.' + parentClass + '.treegrid-collapsed');
                            for (var m = 0; m < innerTrs.length; m++) {
                                var toHideTrClass = '.' + $(innerTrs[m]).attr('class').split(' ')[0].split('-').join('-parent-');
                                $('#primaryChart ' + toHideTrClass).hide();
                            }
                        }
                        if (!self.CALENDARSETTINGS.SPLITVIEW) {
                            $('g').remove()
                            self.prepareLinks()
                        }
                        $('#primaryChart #clockDiv').css('height', $('#primaryChartTableBody table').height());
                        $('#primaryChartTableBody').scrollLeft($('#primaryChartTableBody').scrollLeft() + 1);
                    } else {
                        var element = $(this);
                        var className = element.attr('class');
                        var reqClass = className.split(' ')[0];
                        var t = reqClass.split('-');
                        var parentClass = t[0] + '-parent-' + t[1];
                        underscoreJS.find(underscoreJS.union(self.data_p, self.data_s), {
                            'TREE_ID': t[1]
                        })['EXPANDED'] = false;
                        $('#primaryChart ' + '.' + parentClass).hide();
                        if (!self.CALENDARSETTINGS.SPLITVIEW) {
                            $('g').remove()
                            self.prepareLinks()
                            $('[from = ' + t[1] + ']').remove();
                        }
                        $('#primaryChart #clockDiv').css('height', $('#primaryChartTableBody table').height());
                        $('#primaryChartTableBody').scrollLeft($('#primaryChartTableBody').scrollLeft() + 1);
                    }
                },
                expanderExpandedClass: 'glyphicon glyphicon-triangle-bottom',
                expanderCollapsedClass: 'glyphicon glyphicon-triangle-right'
            });
            underscoreJS.each(self.columns_p, function(f, i, l) {
                var treeTableColumns = self.templates.treeTableColumns;
                treeTableColumns = treeTableColumns.replace("{{treeColumns}}", f.DESCR)
                $('#primaryChartTree table thead tr').append(treeTableColumns);
            });
            var noOfColumns = self.columns_p.length;
            if (noOfColumns == 1) {
                $('#primaryChartTreeHead table').css('min-width', noOfColumns * 280);
                $('#primaryChartTreeBody table').css('min-width', noOfColumns * 280);
            } else {
                $('#primaryChartTreeHead table').css('min-width', noOfColumns * 180);
                $('#primaryChartTreeBody table').css('min-width', noOfColumns * 180);
            }
        }
        if (self.secondInstanceExists == "X" && self.CALENDARSETTINGS.SPLITVIEW) {
            self.prepareSecondInstance();
        }
        self.changeCSSFunction();
        self.hideTreeGroup()
        if (!self.CALENDARSETTINGS.SPLITVIEW) {
            self.prepareLinks();
        }
        $('#secondaryChartTableBody').scrollLeft($('#primaryChartTableBody').scrollLeft());
        self.preparePopover();
        self.commonFunctions()
    }
    ganttChart.prototype.changeCSSFunction = function() {
        if (self.CALENDARSETTINGS.OVERLAPMODE || !self.CALENDARSETTINGS.SPLITVIEW ) {
            $($("#primaryChartTable table tbody tr,#secondaryChartTable table tbody tr")).outerHeight(self.trHeight)
            $('[id*=righttable]').height(15);
            $('[id*=divDescr]').addClass('newDivDescr')
            $('[id*=divStart]').addClass('newClassForStart')
            $('[id*=divEnd]').addClass('newClassForEnd')
        } else {
            $($("#primaryChartTable table tbody tr,#secondaryChartTable table tbody tr")).outerHeight(self.trHeight)
        }
       if (!self.CALENDARSETTINGS.LINKVIEW && !self.CALENDARSETTINGS.OVERLAPMODE && !self.CALENDARSETTINGS.SPLITVIEW) {
            $($("#primaryChartTree table tbody tr,#secondaryChartTree table tbody tr")).outerHeight(self.trHeight)
        }         
        
        
        
    }
    ganttChart.prototype.onClickOkSettings = function(oEvt) {
        self.reqhgt = self.wrapperHeight - self.appToolbarHeight;
        var reqObject = self.CALENDARSETTINGS;
        if (self.INTERNALSETTINGSFORCALENDAR.TIMESLOT) {
            $('div#clockDiv').show();
            self.placeTheDate("primaryChart");
            if (self.secondInstanceExists == "X") {
                self.placeTheDate("secondaryChart")
            }
        } else {
            $('div[id*=clockDiv]').hide()
        }
        if (reqObject.DIVIDERLINES) {
            $('div#vLine').show()
        } else {
            $('div#vLine').hide()
        }
        if (reqObject.DISPLAY_PRIOBJ && reqObject.DISPLAY_SECOBJ) {
            $('#primaryChart').show();
            $('#secondaryChart').show();
            self.elementsHeightFunction();
        } else {
            if (reqObject.DISPLAY_PRIOBJ) {
                $('#secondaryChart').hide();
                $('#primaryChart').show();
                self.parentOneInstanceSizes();
            }
            if (reqObject.DISPLAY_SECOBJ) {
                $('#primaryChart').hide();
                $('#secondaryChart').show();
                self.parentTwoInstanceSizes();
            }
        }
        $('#secondaryChartTableBody').scrollLeft($('#primaryChartTableBody').scrollLeft());
        //self.adjustTrsHeight()
        if (($('#primaryChartTableHead table tr').length == 1) || $('#secondaryChartTableHead table tr').length == 1) {
            $('#primaryChartTable [id*=vLine]').css('margin-top', $('#primaryChartTableHead table tr').height() + 3)
            $('#secondaryChartTable [id*=vLine]').css('margin-top', $('#secondaryChartTableHead table tr').height() + 3)
            $('#secondaryChartTableHead,#primaryChartTableHead').addClass('Vborder')
            $('#secondaryChartTableHead').width($('#secondaryChartTableHead table').width())
            $('#primaryChartTableHead').width($('#primaryChartTableHead table').width())
        }
        $('#primaryChart [id*=vLine]').css('height', $('#primaryChartTableBody').height() - 13);
        $('#secondaryChart [id*=vLine]').css('height', $('#primaryChartTableBody').height() - 13);
    }
    ganttChart.prototype.convertDateFunction = function(dateStr) {
        var dateString = dateStr;
        var year = dateString.substring(0, 4);
        var month = dateString.substring(4, 6);
        var day = dateString.substring(6, 8);
        var date = new Date(year, month - 1, day);
        return date;
    }
    ganttChart.prototype.eventsRegister = function() {
        $('[id*=rowDetail]').off('click').on('click', function(e) {
            var id = $(this).siblings()[($(this).index() - 1)].getAttribute('id').split('--')[1]
            var obj = underscoreJS.find(self.data_p, {
                "TREE_ID": id
            });
            var chartType;
            var detailArr = [];
            if (obj) {
                chartType = "primaryChart";
            } else {
                chartType = "secondaryChart";
                var obj = underscoreJS.find(self.data_s, {
                    "TREE_ID": id
                });
            }
            detailArr.push({
                "ROWID": Number(obj['ROWID']),
                "DOCNO": obj['DOCID'],
                "DATAB": self.convertToInternalFormat((obj['START'])),
                "DATBI": self.convertToInternalFormat((obj['END'])),
                "CHARTID": (chartType == "primaryChart") ? "1" : "2",
                "UPDKZ": ""
            });
            self.control.openAdditionalInfo(detailArr[0], chartType);
        })
        if ((new Date(self.start_p).getTime() == new Date(self.start_s).getTime()) && (new Date(self.end_p).getTime() == new Date(self.end_s).getTime())) {
            $('#primaryChart #circleLeft,#secondaryChart #circleLeft').off('click').on('click', function(e) {
                if ($('#primaryChartTree').is(':visible') || $('#secondaryChartTree').is(':visible')) {
                    $('#primaryChartTree,#secondaryChartTree').hide();
                    $('#primaryChart #splitterDiv,#secondaryChart #splitterDiv').css('left', '0px') /*.draggable('disable')*/ ;
                    $('#primaryChartTable,#secondaryChartTable').css('margin-left', '0px');
                    $('#primaryChartTable,#secondaryChartTable').css('left', $('#splitterDiv').width() + 'px');
                    $('#primaryChartTable,#secondaryChartTable').width($('#calendarComponent').width());
                    $('#primaryChartTableBody,#secondaryChartTableBody').width($('#calendarComponent').width() - 10)
                    self.hideTree = true;
                    self.hideTree1 = true;
                    $('#primaryChart #circleLeft,#secondaryChart #circleLeft').prop('class', 'fa fa-arrow-circle-right')
                } else {
                    $('#primaryChartTree,#secondaryChartTree').show();
                    $('#primaryChart #circleLeft,#secondaryChart #circleLeft').prop('class', 'fa fa-arrow-circle-left')
                    $('#primaryChart #splitterDiv,#secondaryChart #splitterDiv').draggable('enable');
                    $('#primaryChartTable,#secondaryChartTable').css('left', $('#primaryChartTree').width() + $('#primaryChart #splitterDiv').width())
                    $('#primaryChart #splitterDiv,#secondaryChart #splitterDiv').css('left', $('#primaryChartTree').width());
                    $('#primaryChartTableBody,#secondaryChartTableBody').width($('#calendarComponent').width() - $('#primaryChartTree').width() - $('#splitterDiv').width())
                    $('#primaryChartTreeHead #headerWrapper').css({
                        "width": $('#primaryChartTreeHead table').width()
                    })
                    $('#secondaryChartTreeHead #headerWrapper').css({
                        "width": $('#secondaryChartTreeHead table').width()
                    })
                    self.hideTree1 = false
                    self.hideTree = false
                }
            })
        } else {
            $('#primaryChart #circleLeft').off('click').on('click', function(e) {
                if ($('#primaryChartTree').is(':visible')) {
                    $('#primaryChartTree').hide();
                    $('#primaryChart #splitterDiv').css('left', '0px')
                    $('#primaryChart #splitterDiv').draggable('disable');
                    $('#primaryChartTable').css('margin-left', '0px');
                    $('#primaryChartTable').css('left', $('#splitterDiv').width() + 'px');
                    $('#primaryChartTable').width($('#calendarComponent').width());
                    $('#primaryChartTableBody').width($('#calendarComponent').width() - 10)
                    $('#primaryChart #circleLeft').prop('class', 'fa fa-arrow-circle-right')
                    self.hideTree = true
                } else {
                    $('#primaryChartTree').show();
                    $('#primaryChart #circleLeft').prop('class', 'fa fa-arrow-circle-left')
                    $('#primaryChart #splitterDiv').draggable('enable');
                    $('#primaryChartTable').css('left', $('#primaryChartTree').width() + $('#primaryChart #splitterDiv').width())
                    $('#primaryChart #splitterDiv').css('left', $('#primaryChartTree').width());
                    $('#primaryChartTableBody').width($('#calendarComponent').width() - $('#primaryChartTree').width() - $('#splitterDiv').width())
                    $('#primaryChartTreeHead #headerWrapper').css({
                        "width": $('#primaryChartTreeHead table').width()
                    })
                    self.hideTree = false
                }
            })
            $('#secondaryChart #circleLeft').off('click').on('click', function(e) {
                if ($('#secondaryChartTree').is(':visible')) {
                    $('#secondaryChartTree').hide();
                    $('#secondaryChart #splitterDiv').css('left', '0px') /*.draggable('disable')*/ ;
                    $('#secondaryChartTable').css('margin-left', '0px');
                    $('#secondaryChartTable').css('left', $('#secondaryChart #splitterDiv').width() + 'px');
                    $('#secondaryChartTable').width($('#calendarComponent').width());
                    $('#secondaryChartTableBody').width($('#calendarComponent').width() - 10)
                    $('#secondaryChart #circleLeft').prop('class', 'fa fa-arrow-circle-right')
                    self.hideTree1 = true
                } else {
                    $('#secondaryChartTree').show();
                    $('#secondaryChart #circleLeft').prop('class', 'fa fa-arrow-circle-left')
                    $('#secondaryChart #splitterDiv').draggable('enable');
                    $('#secondaryChartTable').css('left', $('#secondaryChartTree').width() + $('#secondaryChart #splitterDiv').width())
                    $('#secondaryChart #splitterDiv').css('left', $('#secondaryChartTree').width());
                    $('#secondaryChartTableBody').width($('#calendarComponent').width() - $('#secondaryChartTree').width() - $('#secondaryChart #splitterDiv').width())
                    $('#secondaryChartTreeHead #headerWrapper').css({
                        "width": $('#secondaryChartTreeHead table').width()
                    })
                    self.hideTree1 = false
                }
            })
        }
        if (!underscoreJS.isEmpty(self.events_p)) {
            $('#primaryChartTableHead table tr').off('click').on('click', function(oEvt) {
            	if($(' #primaryChartTableBody #eventsDiv').css('visibility') == 'visible'){ 
                	$('#primaryChart #eventsDiv').css('visibility','hidden');
                } else {
                    $('#primaryChart #eventsDiv').css('visibility','visible');
                }
            })
        }
        if (!underscoreJS.isEmpty(self.events_s)) {
            $('#secondaryChartTableHead table tr').off('click').on('click', function(oEvt) {
            	if($(' #secondaryChartTableBody #eventsDiv').css('visibility') == 'visible'){ 
                    $('#secondaryChart #eventsDiv').css('visibility','hidden');
                } else {
                    $('#secondaryChart #eventsDiv').css('visibility','visible');
                }
            })
        }
        $("#calendarComponent span[id*=cr]").off('click').on('click', function(e) {
            var trElement = $($(this).parent().parent().parent().parent());
            if (trElement.hasClass('rowColor')) {
                $('.' + trElement.attr('class').split(' ').join('.')).removeClass('rowColor')
            } else {
                $('.' + trElement.attr('class').split(' ').join('.')).addClass('rowColor')
            }
            var id = this.parentElement.parentElement.getAttribute('id').split("--")[1];
            var obj = underscoreJS.find(self.data_p, {
                "TREE_ID": id
            }) ? underscoreJS.find(self.data_p, {
                "TREE_ID": id
            }) : underscoreJS.find(self.data_s, {
                "TREE_ID": id
            });
            if (obj.SELECTED) {
                obj['SELECTED'] = false;
            } else {
                obj['SELECTED'] = true;
            }
        })
        $(window).resize(function(oEvt) {
            if ($(oEvt.target).hasClass('ui-resizable')) {
                return false;
            }
            //self.control.addBusyIndicator()
            self.control.toolbar.rerender()
            // need to perform below also, above is just for triggering
            setTimeout(function() {
                self.appToolbarWidth = $(".appToolbar").width();
                self.onClickOkSettings();
            }, 500)
            if ($('#primaryChart').is(':visible') && !$('#secondaryChart').is(':visible')) {
                $('#calendarComponent').height($('#primaryChartTableBody').height() + $('#primaryChartTableHead').height());
            } else if ($('#secondaryChart').is(':visible') && !$('#primaryChart').is(':visible')) {
                $('#calendarComponent').height($('#secondaryChart').height() + 1);
            } else {
                $('#calendarComponent').height($('#secondaryChart').height() + $('#primaryChartTableBody').height() + $('#primaryChartTableHead').height());
            }
            $('#popoverDiv').height($('#calendarComponent').height() - 13 + 'px');
            $('#popoverContent').height($('#popoverDiv').height() - $('#popoverHeader').height());
            if ($('#calendarComponent').position()) {
                $('#popoverDiv').css({
                    'left': ($('#calendarComponent').position().left + $("#calendarComponent").width() - $("#popoverDiv").width()) + 'px',
                    'margin-top': '-3px'
                });
                $("#angleLeftPopover").css('left', ($('#calendarComponent').position().left + $("#calendarComponent").width() - $("#angleLeftPopover").width()) + 'px');
            }
            $("[aria-pressed]").off('click').on('click', function() {
                setTimeout(function() {
                    if ($('[aria-pressed]').length > 1) {
                        $("[aria-pressed]").on('click', function() {
                            setTimeout(function() {
                                self.appToolbarWidth = $(".appToolbar").width();
                                self.onClickOkSettings();
                            }, 500)
                        })
                    } else {
                        self.appToolbarWidth = $(".appToolbar").width();
                        self.onClickOkSettings();
                    }
                }, 500)
            })
            //self.control.removeBusyIndicator()
        })
        $('#calendarComponent thead td [id*=treeColumns]').off('click').on('click', function(id, cx) {
            /*     self.chartName = id.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute('id');
                 self.sortedIndex = $(this).parent().index();
                 $('#' + self.chartName + ' thead td .fa').remove()
                 if (self.chartName == 'primaryChartTreeHead') {
                     var columns = self.columns_p;
                     var obj = underscoreJS.find(columns, {
                         "DESCR": id.currentTarget.innerText
                     });
                 } else {
                     var columns = self.columns_s;
                     var obj = underscoreJS.find(columns, {
                         "DESCR": id.currentTarget.innerText
                     });
                 }
                 var field = obj.NAME;
                 if (self.asc) {
                     self.asc = false;
                     if (field == 'DATAB' || field == "DATBI") {
                         self.data_p = underscoreJS.sortBy(self.data_p, function(f, i, l) {
                             return new Date(f.field).getTime()
                         }).reverse();
                     } else {
                         self.data_p = underscoreJS.sortBy(self.data_p, field).reverse();
                     }
                 } else {
                     self.asc = true;
                     if (field == 'DATAB' || field == "DATBI") {
                         self.data_p = underscoreJS.sortBy(self.data_p, function(f, i, l) {
                             return new Date(f.field).getTime()
                         })
                     } else {
                         self.data_p = underscoreJS.sortBy(self.data_p, field);
                     }
                 }
                 self.renderFirstTime = true;
                 self.getChartPrepare();
            */
            /*
               	self.chartName = id.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute('id');
                   self.sortedIndex = $(this).parent().index() ;
                   $('#' + self.chartName + ' thead td .fa').remove()
                   if (self.chartName == 'secondaryChartTreeHead') {
                       var columns = self.columns_s;
                       var dataArray = self.data_s;
                       if (self.asc == "") {
                           self.asc = 'X';
                       } else {
                           self.asc = '';
                       }
                   } else {
                       var columns = self.columns_p;
                       var dataArray = self.data_p;
                   }
                   var obj = underscoreJS.find(columns, {
                       "DESCR": id.currentTarget.innerText
                          });
                   var parent = underscoreJS.filter(dataArray, {
                       "TREE_PARENTID": "null"
                   });
                   self.empArr = [];
                   var childs;
                   self.field = obj.NAME;
                   for (var p = 0; p < parent.length; p++) {
                       self.empArr.push(parent[p]);
                       self.empArr = underscoreJS.flatten(self.empArr);
                       childs = underscoreJS.filter(dataArray, {
                           "TREE_PARENTID": parent[p].TREE_ID
                       });
                       if (self.field == 'DATAB' || self.field == 'DATBI') {
                           if (self.asc == "") {
                               self.asc = "X";
                               for (var c = 0; c < childs.length; c++) {
                                   self.empArr.push(childs[c]);
                                   var grandChilds = underscoreJS.filter(dataArray, {
                                       "TREE_PARENTID": childs[c].TREE_ID
                                   });
                                   grandChilds.sort(function(a, b) {
                                       var oDate1 = a[self.field];
                                       var oDate2 = b[self.field];
                                       var limiter1 = oDate1.match(/\-|\*|\.|\,|\-|\//);
                                       var limiter2 = oDate2.match(/\-|\*|\.|\,|\-|\//);
                                       var d1 = new Date(self.convertToRequiredFormat(limiter1, oDate1));
                                       var d2 = new Date(self.convertToRequiredFormat(limiter2, oDate2));
                                       return d2 - d1;
                                   });
                                   self.empArr.push(grandChilds);
                                   self.empArr = underscoreJS.flatten(self.empArr);
                               }
                           } else {
                               self.asc = "";
                               for (var c = 0; c < childs.length; c++) {
                                   self.empArr.push(childs[c]);
                                   var grandChilds = underscoreJS.filter(dataArray, {
                                       "TREE_PARENTID": childs[c].TREE_ID
                                   });
                                   grandChilds.sort(function(a, b) {
                                       var oDate1 = a[self.field];
                                       var oDate2 = b[self.field]
                                       var limiter1 = oDate1.match(/\-|\*|\.|\,|\-|\//);
                                       var limiter2 = oDate2.match(/\-|\*|\.|\,|\-|\//);
                                       var d1 = new Date(self.convertToRequiredFormat(limiter1, oDate1));
                                       var d2 = new Date(self.convertToRequiredFormat(limiter2, oDate2));
                                       return d1 - d2;
                                   });
                                   self.empArr.push(grandChilds);
                                   self.empArr = underscoreJS.flatten(self.empArr);
                               }
                           }
                       } else {
                           if (self.asc == "") {
                               self.asc = "X";
                               for (var c = 0; c < childs.length; c++) {
                                   self.empArr.push(childs[c]);
                                   var grandChilds = underscoreJS.filter(dataArray, {
                                       "TREE_PARENTID": childs[c].TREE_ID
                                   });
                                   if (self.chartName == 'secondaryChartTree') {
                                       grandChilds.sort(function(a, b) {
                                           if (a[self.field] < b[self.field])
                                               return -1;
                                           if (a[self.field] > b[self.field])
                                               return 1;
                                           return 0;
                                       })
                                   } else {
                                       grandChilds.sort(function(a, b) {
                                           return parseInt(b[self.field]) - parseInt(a[self.field]); // ascending
                                       });
                                   }
                                   self.empArr.push(grandChilds);
                                   self.empArr = underscoreJS.flatten(self.empArr);
                               }
                           } else {
                               self.asc = "";
                               for (var c = 0; c < childs.length; c++) {
                                   self.empArr.push(childs[c]);
                                   var grandChilds = underscoreJS.filter(dataArray, {
                                       "TREE_PARENTID": childs[c].TREE_ID
                                   });
                                   if (self.chartName == 'secondaryChartTree') {
                                       grandChilds.sort(function(a, b) {
                                           if (a[self.field] > b[self.field])
                                               return -1;
                                           if (a[self.field] < b[self.field])
                                               return 1;
                                           return 0;
                                       })
                                   } else {
                                       grandChilds.sort(function(a, b) {
                                           return parseInt(a[self.field]) - parseInt(b[self.field]); // descending
                                       });
                                   }
                                   self.empArr.push(grandChilds);
                                   self.empArr = underscoreJS.flatten(self.empArr);
                               }
                           }
                       }
                   }
                   if (self.chartName == 'secondaryChartTree') {
                       self.data_s = [];
                       self.data_s = self.empArr;
                       self.renderFirstTime = true;
                       self.prepareSecondInstance();
                   } else {
                       self.data_p = [];
                       self.data_p = self.empArr;
                       self.renderFirstTime = true;
                       self.getChartPrepare();
                   }
               */
        })
        if (self.renderFirstTime) {
            $('#primaryChartTree thead td').resizable({
                resize: function(oEvt, ui) {
                    $(this).css('left', '0px')
                    for (var i = 0; i < self.columns_p.length + 1; i++) {
                        var width = $('#primaryChartTree #primaryChartTreeHead table thead td:nth-child(' + (i) + ')').width();
                        var nwidth = width + 8;
                        $('#primaryChartTree #primaryChartTreeBody table tbody td:nth-child(' + (i) + ')').width(nwidth);
                    }
                },
                stop: function(oEvt, ui) {
                    for (var i = 0; i < self.columns_p.length + 1; i++) {
                        var width = $('#primaryChartTree #primaryChartTreeHead table thead td:nth-child(' + (i) + ')').width();
                        var nwidth = width + 8;
                        $('#primaryChartTree #primaryChartTreeBody table tbody td:nth-child(' + (i) + ')').width(nwidth);
                    }
                }
            })
            $('#secondaryChartTree thead td').resizable({
                resize: function(oEvt, ui) {
                    $(this).css('left', '0px')
                    for (var i = 0; i < self.columns_s.length + 1; i++) {
                        var width = $('#secondaryChartTree #secondaryChartTreeHead table thead td:nth-child(' + (i) + ')').width();
                        var nwidth = width;
                        $('#secondaryChartTree #secondaryChartTreeBody table tbody td:nth-child(' + (i) + ')').width(nwidth);
                    }
                },
                stop: function(oEvt, ui) {
                    for (var i = 0; i < self.columns_s.length + 1; i++) {
                        var width = $('#secondaryChartTree #secondaryChartTreeHead table thead td:nth-child(' + (i) + ')').width();
                        var nwidth = width;
                        $('#secondaryChartTree #secondaryChartTreeBody table tbody td:nth-child(' + (i) + ')').width(nwidth);
                    }
                }
            });
        }
        if ((new Date(self.start_p).getTime() == new Date(self.start_s).getTime()) && (new Date(self.end_p).getTime() == new Date(self.end_s).getTime())) {
            $("[id*=splitterDiv]").draggable({
                axis: 'x',
                drag: function(e, ui) {
                    if (ui.position.left < ui.originalPosition.left) {
                        var moved = ui.originalPosition.left - ui.position.left;
                    } else {
                        var moved = ui.position.left - ui.originalPosition.left;
                    }
                    var parentwidth = $('#primaryChart').width();
                    var leftchild = ui.position.left;
                    var splitter = $('#splitterDiv').width();
                    $('#splitterDiv').css('width', splitter);
                    var totalleft = leftchild;
                    if (leftchild < 200 || leftchild > 600) {
                        return false;
                    } else {
                        var child2width1 = $('#primaryChartTable table').width();
                        var child2width = parentwidth - totalleft
                        $('#primaryChartTree').css({
                            'width': leftchild + 'px'
                        })
                        $('#primaryChartTree table').css({
                            'width': leftchild + 'px'
                        });
                        $('#primaryChartTreeHead').css('width', totalleft)
                        $('#primaryChartTreeBody').css('width', totalleft)
                        $('#primaryChartTable').css({
                            'width': child2width + 'px',
                            'margin-left': totalleft + 'px',
                        });
                        if ((ui.position.left > ui.originalPosition.left)) {
                            $('#primaryChartTable').css({
                                'width': child2width + 'px',
                                'left': '6px'
                            });
                        } else {
                            $('#primaryChartTable').css({
                                left: '6px'
                            });
                        }
                    }
                    $('#primaryChartTableBody').width($('#primaryChart').width() - $('#primaryChartTree').width() - $('#primaryChart #splitterDiv').width())
                    for (var i = 0; i < self.columns_p.length + 1; i++) {
                        var width = $('#primaryChartTree #primaryChartTreeHead table thead td:nth-child(' + (i) + ')').width();
                        var nwidth = width + 8;
                        $('#primaryChartTree #primaryChartTreeBody table tbody td:nth-child(' + (i) + ')').width(nwidth);
                    }
                    if (self.secondInstanceExists == "X") {
                        $('#secondaryChart #secondaryChartTree').css({
                            'width': leftchild + 'px'
                        })
                        $('#secondaryChart #secondaryChartTree table').css({
                            'width': leftchild + 'px'
                        });
                        $('[id*=splitterDiv]').css('left', leftchild);
                        $('#secondaryChartTreeHead').css('width', totalleft)
                        $('#secondaryChartTreeBody').css('width', totalleft)
                        $('#secondaryChartTable').css({
                            'width': child2width + 'px',
                            'margin-left': totalleft + 'px',
                        });
                        if ((ui.position.left > ui.originalPosition.left)) {
                            $('#secondaryChartTable').css({
                                'width': child2width + 'px',
                                'left': '6px'
                            });
                        } else {
                            $('#secondaryChartTable').css({
                                left: '6px'
                            });
                        }
                        $('#secondaryChartTableBody').width($('#secondaryChart').width() - $('#secondaryChartTree').width() - $('#secondaryChart #splitterDiv').width())
                        for (var i = 0; i < self.columns_s.length + 1; i++) {
                            var width = $('#secondaryChartTree #secondaryChartTreeHead table thead td:nth-child(' + (i) + ')').width();
                            var nwidth = width;
                            $('#secondaryChartTree #secondaryChartTreeBody table tbody td:nth-child(' + (i) + ')').width(nwidth);
                        }
                    }
                },
                stop: function() {}
            });
        } else {
            $("#primaryChart [id*=splitterDiv]").draggable({
                axis: 'x',
                drag: function(e, ui) {
                    if (ui.position.left < ui.originalPosition.left) {
                        var moved = ui.originalPosition.left - ui.position.left;
                    } else {
                        var moved = ui.position.left - ui.originalPosition.left;
                    }
                    var parentwidth = $('#primaryChart').width();
                    var leftchild = ui.position.left;
                    var splitter = $('#splitterDiv').width();
                    $('#splitterDiv').css('width', splitter);
                    var totalleft = leftchild;
                    if (leftchild < 200 || leftchild > 600) {
                        return false;
                    } else {
                        var child2width1 = $('#primaryChartTable table').width();
                        var child2width = parentwidth - totalleft
                        $('#primaryChartTree').css({
                            'width': leftchild + 'px'
                        })
                        $('#primaryChartTree table').css({
                            'width': leftchild + 'px'
                        });
                        $('#primaryChartTreeHead').css('width', totalleft)
                        $('#primaryChartTreeBody').css('width', totalleft)
                        $('#primaryChartTable').css({
                            'width': child2width + 'px',
                            'margin-left': totalleft + 'px',
                        });
                        if ((ui.position.left > ui.originalPosition.left)) {
                            $('#primaryChartTable').css({
                                'width': child2width + 'px',
                                'left': '6px'
                            });
                        } else {
                            $('#primaryChartTable').css({
                                left: '6px'
                            });
                        }
                    }
                    $('#primaryChartTableBody').width($('#primaryChart').width() - $('#primaryChartTree').width() - $('#primaryChart #splitterDiv').width())
                },
                stop: function() {}
            });
            $("#secondaryChart [id*=splitterDiv]").draggable({
                axis: 'x',
                drag: function(e, ui) {
                    var parentwidth = $('#secondaryChart').width();
                    var leftchild = ui.position.left;
                    var splitter = $('#secondaryChart #splitterDiv').width();
                    $('#secondaryChart #splitterDiv').css('width', splitter);
                    var totalleft = leftchild;
                    if (leftchild < 200 || leftchild > 600) {
                        return false;
                    } else {
                        var child2width1 = $('#secondaryChartTable table').width();
                        var child2width = parentwidth - totalleft
                        $('#secondaryChartTree').css({
                            'width': leftchild + 'px'
                        })
                        $('#secondaryChartTree table').css({
                            'width': leftchild + 'px'
                        });
                        $('#secondaryChartTreeHead').css('width', totalleft)
                        $('#secondaryChartTreeBody').css('width', totalleft)
                        $('#secondaryChartTable').css({
                            'width': child2width + 'px',
                            'margin-left': totalleft + 'px',
                        });
                        if ((ui.position.left > ui.originalPosition.left)) {
                            $('#secondaryChartTable').css({
                                'width': child2width + 'px',
                                'left': '10px'
                            });
                        } else {
                            $('#secondaryChartTable').css({
                                left: '10px'
                            });
                        }
                    }
                    $('#secondaryChartTableBody').width($('#secondaryChart').width() - $('#secondaryChartTree').width() - $('#secondaryChart #splitterDiv').width())
                },
                stop: function() {}
            })
        }
        $('#primaryChartTreeBody').on('scroll', function(e) {
            var movedLen = $(this).scrollLeft();
            $('#primaryChartTreeBody').scrollLeft(movedLen);
            $('#primaryChartTreeHead').css('right', movedLen + 'px');
        })
        $('#secondaryChartTreeBody').on('scroll', function(e) {
            var movedLen = $(this).scrollLeft();
            $('#secondaryChartTreeBody').scrollLeft(movedLen);
            $('#secondaryChartTreeHead').css('right', movedLen + 'px');
        })
        $("#primaryChartTableBody").off('scroll').on('scroll', function(e) {
            $('#primaryChartTreeBody').scrollTop($(this).scrollTop());
            $('#primaryChart #eventsDiv').css('margin-top', $(this).scrollTop() + 'px')
        });
        $("#secondaryChartTableBody").off('scroll').on('scroll', function(e) {
            $('#secondaryChartTreeBody').scrollTop($(this).scrollTop());
            $('#secondaryChart #eventsDiv').css('margin-top', $(this).scrollTop() + 'px')
        });
        if ((new Date(self.start_p).getTime() == new Date(self.start_s).getTime()) && (new Date(self.end_p).getTime() == new Date(self.end_s).getTime())) {
            $('#primaryChartTableBody,#secondaryChartTableBody').scroll(function(e) {
                var moved = $(this).scrollLeft();
                $('#primaryChartTableBody,#secondaryChartTableBody').scrollLeft(moved);
                var newLeft = ($('.child1').width()) - moved;
                $('#primaryChartTableHead,#secondaryChartTableHead').css('right', (moved) + 'px');
            });
        } else {
            //----------added
            $('#primaryChartTableBody').scroll(function(e) {
                var moved = $(this).scrollLeft();
                $('#primaryChartTableBody').scrollLeft(moved);
                var newLeft = ($('.child1').width()) - moved;
                $('#primaryChartTableHead').css('right', (moved) + 'px');
            });
            $('#secondaryChartTableBody').scroll(function(e) {
                var moved = $(this).scrollLeft();
                $('#secondaryChartTableBody').scrollLeft(moved);
                var newLeft = ($('.child1').width()) - moved;
                $('#secondaryChartTableHead').css('right', (moved) + 'px');
            });
            //-----------------------       
        }
        $("#primaryChartTree table thead tr td,#secondaryChartTree table thead tr td").off('mouseenter').on('mouseenter', function(evt) {
            $(this).removeClass('columnHeader');
            $(this).addClass('columnHeader-hover');
        });
        $('#primaryChartTree table thead tr td,#secondaryChartTree table thead tr td').off('mouseleave').on('mouseleave', function() {
            $(this).removeClass('columnHeader-hover');
            $(this).addClass('columnHeader');
        });
        var primaryChartTableBody = document.getElementById('primaryChartTableBody');
        if (primaryChartTableBody) {
        	if (primaryChartTableBody.addEventListener) {
                //IE 9, Chrome,safari,Opera
        		primaryChartTableBody.addEventListener('mousewheel', self.MouseWheelHandler, false);
                //Firefox
        		primaryChartTableBody.addEventListener('DOMMouseScroll', self.MouseWheelHandler, false);
            } else {
                //IE 6/7/8
            	primaryChartTableBody.attachEvent('onmousewheel', self.MouseWheelHandler)
            }
        }
        
        var secondaryChartTableBody = document.getElementById('secondaryChartTableBody');
        if (secondaryChartTableBody) {
        	if (secondaryChartTableBody.addEventListener) {
                //IE 9, Chrome,safari,Opera
        		secondaryChartTableBody.addEventListener('mousewheel', self.MouseWheelHandler, false);
                //Firefox
        		secondaryChartTableBody.addEventListener('DOMMouseScroll', self.MouseWheelHandler, false);
            } else {
                //IE 6/7/8
            	secondaryChartTableBody.attachEvent('onmousewheel', self.MouseWheelHandler)
            }
        }
        
        
    }

    ganttChart.prototype.undoMove = function(oEvt) {
        if (self.undoCounter > 0) {
            for (var i = 0; i < self.taskBuffer.length; i++) {
                var obj = self.taskBuffer[self.undoCounter - 1];
                var span = Math.floor((Date.parse(new Date(obj.originalStart)) - Date.parse(new Date(obj.chartStart))) / 86400000) + 1;
                $('#righttable--' + obj.id + '').css('left', (span * self.originalThwidth) + 'px');
                $("#righttable--" + obj.id + "").css('width', (self.getSpan(new Date(obj.originalStart), new Date(obj.originalEnd)) + 1) * self.originalThwidth + 'px');
                $("#righttable--" + obj.id + " #divEnd").css('left', $("#righttable--" + obj.id + "").width() + 'px');
                $("#righttable--" + obj.id + " #divStart")[0].innerHTML = self.convertToRequiredFormat((obj.originalStart).match(/\-|\*|\.|\,|\-|\//), new Date(obj.originalStart));
                $("#righttable--" + obj.id + " #divEnd")[0].innerHTML = self.convertToRequiredFormat((obj.originalEnd).match(/\-|\*|\.|\,|\-|\//), new Date(obj.originalEnd))
                $("#righttable--" + obj.id + " .type3").css('left', ($("#righttable--" + obj.id + "").width() - $('.circleBase.type2').outerWidth()) + 'px');
                if (obj.chartType == 'primaryChart') {
                    var dataObj = underscoreJS.find(self.data_p, {
                        "TREE_ID": obj.id
                    });
                } else {
                    var dataObj = underscoreJS.find(self.data_s, {
                        "TREE_ID": obj.id
                    });
                }
                dataObj.START = obj.originalStart;
                dataObj.END = obj.originalEnd;
                var reqObject = self.CALENDARSETTINGS;
                if (reqObject.OVERLAPMODE) {
                    self.getChartPrepare(obj.chartStart, obj.chartEnd);
                }
                self.processSendData(dataObj, obj.chartType);
                self.changeValiditiesInTree(dataObj, obj.chartType);
                self.undoCounter = self.undoCounter - 1;
                break;
            }
        }
    }
    ganttChart.prototype.redoMove = function(oEvt) {
        if (self.undoCounter != self.taskBuffer.length) {
            self.undoCounter = self.undoCounter + 1;
            for (var i = 0; i < self.taskBuffer.length; i++) {
                var obj = self.taskBuffer[self.undoCounter - 1];
                var span = Math.floor((Date.parse(new Date(obj.newStart)) - Date.parse(new Date(obj.chartStart))) / 86400000) + 1;
                $('#righttable--' + obj.id + '').css('left', (span * self.originalThwidth) + 'px');
                $("#righttable--" + obj.id + "").css('width', (self.getSpan(new Date(obj.newStart), new Date(obj.newEnd)) + 1) * self.originalThwidth + 'px');
                $("#righttable--" + obj.id + " #divEnd").css('left', $("#righttable--" + obj.id + "").width() + 'px');
                $("#righttable--" + obj.id + " #divStart")[0].innerHTML = self.convertToRequiredFormat((obj.newStart).match(/\-|\*|\.|\,|\-|\//), new Date(obj.newStart));
                $("#righttable--" + obj.id + " #divEnd")[0].innerHTML = self.convertToRequiredFormat((obj.newEnd).match(/\-|\*|\.|\,|\-|\//), new Date(obj.newEnd))
                $("#righttable--" + obj.id + " .type3").css('left', ($("#righttable--" + obj.id + "").width() - $('.circleBase.type2').outerWidth()) + 'px');
                if (obj.chartType == 'primaryChart') {
                    var dataObj = underscoreJS.find(self.data_p, {
                        "TREE_ID": obj.id
                    });
                } else {
                    var dataObj = underscoreJS.find(self.data_s, {
                        "TREE_ID": obj.id
                    });
                }
                dataObj.START = obj.newStart;
                dataObj.END = obj.newEnd;
                var reqObject = self.CALENDARSETTINGS;
                if (reqObject.OVERLAPMODE) {
                    self.getChartPrepare(obj.chartStart, obj.chartEnd)
                }
                self.processSendData(dataObj, obj.chartType)
                self.changeValiditiesInTree(dataObj, obj.chartType);
                break;
            }
        }
    }
    ganttChart.prototype.onClickChangeValidity = function(sDate, eDate) {

        if (self.taskBuffer.length != self.undoCounter) { /// indicates i added some ting after undoing , so remove the content from buffer after self.undocounter position
            self.taskBuffer.length = self.undoCounter
        }


        self.taskBuffer.push({
            "id": self.tappedObj['TREE_ID'],
            "originalStart": self.tappedObj['START'],
            "originalEnd": self.tappedObj['END'],
            "newStart": sDate,
            "newEnd": eDate,
            "chartType": self.chartType,
            "chartStart": (self.chartType == "primaryChart") ? self.start_p : self.start_s,
            "chartEnd": (self.chartType == "primaryChart") ? self.end_p : self.end_s,
        })
        self.undoCounter = self.undoCounter + 1;
        self.tappedObj['START'] = sDate;
        self.tappedObj['END'] = eDate;
        if (self.chartType == "primaryChart") {
            var start = self.start_p;
            var end = self.end_p;
        } else {
            var start = self.start_s;
            var end = self.end_s;
        }
        var span = Math.floor((Date.parse(new Date(sDate)) - Date.parse(new Date(start))) / 86400000);
        $("#righttable--" + self.tappedObj["TREE_ID"] + "").css('left', span * self.originalThwidth + 'px');
        $("#righttable--" + self.tappedObj["TREE_ID"] + "").css('width', (self.getSpan(new Date(sDate), new Date(eDate)) + 1) * self.originalThwidth + 'px');
        $("#righttable--" + self.tappedObj["TREE_ID"] + " #divEnd").css('left', $("#righttable--" + self.tappedObj["TREE_ID"] + "").width() + 'px')
        $("#righttable--" + self.tappedObj["TREE_ID"] + " #divStart")[0].innerHTML = self.convertToRequiredFormat((self.tappedObj.START).match(/\-|\*|\.|\,|\-|\//), new Date(self.tappedObj.START));
        $("#righttable--" + self.tappedObj["TREE_ID"] + " #divEnd")[0].innerHTML = self.convertToRequiredFormat((self.tappedObj.END).match(/\-|\*|\.|\,|\-|\//), new Date(self.tappedObj.END))
        $("#righttable--" + self.tappedObj["TREE_ID"] + " .type3").css('left', $("#righttable--" + self.tappedObj["TREE_ID"] + "").width() - $('.circleBase.type2').outerWidth());
        var reqObject = self.CALENDARSETTINGS;
        if (reqObject.OVERLAPMODE) {
            self.getChartPrepare(start, end)
        }
        self.processSendData(self.tappedObj, self.chartType);
        self.changeValiditiesInTree(self.tappedObj, self.chartType);
    }
    ganttChart.prototype.changeValiditiesInTree = function(obj, chartType) {
        obj['DATAB'] = self.convertToRequiredFormat((obj.START).match(/\-|\*|\.|\,|\-|\//), new Date(obj.START));
        obj['DATBI'] = self.convertToRequiredFormat((obj.END).match(/\-|\*|\.|\,|\-|\//), new Date(obj.END));
        if (!self.CALENDARSETTINGS.OVERLAPMODE) {
            var taskClass = $("#" + chartType + "TreeBody" + " ." + $('#righttable--' + obj.TREE_ID + '').parent().parent().attr('class').split(' ').join('.') + " td " + "span#contentDisplay");
            if (chartType == 'primaryChart') {
                for (var i = 0; i < self.columns_p.length; i++) {
                    if (self.columns_p[i].FIELDNAME == "DATAB" || self.columns_p[i].FIELDNAME == "DATBI") {
                        (taskClass[i]).innerText = obj[self.columns_p[i].FIELDNAME];
                    }
                }
            } else {
                for (var i = 0; i < self.columns_s.length; i++) {
                    if (self.columns_s[i].FIELDNAME == "DATAB" || self.columns_s[i].FIELDNAME == "DATBI") {
                        (taskClass[i]).innerText = obj[self.columns_s[i].FIELDNAME];
                    }
                }
            }
        }
    }
    ganttChart.prototype.resizingDragFunc = function() {
            $('[id*=righttable]').off('dblclick').on('dblclick', function(e) {
                if (self.document_mode != 'A') {
                    if ($(e.delegateTarget).hasClass('taskBars')) {
                        var id = e.delegateTarget.getAttribute('id').split("--")[1];
                        self.tappedObj = underscoreJS.find(self.data_p, {
                            "TREE_ID": id
                        });
                        self.chartType = "primaryChart";
                        if (!self.tappedObj) {
                            self.tappedObj = underscoreJS.find(self.data_s, {
                                "TREE_ID": id
                            });
                            self.chartType = "secondaryChart";
                        }
                        self.control.openValidityPopover(e, id, self.tappedObj, self.chartType)
                    }
                }
            })
        },
        ganttChart.prototype.processSendData = function(obj, chartType) {
            var toSendObj = underscoreJS.find(self.sendData, {
                "DOCNO": obj.DOCID
            });
            if (!toSendObj) {
                self.sendData.push({
                    "ROWID": Number(obj['ROWID']),
                    "DOCNO": obj['DOCID'],
                    "DATAB": self.convertToInternalFormat(obj['START']),
                    "DATBI": self.convertToInternalFormat(obj['END']),
                    "CHARTID": (chartType == "primaryChart") ? "1" : "2",
                    "UPDKZ": "U"
                });
            } else {
                toSendObj['ROWID'] = Number(obj['ROWID']);
                toSendObj['DOCNO'] = obj['DOCID'];
                toSendObj['DATAB'] = self.convertToInternalFormat(obj['START']);
                toSendObj['DATBI'] = self.convertToInternalFormat(obj['END'])
            }
            if (!self.CALENDARSETTINGS.SPLITVIEW) {
                self.prepareLinks()
            }
        }
    ganttChart.prototype.convertToInternalFormat = function(oDate) {
        return new Date(oDate).getFullYear() + '-' + ('0' + (new Date(oDate).getMonth() + 1)).slice(-2) + '-' + ('0' + (new Date(oDate).getDate())).slice(-2)
    }
    ganttChart.prototype.dateOverlappingCheck = function(presentStart, presentEnd, prevEventStart, prevEventEnd) {
        if ((prevEventStart <= presentStart && prevEventEnd >= presentStart)) {
            return true;
        } else {
            return false;
        }
    }
    ganttChart.prototype.eventsPrepare = function(from, to, chartType, events) {
        var ofrom = from;
        var oto = to;
        $('#' + chartType + ' #eventsDiv').empty();
        var from = new Date(ofrom);
        var to = new Date(oto);
        var span = self.getSpan(from, to) + 1;
        var thwidth = self.originalThwidth;
        var events = events;
        var fromLeft = 0;
        var flagCount = 0;
        var events = underscoreJS.filter(events, function(f, i, l) {
            return (new Date(f.START) >= from) && (new Date(f.END) <= to)
        });
        $('#' + chartType + ' #eventsDiv').outerWidth($('#' + chartType + 'Table table').outerWidth());
        for (var i = 0; i < events.length; i++) {
            if (events[i + 1]) {
                var presentStart = Date.parse(events[i + 1].START);
                var presentEnd = Date.parse(events[i + 1].END);
            }
            var prevEventStart = Date.parse(events[i].START);
            var prevEventEnd = Date.parse(events[i].END);
            var flag = self.dateOverlappingCheck(presentStart, presentEnd, prevEventStart, prevEventEnd);
            if (!events[i + 1]) {
                flag = false;
            }
            if (!flag) {
                var start = new Date(events[i].START);
                var end = new Date(events[i].END);
                var holidaySpan = self.getSpan(start, end) + 1;
                var fromLeft = (Math.floor((Date.parse(start) - Date.parse(from)) / 86400000)) * self.originalThwidth;
                var holidaysWidth = (holidaySpan * self.originalThwidth)
                var eventsPrepareTemplate = self.templates.eventsPrepareTemplate;
                eventsPrepareTemplate = eventsPrepareTemplate.replace("{{count}}", events[i].RENDEREDID)
                    .replace("{{divColor}}", events[i].COLOR)
                    .replace("{{width}}", holidaysWidth)
                    .replace("{{leftValue}}", fromLeft);
                $('#' + chartType + ' #eventsDiv').append(eventsPrepareTemplate);
                $('#' + chartType + ' #event--' + (events[i].RENDEREDID) + '').css('top', (flagCount * 14) + 'px');
                var flagCount = 0;
            } else {
                var start = new Date(events[i].START);
                var end = new Date(events[i].END);
                var holidaySpan = self.getSpan(start, end) + 1;
                // var fromLeft = ((self.getSpan(from, start) + 1) * self.originalThwidth) - self.originalThwidth;
                var fromLeft = (Math.floor((Date.parse(start) - Date.parse(from)) / 86400000)) * self.originalThwidth;
                var holidaysWidth = (holidaySpan * self.originalThwidth)
                var eventsPrepareTemplate = self.templates.eventsPrepareTemplate;
                eventsPrepareTemplate = eventsPrepareTemplate.replace("{{count}}", events[i].RENDEREDID)
                    .replace("{{divColor}}", events[i].COLOR)
                    .replace("{{width}}", holidaysWidth)
                    .replace("{{leftValue}}", fromLeft);
                $('#' + chartType + ' #eventsDiv').append(eventsPrepareTemplate);
                $('#' + chartType + ' #event--' + (events[i].RENDEREDID) + '').css('top', (flagCount * 14) + 'px');
                flagCount = flagCount + 1;
                $('#' + chartType + ' #eventsDiv').css('height', ((flagCount + 1) * 14) + 'px');
            }
        }
    }
    ganttChart.prototype.elementsHeightFunction = function() {
        if (self.secondInstanceExists == "") {
            self.parentOneInstanceSizes();
        } else {
            self.reqhgt = self.reqhgt / 2;
            $('#primaryChart').css('max-height', self.reqhgt);
            $('#primaryChartTree').css('max-height', self.reqhgt)
            $('#primaryChartTable').css('max-height', self.reqhgt)
            $('#primaryChartTreeBody').css('max-height', $('#primaryChart').height() - $('#primaryChartTreeHead').height());
            $('#primaryChartTableBody').css('max-height', $('#primaryChart').height() - $('#primaryChartTableHead').height());
            $('#primaryChart #splitterDiv').height($('#primaryChartTable').height());
            $('#primaryChartTree').height(self.reqhgt);
            $('#primaryChartTreeBody').height($('#primaryChartTree').height() - $('#primaryChartTreeHead').height())
            $('#primaryChartTableBody').height($('#primaryChartTable').height() - $('#primaryChartTableHead').height())
            $('#primaryChart #clockDiv').css('height', $('#primaryChartTableBody table').height() + 'px');
            //$('#primaryChart [id*=vLine]').css('height', $('#primaryChartTableBody').height() - 13);
            self.orgHgt = (self.reqhgt * 2); // orginal hgt
            self.reqhgt = (self.orgHgt) - $('#primaryChartTable').height();
            $('#secondaryChart').height(self.reqhgt);
            $('#secondaryChartTree').height($('#secondaryChart').height());
            $('#secondaryChartTable').height($('#secondaryChart').height());
            $('#secondaryChartTreeBody').height($('#secondaryChart').height() - $('#secondaryChartTreeHead').height());
            $('#secondaryChartTableBody').height($('#secondaryChart').height() - $('#secondaryChartTableHead').height());
            $('#secondaryChart #clockDiv').css({
                'height': $('#secondaryChartTableBody table').height(),
                'top': '0px',
            });
            $('#secondaryChart').css('top', -((self.orgHgt / 2) - $('#primaryChartTable').height()) - 3 + 'px');
            //$('#secondaryChart [id*=vLine]').css('height', $('#secondaryChartTableBody').height() - 13);
            $('#secondaryChart #splitterDiv').css('height', $('#secondaryChartTable').height());
            $('#primaryChart').width(self.appToolbarWidth);
            $('#primaryChartTable').width($('#primaryChart').width() - $('#primaryChartTree').width() - $('#primaryChart #splitterDiv').width());
            $('#secondaryChart').width(self.appToolbarWidth);
            $('#secondaryChartTable').width($('#secondaryChart').width() - $('#secondaryChartTree').width() - -$('#secondaryChart #splitterDiv').width());
            $('#primaryChartTableBody').width($('#primaryChart').width() - $('#primaryChartTree').width() - $('#primaryChart #splitterDiv').width())
            $('#secondaryChartTable').css({
                'margin-left': '0px',
                'left': $('#secondaryChartTree').width() + $('#secondaryChart #splitterDiv').width()
            })
            $('#secondaryChart #splitterDiv').css('left', $('#secondaryChartTree').width())
            $('#secondaryChartTableBody').width($('#calendarComponent').width() - $('#secondaryChartTree').width() - $('#secondaryChart #splitterDiv').width())
            if ((new Date(self.start_p).getTime() == new Date(self.start_s).getTime()) && (new Date(self.end_p).getTime() == new Date(self.end_s).getTime())) {
                $('#secondaryChartTableBody').width($('#primaryChartTableBody').width());
                // if i have 2 views we should set heights of 1st parent.
                $('#secondaryChartTableBody').width($('#calendarComponent').width() - $('#secondaryChartTree').width() - $('#secondaryChart #splitterDiv').width())
                if ($('#secondaryChart #splitterDiv').is(':visible')) {
                    // $('#secondaryChart #splitterDiv').css('left', $('#primaryChart #splitterDiv').css('left').slice(0, -2) + 'px');
                    $('#secondaryChart #splitterDiv').css('left', $('#primaryChart #splitterDiv').position().left + 'px');
                }
                $('#secondaryChartTree').css('width', $('#primaryChartTree').width())
            }
            if ($('#calendarComponent').position()) {
                $('#popoverDiv').css({
                    'left': ($('#calendarComponent').position().left + $("#calendarComponent").width() - $("#popoverDiv").width()) + 'px',
                    'margin-top': '-3px'
                });
                $("#angleLeftPopover").css({
                    'left': ($('#calendarComponent').position().left + $("#calendarComponent").width() - $("#angleLeftPopover").width()) + 'px',
                    'margin-top': '-3px'
                });
            }
            $('#calendarComponent').height($('#secondaryChart').height() + $('#primaryChartTableBody').height() + $('#primaryChartTableHead').height());
            $('#popoverDiv').height($('#calendarComponent').height() - 13 + 'px');
            $('#popoverContent').height($('#popoverDiv').height() - $('#popoverHeader').height());
            if ($('#vweek').is(':visible')) {
                $('#primaryChart #vmonth [id*=vLine]').height($('#primaryChart #vmonth [id*=vLine]').height() + $('#vmonth').height())
                $('#secondaryChart #vmonth [id*=vLine]').height($('#secondaryChart #vmonth [id*=vLine]').height() + $('#vmonth').height())
            }
            $('#secondaryChartTreeHead #headerWrapper').css({
                "width": $('#secondaryChartTreeHead table').width()
            })
            $('#primaryChartTreeHead #headerWrapper').width($('#primaryChartTreeHead table').width())
            $('#primaryChartTableBody').scrollLeft($('#primaryChartTableBody').scrollLeft() + 1);
            $('#secondaryChartTableBody').scrollLeft($('#secondaryChartTableBody').scrollLeft() + 1);
            $('#primaryChartTableHead').height($('#primaryChartTreeHead').height())
            $('#secondaryChartTableHead').height($('#secondaryChartTreeHead').height())
            if (self.hideTree) {
                $('#primaryChartTree').hide();
                $('#primaryChart #splitterDiv').css('left', '0px') /*.draggable('disable');*/
                $('#primaryChartTable').css('margin-left', '0px');
                $('#primaryChartTable').css('left', $('#primaryChart #splitterDiv').width() + 'px');
                $('#primaryChartTable').width($('#calendarComponent').width());
                $('#primaryChartTableBody').width($('#calendarComponent').width() - 10)
            } else {
                $('#primaryChartTree').show();
                $('#primaryChart #circleLeft').prop('class', 'fa fa-arrow-circle-left')
                $('#primaryChart #splitterDiv').draggable('enable');
                $('#primaryChartTable').css('margin-left', '0px')
                $('#primaryChartTable').css('left', $('#primaryChartTree').width() + $('#primaryChart #splitterDiv').width())
                $('#primaryChart #splitterDiv').css('left', $('#primaryChartTree').width());
                $('#primaryChartTableBody').width($('#calendarComponent').width() - $('#primaryChartTree').width() - $('#splitterDiv').width())
                $('#primaryChartTreeHead #headerWrapper').css({
                    "width": $('#primaryChartTreeHead table').width()
                })
                $('#primaryChart #circleLeft').show();
            }
            if (self.hideTree1) {
                $('#secondaryChartTree').hide();
                $('#secondaryChart #splitterDiv').css('left', '0px') /*.draggable('disable')*/ ;
                $('#secondaryChartTable').css('margin-left', '0px');
                $('#secondaryChartTable').css('left', $('#secondaryChart #splitterDiv').width() + 'px');
                $('#secondaryChartTable').width($('#calendarComponent').width());
                $('#secondaryChartTableBody').width($('#calendarComponent').width() - 10)
            } else {
                $('#secondaryChartTree').show();
                $('#secondaryChart #circleLeft').prop('class', 'fa fa-arrow-circle-left')
                $('#secondaryChart #splitterDiv').draggable('enable');
                $('#primaryChartTable').css('margin-left', '0px')
                $('#secondaryChartTable').css('left', $('#secondaryChartTree').width() + $('#secondaryChart #splitterDiv').width())
                $('#secondaryChart #splitterDiv').css('left', $('#secondaryChartTree').width());
                $('#secondaryChartTableBody').width($('#calendarComponent').width() - $('#secondaryChartTree').width() - $('#secondaryChart #splitterDiv').width())
                $('#secondaryChartTreeHead #headerWrapper').css({
                    "width": $('#secondaryChartTreeHead table').width()
                })
                $('#secondaryChart #circleLeft').show();
            }
        }
    }
    ganttChart.prototype.adjustTrsHeight = function() {
        for (var i = 0; i < $('[id*=righttable]').length; i++) {
            var setHgt = $($('[id*=righttable]')[i]).height() + 35;
            var trClass = $($('[id*=righttable]')[i]).parent().parent();
            var sameClass = $('.' + trClass[0].className.split(' ')[0]);
            $(sameClass).css('height', setHgt);
        }
    }
    ganttChart.prototype.parentOneInstanceSizes = function() {
        self.reqhgt = self.wrapperHeight - self.appToolbarHeight;
        $('#primaryChart').css('max-height', self.reqhgt);
        $('#primaryChartTree').css('max-height', self.reqhgt)
        $('#primaryChartTable').css('max-height', self.reqhgt)
        $('#primaryChartTreeBody').css('max-height', $('#primaryChart').height() - $('#primaryChartTreeHead').height());
        $('#primaryChartTableBody').css('max-height', $('#primaryChart').height() - $('#primaryChartTableHead').height());
        $('#primaryChart').height(self.reqhgt)
        $('#primaryChartTree').height($('#primaryChart').height());
        $('#primaryChartTable').height($('#primaryChart').height());
        $('#primaryChartTreeBody').height($('#primaryChart').height() - $('#primaryChartTreeHead').height());
        $('#primaryChartTableBody').height($('#primaryChart').height() - $('#primaryChartTableHead').height());
        $('#primaryChart #clockDiv').css('height', $('#primaryChartTableBody table').height() + 'px');
        $('#primaryChart #splitterDiv').height($('#primaryChartTree').height());
        $('#primaryChart').width(self.appToolbarWidth);
        $('#primaryChartTable').width($('#primaryChart').width() - ($('#primaryChartTree').width() + $('#primaryChart #splitterDiv').width()));
        //added
        $('#primaryChartTableBody').width($('#primaryChart').width() - ($('#primaryChartTree').width() + $('#primaryChart #splitterDiv').width()))
        //----
        // $('#primaryChart [id*=vLine]').css('height', $('#primaryChartTableBody').height() - 13);
        $('#primaryChart [id*=vmonth] [id*=vLine]').css('height', $('#primaryChart [id*=vmonth] [id*=vLine]').height() + $('#primaryChart [id*=vmonth]').height())
        if ($('#calendarComponent').position()) {
            $('#popoverDiv').css({
                'left': ($('#calendarComponent').position().left + $("#calendarComponent").width() - $("#popoverDiv").width()) + 'px',
                'margin-top': '-3px'
            });
            $("#angleLeftPopover").css({
                'left': ($('#calendarComponent').position().left + $("#calendarComponent").width() - $("#angleLeftPopover").width()) + 'px',
                'margin-top': '-3px'
            });
        }
        $('#calendarComponent').height($('#primaryChartTableBody').height() + $('#primaryChartTableHead').height());
        $('#popoverDiv').height($('#calendarComponent').height() - 13 + 'px');
        $('#popoverContent').height($('#popoverDiv').height() - $('#popoverHeader').height());
        if ($('#vweek').is(':visible')) {
            $('#primaryChart #vmonth [id*=vLine]').height($('#primaryChart #vmonth [id*=vLine]').height() + $('#vmonth').height())
            $('#secondaryChart #vmonth [id*=vLine]').height($('#secondaryChart #vmonth [id*=vLine]').height() + $('#vmonth').height())
        }
        $('#primaryChartTableBody').scrollLeft($('#primaryChartTableBody').scrollLeft() + 1);
        $('#primaryChart [id*=headerWrapper]').width($('#primaryChartTreeBody table').width())
        if (self.hideTree) {
            $('#primaryChartTree').hide();
            $('#primaryChart #splitterDiv').css('left', '0px') /*.draggable('disable')*/ ;
            $('#primaryChartTable').css('margin-left', '0px');
            $('#primaryChartTable').css('left', $('#primaryChart #splitterDiv').width() + 'px');
            $('#primaryChartTable').width($('#calendarComponent').width());
            $('#primaryChartTableBody').width($('#calendarComponent').width() - 10)
        } else {
            $('#primaryChartTree').show();
            $('#primaryChart #circleLeft').prop('class', 'fa fa-arrow-circle-left')
            $('#primaryChart #splitterDiv').draggable('enable');
            $('#primaryChartTable').css('margin-left', '0px')
            $('#primaryChartTable').css('left', $('#primaryChartTree').width() + $('#primaryChart #splitterDiv').width())
            $('#primaryChart #splitterDiv').css('left', $('#primaryChartTree').width());
            $('#primaryChartTableBody').width($('#calendarComponent').width() - $('#primaryChartTree').width() - $('#splitterDiv').width())
            $('#primaryChartTreeHead #headerWrapper').css({
                "width": $('#primaryChartTreeHead table').width()
            })
            $('#primaryChart #circleLeft').show();
        }
        $('#primaryChartTableHead').height($('#primaryChartTreeHead').height())
    }
    ganttChart.prototype.parentTwoInstanceSizes = function() {
        self.reqhgt = self.wrapperHeight - self.appToolbarHeight;
        $('#secondaryChart').height(self.reqhgt);
        $('#secondaryChartTree').height($('#secondaryChart').height());
        $('#secondaryChartTable').height($('#secondaryChart').height());
        $('#secondaryChartTreeBody').height($('#secondaryChart').height() - $('#secondaryChartTreeHead').height());
        $('#secondaryChartTableBody').height($('#secondaryChart').height() - $('#secondaryChartTableHead').height());
        $('#secondaryChart').width(self.appToolbarWidth);
        $('#secondaryChartTable').width($('#secondaryChart').width() - $('#secondaryChartTree').width() - $('#primaryChart #splitterDiv').width());
        $('#secondaryChart #splitterDiv').css({
            'height': $('#secondaryChart').height(),
            'left': $('#secondaryChartTree').width()
        });
        $('#secondaryChartTable').css({
            'margin-left': '0px',
            'left': $('#secondaryChartTree').width() + $('#secondaryChart #splitterDiv').width()
        })
        $('#secondaryChart').css('top', '1px');
        //$('#secondaryChart [id*=vLine]').css('height', $('#secondaryChartTableBody').height() - 13);
        $('#secondaryChart [id*=vmonth] [id*=vLine]').css('height', $('#secondaryChart [id*=vmonth] [id*=vLine]').height() + $('#secondaryChart [id*=vmonth]').height())
        $('#secondaryChart #clockDiv').css({
            'height': $('#secondaryChartTableBody table').height(),
            'top': '0px',
            /*'left': $('#secondaryChart #clockDiv').css('left').slice(0, -2) + 'px'*/
        });
        $('#secondaryChartTableBody').width($('#secondaryChart').width() - $('#secondaryChartTree').width() - $('#secondaryChart #splitterDiv').width())
        $('#calendarComponent').height($('#secondaryChart').height() + 1);
        $('#popoverDiv').height($('#calendarComponent').height() - 13 + 'px');
        //$('#popoverDiv').css({'left':self.appToolbarWidth - $('#popoverDiv').width() + 'px','margin-top':'1px'});
        if ($('#calendarComponent').position()) {
            $('#popoverDiv').css({
                'left': ($('#calendarComponent').position().left + $("#calendarComponent").width() - $("#popoverDiv").width()) + 'px',
                'margin-top': '1px'
            });
            $("#angleLeftPopover").css({
                'left': ($('#calendarComponent').position().left + $("#calendarComponent").width() - $("#angleLeftPopover").width()) + 'px',
                'margin-top': '1px'
            });
        }
        $('#popoverContent').height($('#popoverDiv').height() - $('#popoverHeader').height());
        if ($('#vweek').is(':visible')) {
            $('#primaryChart #vmonth [id*=vLine]').height($('#primaryChart #vmonth [id*=vLine]').height() + $('#vmonth').height())
            $('#secondaryChart #vmonth [id*=vLine]').height($('#secondaryChart #vmonth [id*=vLine]').height() + $('#vmonth').height())
        }
        $('#secondaryChartTableBody').scrollLeft($('#secondaryChartTableBody').scrollLeft() + 1);
        $('#secondaryChart [id*=headerWrapper]').width($('#secondaryChartTreeBody table').width())
        if (self.hideTree1) {
            $('#secondaryChartTree').hide();
            $('#secondaryChart #splitterDiv').css('left', '0px') /*.draggable('disable')*/ ;
            $('#secondaryChartTable').css('margin-left', '0px');
            $('#secondaryChartTable').css('left', $('#secondaryChart #splitterDiv').width() + 'px');
            $('#secondaryChartTable').width($('#calendarComponent').width());
            $('#secondaryChartTableBody').width($('#calendarComponent').width() - 10)
        } else {
            $('#secondaryChartTree').show();
            $('#secondaryChart #circleLeft').prop('class', 'fa fa-arrow-circle-left')
            $('#secondaryChart #splitterDiv').draggable('enable');
            $('#primaryChartTable').css('margin-left', '0px')
            $('#secondaryChartTable').css('left', $('#secondaryChartTree').width() + $('#secondaryChart #splitterDiv').width())
            $('#secondaryChart #splitterDiv').css('left', $('#secondaryChartTree').width());
            $('#secondaryChartTableBody').width($('#calendarComponent').width() - $('#secondaryChartTree').width() - $('#secondaryChart #splitterDiv').width())
            $('#secondaryChartTreeHead #headerWrapper').css({
                "width": $('#secondaryChartTreeHead table').width()
            })
            $('#secondaryChart #circleLeft').show();
        }
        $('#secondaryChartTableHead').height($('#secondaryChartTreeHead').height())
    }
    ganttChart.prototype.placeTheDate = function(chartName) {
        var reqObject = self.CALENDARSETTINGS;
        var JSONdate = reqObject.ANCHORDATE;
        var dateCheck = new Date(JSONdate).getTime(); // current Date
        if (chartName == 'primaryChart') {
            var from = new Date(self.start_p);
            var to = new Date(self.end_p);
        } else {
            var from = new Date(self.start_s);
            var to = new Date(self.end_s);
        }
        var from = Date.parse(from);
        var to = Date.parse(to);
        var ofrom = from;
        var bufferFrom = new Date(ofrom);
        if (dateCheck > to) {
            var bufferTo = new Date(to);
            var span = self.getSpan(bufferFrom, bufferTo) + 1;
            var leftValue = span * self.originalThwidth;
        } else {
            var bufferTo = new Date(JSONdate);
            var span = self.getSpan(bufferFrom, bufferTo);
            var toInSeconds = (((new Date().getHours() * 60) + (new Date().getMinutes())) * 60) + (new Date().getSeconds())
            var extra = (self.originalThwidth / 86400) * toInSeconds;
            var leftValue = (self.originalThwidth * span) + extra;
        }
        $('#' + chartName + 'TableBody #clockDiv').css('left', leftValue + 'px');
    }
    ganttChart.prototype.getSpan = function(from, to) {
        if (from < to) {
            var timeDiff = Math.abs(to.getTime() - from.getTime());
            var colspan = Math.ceil(timeDiff / (1000 * 3600 * 24))
            return colspan;
        } else {
            return 0;
        }
    }
    ganttChart.prototype.getSpanForBuffer = function(from, to) {
        if (from < to) {
            var timeDiff = Math.abs(to.getTime() - from.getTime());
            var colspan = Math.ceil(timeDiff / (1000 * 3600 * 24))
            return colspan;
        } else if (from > to) {
            var timeDiff = Math.abs(from.getTime() - to.getTime());
            var colspan = Math.ceil(timeDiff / (1000 * 3600 * 24))
            return (-colspan);
        } else {
            return 0;
        }
    }
    ganttChart.prototype.prepareHeaderContentData = function(requiredLevel, levelName, chartType) {
        var res = '';
        if (chartType == "primaryChart") {
            var events = self.events_p;
        } else {
            var events = self.events_s;
        }
        for (var z = 0; z < (requiredLevel.DTLS).length; z++) {
            var from = new Date(requiredLevel.DTLS[z].VONTG);
            var to = new Date(requiredLevel.DTLS[z].BISTG);
            var colspan = self.getSpan(from, to);
            var endDateInLevels = new Date(requiredLevel.DTLS[z].BISTG);
            var startDateInLevels = new Date(requiredLevel.DTLS[z].VONTG);
            if (requiredLevel.DTLS[z - 1]) {
                var previousYear = new Date(requiredLevel.DTLS[z - 1].BISTG);
                var presentYear = new Date(requiredLevel.DTLS[z].BISTG);
                self.events_pArr = underscoreJS.filter(events, function(f, ind, l) {
                    return (new Date(f.END) > previousYear) && (new Date(f.END) < presentYear);
                });
            } else {
                self.events_pArr = underscoreJS.filter(events, function(f, ind, l) {
                    return (new Date(f.END) < endDateInLevels) && (new Date(f.START) >= startDateInLevels)
                }); //for first
            }
            var getYearContentTemplate = self.templates.getYearContentTemplate;
            if ($('#' + chartType + 'Table thead tr').length > 1) { // since no need of seperation for 2nd level th
                var dummyTemplate = getYearContentTemplate.split('<div');
                dummyTemplate.splice(2, 1); // deleting #seperatorBar
                getYearContentTemplate = dummyTemplate.join('<div')
            }
            getYearContentTemplate = getYearContentTemplate.replace("{{span}}", (colspan + 1))
                .replace("{{description}}", requiredLevel.DTLS[z].DESCR)
                .replace("{{eventsCount}}", self.events_pArr.length)
            $('#' + chartType + 'Table table thead tr#' + levelName + '').append(getYearContentTemplate);
            if (self.events_pArr.length == 0) {
                $($('#' + chartType + 'Table table thead #' + levelName + ' #eventsCount')[z]).css('visibility', 'hidden');
            }
        }
    }
    ganttChart.prototype.getYearHeader = function(from, to, chartType, levels) {
        $('#' + chartType + 'Table table thead tr[id*=vyear]').remove()
        $('#' + chartType + 'Table table thead').append(self.templates.getYearHeaderTemplate)
        var colspan = self.getSpan(from, to);
        var yearObj = underscoreJS.findWhere(levels, {
            'TEXT': 'Years'
        });
        if (yearObj) {
            self.prepareHeaderContentData(yearObj, "vyear", chartType);
        }
    }
    ganttChart.prototype.getHalfYear = function(from, to, chartType, levels) {
        $('#' + chartType + 'Table table thead tr[id*=vhalf]').remove()
        $('#' + chartType + 'Table table thead').append(self.templates.getHalfYearTemplate)
        var HalfYearObj = underscoreJS.findWhere(levels, {
            'TEXT': 'Half Year'
        });
        if (HalfYearObj) {
            self.prepareHeaderContentData(HalfYearObj, "vhalf", chartType);
        }
    }
    ganttChart.prototype.getQuarters = function(from, to, chartType, levels) {
        $('#' + chartType + 'Table table thead tr[id*=vquarter]').remove()
        $('#' + chartType + 'Table table thead').append(self.templates.getQuartersTemplate)
        var QuarterObj = underscoreJS.findWhere(levels, {
            'TEXT': 'Quarter'
        });
        if (QuarterObj) {
            self.prepareHeaderContentData(QuarterObj, "vquarter", chartType);
        }
    }
    ganttChart.prototype.getmonths = function(from, to, chartType, levels) {
        $('#' + chartType + 'Table table thead tr[id*=vmonth]').remove()
        $('#' + chartType + 'Table table thead').append(self.templates.getMonthsTemplate)
        var colspan;
        var MonthObj = underscoreJS.findWhere(levels, {
            'TEXT': 'Months'
        });
        if (MonthObj) {
            self.prepareHeaderContentData(MonthObj, "vmonth", chartType);
        }
    }
    ganttChart.prototype.getWeeks = function(from, to, chartType, levels) {
        $('#' + chartType + 'Table table thead tr[id*=vweek]').remove()
        $('#' + chartType + 'Table table thead').append(self.templates.getWeeksTemplate);
        var WeekObj = underscoreJS.findWhere(levels, {
            'TEXT': 'Weeks'
        });
        if (WeekObj) {
            self.prepareHeaderContentData(WeekObj, "vweek", chartType);
        }
    }
    ganttChart.prototype.getDays = function(from, to, chartType, levels) {
        $('#' + chartType + 'Table table thead tr#vday').remove();
        var val;
        $('#' + chartType + 'Table table thead').append(self.templates.getDaysTemplate)
        var DayObj = underscoreJS.findWhere(levels, {
            'TEXT': 'Days'
        });
        if (DayObj) {
            var day = DayObj.DTLS;
            for (var z = 0; z < day.length; z++) {
                from = new Date(day[z].VONTG);
                to = new Date(day[z].BISTG);
                var colspan = self.getSpan(from, to);
                var getDaysContentTemplate = self.templates.getDaysContentTemplate;
                getDaysContentTemplate = getDaysContentTemplate.replace("{{span}}", (colspan + 1))
                    .replace("{{description}}", /*day[z].DESCR*/ ("0" + from.getDate()).slice(-2))
                    .replace("{{weekName}}", (from.getDay() == 6 || from.getDay() == 0) ? (self.weekNames[from.getDay()]) : '')
                $('#' + chartType + 'Table table thead tr#vday').append(getDaysContentTemplate);
            }
        }
    }
    ganttChart.prototype.headerPrepare = function(from, to, scale, chartType, levels) {
        from.setHours(0, 0, 0, 0);
        to.setHours(0, 0, 0, 0);
        var noofyears = (to.getFullYear() - from.getFullYear()) + 1;
        switch (scale) {
            case 'Years':
                self.getYearHeader(from, to, chartType, levels);
                break;
            case 'Half Year':
                self.getHalfYear(from, to, chartType, levels);
                break;
            case 'Quarter':
                self.getQuarters(from, to, chartType, levels);
                break;
            case 'Months':
                self.getmonths(from, to, chartType, levels);
                break;
            case 'Weeks':
                self.getWeeks(from, to, chartType, levels);
                break;
            case 'Days':
                self.getDays(from, to, chartType, levels);
                break;
        }
    }
    ganttChart.prototype.MouseWheelHandler = function(e) {
        if (self.xcount == 0) {
            //cross browser wheel delta;
            var e = window.event || e; //old IE supports
            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
            if (delta > 0) {
                if (self.zoomCount == self.levels_p.length - 1) {
                    e.preventDefault();
                } else {
                    ganttChart.prototype.zoomIn();
                }
            } else if (delta < 0) {
                ganttChart.prototype.zoomOut();
            }
            self.control.scalingFunction(self.control, self.zoomCount);
            self.xcount = 1;
        } else {
            self.xcount = 0;
        }
        e.preventDefault();
    }
    ganttChart.prototype.tooltipFunctions = function() {
        $('#primaryChart [id*=event--]').off('click').on('click', function(evt) {
            var idx = this.getAttribute('id').split('--')[1];
            $('#popoverDiv').show("slide", {
                direction: "right"
            }, 600);
            var parentHgt = $('#rightBar--' + idx).parent()[0].offsetTop;
            var scrollVal = parentHgt + $('#rightBar--' + idx)[0].offsetTop - 10;
            $('#popoverDiv #rightBar--' + idx + ' #eventName').effect('highlight', {
                "color": 'yellow'
            }, 4000);
            $(this).effect('highlight', {
                "color": 'yellow'
            }, 4000);
            self.INTERNALSETTINGSFORCALENDAR.SWITCHSTATE = true;
            setTimeout(function() {
                $("#popoverContent").animate({
                    scrollTop: scrollVal + 'px'
                });
            }, 200)
        })
        $('#secondaryChart [id*=event--]').off('click').on('click', function(evt) {
            var idx = this.getAttribute('id').split('--')[1];
            var idx1 = this.getAttribute('id').split('--')[1];
            $('#popoverDiv').show("slide", {
                direction: "right"
            }, 600);
            if ($('#rightBar--' + idx).is(':visible')) {
                var parentHgt = $('#rightBar--' + idx).parent()[0].offsetTop;
            } else {
                var txt = underscoreJS.find(self.events_s, {
                    "RENDEREDID": idx
                }).NAME;
                var idx = underscoreJS.find(self.events_p, {
                    "NAME": txt
                }).RENDEREDID;
                var parentHgt = $('#rightBar--' + idx).parent()[0].offsetTop;
            }
            var scrollVal = parentHgt + $('#rightBar--' + idx)[0].offsetTop - 10;
            $(this).effect('highlight', {
                "color": 'yellow'
            }, 4000);
            $('#popoverDiv #rightBar--' + idx + ' #eventName').effect('highlight', {
                "color": 'yellow'
            }, 4000);
            self.INTERNALSETTINGSFORCALENDAR.SWITCHSTATE = true;
            setTimeout(function() {
                $("#popoverContent").animate({
                    scrollTop: scrollVal + 'px'
                });
            }, 200)
        })
    }
    ganttChart.prototype.genericDateFunction = function(sampledate) {
        var Days = ("0" + (sampledate.getDate())).slice(-2);
        var Months = ("0" + (sampledate.getMonth() + 1)).slice(-2);
        var Years = sampledate.getFullYear();
        if (self.dateFormat == 'ENGLISH') {
            var Months = self.monthNames[Number(Months - 1)];
            return Months + " " + Days + ", " + Years;
        } else {
            return (self.dateFormat).replace('YYYY', Years).replace('MM', Months).replace('DD', Days);
        }
    }
    ganttChart.prototype.filterTasks = function(searchText) {
        var object = [];
        self.searchText = searchText
        if (!self.CALENDARSETTINGS.OVERLAPMODE) {
            if (searchText != "") {
                $("#calendarComponent table tbody td").filter(function(index) {
                    var trClass = '.' + $(this).parent().attr('class');
                    trClass = trClass.split(' ').join('.');
                    trClass = trClass.split('.');
                    if (trClass.length > 2) { // specifies i have all parent nulls
                        trClass.pop();
                    }
                    trClass = trClass.join('.');
                    var txt = $(this)[0].innerText.toLowerCase();
                    var srchTxt = searchText.toLowerCase();
                    if (txt.indexOf(srchTxt) != -1) {
                        object.push(trClass)
                        $(trClass).show()
                    } else {
                        $(trClass).hide();
                    }
                })
            } else {
                $("#calendarComponent table tbody td").filter(function(index) {
                    var trClass = '.' + $(this).parent().attr('class');
                    trClass = trClass.split(' ').join('.');
                    trClass = trClass.split('.');
                    if (trClass.length > 2) { // specifies i have all parent nulls
                        trClass.pop();
                    }
                    trClass = trClass.join('.');
                    object.push(trClass)
                })
            }
            for (var i = 0; i < object.length; i++) {
                $(object[i]).show();
            }
            if (!self.CALENDARSETTINGS.SPLITVIEW) {
                $('g').remove()
                self.prepareLinks()
            }
        } else {
            self.collapsedClass = [];
            var classes = $('.treegrid-collapsed');
            for (var i = 0; i < classes.length; i++) {
                var t1 = $($('.treegrid-collapsed')[i]).attr('class').split(' ');
                var class1 = $($('.treegrid-collapsed')[i]).attr('class').split(' ')[t1.length - 2];
                self.collapsedClass.push(class1)
            }
            if (searchText != "") {
                $("#primaryChartTreeBody table tbody td,#secondaryChartTreeBody table tbody td").each(function(index) {
                    var trClass = '.' + $(this).parent().attr('class');
                    var leftTree = trClass.split(' ')[0]; //".treegrid-0001"
                    var rightTable = trClass.split(' ')[0].split('-').join('-parent-'); //".treegrid-parent-0001"
                    var txt = $(this)[0].innerText.toLowerCase();
                    var srchTxt = searchText.toLowerCase();
                    if (txt.indexOf(srchTxt) != -1) {
                        object.push(leftTree)
                        object.push(rightTable)
                        $(leftTree).show()
                        $(rightTable).show()
                    } else {
                        $(rightTable).hide();
                        $(leftTree).hide();
                    }
                })
            } else {
                $("#primaryChartTreeBody table tbody td,#secondaryChartTreeBody table tbody td").each(function(index) {
                    var trClass = '.' + $(this).parent().attr('class');
                    var leftTree = trClass.split(' ')[0]; //".treegrid-0001"
                    var rightTable = trClass.split(' ')[0].split('-').join('-parent-'); //".treegrid-parent-0001"
                    object.push(leftTree)
                    object.push(rightTable)
                })
            }
            for (var i = 0; i < object.length; i++) {
                $(object[i]).show();
            }
            for (var x = 0; x < self.collapsedClass.length; x++) {
                $('.' + self.collapsedClass[x].split('-').join('-parent-')).hide()
            }
        }
        $('#primaryChart [id*=vLine]').css('height', $('#primaryChartTableBody').height() - 13);
        $('#secondaryChart #clockDiv').css('height', $('#secondaryChartTableBody table').height());
        $('#primaryChart #clockDiv').css('height', $('#secondaryChartTableBody table').height());
        $('#secondaryChart [id*=vLine]').css('height', $('#secondaryChartTableBody').height() - 13);
        $('#primaryChartTableBody').scrollLeft($('#primaryChartTableBody').scrollLeft() + 1);
    }
    ganttChart.prototype.clearData = function() {
            if (self.renderFirstTime) {
                $('#primaryChartTree table tbody,#secondaryChartTree table tbody').empty();
                $('#primaryChartTree table thead tr,#secondaryChartTree table thead tr').empty();
            }
            $('#primaryChartTable table tbody,#secondaryChartTable table tbody').empty();
            $('[id*=eventTooltip]').remove();
        },
        ganttChart.prototype.clearAllHeader = function() {
            $('#primaryChartTable table thead,#secondaryChartTable table thead').empty();
        },
        ganttChart.prototype.zoomIn = function() {

            var from = new Date(self.start_p);
            var to = new Date(self.end_p);
            var span = self.getSpan(from, to) + 1;
            var levels = 0;
            if (self.zoomCount >= 1 && self.zoomCount < 5) {
                self.clearData();
                self.prevScaleZoomIn = self.zoomCount;
                self.zoomCount = self.zoomCount + 1;
                self.CALENDARSETTINGS.ZOOMCOUNT = self.zoomCount
                self.clearAllHeader();
                var tempArr = [];
                var val;
                tempArr.push(self.scale[Number(self.zoomCount)]); // scale is object which contains all views
                tempArr.push(self.scale[Number(self.zoomCount) + 1]);
                for (var t = 0; t < tempArr.length; t++) {
                    self.headerPrepare(from, to, tempArr[t], "primaryChart", self.levels_p)
                }
                self.getChartPrepare(from, to);
            }
        }
    ganttChart.prototype.zoomOut = function() {
        var from = new Date(self.start_p);
        var to = new Date(self.end_p);
        var span = self.getSpan(from, to) + 1;
        if (self.zoomCount > 1) {
            self.clearData();
            self.originalThwidth = self.scale['w' + self.zoomCount];
            self.zoomCount = self.zoomCount - 1;
            self.CALENDARSETTINGS.ZOOMCOUNT = self.zoomCount
            self.prevScaleZoomIn = self.zoomCount;
            self.clearAllHeader();
            var tempArr = [];
            var val;
            tempArr.push(self.scale[Number(self.zoomCount)]); // scale is object which contains all views
            tempArr.push(self.scale[Number(self.zoomCount) + 1]);
            for (var t = 0; t < tempArr.length; t++) {
                self.headerPrepare(from, to, tempArr[t], "primaryChart", self.levels_p)
            }
            self.getChartPrepare(from, to);
        }
    }
    ganttChart.prototype.scaleZoomIn = function(previousValue, orgVal) {
        self.clearData();
        var val;
        var from = new Date(self.start_p);
        var to = new Date(self.end_p);
        var span = self.getSpan(from, to) + 1;
        //$('#primaryChartTable table thead').empty();
        self.clearAllHeader();
        var tempArr = [];
        tempArr.push(self.scale[orgVal]); // scale is object which contains all views
        tempArr.push(self.scale[Number(orgVal) + 1]);
        self.zoomCount = Number(orgVal);
        self.originalThwidth = self.scale['w' + orgVal];
        self.CALENDARSETTINGS.ZOOMCOUNT = self.zoomCount
        for (var t = 0; t < tempArr.length; t++) {
            self.headerPrepare(from, to, tempArr[t], "primaryChart", self.levels_p)
        }
        self.getChartPrepare(from, to);
        self.prevScaleZoomIn = self.zoomCount;
    }
    ganttChart.prototype.scaleZoomOut = function(previousValue, orgVal) {
        self.clearData();
        var from = new Date(self.start_p);
        var to = new Date(self.end_p);
        var span = self.getSpan(from, to) + 1;
        self.clearAllHeader();
        var tempArr = [];
        self.zoomCount = Number(orgVal);
        self.CALENDARSETTINGS.ZOOMCOUNT = self.zoomCount
        tempArr.push(self.scale[orgVal]); // scale is object which contains all views
        tempArr.push(self.scale[Number(orgVal) + 1]);
        self.originalThwidth = self.scale['w' + orgVal];
        for (var t = 0; t < tempArr.length; t++) {
            self.headerPrepare(from, to, tempArr[t], "primaryChart", self.levels_p);
        }
        self.getChartPrepare(from, to);
        self.prevScaleZoomIn = self.zoomCount;
    }
})(ganttChart || (ganttChart = {}));