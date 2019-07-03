sap.ui.define([
    "sap/ui/core/Control",
    vistexConfig.rootFolder + "/ui/core/global",
    vistexConfig.rootFolder + "/ui/core/underscore-min"
], function(control,global,underscoreJS) {

    var A = control.extend(vistexConfig.rootFolder + ".ui.controls.Texts", {
        metadata: {
          properties: {
                controller : {
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
                txtdata : {
                   type: "string",
                   defaultValue: null
                },
                textIdsPath:{
                   type: "string",
                   defaultValue: null
                },
                selectedTextId:{
                   type: "string",
                   defaultValue: null
                },
                editable : {
                   type: "boolean",
                   defaultValue: false
                }
          },
          events: {
             textUpdate:{},
             tabSelect :{}
            },
            aggregations: {
             _getTextsBar: {
               type: "sap.ui.core.Control",
               multiple: false,
               visibility: "hidden"
             }
            }
        },
        renderer: function(oRM, oControl) {
            oRM.write("<style>");
            oRM.write(".VuiTextArea{margin-top: 2% !important; padding:4px !important;}");
            oRM.write("</style>");
            oRM.write("<div");
            oRM.writeControlData(oControl);
            oRM.write(">");

            oRM.renderControl(oControl.getAggregation("_getTextsBar"));
            oRM.write("</div>");
        }

    });
    A.prototype.setModelName = function(value) {
      this.setProperty("modelName",value,true);
    };
    A.prototype.setDataPath = function(value) {
      this.setProperty("dataPath",value,true);
    };
    A.prototype.setTextIdsPath = function(value) {
      this.setProperty("textIdsPath",value,true);
    };
    A.prototype.setSelectedTextId = function(value) {
      this.setProperty("selectedTextId",value,true);
    };
    A.prototype.setEditable = function(value) {
      this.setProperty("editable",value,true);
    };
    A.prototype.onTextsInfocusSet = function(){
         var oControl = this;
          var oController = this.getProperty("controller");
          var modelName = this.getModelName();
          var dataPath = this.getDataPath();
          var model = oController.getModel(modelName);
          var mainModel = oController.getModel(global.vui5.modelName);
          var textIdsPath = this.getProperty('textIdsPath');
          var textObjects = model.getProperty(textIdsPath);
          var bundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls");
          var data =  model.getProperty(dataPath);
          if(textObjects == undefined || textObjects.length == 0){
            var oMessagePage = new sap.m.MessagePage({
                  text: bundle.getText("NoTextData"),
                  description: "",
                  showHeader: false
                });
                var textsFrag = new sap.m.Panel({
                  width: "100%",
                  height: "300px",
                  content: [oMessagePage]
                });
                oControl.setAggregation("_getTextsBar", textsFrag);
                return;
          }
          else{
            oControl.onTexts();
          }

    };

    A.prototype.onTexts = function() {
      var oControl = this;
      oControl.textsObj = {
          "SPRAS":"",
          "SPTXT":"",
          "TEXT":"",
          "UPDKZ_UI":"",
          "SELECTED":""
      };

      var oController = this.getProperty("controller");
      var modelName = this.getModelName();
      var dataPath = this.getDataPath();
      var selectedTextId = this.getSelectedTextId();
      var model = oController.getModel(modelName);
      var mainModel = oController.getModel(global.vui5.modelName);
      oControl.sectionData = oController.sectionData;
      var textIdsPath = this.getProperty('textIdsPath');

      oControl.oTextBar = new sap.m.IconTabBar({
        select: [oControl.onTabSelect, oControl],
      })
      //.bindProperty("selectedKey",modelName+">"+selectedTextId,textsFormatter.returnSelTextId, sap.ui.model.BindingMode.OneWay)
      /*.bindProperty("selectedKey", {
       path: modelName+">" + selectedTextId,
       formatter:function(value){
        if(value != undefined){
         return value;
        }
       },
       mode: sap.ui.model.BindingMode.OneWay
      })*/
        .setModel(model, modelName)
        .setModel(mainModel, global.vui5.modelName);
      
      oControl.oTextBar.bindAggregation("items", modelName + ">"+ textIdsPath, function(sId, oContext) {
         return new sap.m.IconTabFilter({
            key: oContext.getObject("NAME"),
            text: oContext.getObject("VALUE")
         });
      });

      var textContent = oControl.onTextContent();      

      //*****Rel 60E_SP6
      var textIds = model.getProperty(textIdsPath);
      if(textIds && textIds.length > 1){
    	  oControl.oTextBar.insertContent(textContent);
    	  oControl.setAggregation("_getTextsBar", oControl.oTextBar);  
      }
      else {
    	  oControl.setAggregation("_getTextsBar", textContent);  
      }
      //*****
      //      
      
    };

    A.prototype.onTabSelect = function(oEvt) {
      var oControl = this;
      var oController = this.getController();
      var modelName = this.getModelName();
      var dataPath = this.getDataPath();
      var model = oController.getModel(modelName);
      var mainModel = oController.getModel(global.vui5.modelName);
      var selTextId = oEvt.getSource().getSelectedKey();
      var textIdsPath = this.getProperty('textIdsPath');
      var textObjects = model.getProperty(textIdsPath);
      var selTextObject = underscoreJS.findWhere(textObjects,{NAME: selTextId});

      oControl.fireTabSelect({filter: selTextObject});
      oControl._updateButton.setVisible(false);
    };

    A.prototype._setTextSelectedKey = function(oEvt) {
      
      var oControl = this;
      var oController = this.getController();
      var modelName = this.getModelName();
      var selectedTextId = this.getSelectedTextId();
      var model = oController.getModel(modelName);
      var selectedKey = model.getProperty(selectedTextId);
      if(oControl.oTextBar){
        var currentKey = oControl.oTextBar.getSelectedKey();
        if(currentKey != selectedKey){
          oControl.oTextBar.setSelectedKey(selectedKey,true);
        }
      }
    };

    A.prototype._getChangedData = function(oEvt) {
      var oControl = this;
      var oController = this.getController();
      var modelName = this.getModelName();
      var dataPath = this.getDataPath();
      var model = oController.getModel(modelName);
      var texts = model.getProperty(dataPath);
      var flag = "";

      underscoreJS.each(texts, function(obj){
        if(!underscoreJS.isEmpty(obj['UPDKZ_UI'])){
          flag = "X";
          return;
        }
      });

      return underscoreJS.isEmpty(flag) ? [] : texts;
    };

    A.prototype.onTextContent = function() {
      var oControl = this;
      var oController = this.getController();
      var modelName = this.getModelName();
      var dataPath = this.getDataPath();
      var model = oController.getModel(modelName);
      var mainModel = oController.getModel(global.vui5.modelName);
      var bundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls");
      var oBox = new global.vui5.ui.controls.ComboBox({
        selectionChange: [oControl._onLanguageChange, oControl]
      }).setModel(model,modelName);
      oBox.bindProperty("selectedKey",modelName+">"+dataPath, textsFormatter.returnSelected, sap.ui.model.BindingMode.TwoWay);
      oBox.bindAggregation("items", modelName+">"+dataPath, function(sId, oContext) {
        return new sap.ui.core.Item({
           key: oContext.getObject("SPRAS"),
           text: oContext.getObject("SPTXT")
        });
      });

      oControl._updateButton = new sap.m.Button({
        icon: "sap-icon://upload",
        tooltip: bundle.getText("Update"),
        visible: false,
        press: [oControl.onUpdate, oControl]
      });

      var oBar = new sap.m.Bar({
          contentLeft: [
              new sap.m.Text({
                  text: bundle.getText("Language")
              }),
              oBox
          ],
          contentRight: [new sap.m.Button({
                           icon: "sap-icon://add",
                           tooltip: bundle.getText("AddText"),
                           press: [oControl.onLanguageDrdn, oControl]
          /***Rel 60E SP7 ECIP #21608 - Start ***/
          //}).bindProperty("visible", global.vui5.modelName+">/DOCUMENT_MODE",textsFormatter.returnBoolean, sap.ui.model.BindingMode.OneWay),
			}).bindProperty("visible",{
				path:global.vui5.modelName + ">/DOCUMENT_MODE",
				formatter:function(value){
					if(!oControl.getEditable()){
						return false;
					}
					else{
						return textsFormatter.returnBoolean(value);
					}
				}
			}),
          /***Rel 60E SP7 ECIP #21608 - End ***/ 
                         oControl._updateButton,
                         new sap.m.Button({
                           icon: "sap-icon://delete",
                           tooltip: bundle.getText("DelText"),
                           press: [oControl.onDelete, oControl]
                         /***Rel 60E SP7 ECIP #21608 - Start ***/
                         //}).bindProperty("visible", global.vui5.modelName+">/DOCUMENT_MODE",textsFormatter.returnBoolean, sap.ui.model.BindingMode.OneWay),
						}).bindProperty("visible",{
							path:global.vui5.modelName + ">/DOCUMENT_MODE",
							formatter:function(value){
								if(!oControl.getEditable()){
									return false;
								}
								else{
									return textsFormatter.returnBoolean(value);
								}
							}
						})
                         /***Rel 60E SP7 ECIP #21608 - End ***/ 
          ]
      });

      oController.oTextArea = new sap.m.TextArea({
        width: "80%",
        rows: 10,
        liveChange: function(oEvt) {
          oControl._updateButton.setVisible(true);
        },
        change : function(oEvt){
          var selectedItem = underscoreJS.findWhere(model.getProperty(dataPath),{SELECTED :"X"});
          selectedItem['TEXT'] = oEvt.getSource().getValue();
          if(selectedItem['UPDKZ_UI'] != "I"){
             selectedItem['UPDKZ_UI'] = "U";
          }
        }
      }).setModel(mainModel,global.vui5.modelName)
        .bindProperty("value", modelName+">"+dataPath, textsFormatter.returnText, sap.ui.model.BindingMode.TwoWay).addStyleClass("VuiTextArea")
        /***Rel 60E SP7 ECIP #21608 - Start ***/
        //.bindProperty("editable", global.vui5.modelName + ">/DOCUMENT_MODE", textsFormatter.returnBoolean, sap.ui.model.BindingMode.OneWay);
		.bindProperty("editable",{
			path:global.vui5.modelName + ">/DOCUMENT_MODE",
			formatter:function(value){
				if(!oControl.getEditable()){
					return false;
				}
				else{
					return textsFormatter.returnBoolean(value);
				}
			}
		})
		/***Rel 60E SP7 ECIP #21608 - End ***/

      var oFlex = new sap.m.FlexBox({
         height: "100%",
         width: "100%",
         direction: sap.m.FlexDirection.Column,
         items: [oBar, oController.oTextArea]
      });

      return oFlex;
    };

    A.prototype._onLanguageChange = function(oEvt) {
      var oControl = this;
      var oController = this.getController();
      var modelName = this.getModelName();
      var dataPath = this.getDataPath();
      var model = oController.getModel(modelName);
      var textsData = model.getProperty(dataPath);
      var key = oEvt.getSource().getProperty("selectedKey");
      var selText = underscoreJS.findWhere(textsData,{SPRAS: key});
      var newTexts = [];

      underscoreJS.each(textsData, function(obj){
        if(obj['SELECTED'] == "X"){
          obj['SELECTED'] = "";
        }
        if(obj['SPRAS'] == selText['SPRAS']){
          obj['SELECTED'] = "X";
        }
        newTexts.push(obj);
      });

      model.setProperty(dataPath,[]);
      model.setProperty(dataPath,newTexts);
    };

    A.prototype.onLanguageDrdn = function(oEvt) {
      var oControl = this;
      var oController = this.getController();
      var modelName = this.getModelName();
      var dataPath = this.getDataPath();
      var model = oController.getModel(modelName);
      var mainModel = oController.getModel(global.vui5.modelName);
      var bundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls");
      var langList = new sap.m.SelectList({
        selectionChange: [oControl._onNewLang, oControl]
      }).setModel(mainModel, global.vui5.modelName);
      langList.bindAggregation("items",global.vui5.modelName + ">/DROPDOWNS/"+oControl.sectionData['DARID']+"/LANGUAGES/", function(sId, oContext) {
        return new sap.ui.core.Item({
          key: oContext.getObject("NAME"),
          text: oContext.getObject("VALUE")
        });
      });
      var langPopover = new sap.m.ResponsivePopover({
        placement: sap.m.PlacementType.Bottom,
        title: bundle.getText("Languages"),
        content: langList
      });
      langPopover.openBy(oEvt.getSource());
    };

    A.prototype._onNewLang = function(oEvt) {
      var oControl = this;
      var oController = this.getController();
      var modelName = this.getModelName();
      var dataPath = this.getDataPath();
      var txtdata = jQuery.extend(true,{},oControl.textsObj);
      var model = oController.getModel(modelName);
      var mainModel = oController.getModel(global.vui5.modelName);
      var path = oEvt.getSource().getSelectedItem().getBindingContext(global.vui5.modelName).getPath();
      var selLang = mainModel.getProperty(path);
      var bundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls");
      oEvt.getSource().getParent().close();

      var textsData = [];
      if(!underscoreJS.isEmpty(underscoreJS.findWhere(model.getProperty(dataPath),{SPRAS: selLang['NAME']}))){
        sap.m.MessageToast.show(bundle.getText("LangExists"));
        return;
      }

      underscoreJS.each(model.getProperty(dataPath),function(obj){
        if(obj['SELECTED'] == "X"){
          obj['SELECTED'] = "";
        }
        textsData.push(obj);
      });
      var newText = txtdata;
      newText['SPRAS'] = selLang['NAME'];
      newText['SPTXT'] = selLang['VALUE'];
      newText['UPDKZ_UI'] = "I";
      newText['SELECTED'] = "X";
      textsData.push(newText);

      model.setProperty(dataPath,[]);
      model.setProperty(dataPath,textsData);
      oControl._updateButton.setVisible(true);
    };

    A.prototype.onUpdate = function(oEvt) {
      var oControl = this;
      oControl.fireTextUpdate();
      oControl._updateButton.setVisible(false);
    };

    A.prototype.onDelete = function(oEvt) {
      var oControl = this;
      var oController = this.getController();
      var modelName = this.getModelName();
      var dataPath = this.getDataPath();
      var model = oController.getModel(modelName);
      var newTexts = [];
      var bundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls");
      var selText = underscoreJS.findWhere(model.getProperty(dataPath),{SELECTED: "X"});
      if(selText['UPDKZ_UI'] == "I"){
        newTexts = underscoreJS.without(model.getProperty(dataPath),underscoreJS.findWhere(model.getProperty(dataPath),{SPRAS: selText['SPRAS']})) || [];
        model.setProperty(dataPath,[]);
        model.setProperty(dataPath, newTexts);
        oControl.fireTextUpdate();
      }
      else{
        underscoreJS.each(model.getProperty(dataPath),function(obj){
          if(obj['SPRAS'] == selText['SPRAS']){
            obj['UPDKZ_UI'] = 'D';
          }
          newTexts.push(obj);
        });
        model.setProperty(dataPath,[]);
        model.setProperty(dataPath,newTexts);
        oControl.fireTextUpdate();
      }

      oControl._updateButton.setVisible(false);

    };

    textsFormatter = {
      returnBoolean: function(value) {
            if (value != undefined) {
                if (value == "" || value == "A")
                    return false;
                else
                    return true;
            }
      },
      returnSelTextId: function(value){
        if (value != undefined){
           
           return value;
        }
      },
      returnSelected: function(value) {
        if (value != undefined) {
           var selectedItem = underscoreJS.findWhere(value,{SELECTED: "X"});
           if(selectedItem){
             return selectedItem['SPRAS'];
           }
        }
      },
      returnText : function(value){
        if (value != undefined) {
          var selectedItem = underscoreJS.findWhere(value,{SELECTED: "X"});
          if(selectedItem){
            return selectedItem['TEXT'];
          }
        }
      }

    };
});