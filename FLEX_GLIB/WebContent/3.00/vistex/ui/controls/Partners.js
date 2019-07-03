sap.ui.define([
    "sap/ui/core/Control",
    vistexConfig.rootFolder + "/ui/core/global",
    vistexConfig.rootFolder + "/ui/core/underscore-min",
    vistexConfig.rootFolder + "/ui/core/commonUtils"
], function(control,global,underscoreJS,commonUtils) {

    var A = control.extend(vistexConfig.rootFolder + ".ui.controls.Partners", {
        metadata: {
            properties: {
              controller: {
                type : "object",
                defaultValue: null
              },
              modelName : {
                 type: "string",
                 defaultValue: null
              },
              dataPath : {
                 type: "string",
                 defaultValue: null
              },
              ptrflds: {
                 type: "string",
                 defaultValue: null
              },
              title:{
                type: "string",
                  defaultValue: null
              },
//              ptrdata: {
//                 type: "string",
//                 defaultValue: null
//              },
              selectedFilter: {
                 type: "string",
                 defaultValue: null
              },
              showTitle:{
                type:"boolean",
                defaultValue: null
              },
              editable : {
                 type: "boolean",
                 defaultValue: false
              }
            },
            events: {
                partnerUpdate: {},
                partnerDelete: {},
                partnerFunctionChange: {},
                filterSelect: {},
                onValueHelpRequest: {},
                fieldEvent: {
                    parameters: {
                        selectionSet: {
                            type: "sap.ui.core.Control[]"
                        }
                    }
                },
                messagesShow: {
                    parameters: {
                        selectionSet: {
                            type: "sap.ui.core.Control[]"
                        }
                    }
                }
            },
            aggregations: {
                _ogetPartnersPanel: {
                    type: "sap.m.FlexBox",                	
                    multiple: false,
                    visibility: "hidden"
                },
                //*****Rel 60E_SP6
                content: {
                	type: "sap.ui.core.Control",
                	multiple: true,
                	singularName: "content",
                	visibility: "hidden"
                }
                //*****
            }
        },
        init: function() {
            //this.onPartners();
            partnersControl = this;
            partnersControl.ptrData = {
                "ROW_ID":"",
                "PARVW":"",
                "PARTNER":"",
                "NRART":"",
                "SHLPNAME":"",
                "FIELDNAME":"",
                "NAME1":"",
                "STREET":"",
                "CITY":"",
                "POST_CODE":"",
                "COUNTRY":"",
                "EDIT":"",
                "RDONLY_FIELDS":"",
                "UPDKZ":"",
                "-IRM_-PARVW":""
               };
            this._oTitle = new sap.m.Title({
                titleStyle :sap.ui.core.TitleLevel.H3
            });
           //.bindProperty("text", modelName+">"+dataPath, partnersFormater.gridTitle, sap.ui.model.BindingMode.OneWay);
            this._oBundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls");
        },

        onPartners: function() {
            var oControl = this;
            var oController = this.getController();
            var modelName = this.getModelName();
            var dataPath = this.getDataPath();
            var model = oController.getModel(modelName);
            var mainModel = oController.getModel(global.vui5.modelName);
            var ptrflds = this.getPtrflds();
            var editable = this.getEditable();
            oControl.sectionData = oController.sectionData;

            //*****Rel 60E_SP6
            oControl.addInvisibleText = new sap.ui.core.InvisibleText({
            	text: oControl._oBundle.getText("Add")
            });
            oControl.filterInvisibleText = new sap.ui.core.InvisibleText({
            	text: oControl._oBundle.getText("Filter")
            });
            oControl.editInvisibleText = new sap.ui.core.InvisibleText({
            	text: oControl._oBundle.getText("Edit")
            });
            oControl.delInvisibleText = new sap.ui.core.InvisibleText({
            	text: oControl._oBundle.getText("Del")
            });
            //*****
            
            oControl.filterInfoText = new sap.m.Text({
                maxLines: 1,
                width: "100%"
            });
            oControl.headerInfobar = new sap.m.Toolbar({
                design: sap.m.ToolbarDesign.Info,
                content: [oControl.filterInfoText,
                    new sap.m.ToolbarSpacer({}),
                    new sap.ui.core.Icon({
                        src: "sap-icon://decline",
                        width: "1.2rem",
                        tooltip: oControl._oBundle.getText("Close"),
                        press: function() {
                            var filters = mainModel.getProperty("/DROPDOWNS/"+oControl.sectionData['DARID']+"/FILTERS");
                            var selRecord = underscoreJS.findWhere(filters,{NAME: "PARALL"});
                            var promise = oControl.fireFilterSelect([{filter: selRecord},
                                                                     {callBack: function(resp){
                                                                     oControl.headerInfobar.setVisible(false);
                                                                     }}]);
                        }
                    })
                ],
                visible: false
            });
//          this._oTitle = new sap.m.Title({
//              design: sap.m.LabelDesign.Bold
//          }).bindProperty("text", modelName+">"+dataPath, partnersFormater.gridTitle, sap.ui.model.BindingMode.OneWay);            
            var oToolbar = new sap.m.Toolbar({
                content: [this._oTitle,
//                    new sap.m.Label({
//                        design: sap.m.LabelDesign.Bold
//                    }).bindProperty("text", modelName+">"+dataPath, partnersFormater.gridTitle, sap.ui.model.BindingMode.OneWay),
                    new sap.m.ToolbarSpacer({}),
                    new sap.ui.core.Icon({
                        src: "sap-icon://add",
                        width: "1.5rem",
                        visible: editable,
                        //*****Rel 60E_SP6
                        tooltip: oControl._oBundle.getText("Add"),                        
                        ariaLabelledBy: oControl.addInvisibleText,
                        //*****
                        press: [oControl._onPartnerCreate, oControl]
                    }),//.bindProperty("visible", editable, partnersFormater.returnBoolean, sap.ui.model.BindingMode.OneWay),
                    new sap.ui.core.Icon({
                        src: "sap-icon://filter",
                        width: "1.5rem",
                        //*****Rel 60E_SP6
                        tooltip: oControl._oBundle.getText("Filter"),                        
                        ariaLabelledBy: oControl.filterInvisibleText,
                        //*****
                        press: [oControl._onFilterClick, oControl]
                    })
                ]
            });

            oToolbar.setModel(model, modelName);
            oControl.oPartnersTable = new sap.m.Table({
                growing: true,
                inset: false,
                showUnread: true,
                width: "100%"
            });
            oControl.oPartnersTable.setModel(model, modelName);

            oControl.columns = [];
            oControl.oPartnersTable.bindAggregation("columns", modelName+">"+ptrflds, function(sid, oContext) {
                var contextObject = oContext.getObject();
                var columnName = contextObject['FLDNAME'];
                oControl.columns.push(columnName);
                var label = contextObject['LABEL'];
                var width;
                if (columnName == 'ICON') {
                    width = "12%";
                } else {
                    width = "29%";
                }

                var oLabel = new sap.m.Label({
                    text: label
                });

                //var oTemplate = new sap.m.Text({}).bindProperty("text", columnName);
                return new sap.m.Column({
                    visible: true,
                    header: oLabel,
                    //template: oTemplate,
                    width: width,
                    popinDisplay: sap.m.PopinDisplay.WithoutHeader
                });
            });

            oControl.oPartnersTable.bindAggregation("items",modelName+">"+ this.getDataPath(), function(sid, oContext) {
                var disable, oEdit, datasPath, oLayout,oRow;
                var contextObject = oContext.getObject();
                var cells = [];
                var oCancel;
                var oPath = oContext.sPath;
                underscoreJS.each(oControl.columns, function(obj, index) {
                    var lv_edit;
                    if (contextObject['EDIT'] == 'X') {
                        lv_edit = true;
                    } else {
                        lv_edit = false;
                    }
                    if (obj == "PARTNER") {
                        if(underscoreJS.contains(contextObject['RDONLY_FIELDS'],obj)){
                          lv_edit = false;
                        }
                        if (lv_edit == false) {
                            var oGrid = new sap.ui.layout.Grid({
                              width: "100%",
                              hSpacing: 0,
                              vSpacing: 0,
                              defaultSpan: "L12 M12 S12",
                              content:[
                                       new sap.ui.layout.HorizontalLayout({
                                         content:[
                                                  new sap.m.Link({
                                                    text: contextObject['NAME1'],
                                                      press: [oControl._onSelect, oControl]
                                                  }),
                                                  new sap.m.Link({
                                                          text: "(" + contextObject[obj] + ")",
                                                          press: [oControl._onSelect, oControl]
                                                      }).addStyleClass("partnerNum")
                                                 ]
                                       })
                                       ]
                            });
                            cells.push(oGrid);
                        } else {
                            var fldname = oContext.getObject('FIELDNAME');
                            datasPath = modelName + ">" + oPath + "/PARTNER";
                            var oInput = new sap.m.Input({
                                value: contextObject[obj],
                                showValueHelp: true,
                                maxLength: 10,
                                fieldWidth: "30%",
                                valueHelpRequest: function(oEvt) {
                                    oControl._onValueHelp(oEvt);
                                },
//*****Rel 60E_SP6
                                change: function(oEvt){
                                  oControl.oPartnersTable.getBinding("items").bSuspended = true;
                                }
//*****
                            }).bindValue(datasPath, null, sap.ui.model.BindingMode.TwoWay);

                            oInput.setShowSuggestion(true);
                            oInput.setFilterSuggests(false);
                            oInput.setMaxSuggestionWidth("50%");
                            oInput.attachSuggest(oControl.handleTypeAhead.bind(oControl));
                            oInput.attachSuggestionItemSelected(oControl.handleSuggestionItemSelected.bind(oControl));
                            oInput.bindAggregation("suggestionColumns", global.vui5.modelName + ">/TYPEAHEAD/"+fldname+"/FIELDS", function(sid, oContext) {
                                var contextObject = oContext.getObject();
                                return new sap.m.Column({
                                    header: new sap.m.Text({
                                        text: contextObject['LABEL']
                                    })
                                });
                            });

                            oInput.bindAggregation("suggestionRows", global.vui5.modelName + ">/TYPEAHEAD/"+fldname+"/DATA", function(sid, oContext) {
                                var contextObject = oContext.getObject();
                                var model = oController.getModel(global.vui5.modelName);
                                var fields = model.getProperty("/TYPEAHEAD/"+fldname+"/FIELDS");
                                var cells = [];
                                underscoreJS.each(fields, function(obj) {
                                    var label = new sap.m.Label({
                                        text: contextObject[obj['FLDNAME']]
                                    });
                                    cells.push(label);
                                });
                                var listItem = new sap.m.ColumnListItem({
                                    vAlign: sap.ui.core.VerticalAlign.Middle,
                                    cells: cells
                                });
                                return listItem;
                            });

                            oInput.attachBrowserEvent("keypress", function(oEvent) {
                                if (oEvent.keyCode == 13) {
                                    oControl._onPartnerChange();
                                }
                            });
                            cells.push(oInput);
                        }
                    } else if (obj == "ICON") {
                        if(underscoreJS.contains(contextObject['RDONLY_FIELDS'],"PARTNER")){
                          disable = 'X';
                        }                                               
                        
                        oCancel = new sap.ui.core.Icon({
                            src: "sap-icon://sys-cancel",
                            color: "#cc1919",
                            tooltip: oControl._oBundle.getText("Del"),
                            //*****Rel 60E_SP6
                            ariaLabelledBy: oControl.delInvisibleText,
                            //*****
                            visible: editable,                            
                            press: function() {
                                oControl._onConfirmDialog(oPath);
                            }
                        });
                        //.bindProperty("visible", editable, partnersFormater.returnBoolean, sap.ui.model.BindingMode.OneWay);

                        var hAlign = sap.ui.commons.layout.HAlign.Center;

                        if (lv_edit == false && disable != 'X') {
                            oEdit = new sap.ui.core.Icon({
                                src: "sap-icon://edit",
                                color: "gray",
                                tooltip:oControl._oBundle.getText("Edit"),
                                //*****Rel 60E_SP6                        
                                ariaLabelledBy: oControl.editInvisibleText,
                                //*****
                                visible: editable,
                                press: [oControl._onEdit, oControl]
                            });
                            //.bindProperty("visible", global.vui5.modelName+">/DOCUMENT_MODE", partnersFormater.returnBoolean, sap.ui.model.BindingMode.OneWay);

                        } else if (lv_edit == true && disable != 'X') {
                            hAlign = sap.ui.commons.layout.HAlign.Left;
                            oEdit = new sap.m.Button({
                                text: oControl._oBundle.getText("Ok"),
                                type: sap.m.ButtonType.Transparent,
                                visible: editable,
                                press: [oControl._onOkClick, oControl]
                            });
                            //.bindProperty("visible", global.vui5.modelName+">/DOCUMENT_MODE", partnersFormater.returnBoolean, sap.ui.model.BindingMode.OneWay);

                            oCancel = new sap.m.Button({
                                text: oControl._oBundle.getText("Cancel"),
                                type: sap.m.ButtonType.Transparent,
                                visible: editable,
                                press: function(oEvent) {
                                    var sPath = oEvent.getSource().getBindingContext(modelName).sPath;
                                    var selectedRow = model.getProperty(sPath);
                                    if (selectedRow.UPDKZ == "I") {
                                        oControl._onPartnerDelete(sPath);
                                    } else {
                                        var parvw = oControl.selected.split("_")[0];
                                        var partner = oControl.selected.split("_")[1];
                                        model.setProperty(sPath + "/PARVW", parvw);
                                        model.setProperty(sPath + "/PARTNER", partner);
                                        model.setProperty(sPath + "/EDIT", "");
                                        oControl.selected = "";
                                    }

                                }
                            });
                            //.bindProperty("visible", global.vui5.modelName+">/DOCUMENT_MODE", partnersFormater.returnBoolean, sap.ui.model.BindingMode.OneWay);

                        }
                        var oHLayout = new sap.ui.layout.HorizontalLayout({
                          content: [oEdit,oCancel]
                        });

                        if (lv_edit == false && disable != 'X') {
                          oHLayout.addStyleClass("VuiHLayout");
                        }
                        else if(lv_edit == true && disable != 'X'){
                          oHLayout.removeStyleClass("VuiHLayout");
                        }

                        var oGrid = new sap.ui.layout.Grid({
                          width: "100%",
                          hSpacing: 1,
                          vSpacing: 0,
                          defaultSpan: "L12 M12 S12",
                          position: "Center",
                          content: [oHLayout]
                        });
                        cells.push(oGrid);
                    } else if (obj == 'PARVW') {
                        if(underscoreJS.contains(contextObject['RDONLY_FIELDS'],"/IRM/PARVW")){
                          lv_edit = false;
                        }
                        datasPath = modelName + ">" + oPath + "/PARVW";
                        if(lv_edit == false){
                          var oText = new sap.m.Text().bindProperty("text" ,{
                                parts: [{path: datasPath},
                                        {path: global.vui5.modelName+">/DROPDOWNS/"+oControl.sectionData['DARID']+"/PARVW/"}],
                                      formatter: partnersFormater.setParvw,
                                      mode: sap.ui.model.BindingMode.OneWay
                                      });
                              cells.push(oText);
                           }
                          else{
                            var oBox = new global.vui5.ui.controls.ComboBox({
                                selectionChange: [oControl._onPartnerFunctionChange, oControl]
                            }).bindProperty("selectedKey", datasPath, null, sap.ui.model.BindingMode.TwoWay);

                            oBox.setModel(model, modelName);
                            oBox.setModel(mainModel, global.vui5.modelName);
                            oBox.bindAggregation("items", global.vui5.modelName+">/DROPDOWNS/"+oControl.sectionData['DARID']+"/PARVW/", function(sId, oContext) {
                                return new sap.ui.core.Item({
                                    key: oContext.getObject("NAME"),
                                    text: oContext.getObject("VALUE")
                                });
                            });
                            oBox.setProperty("editable", lv_edit);
                            cells.push(oBox);
                        }
                       /* if(underscoreJS.contains(contextObject['RDONLY_FIELDS'],"/IRM/PARVW")){
                          lv_edit = false;
                        }
                        datasPath = modelName + ">" + oPath + "/PARVW";
                        var oBox = new global.vui5.ui.controls.ComboBox({
                            selectionChange: [oControl._onPartnerFunctionChange, oControl]
                        }).bindProperty("selectedKey", datasPath, null, sap.ui.model.BindingMode.TwoWay);

                        oBox.setModel(model, modelName);
                        oBox.setModel(mainModel, global.vui5.modelName);
                        oBox.bindAggregation("items", global.vui5.modelName+">/DROPDOWNS/"+oControl.sectionData['DARID']+"/PARVW/", function(sId, oContext) {
                            return new sap.ui.core.Item({
                                key: oContext.getObject("NAME"),
                                text: oContext.getObject("VALUE")
                            });
                        });
                        oBox.setProperty("editable", lv_edit);
                        cells.push(oBox);
                        */
                    } else if (obj == "DUMMY") {
                        cells.push(new sap.m.Text({}));
                    } else if (obj == "HDRPR") {
                        datasPath = modelName + oPath + "/HDRPR";
                        var oCheck = new sap.m.CheckBox({
                                enabled: false
                            }).bindProperty("selected", datasPath, partnersFormater.itemPartners, sap.ui.model.BindingMode.OneWay);
                        cells.push(oCheck);
                    }
                });
                var oList = new sap.m.ColumnListItem({
                    type: sap.m.ListType.Inactive,
                    vAlign: "Middle",
                    cells: cells
                });
                return oList;
            });

            var oFlex = new sap.m.FlexBox({
                height: "100%",
                width: "100%",
                direction: sap.m.FlexDirection.Column,
                items: [oToolbar, oControl.headerInfobar, oControl.oPartnersTable]
            });
            
            //*****Rel 60E_SP6
            oControl.addAggregation("content", oControl.addInvisibleText);
            oControl.addAggregation("content", oControl.filterInvisibleText);
            oControl.addAggregation("content", oControl.editInvisibleText);
            oControl.addAggregation("content", oControl.delInvisibleText);
            //*****
            
            oControl.setAggregation("_ogetPartnersPanel", oFlex);
        },

        renderer: function(oRM, oControl) {
            oRM.write("<style>");
            oRM.write(".filter{ width:100% !important; }");
            oRM.write(".partnerNum{ padding-left: 5px !important;}");
            oRM.write(".VuiHLayout .sapUiHLayoutChildWrapper{padding-right: 10% !important}");
            oRM.write("</style>");
            oRM.write("<div");
            oRM.writeControlData(oControl);
            oRM.write(">");

            oRM.renderControl(oControl.getAggregation("_ogetPartnersPanel"));
            //*****Rel 60E_SP6
            var aChildren = oControl.getAggregation("content");
            var iLength = aChildren.length;
            for (var i = 0; i < iLength; i++) {
                oRM.renderControl(aChildren[i]);
            }
            //*****
            oRM.write("</div>");
        }
    });

    A.prototype.setModelName = function(value) {
      this.setProperty("modelName",value,true);
    };

    A.prototype.setDataPath = function(value) {
      this.setProperty("dataPath",value,true);
    };
    A.prototype.setShowTitle = function(value) {
        this.setProperty("showTitle",value,true);
        this._oTitle.setVisible(value);
    };
    A.prototype.setTitle = function(value){
       this.setProperty("title",value,true);
       this._oTitle.setText(value);
    };

    A.prototype.setPtrflds = function(value) {
      this.setProperty("ptrflds",value,true);
    };

//    A.prototype.setPtrdata = function(value) {
//      this.setProperty("ptrdata",value,true);
//    };

    A.prototype.setSelectedFilter = function(value) {
      this.setProperty("selectedFilter",value,true);
    };

    A.prototype.setEditable = function(value) {
      this.setProperty("editable",value,true);
    };

    A.prototype.partnerInfocusSet = function() {
        this.onPartners();
    };

    A.prototype._getChangedData = function() {
      var oControl = this;
      var oController = this.getController();
      var modelName = oControl.getModelName();
      var dataPath = oControl.getDataPath();
      var model = oControl.getModel(modelName);
      var mainModel = oController.getModel(global.vui5.modelName);
      oReturn = "";

      var partners = model.getProperty(dataPath) || [];
      underscoreJS.each(partners, function(obj) {
         if (obj.EDIT == 'X') {
            if (obj.PARVW == "") {
                    oControl.fireMessagesShow({
                        "MESSAGES": [{MSGLI: oControl._oBundle.getText("EnterPartnerFunc"),
                                      MSGTY: "E"}]
                    });
                    oReturn = "X";
                    return;
            }
            if (obj.PARTNER == "") {
                    oControl.fireMessagesShow({
                        "MESSAGES": [{MSGLI: oControl._oBundle.getText("EnterPartner"),
                                      MSGTY: "E"}]
                    });
                    oReturn = "X";
                    return;
            }
         }
      });

      mainModel.setProperty("/DOCUMENT_ERRORS", oReturn);
      return underscoreJS.isEmpty(oReturn) ? partners : [];
    };

    A.prototype._onPartnerChange = function(newRow, data, selected) {
        var oControl = this;
//*****Rel 60E_SP6
        oControl.oPartnersTable.getBinding("items").bSuspended = false;
        oControl.oPartnersTable.getBinding("items").checkUpdate(false);
//*****
        var oController = this.getController();
        var modelName = this.getModelName();
        var dataPath = this.getDataPath();
       // var ptrdata = this.getPtrdata();
        var model = oController.getModel(modelName);
        var partners = model.getProperty(dataPath);
        var docs = [];
        oReturn = ""; //dont declare with var
        flag = ""; //dont declare with var
        underscoreJS.each(partners, function(obj) {
            if (obj.EDIT == 'X') {
                if (obj.PARVW == "") {
                    var msg = [{
                        MSGLI: oControl._oBundle.getText("EnterPartnerFunc"),
                        MSGTY: "E"
                    }];
                    oControl.fireMessagesShow({
                        "MESSAGES": msg
                    });
                    oReturn = "X";
                    return;
                }
                if (obj.PARTNER == "") {
                    var msg = [{
                        MSGLI: oControl._oBundle.getText("EnterPartner"),
                        MSGTY: "E"
                    }];
                    oControl.fireMessagesShow({
                        "MESSAGES": msg
                    });
                    oReturn = "X";
                    return;
                }
                flag = "X";
            }
            docs.push(obj);
        });
        if (oReturn == "X") {
            return;
        }
        if (newRow == "" && flag != "X") {
            underscoreJS.each(partners, function(obj) {
                if (data.PARVW == obj["PARVW"] &&
                    data.PARTNER == obj["PARTNER"]) {
                    obj["EDIT"] = 'X';
                }
            });
            model.setProperty(dataPath,docs);
            return;
        }

        var promise = oControl.firePartnerUpdate({callBack:function(resp){
           data = model.getProperty(dataPath);
           if (newRow == "X" && resp['RESULT']['ERRORS'] != "X") {
             var emptydata =  jQuery.extend(true,{}, partnersControl.ptrData);

//             var emptydata = underscoreJS.clone(partnersControl.ptrData);
             if (data.length != 0) {
               var length = data.length - 1;
               var rowid = parseInt(data[length].ROWID);
               rowid = rowid + 1;
             } else {
               var rowid = 1;
             }
             emptydata['ROWID'] = rowid;
             emptydata['EDIT'] = 'X';
             emptydata['UPDKZ'] = 'I';
             data.push(emptydata);
             model.setProperty(dataPath, data);
          }
          if(selected && resp['RESULT']['ERRORS'] != "X"){
            docs = [];
            selected = selected.split("_");
            underscoreJS.each(data,function(obj,i){
              if(obj['PARVW'] == selected[0] && obj['PARTNER'] == selected[1]){
                obj['EDIT'] = "X";
              }
              docs.push(obj);
            });
            model.setProperty(dataPath,docs);
          }
       }});

    };

    A.prototype._onOkClick = function() {
        var oControl = this;
        oControl._onPartnerChange();
    };

    A.prototype._onEdit = function(oEvent) {
        var oControl = this;
        var oController = this.getProperty("controller");
        var modelName = oControl.getModelName();
        var data = oEvent.getSource().getBindingContext(modelName).getObject();
        oControl.selected = data.PARVW + '_' + data.PARTNER;
        oControl._onPartnerChange("", data, oControl.selected);
    };

    A.prototype._onPartnerCreate = function() {
        var oControl = this;
        var oController = this.getController();
        var modelName = this.getModelName();
        var dataPath = this.getDataPath();
        //var ptrdata = this.getPtrdata();
        var model = oController.getModel(modelName);
        var data = model.getProperty(dataPath) || [];
        var rowid, length;

        var newRow = underscoreJS.findWhere(model.getProperty(dataPath),{EDIT: "X"}) || {};
        if(underscoreJS.isEmpty(newRow)){
          var emptydata =  jQuery.extend(true,{}, partnersControl.ptrData);

          //var emptydata = underscoreJS.clone(partnersControl.ptrData);
          if(underscoreJS.isEmpty(data)){
            rowid = 1;
          }
          else{
            length = data.length - 1;
            rowid = parseInt(data[length]['ROWID']) + 1;
          }
          emptydata['ROWID'] = rowid;
          emptydata['EDIT'] = 'X';
          emptydata['UPDKZ'] = 'I';
          data.push(emptydata);
          model.setProperty(dataPath,data);
        }
        else{
          oControl._onPartnerChange("X");
        }
    };

    A.prototype._onPartnerDelete = function(delPartnerPath) {
        var oControl = this;
        var oController = this.getController();
        var modelName = this.getModelName();
        var dataPath = this.getDataPath();
        var model = oController.getModel(modelName);
        var partners = model.getProperty(dataPath);
        var delPartner = model.getProperty(delPartnerPath);
        var deletedDocs = [], data = [], newData = [];

        if(delPartner['UPDKZ'] == "I"){
          var newPartners = underscoreJS.without(partners,underscoreJS.findWhere(partners,{ROWID: delPartner['ROWID']})) || [];
          model.setProperty(dataPath, newPartners);
        }
        else{
          var selRecord = underscoreJS.findWhere(partners,{ROWID: delPartner['ROWID']});
          var promise = oControl.firePartnerDelete({record: selRecord});
        }

    };

    A.prototype._onPartnerFunctionChange = function(oEvent) {
        var oControl = this;
        var oController = this.getController();
        var modelName = this.getModelName();
        var dataPath = this.getDataPath();
        var oPath = oEvent.getSource().getBindingContext(modelName).getPath();
        var model = oController.getModel(modelName);
        var changedRow = model.getProperty(oPath);
        if (changedRow['PARVW'] == "") {
            return;
        }

        oControl.firePartnerFunctionChange([{parvw: changedRow['PARVW']},
                                            {path: oPath}]);
    };

    A.prototype._onSelect = function(oEvent) {
        var oControl = this;
        var oController = this.getController();
        var modelName = this.getModelName();
        var dataPath = this.getDataPath();
        var model = oController.getModel(modelName);
        var partners = model.getProperty(dataPath);

        var sPath = oEvent.getSource().getBindingContext(modelName).getPath();
        var selected = model.getProperty(sPath);

        var data = underscoreJS.findWhere(partners, {PARTNER: selected.PARTNER,PARVW: selected.PARVW});
        var oAddress = data.STREET;
        if (data.CITY1 != "") {
            if (oAddress != "") {
                oAddress = oAddress + ', ' + data.CITY1;
            } else {
                oAddress = data.CITY1;
            }
        }
        if (data.POST_CODE1 != "") {
            if (oAddress != "") {
                oAddress = oAddress + ', ' + data.POST_CODE1;
            } else {
                oAddress = data.POST_CODE1;
            }
        }
        if (data.COUNTRY != "") {
            if (oAddress != "") {
                oAddress = oAddress + ',/n' + data.COUNTRY;
            } else {
                oAddress = data.COUNTRY;
            }
        }

        var qView = new sap.m.QuickViewCard({
            showVerticalScrollBar: false,
            //width: "50px",
            pages: new sap.m.QuickViewPage({
                icon: this._getIcon(data.NAME1),
                title: data.NAME1,
                description: data.NRART,
                //width: "50px",
                groups: new sap.m.QuickViewGroup({
                    elements: [new sap.m.QuickViewGroupElement({
                        label:oControl._oBundle.getText("Address"),
                        value: oAddress
                    })]
                })
            })
        }).addStyleClass("quickviewcard");

        var oPanel = new sap.m.Panel({
            width: "100%",
            content: [qView]
        });

        var oPopover = new sap.m.ResponsivePopover({
            customHeader: [
                new sap.m.Bar({
                    contentMiddle: [
                        new sap.m.Text({
                            text: data.NRART + ' ' + data.PARTNER
                        })
                    ],
                    contentRight: [
                        new sap.m.Button({
                            icon: "sap-icon://decline",
                            tooltip: oControl._oBundle.getText("Close"),
                            press: function(oEvt) {
                                oEvt.getSource().getParent().getParent().close();
                            }
                        })
                    ]
                })
            ],
            content: oPanel
        });
        oPopover.openBy(oEvent.getSource());
    };

    A.prototype._getIcon = function(name){
     if(name == "")
       {
       return "sap-icon://person-placeholder";
       }
     else{
       var icon =commonUtils.getAvatarURI(name);
       return icon;
     }
    };

    A.prototype._onFilterClick = function(oEvent) {
      var oControl = this;
      var oController = this.getController();
      var modelName = oControl.getModelName();
      var model = oController.getModel(modelName);
      var mainModel = oController.getModel(global.vui5.modelName);
      var selectedFilter = oControl.getSelectedFilter();

      var oFilterList = new sap.m.List({
        mode: sap.m.ListMode.SingleSelectMaster,
        selectionChange: function(evt){
           evt.getSource().getParent().close();
           oControl._onFilterSelect(this);
        }
      }).setModel(mainModel,global.vui5.modelName)
        .setModel(model,modelName);

      oFilterList.bindAggregation("items", global.vui5.modelName+">/DROPDOWNS/"+oControl.sectionData['DARID']+"/FILTERS", function(sId, oContext) {
        var dataPath = global.vui5.modelName + ">" + oContext.getPath() + "/NAME";
        var selFilter = modelName + ">" + selectedFilter;
        return new sap.m.StandardListItem({
          title: oContext.getObject("VALUE"),
          type: sap.m.ListType.Active
        }).bindProperty("selected",{
            parts: [{path: dataPath},
                    {path: selFilter}],
            formatter: partnersFormater.setFilter,
            mode: sap.ui.model.BindingMode.OneWay
        });
      });

      var oPopover = new sap.m.ResponsivePopover({
        title: oControl.sectionData['FILTER']['LABEL'],
        placement: sap.m.PlacementType.Left,
        customHeader: [
           new sap.m.Bar({
             contentMiddle: [
               new sap.m.Text({
                 text: oControl._oBundle.getText("Filters")
               })
             ],
             contentRight: [
               new sap.m.Button({
                 icon: "sap-icon://decline",
                 tooltip: oControl._oBundle.getText("Close"),
                 press: function(oEvt) {
                   oEvt.getSource().getParent().getParent().close();
                 }
               })
             ]
           })
        ],
        content: [oFilterList]
      });

      oPopover.openBy(oEvent.getSource());
    };

    A.prototype._onFilterSelect = function(oEvent) {
      var oControl = this;
      var oController = this.getController();
      var modelName = oControl.getModelName();
      var model = oController.getModel(modelName);
      var mainModel = oController.getModel(global.vui5.modelName);
      var selectedFilterPath = oControl.getSelectedFilter();
      var filters = mainModel.getProperty("/DROPDOWNS/"+oControl.sectionData['DARID']+"/FILTERS");
      var oPath = oEvent.getSelectedItem().getBindingContext(global.vui5.modelName).getPath();

      var promise = oControl.fireFilterSelect([{filter: mainModel.getProperty(oPath)},
                                               {callBack: function(resp){
                                                 var selectedFilter = model.getProperty(selectedFilterPath);
                                                 var filterName = underscoreJS.findWhere(filters,{NAME: selectedFilter});
                                                 oControl.filterInfoText.setText(oControl._oBundle.getText("Filtered") + ' ' + filterName['VALUE']);
                                                 if (selectedFilter == "PARALL") {
                                                     oControl.headerInfobar.setVisible(false);
                                                 } else {
                                                     oControl.headerInfobar.setVisible(true);
                                                 }
                                               }}]);
    };

    A.prototype._onConfirmDialog = function(path) {
        var oControl = this;
        sap.m.MessageBox.show(oControl._oBundle.getText("DeleteItem"), {
            icon: sap.m.MessageBox.Icon.INFORMATION,
            title: this._oBundle.getText("DeletePartner"),
            actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
            onClose: function(oAction) {
                if (oAction == sap.m.MessageBox.Action.YES) {
                    oControl._onPartnerDelete(path);
                }
            }
        });

    };

    A.prototype._onValueHelp = function(oEvent) {
      var oControl = this;
      var oController = this.getController();
      var modelName = oControl.getModelName();
      var model = oController.getModel(modelName);
      var oPath = oEvent.getSource().getBindingContext(modelName).getPath();
      var fieldData = model.getProperty(oPath);
      //*****Rel 60E_SP6
      var label = oControl._oBundle.getText("Partner");
      //*****
      var fieldInfo = {"SHLPNAME": fieldData['SHLPNAME'], "FLDNAME": fieldData['FIELDNAME'], "LABEL": label};

      oControl.fireOnValueHelpRequest({
        oEvent: oEvent,
        fieldInfo: fieldInfo
      });
    };

    A.prototype.handleTypeAhead = function(oEvent) {
      var oControl = this;
      var oController = this.getController();
      var modelName = oControl.getModelName();
      var source = oEvent.getSource();
      var model = oController.getModel(modelName);
      var fieldData = oEvent.getSource().getBindingContext(modelName).getObject();
      var fieldInfo = {"SHLPNAME": fieldData['SHLPNAME'], "FLDNAME": fieldData['FIELDNAME']};

      oControl.fireFieldEvent({
        oEvent: oEvent,
        fieldInfo: fieldInfo,
        fieldValue: oEvent.getParameter('suggestValue'),
        eventType: global.vui5.cons.fieldSubEvent.typeAhead
      });
    };

    A.prototype.handleSuggestionItemSelected = function(oEvent) {
      var oControl = this;
      var oController = this.getController();
      var modelName = oControl.getModelName();
      var source = oEvent.getSource();
      var model = oController.getModel(modelName);
      var mainModel = oController.getModel(global.vui5.modelName);

      var item = oEvent.getParameter("selectedRow");
      var rowData = item.getBindingContext(global.vui5.modelName).getObject();
      var fieldName = item.getBindingContext("infocusModel").getObject('FIELDNAME');
      var returnField = mainModel.getProperty("/TYPEAHEAD/" + fieldName + "/RETURNFIELD");

      var path = source.getBinding("value").getPath();
      model.setProperty(path, rowData[returnField]);
    };

    partnersFormater = {
        returnBoolean: function(value) {
            if (value != undefined) {
                if (value == "" || value == "A")
                    {
                  return false;
                    }
                else
                    {
                  return true;
                    }
            }
        },
        setFilter: function(value,selFilter){
          if(value != undefined && selFilter != undefined){
            if(value == selFilter){
              return true;
            }
            else{
              return false;
            }
          }
        },
        gridTitle: function(table) {
          if(table != undefined){
            var descr = "";
           // var title = partnersControl.getProperty("controller").sectionData['DESCR'];
            var title = partnersControl.sectionData['DESCR'];
            if (title != "") {
                descr = title + "(" + table.length + ")";
            }
            return descr;
          }
        },
        itemPartners: function(value) {
            if (value != undefined) {
                if (value == "X") {
                    return false;
                } else {
                    return true;
                }
            }
        },
        setParvw : function(value1, drpdwns){
          if(value1!=undefined && drpdwns !=undefined){
            var dropdownValue = underscoreJS.findWhere(drpdwns,{"NAME" : value1});
            return dropdownValue.VALUE;
          }
        }
    };
});