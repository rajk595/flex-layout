sap.ui.define(["sap/ui/core/Control",
             vistexConfig.rootFolder + "/ui/core/global",
             vistexConfig.rootFolder + "/ui/core/underscore-min"
], function(control,global,underscoreJS) {

//  showRCeateTile - yes/no - will show create tile
//  createTileText - if showCreateTile is true , then this text will be shown on create tile
//  showMessagePage - yes/no - message page will be shown and nothing else , used when no address exists
//  messagePageText - if showMessagePage is true , then this text will be shown on message page
//  showDeleteButton - yes/no - will show delete button on toolbar

  var A = control.extend(vistexConfig.rootFolder + ".ui.controls.Address", {
    metadata: {
          library : vistexConfig.rootFolder + ".ui",
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
        sectionID : {
          type: "string",
          defaultValue: null
        },
        showCreateTile: {
          type: "string",
          defaultValue: null
        },
        showPrintButton: {
          type: "string",
          defaultValue: null
        },
        showMessagePage: {
          type: "string",
          defaultValue: null
        },
        createTileText:{
          type: "string",
          defaultValue: null
        },
        messagePageText:{
          type: "string",
          defaultValue: null
        },
        showDeleteButton:{
          type: "string",
          defaultValue: null
        },
        showAddress: {
          type: "string",
          defaultValue: null
        }
      },
      events: {
        printPreview: {},
        createAddress: {},
        deleteAddress: {}
      },
      aggregations: {
        _address: {
          type: "sap.ui.core.Control",
          multiple: false,
          visibility: "hidden"
        }

      }
    },

    init: function() {},

    renderer: function(oRM, oControl) {
      oRM.write("<div");
      oRM.writeControlData(oControl);
      oRM.write(">");
      oRM.write("<style>");
      oRM.write(".printFormData { padding: 5px}");
      oRM.write("</style>");
      oRM.renderControl(oControl.getAggregation("_address"));
      oRM.write("</div>");
    }
  });


  A.prototype.setModelName = function(value) {
    this.setProperty("modelName",value,false);
  };

  A.prototype.setDataPath = function(value) {
    this.setProperty("dataPath",value,false);
  };

  A.prototype.setSectionID = function(value) {
    this.setProperty("sectionID",value,false);
  };

  A.prototype.setShowCreateTile = function(value) {
    this.setProperty("showCreateTile",value,false);
  };

  A.prototype.setShowPrintButton = function(value) {
    this.setProperty("showPrintButton",value,false);
  };

  A.prototype.setShowMessagePage = function(value) {
    this.setProperty("showMessagePage",value,false);
  };

//  A.prototype.setShowAddress = function(value) {
//    this.setProperty("showAddress",value,false);
//  };


  A.prototype.setCreateTileText = function(value) {
    this.setProperty("createTileText",value,false);
  };

  A.prototype.setMessagePageText = function(value) {
    this.setProperty("messagePageText",value,false);
  };

  A.prototype.setShowDeleteButton = function(value) {
    this.setProperty("showDeleteButton",value,false);
  };

//  A.prototype.setEditable = function(value) {
//  this.setProperty("editable",value,true);
//  };


  A.prototype.addressInfocusSet = function() {
//    this.addressProcess();
//    this.addressProcessTemp();
//    this.addressPrepare();
    this.addressPrepare12();
  };

  //new - after discussing with santhosh
  //to hide form, on need to mark all fields no_out or clear fields/flgrp table
  A.prototype.addressPrepare12 = function() {
    var oControl = this;
    var oController = this.getProperty("controller");
    var modelName = this.getProperty("modelName");
    var model = oController.getModel(modelName);
    var mainModel = oController.getModel(global.vui5.modelName);
    var documentMode = mainModel.getProperty("/DOCUMENT_MODE");

    var showDeleteButton = oControl.getShowDeleteButton();
    var showMessagePage = oControl.getShowMessagePage();
    var messagePageText = oControl.getMessagePageText();
    var showCreateTile = oControl.getShowCreateTile();
    var createTileText = oControl.getCreateTileText();

    var showMsgPageValue = model.getProperty(showMessagePage);
    if(!oControl.oPanel){
      if(showMsgPageValue === ''){
          var oPanel = new sap.m.Panel({
              width: "100%"
//              height: auto,
//              height: "600px"
            });
            oControl.oPanel = oPanel;
      }
      else{
          var oPanel = new sap.m.Panel({
              width: "100%",
              height: "300px"
            });
            oControl.oPanel = oPanel;

      }
    }

    //create tile
    var tile = new sap.m.StandardTile({
    icon: "sap-icon://add",
    type: sap.m.StandardTileType.None,
    visible: "{= ${" + modelName + ">" + showCreateTile + "} === 'X' &&"
    + " ${" + global.vui5.modelName + ">/DOCUMENT_MODE} !== 'A'}",
    press: [oControl._onCreateAddress, oControl]
    });
    tile.bindProperty("info",modelName+">"+createTileText, null, sap.ui.model.BindingMode.OneWay);
//    tile.bindProperty("info",modelName+">"+createTileText, addressFormatter.text, sap.ui.model.BindingMode.OneWay);


    var tileContainer = new sap.m.TileContainer({
    width: "100%",
    height : "300px",
    editable: false,
    visible: "{= ${" + modelName + ">" + showCreateTile + "} === 'X' &&"
    + " ${" + global.vui5.modelName + ">/DOCUMENT_MODE} !== 'A'}",
    tiles : [ tile ]
    });


    //message page
    var oMessagePage = new sap.m.MessagePage({
      description: "",
      showHeader : false,
      visible: "{= ${" + modelName + ">" + showMessagePage + "} === 'X' &&"
      + " ${" + global.vui5.modelName + ">/DOCUMENT_MODE} === 'A'}"

    });
    oMessagePage.bindProperty("text",modelName+">"+messagePageText, null, sap.ui.model.BindingMode.OneWay);


    oControl._showAddressForm();
    oControl.oPanel.addContent(tileContainer);
    oControl.oPanel.addContent(oMessagePage);

    oControl.setAggregation("_address", oControl.oPanel,false);

    },



  A.prototype._showAddressForm = function(){
    var oControl = this,sectionEditable,sectionPath,dataPath,index,section,mainModel,dmode;
    var oController = this.getProperty("controller");
    oControl.titlePath = oController.titlePath;
    var oController = oControl.getController();
    var modelName = this.getProperty("modelName");
    var model = oController.getModel(modelName);
    var sectionID = oControl.getSectionID();
    sectionPath = oController._getPath(true);
    dataPath = oController._getPath();
    mainModel = oController.getModel(global.vui5.modelName);
    dmode = mainModel.getProperty("/DOCUMENT_MODE");
    section = oController.getSectionBy("SECTN",sectionID);
    index = underscoreJS.findIndex(model.getProperty(sectionPath), {
        SECTN: sectionID
    });
    var formRef;
    oControl.fieldsPath = oController.fieldsPath;
    var showDeleteButton = oControl.getShowDeleteButton();
    var showPrintButton = oControl.getShowPrintButton();
    var showMessagePage = oControl.getShowMessagePage();
    var showMsgPageValue = model.getProperty(showMessagePage);

    //formRef = oController.sectionRef[sectionID] = sap.ui.jsfragment(global.vui5.utilitiesDomain + ".fragments.Form", oController);
   // formRef = sap.ui.jsfragment(global.vui5.ui.fragments.Form, oController);
    if (oController._formDialog) {
        sectionEditable = (section['DISOL'] === '')
      } else {
          sectionEditable = section['DISOL'] === '' && (section['EDIT'] !== '' || dmode !== global.vui5.cons.mode.display);
      }
      //formRef = oController.sectionRef[sectionID] = new vui5.ui.controls.Form({
      formRef = new vui5.ui.controls.Form({
            modelName : oController.modelName,
            dropdownModelName: vui5.modelName,
            sectionPath : sectionPath + index + "/",
              sectionFieldPath : sectionPath + index + "/FLGRP/",
            sectionDataPath : dataPath + section['DARID'] + "/",
            fieldsPath: sectionPath + index + "/FIELDS/",
            functionsPath : sectionPath + index + "/FUNC/",
            titlePath: sectionPath + index + "/DESCR",
            dataArea: section['DARID'],
            sectionEditable : sectionEditable,
            formDialog : underscoreJS.isObject(oController._formDialog)
          }).setModel(oController.getModel(oController.modelName), oController.modelName)
            .setModel(oController.getModel(vui5.modelName),vui5.modelName);
      
        oController.handleSuggestionItemSelected = function () {};
        formRef._prepareButtonControl = function(object,sectionID,fromToolBar){
          oController.prepareButtonControl(object,sectionID,fromToolBar)
         }; 
        formRef.processFileUpload = function(oEvent, dataPath, field){
          oController.processFileUpload(sectionID,oEvent, dataPath, field)
         };
        formRef._onCheckBoxSelect = function(oEvent){
          oController._onCheckBoxSelect(oEvent)
         };
        formRef.dateFieldCheck= function(oEvent){
            oController.dateFieldCheck(oEvent)
         };
        formRef.onValueHelpRequest = function (oEvent) {
                oController.onValueHelpRequest(sectionID, oEvent);
         };
        formRef.processOnInputChange = function (oEvent) {
                return oController.processOnInputChange(sectionID, oEvent);
         };
        formRef.preProcessFieldEvent = function (oEvent) {
                return oController.preProcessFieldEvent(sectionID, oEvent);
         };
        formRef.preProcessFieldClickEvent = function (oEvent) {
                return oController.preProcessFieldClickEvent(sectionID, oEvent);
         };
        jQuery.sap.syncStyleClass(oController.getOwnerComponent().getContentDensityClass(),
            oController.getView(), formRef);
        formRef.prepareFormControl();
    if(!oControl.oPanel){
        if(showMsgPageValue === ''){
            var oPanel = new sap.m.Panel({
                width: "100%"
//                height: auto,
//                height: "600px"
              });
              oControl.oPanel = oPanel;
        }
        else{
            var oPanel = new sap.m.Panel({
                width: "100%",
                height: "300px"
              });
              oControl.oPanel = oPanel;

        }
      }

       var formToolbar = new sap.m.Toolbar({
//      visible : "{= ${" + modelName + ">" + oControl.fieldsPath + ".length } !== '0' }",
      content: [
//                new sap.m.Title({
//                }).bindProperty("text", oController.modelName + ">" + oControl.titlePath, sap.ui.model.BindingMode.OneWay),
                new sap.m.ToolbarSpacer({}),
                new sap.m.Button({
                  icon: "sap-icon://print",
                  type: sap.m.ButtonType.Transparent,
                  visible: "{= ${" + oController.modelName + ">" + showPrintButton + "} === 'X' }",
                  press: [oControl._onPrintAddress, oControl]
//                press: [oControl._onPrintAddress.bind(oController)]
                }),
                new sap.m.Button({
                  icon: "sap-icon://delete",
                  type: sap.m.ButtonType.Transparent,
                  press: [oControl._onDeleteAddress, oControl],
                  visible: "{= ${" + oController.modelName + ">" + showDeleteButton + "} === 'X' }"
                })
                //     }).bindProperty("visible", oController.modelName+">"+showDeleteButton, addressFormatter.returnBoolean, sap.ui.model.BindingMode.OneWay),
                ],

                visible: "{= ${" + oController.modelName + ">" + showDeleteButton + "} === 'X'  ||"
                + " ${" + oController.modelName + ">" + showPrintButton + "} === 'X'}"
    }) ;
//    .bindProperty("visible", {
//            path: oController.modelName + ">" + oControl.fieldsPath,
//            formatter: function(fields) {
//                return _.find(fields, { "NO_OUT": "" }) ? true : false;
//            }


//        });
       formRef.getAggregation('_Form').setToolbar(formToolbar);
//    oControl.oPanel.removeAllContent();
    oControl.oPanel.addContent(formRef);
//    oControl.setAggregation("_address", oControl.oPanel,false);
  };












  //old approach
  A.prototype.addressPrepare = function(){
    var oControl = this;
    var oController = this.getProperty("controller");
    var modelName = this.getProperty("modelName");
    var model = oController.getModel(modelName);
    var mainModel = oController.getModel(global.vui5.modelName);
    var documentMode = mainModel.getProperty("/DOCUMENT_MODE");

    var showDeleteButton = oControl.getShowDeleteButton();
    var showAddress = oControl.getShowAddress();
//    var showMessagePage = oControl.getShowMessagePage();
//    var messagePageText = oControl.getMessagePageText();
//    var showCreateTile = oControl.getShowCreateTile();
//    var createTileText = oControl.getCreateTileText();
    oControl.titlePath = oController.titlePath;

    if(!oControl.oPanel){
      var oPanel = new sap.m.Panel({
        width: "100%",
        height: "100%"
      });
      oControl.oPanel = oPanel;
    }

    if(showAddress != undefined && showAddress == 'X'){

      oControl._showAddressForm();
//      var formRef1 = this._showAddressForm();

//      var formToolbar = new sap.m.Toolbar({
//      content: [
//      new sap.m.Title({
//      }).bindProperty("text", oController.modelName + ">" + oControl.titlePath, sap.ui.model.BindingMode.OneWay),
//      new sap.m.ToolbarSpacer({}),
//      new sap.m.Button({
//      icon: "sap-icon://print",
//      type: sap.m.ButtonType.Transparent,
//      visible :true,
//      press: [oControl._onPrintAddress, oControl]
//      }),
//      new sap.m.Button({
//      icon: "sap-icon://delete",
//      type: sap.m.ButtonType.Transparent,
//      press: [oControl._onDeleteAddress, oControl]
//      }).bindProperty("visible", modelName+">"+showDeleteButton, addressFormatter.returnBoolean, sap.ui.model.BindingMode.OneWay),
//      ]
//      });
//      formRef1.setToolbar(formToolbar);
//      oPanel.addContent(formRef1);
////      oControl.oPanel = oPanel;
//      oControl.setAggregation("_address", oControl.oPanel);
    }else{

//      var oBar = new sap.m.Toolbar({
//      design: sap.m.ToolbarDesign.Solid,
//      content: [
//      new sap.m.Button({
//      icon: "sap-icon://print",
//      type: sap.m.ButtonType.Transparent,
//      visible :true,
//      //     press: [oControl._onAddressDelete, oControl]
//      }),
//      new sap.m.Button({
//      icon: "sap-icon://delete",
//      type: sap.m.ButtonType.Transparent,
//      //     press: [oControl._onAddressDelete, oControl]
//      }).bindProperty("visible", modelName+">"+showDeleteButton, addressFormatter.returnBoolean, sap.ui.model.BindingMode.OneWay),
//      ]
//      });

//      var formToolbar = new sap.m.Toolbar({
//      content: [
//      new sap.m.Title({
//      }).bindProperty("text", oController.modelName + ">" + oControl.titlePath, sap.ui.model.BindingMode.OneWay),
//      new sap.m.ToolbarSpacer({}),
//      new sap.m.Button({
//      icon: "sap-icon://print",
//      type: sap.m.ButtonType.Transparent,
//      visible :true,
//      press: [oControl._onPrintAddress, oControl] }),

//      new sap.m.Button({
//      icon: "sap-icon://delete",
//      type: sap.m.ButtonType.Transparent,
//      press: [oControl._onDeleteAddress, oControl]
//      }).bindProperty("visible", modelName+">"+showDeleteButton, addressFormatter.returnBoolean, sap.ui.model.BindingMode.OneWay),

//      ]
//      });
      //message do not exists
      if(documentMode === 'A'){ //display mode
//        oControl.setShowCreateTile(" ");
//        oControl.setShowDeleteButton(" ");
//        oControl.setShowMessagePage("X");
//        oControl.setShowAddress(" ");
//        oControl.setMessagePageText("Address is not maintained");
        oControl._showMessagePage();
      }else{
        oControl.setShowCreateTile("X");
        oControl.setShowDeleteButton(" ");
        oControl.setShowMessagePage(" ");
        oControl.setShowAddress(" ");
        oControl.setCreateTileText("Create Address");
        oControl._showCreateTile();
      }
//      var oMessagePage = new sap.m.MessagePage({
//      description: "",
//      showHeader : false
//      });
//      oMessagePage.bindProperty("visible",modelName+">"+showMessagePage, addressFormatter.returnBoolean, sap.ui.model.BindingMode.OneWay);
//      oMessagePage.bindProperty("text",modelName+">"+messagePageText, addressFormatter.text, sap.ui.model.BindingMode.OneWay);

//      var tile = new sap.m.StandardTile({
//      icon: "sap-icon://add",
//      type: sap.m.StandardTileType.None,
////      visible: true,
////      info: addressText
////      visible : "{= ${" + oController.modelName + ">" + addressExists + "} === ''  &&"
////      + " ${" + global.vui5.modelName + ">/DOCUMENT_MODE} !== 'A'}"
//      press: [oController._onCreateAddress, oController]
//      });
//      tile.bindProperty("visible",modelName+">"+showCreateTile, addressFormatter.returnBoolean, sap.ui.model.BindingMode.OneWay);
//      tile.bindProperty("info",modelName+">"+createTileText, addressFormatter.text, sap.ui.model.BindingMode.OneWay);


//      var tileContainer = new sap.m.TileContainer({
//      width: "100%",
//      height : "300px",
//      editable: false,
////      visible : "{= ${" + oController.modelName + ">" + addressExists + "} === ''  &&"
////      + " ${" + global.vui5.modelName + ">/DOCUMENT_MODE} !== 'A'}" ,
//      tiles : [ tile ]
//      });
//      tileContainer.bindProperty("visible",modelName+">"+showCreateTile, addressFormatter.returnBoolean, sap.ui.model.BindingMode.OneWay);

////      if(showAddress != undefined && showAddress == 'X'){
////      var formRef1 = this.showAddressForm();
////      formRef1.setToolbar(formToolbar);
////      oPanel.addContent(formRef1);
////      oControl.setAggregation("_address", oPanel);
////      }else{
////      oPanel.addContent(oBar);
//      oPanel.addContent(oMessagePage);
//      oPanel.addContent(tileContainer);
//      oControl.setAggregation("_address", oPanel);
//      }

    }
  };


  
addressFormatter = {
      returnBoolean: function(value) {
        if (value != undefined) {
          if (value == "" )
            {
            return false;
            }
          else
          {
            return true;
          }
        }
      },
      text: function(value) {
        if (value != undefined && value != "") {
          return  value;
        }
      }
  };
  A.prototype.addressProcess1 = function(){
    var oControl = this;
    var oController = this.getProperty("controller");
    var modelName = this.getProperty("modelName");
    var model = oController.getModel(modelName);
    var mainModel = oController.getModel(global.vui5.modelName);
    var documentMode = mainModel.getProperty("/DOCUMENT_MODE");

    //create tile

  },

  A.prototype.addressProcessTemp = function(){
    //create tile - in change mode
    //else message page in display mode

    //if address exists , show form
    var oControl = this;
    var oController = oControl.getController();
    var sectionID = oControl.getSectionID();
    var mainModel = oController.getModel(global.vui5.modelName);
    var formRef;
    var modelName = oController.getModel();
//    var addressExists = oControl.getAddressExists();
//    var addressText = oControl.getAddressText();
    var documentMode = mainModel.getProperty("/DOCUMENT_MODE");

    var sectionFieldPath = oController.sectionFieldPath;
    var infocusModel = oController.getModel(oController.modelName);
    var overview_fields = infocusModel.getProperty(sectionFieldPath);

    var oFlexBox = new sap.m.FlexBox({
      width: "100%",
      height: "100%",
      direction: sap.m.FlexDirection.Column
    });

    //message page
    if(addressExists != undefined && addressExists == 'X'){
      var formRef1 = this.showAddressForm();
      oFlexBox.addItem(formRef1);

    }else if(addressExists != undefined && addressExists == '' && documentMode == 'A'){
      var oMessagePage = new sap.m.MessagePage({
        description: "",
        showHeader: false,
        visible: true,
        text: addressText
//        visible : "{= ${" + oController.modelName + ">" + addressExists + "} === ''  &&"
//        + " ${" + global.vui5.modelName + ">/DOCUMENT_MODE} === 'A'}"
      });
      oFlexBox.addItem(oMessagePage);
//      oMessagePage.bindProperty("text",oController.modelName+">"+ addressText, null, sap.ui.model.BindingMode.OneWay)
    }else if(addressExists != undefined && addressExists == '' && documentMode != 'A'){
      //create tile
      var tile = new sap.m.StandardTile({
        icon: "sap-icon://add",
        type: sap.m.StandardTileType.None,
        visible: true,
        info: addressText
//        visible : "{= ${" + oController.modelName + ">" + addressExists + "} === ''  &&"
//        + " ${" + global.vui5.modelName + ">/DOCUMENT_MODE} !== 'A'}"
//        press: [oController.onAddressCreate, oController]
      });
//      tile.bindProperty("info",oController.modelName+">"+ addressText, null, sap.ui.model.BindingMode.OneWay);

      var tileContainer = new sap.m.TileContainer({
        width: "100%",
        height : "340px",
        editable: false,
        visible: true,
//        visible : "{= ${" + oController.modelName + ">" + addressExists + "} === ''  &&"
//        + " ${" + global.vui5.modelName + ">/DOCUMENT_MODE} !== 'A'}" ,
        tiles : [ tile ]
      });
      oFlexBox.addItem(tileContainer);
    }



    //create tile
//    var tile = new sap.m.StandardTile({
//    icon: "sap-icon://add",
//    type: sap.m.StandardTileType.None,
//    visible : "{= ${" + oController.modelName + ">" + addressExists + "} === ''  &&"
//    + " ${" + global.vui5.modelName + ">/DOCUMENT_MODE} !== 'A'}"
////    press: [oController.onAddressCreate, oController]
//    });
//    tile.bindProperty("info",oController.modelName+">"+ addressText, null, sap.ui.model.BindingMode.OneWay);

//    var tileContainer = new sap.m.TileContainer({
//    width: "100%",
//    height : "340px",
//    editable: false,
//    visible : "{= ${" + oController.modelName + ">" + addressExists + "} === ''  &&"
//    + " ${" + global.vui5.modelName + ">/DOCUMENT_MODE} !== 'A'}" ,
//    tiles : [ tile ]
//    });



//    oFlexBox.addItem(oMessagePage);
//    oFlexBox.addItem(tileContainer);
//    if(overview_fields.length !== 0){
//    var formRef1 = this.showAddressForm();
//    oFlexBox.addItem(formRef1);
//    }

    oControl.setAggregation("_address", oFlexBox,false);

  },



//  A.prototype._showAddressForm = function(){
//    var oControl = this;
//    var oController = this.getProperty("controller");
//    oControl.titlePath = oController.titlePath;
//    var oController = oControl.getController();
//    var modelName = this.getProperty("modelName");
//    var model = oController.getModel(modelName);
//    var sectionID = oControl.getSectionID();
//    var formRef;
//    var showDeleteButton = oControl.getShowDeleteButton();
//
//    //formRef = oController.sectionRef[sectionID] = sap.ui.jsfragment(global.vui5.utilitiesDomain + ".fragments.Form", oController);
//    formRef = sap.ui.jsfragment(global.vui5.utilitiesDomain + ".fragments.Form", oController);
//    formRef.onValueHelpRequest = function (oEvent) {
//      oController.onValueHelpRequest(sectionID, oEvent);
//    };
//
//    formRef.processOnInputChange = function (oEvent) {
//      return oController.processOnInputChange(sectionID, oEvent);
//    };
//
//    formRef.preProcessFieldEvent = function (oEvent) {
//      return oController.preProcessFieldEvent(sectionID, oEvent);
//    };
//    jQuery.sap.syncStyleClass(oController.getOwnerComponent().getContentDensityClass(),
//        oController.getView(), formRef);
//
//
//    if(!oControl.oPanel){
//      var oPanel = new sap.m.Panel({
//        width: "100%",
//        height: "400px"
//      });
//      oControl.oPanel = oPanel;
//    }
//
//    var formToolbar = new sap.m.Toolbar({
//      content: [
//                new sap.m.Title({
//                }).bindProperty("text", oController.modelName + ">" + oControl.titlePath, sap.ui.model.BindingMode.OneWay),
//                new sap.m.ToolbarSpacer({}),
//                new sap.m.Button({
//                  icon: "sap-icon://print",
//                  type: sap.m.ButtonType.Transparent,
//                  visible :true,
//                  press: [oControl._onPrintAddress, oControl]
////                press: [oControl._onPrintAddress.bind(oController)]
//                }),
//                new sap.m.Button({
//                  icon: "sap-icon://delete",
//                  type: sap.m.ButtonType.Transparent,
////                  press: [oControl._onDeleteAddress.bind(oController)],
//                  press: [oControl._onDeleteAddress, oControl],
////                  visible: "{= ${" + oController.modelName + ">" + showDeleteButton + "=== 'X' }}",
//                  visible: "{= ${" + oController.modelName + ">" + showDeleteButton + "} === 'X' }"
//                })
//                //     }).bindProperty("visible", oController.modelName+">"+showDeleteButton, addressFormatter.returnBoolean, sap.ui.model.BindingMode.OneWay),
//                ]
//    });
//    formRef.setToolbar(formToolbar);
//    oControl.oPanel.removeAllContent();
//    oControl.oPanel.addContent(formRef);
//    oControl.setAggregation("_address", oControl.oPanel,false);
//  }

  A.prototype._showCreateTile = function(){
    var oControl = this;
    var oController = this.getProperty("controller");
    var modelName = this.getProperty("modelName");
    var model = oController.getModel(modelName);

//    var showDeleteButton = oControl.getShowDeleteButton();
//    var showMessagePage = oControl.getShowMessagePage();
//    var messagePageText = oControl.getMessagePageText();
//    var showCreateTile = oControl.getShowCreateTile();
//    var createTileText = oControl.getCreateTileText();
//    oControl.titlePath = oController.titlePath;

    if(!oControl.oPanel){
      var oPanel = new sap.m.Panel({
        width: "100%",
        height: "400px"
      });

      oControl.oPanel = oPanel;
    }

    var tile = new sap.m.StandardTile({
      icon: "sap-icon://add",
      type: sap.m.StandardTileType.None,
      press: [oController._onCreateAddress, oController],
      visible : true
    });
//    tile.bindProperty("visible",modelName+">"+showCreateTile, addressFormatter.returnBoolean, sap.ui.model.BindingMode.OneWay);
//    tile.bindProperty("info",modelName+">"+createTileText, addressFormatter.text, sap.ui.model.BindingMode.OneWay);


    var tileContainer = new sap.m.TileContainer({
      width: "100%",
      height : "300px",
      editable: false,
      tiles : [ tile ]
    });
    //  tileContainer.bindProperty("visible",modelName+">"+showCreateTile, addressFormatter.returnBoolean, sap.ui.model.BindingMode.OneWay);

    //clearing all values from model dataPath , otherwise it will go for update
  //  var oController = oControl.getController();
  //  var modelName = oControl.getModelName();
  //  var model = oController.getModel(modelName);
    var data = model.getProperty(oController.sectionDataPath);
    Object.keys(data).forEach(function (key) {
        console.log(data[key]);
        data[key] = "";
      });
    // - end
    model.setProperty(oController.sectionDataPath,data);
    oControl.oPanel.removeAllContent();
    oControl.oPanel.addContent(tileContainer);
    oControl.removeAggregation("_address");
    oControl.setAggregation("_address", oControl.oPanel,false);
//    oControl.invalidate();

  },

  A.prototype._showMessagePage = function(){
    var oControl = this;
    var oController = this.getProperty("controller");
    var modelName = this.getProperty("modelName");
    var model = oController.getModel(modelName);

//    var showMessagePage = oControl.getShowMessagePage();
//    var messagePageText = oControl.getMessagePageText();

    if(!oControl.oPanel){
      var oPanel = new sap.m.Panel({
        width: "100%",
        height: "100%"
      });
      oControl.oPanel = oPanel;
    }
    var oMessagePage = new sap.m.MessagePage({
      description: "",
      showHeader : false,
      visible : true
//      text:
    });
//    oMessagePage.bindProperty("visible",modelName+">"+showMessagePage, addressFormatter.returnBoolean, sap.ui.model.BindingMode.OneWay);
//    oMessagePage.bindProperty("text",modelName+">"+messagePageText, addressFormatter.text, sap.ui.model.BindingMode.OneWay);

    oControl.oPanel.removeAllContent();
    oControl.oPanel.addContent(oMessagePage);
    oControl.setAggregation("_address", oControl.oPanel,false);
  },

  A.prototype._onCreateAddress = function(){
    var oControl = this;
    var oController = oControl.getController();
    var promise = oControl.fireCreateAddress({
                callBack:function(){}
    });

  },
  A.prototype._onDeleteAddress = function(){
    var oControl = this;
    var oController = oControl.getController();
    var modelName = oControl.getModelName();
    var model = oController.getModel(modelName);
    var data = model.getProperty(oController.sectionDataPath);
    var promise = oControl.fireDeleteAddress({
                callBack:function(){
                  //clearing data in model,otherwise on tab switch upodate goes to backend with data in model
                  Object.keys(data).forEach(function (key) {
                    console.log(data[key]);
                    data[key] = "";
                  });
                model.setProperty(oController.sectionDataPath,data);
                }
  });

//    var oControl = this;
//    var oController = oControl.getController();


//    var promise = oControl.fireDeleteAddress({
//      callBack:function(){
//        oControl.setShowCreateTile('X');
//        oControl.setShowDeleteButton(" ");
//        oControl.setShowMessagePage(" ");
//        oControl.setShowAddress(" ");
//        //clearing all values in structure
//        Object.keys(data).forEach(function (key) {
//            console.log(data[key]);
//            data[key] = "";
//          });
//        model.setProperty(oController.sectionDataPath,data);
//        oControl._showCreateTile();
//      }
//    });
  },

  A.prototype._preparePrintForm = function(source) {
    var oControl = this;
//    var addressInDialog = oControl.getProperty("dialog");
    var contentData = [];
    var placement;

    for (var i = 0; i < 10; i++) {
      if (oControl._addressPrintForm['LINE' + i] == "") {
        break;
      }
      contentData.push(new sap.m.Text({
        text: oControl._addressPrintForm['LINE' + i]
      }).addStyleClass("printFormData"));
    }

    var oFooter = new sap.m.Bar({
      contentRight: [new sap.m.Button({
        text: sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls").getText("Close"),
        press: [oControl._onPrintFormClose, oControl]
      })]
    });

//    if (addressInDialog == "X") {
//    placement = sap.m.PlacementType.Top;
//    } else {
    placement = sap.m.PlacementType.Left;
//    }

    var oVertical = new sap.ui.layout.VerticalLayout({
      width: "100%",
      content: [contentData]
    });

    oControl._oPopver = new sap.m.Popover({
      placement: placement,
      title: sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls").getText("FormatAddress"),
      contentWidth: "20%",
      footer: [oFooter],
      content: [oVertical]
    });

    oControl._oPopver.openBy(source);
  };





//  A.prototype.addressProcess = function() {
//  var oControl = this;
//  var oController = oControl.getController();
//  var modelName = oControl.getModelName();
//  var model = oController.getModel(modelName);
//  var statusi18nModel = oController.getModel("i18n");
//  oControl.sectionData = oController.sectionData;

//  var sectionEditable = oControl.getEditable();
//  var dataPath = oControl.getDataPath();
//  var fieldsPath = oControl.getFieldPath();
//  var fieldsGroupPath = oControl.getFieldGroupPath();
//  var addressMode = oControl.getAddressMode();
//  var fieldGroups = model.getProperty(fieldsGroupPath);
//  var fields = model.getProperty(fieldsPath);

//  var oNonGrpFields = _.filter(fields, function(field) {
//  return field['FLGRP'] == "";
//  });
//  if(oNonGrpFields.length != 0){
//  fieldGroups.push([]);
//  }

//  var singleGroup, columnL, columnM, emptyL, emptyM;
//  if (fieldGroups.length == 0) {
//  singleGroup = true;
//  columnL = 1;
//  columnM = 1;
//  emptyL = 4;
//  emptyM = 0;
//  } else {
//  singleGroup = false;
//  columnL = 2;
//  columnM = 2;
//  emptyL = 0;
//  emptyM = 0;
//  }

//  var contentData = [];

//  var group_fields, visibleFields , fieldDataPath, fieldPath, drpdnPath, selection,
//  selectionLabel, bindingMode, lv_visible , lv_editable;

//  if(fields){
//  _.each(fieldGroups,function( group, grpIndex ){
//  group_fields = _.where(fields, {"FLGRP": group['FLGRP'] });

//  visibleFields = _.findWhere(group_fields, { NO_OUT: "" });
//  if(visibleFields){
//  if (group['DESCR'] != "") {
//  contentData.push(new sap.ui.core.Title({
//  text: group['DESCR']
//  }));
//  } else {
//  contentData.push(new sap.ui.core.Title({
//  text: group['FLGRP']
//  }));
//  }

//  _.each(group_fields, function(field, index){
//  fieldDataPath = dataPath + field['FLDNAME'];
//  fieldPath = fieldsPath + "/" + _.findIndex(fields, field) + "/";
//  drpdnPath = global.vui5.modelName+">/DROPDOWNS/"+oControl.sectionData['DARID'] +"/" + field['FLDNAME'];
//  selection = {};

//  if (sectionEditable) {
//  bindingMode = sap.ui.model.BindingMode.TwoWay;
//  } else {
//  bindingMode = sap.ui.model.BindingMode.OneWay;
//  }

//  selectionLabel = {};

//  if (singleGroup){
//  selectionLabel = new sap.m.Label({
//  text: field['LABEL']
//  });
//  } else {
//  selectionLabel = new sap.m.Label({
//  text: field['LABEL'],
//  layoutData: new sap.ui.layout.GridData({
//  span: "L4 M12 S12"
//  })

//  });
//  }

//  lv_editable = "{= ${" + global.vui5.modelName + ">/DOCUMENT_MODE} !== 'A' &&" + " ${" + modelName + ">" + fieldPath + "DISABLED} === '' }";
//  if (field['REQUIRED'] == "X") {
//  selectionLabel.setRequired(true);
//  }

//  contentData.push(selectionLabel);

//  lv_visible = "{= ${" + modelName + ">" + fieldPath + "NO_OUT} === '' }";
//  if (sectionEditable) {
//  switch (field['ELTYP']) {
//  case global.vui5.cons.element.valueHelp:
//  oControl.prepareValueHelpInputField(
////  oControl,
//  field,
//  fieldPath,
//  fieldDataPath,
//  bindingMode,
//  lv_editable,
//  lv_visible,
//  contentData);
//  break;
//  case global.vui5.cons.element.dropDown:
//  oControl.prepareDropdownField(
//  oControl,
//  field,
//  fieldDataPath,
//  drpdnPath,
//  bindingMode,
//  lv_editable,
//  lv_visible,
//  contentData);
//  break;

//  case global.vui5.cons.element.checkBox:
//  oControl.prepareCheckBoxFieldInput(
//  oControl,
//  field,
//  fieldDataPath,
//  lv_editable,
//  lv_visible,
//  contentData);
//  break;
//  case global.vui5.cons.element.input:
//  oControl.prepareInputField(
//  oControl,
//  field,
//  fieldPath,
//  fieldDataPath,
//  bindingMode,
//  lv_editable,
//  lv_visible,
//  contentData,
//  fields);
//  break;
//  }

//  } else {
//  if (field['ELTYP'] == global.vui5.cons.element.checkBox) {
//  selection = new sap.m.CheckBox({
//  editable: false,
//  selected: "{= ${" + dataPath + "} === 'X' }",
//  visible : lv_visible
//  });
//  } else {
//  selection = new sap.m.Input({
//  type: sap.m.InputType.Text,
//  showValueHelp: false,
//  editable: false,
//  visible : lv_visible
//  });

//  oControl.handleDescriptionField(selection, contentData, field, fieldDataPath, fieldPath, bindingMode);

////  if (field['SDSCR'] == global.vui5.cons.fieldValue.value) {
////  selection.bindValue(dataPath, null, bindingMode);
////  contentData.push(selection);
////  } else if (field['SDSCR'] == global.vui5.cons.fieldValue.value_descr) {
////  selection.bindValue(dataPath, null, bindingMode);
////  contentData.push(selection);
////  descriptionPath = dataPath + "_" + field['FNAME'] + "_TXT";
////  contentData.push(new sap.m.Input({
////  type: sap.m.InputType.Text,
////  showValueHelp: false,
////  editable: false
////  }).bindValue(descriptionPath, null, sap.ui.model.BindingMode.OneWay));

////  } else if (field['VLPRT'] == global.vui5.cons.fieldValue.description || field['VLPRT'] == global.vui5.cons.fieldValue.value_cont_descr) {
////  descriptionPath = dataPath + "_" + field['FNAME'] + "_TXT";
////  selection.bindValue(descriptionPath, null, bindingMode);
////  contentData.push(selection);
////  }
//  }

//  selection.setModel(model,modelName);
//  }
//  contentData.push(selection);
//  })
//  }
//  })
//  };

//  var simpleForm;
//  if (singleGroup) {
//  simpleForm = new sap.ui.layout.form.SimpleForm({
//  layout: sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout,
//  //        maxContainerCols: 1,
//  //        columnsL : 2,
//  editable: true,
//  labelSpanL: 4,
//  labelSpanM: 4,
//  emptySpanL: emptyL,
//  emptySpanM: emptyM,
//  columnsL: columnL,
//  columnsM: columnM,
//  content: contentData
//  });
//  } else {
//  simpleForm = new sap.ui.layout.form.SimpleForm({
//  layout: sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout,
//  //        maxContainerCols: 1,
//  //        columnsL : 2,
//  editable: true,
//  //        labelSpanL: 4,
//  //        labelSpanM: 4,
//  emptySpanL: emptyL,
//  emptySpanM: emptyM,
//  columnsL: columnL,
//  columnsM: columnM,
//  content: contentData
//  });
//  }


//  simpleForm.setModel(model,modelName);
//  simpleForm.data("editable", sectionEditable);

//  var oPrintBtn = new sap.m.Button({
//  //text:i18nModel.getProperty("Print"),
//  icon: "sap-icon://print",
//  tooltip: statusi18nModel.getProperty("Print"),
//  press: [oControl.onPrint, oControl]
//  });

////  var oVisible = true;
////  if (addressMode == "DISPLAY" || oControl._popup != "X") {
////  oVisible = false;
////  }

////  var oCheckBtn = new sap.m.Button({
////  text: i18nModel.getProperty("Check"),
////  visible: oVisible,
////  press: [oControl._onCheck, oControl]
////  });

////  if (oControl._dialogMode == "DISPLAY" || oControl._showDeleteButton == undefined || oControl._showDeleteButton == false) {
////  oVisible = false;
////  }

//  /// no need to show delete button
////  var oDeleteBtn = new sap.m.Button({
////  visible: oVisible,
////  icon: "sap-icon://delete",
////  press: [oControl._onAddressDelete, oControl]
////  });


////  if (addressInDialog == "X") {
////  if (addressMode != "DISPLAY") {
////  var oMessageBtn = new sap.m.Button({
////  icon: "sap-icon://message-popup",
////  type: "Emphasized",
////  press: [oControl.onMessages, oControl]
////  }).bindProperty("text", "addressModel>/MESSAGES",
////  addressFormatter.messagesLength, sap.ui.model.BindingMode.OneWay)
////  .bindProperty("visible", "addressModel>/MESSAGES",
////  addressFormatter.showMessages, sap.ui.model.BindingMode.OneWay);

////  oMessageBtn.setModel(addressModel, "addressModel");

////  var oContinueBtn = new sap.m.Button({
////  type: sap.m.ButtonType.Emphasized,
////  text: i18nModel.getProperty("Continue"),
////  press: [oControl._onContinue, oControl]
////  });

////  var oCancelBtn = new sap.m.Button({
////  text: i18nModel.getProperty("Cancel"),
////  press: [oControl._onCancel, oControl]
////  });

////  oBar = new sap.m.Bar({
////  contentLeft: [oMessageBtn],
////  contentRight: [oContinueBtn, oCancelBtn, oCheckBtn, oPrintBtn, oDeleteBtn]
////  });


////  } else {
////  var oCloseBtn = new sap.m.Button({
////  text: i18nModel.getProperty("Close"),
////  press: [oControl._onCancel, oControl]
////  });
////  oBar = new sap.m.Bar({
////  contentRight: [oPrintBtn, oCloseBtn]
////  });
////  }


////  var oPage = new sap.m.Page({
////  showHeader: false,
////  showSubHeader: false,
////  footer: oBar,
////  content: [simpleForm]
////  });


////  oControl._oDialog = new sap.m.Dialog({
////  title: oControl._title,
////  content: [oPage],
////  contentWidth: "85%",
////  contentHeight: "80%",
////  afterClose: function() {
////  oControl._oDialog.destory();
////  }
////  });

////  oControl._oDialog.setModel(model, modelName);

////  if (!jQuery.support.touch) { // apply compact mode if touch is not supported
////  oControl._oDialog.addStyleClass("sapUiSizeCompact");
////  }

////  oControl._oDialog.open();

////  }
////  else {
//  var oBar;
//  var oFlexBox = new sap.m.FlexBox({
//  width: "100%",
//  height: "100%",
//  direction: sap.m.FlexDirection.Column
//  });

////  oBar = new sap.m.Bar({
////  contentRight: [oCheckBtn, oPrintBtn, oDeleteBtn]
////  });
////  oBar = new sap.m.Bar({
////  contentRight: [oDeleteBtn]
////  });
//  oFlexBox.addItem(oBar);
//  oFlexBox.addItem(simpleForm);
////  oFlexBox.setModel(model,modelName);
//  oControl.setAggregation("_address", oFlexBox);
////  }

//  };

//  A.prototype.prepareValueHelpInputField = function(field, fieldPath, dataPath, bindingMode, editable, visible, contentData) {
//  var oControl = this;
//  var selection;
//  var oController = oControl.getController();
//  selection = new sap.m.Input({
//  showValueHelp: true,
//  fieldWidth: "100%",
//  editable: editable,
//  visible: visible,
//  maxLength: parseInt(field['OUTPUTLEN'])
//  });

////  if (setPlaceholder) {
////  selection.setPlaceholder(field['LABEL']);
////  selection.setTooltip(field['LABEL']);
////  }

//  oControl.setFieldType(selection, field);
//  oControl.handleDescriptionField(selection,contentData, field, dataPath, fieldPath, bindingMode);
//  var func = oControl.getOnF4HelpRequest();
//  if (func && typeof func == "function")
//  selection.attachValueHelpRequest(func.bind(oController));

//  selection.data("model", oControl.getModelName());
//  selection.data("path", fieldPath);
////  selection.data("dataArea", dataArea);
//  oControl.bindTypeAheadField(oControl, selection, field);
//  oControl._onInputChange(selection, field);
//  };


//  A.prototype.prepareInputField = function(oControl, field, fieldPath, dataPath, bindingMode, editable, visible, contentData, fields) {

////  var samePosDataPath, oSamePosField;
//  var oLSelection, oRSelection;
//  var adjacentField;


////  oSamePosField = _.where(fields, {
////  "FLGRP": field['FLGRP'],
////  "POSTN": field['POSTN']
////  });

//  oLSelection = new sap.m.Input({
//  showValueHelp : true,
//  editable: editable,
//  visible: visible,
//  maxLength: parseInt(field['OUTPUTLEN']),
//  });
//  oControl.setFieldType(oLSelection, field);
//  oControl.handleDescriptionField(oLSelection, contentData, field, dataPath, fieldPath, bindingMode);
//  contentData.push(oLSelection);

//  if(field['ADJFL'] != ""){
//  adjacentField = _.where(fields,{ FLDNAME : field['ADJFL']});

////  if(adjacentField['EDIT']){
////  lv_editable_tmp ;
////  }
//  var adjacentFieldDataPath = oControl.getProperty("dataPath") + adjacentField['FLDNAME'];
//  var fieldsPath = oControl.getProperty("fieldPath");
//  var adjacentFieldPath = _.where(fieldsPath, {FLDNAME : field['ADJFL']});

//  oRSelection = new sap.m.Input({
//  showValueHelp : true,
////  editable: lv_editable_tmp,
//  maxLength: parseInt(adjacentField['OUTPUTLEN']),
//  });
//  oControl.setFieldType(oRSelection, adjacentField);
//  oControl.handleDescriptionField(oRSelection, contentData, adjacentField, adjacentFieldDataPath, adjacentFieldPath, bindingMode);
//  contentData.push(oRSelection);
//  }
////  oLSelection.setModel(oControl.getModel("addressi18n"), "i18n");

////  if (oSamePosField.length > 1) {
////  if (oSamePosField[1]['EDIT'] == "X") {
////  editable = false;
////  } else {
////  editable = true;
////  }

////  oRSelection = new sap.m.Input({
////  editable: editable,
////  maxLength: parseInt(oSamePosField[1].OUTLN),
////  change: function(oEvent)
////  {
////  oControl._onInputChange(oEvent,oSamePosField[1]);
////  }
////  });
//////oRSelection.setModel(oControl.getModel("addressi18n"), "i18n");

////  }

////  if (field['VLPRT'] == global.vui5.cons.fieldValue.value) {
////  oLSelection.bindValue(dataPath, null, bindingMode);
////  contentData.push(oLSelection);
////  if (oRSelection && oSamePosField.length > 1) {
////  if (oSamePosField[1].VLPRT == global.vui5.cons.fieldValue.value) {
////  samePosDataPath = dataPath + oSamePosField[1].FNAME;
////  oRSelection.bindValue(samePosDataPath, null, bindingMode);
////  contentData.push(oRSelection);
////  } else if (oSamePosField[1].VLPRT == "") {
////  descriptionPath = dataPath + "_" + oSamePosField[1].FNAME + "_TXT";
////  oRSelection.bindValue(descriptionPath, null, bindingMode);
////  contentData.push(oRSelection);
////  }

////  }
////  } else if (field['VLPRT'] == global.vui5.cons.fieldValue.description) {
////  descriptionPath = dataPath + "_" + field["FNAME"] + "_TXT";
////  oLSelection.bindValue(descriptionPath, null, bindingMode);
////  contentData.push(oLSelection);

////  if (oRSelection && oSamePosField.length > 1) {

////  if (oSamePosField[1].VLPRT == global.vui5.cons.fieldValue.value) {
////  samePosDataPath = dataPath + oSamePosField[1].FNAME;
////  oRSelection.bindValue(samePosDataPath, null, bindingMode);
////  contentData.push(oRSelection);
////  } else if (oSamePosField[1].VLPRT == "") {
////  descriptionPath = dataPath + "_" + oSamePosField[1].FNAME + "_TXT";
////  oRSelection.bindValue(descriptionPath, null, bindingMode);
////  contentData.push(oRSelection);
////  }
////  }
////  }


//  };

//  A.prototype._onInputChange = function (selection, fieldInfo) {
//  var oControl = this;
//  var sectionDataPath = oControl.getDataPath();

//  if (fieldInfo['ELTYP'] === global.vui5.cons.element.checkBox) {
//  selection.attachSelect(function (oEvent) {
//  oControl._preProcessOnInputChange(oEvent, selection, fieldInfo, sectionDataPath);
//  oControl.processOnInputChange(oEvent);

////  oControl.processOnInputChange(oEvent).then(function () {
////  oControl._postProcessOnInputChange(oEvent);
////  });
////  oControl.processOnInputChange(oEvent).fail(function (errorContext) {
////  oControl._postProcessOnInputChange(oEvent, errorContext);
////  });

//  });
//  } else if (fieldInfo['ELTYP'] === global.vui5.cons.element.dropDown) {
//  selection.attachChange(function (oEvent) {
//  oControl._preProcessOnInputChange(oEvent, selection, fieldInfo, sectionDataPath);
//  oControl.processOnInputChange(oEvent);

////  oControl.processOnInputChange(oEvent).then(function () {
////  oControl._postProcessOnInputChange(oEvent);
////  });
////  oControl.processOnInputChange(oEvent).fail(function (errorContext) {
////  oControl._postProcessOnInputChange(oEvent, errorContext);
////  });

//  });
//  } else if (fieldInfo['ELTYP'] !== global.vui5.cons.element.link) {
//  selection.attachChange(function (oEvent) {
//  oControl._preProcessOnInputChange(oEvent, selection, fieldInfo, sectionDataPath);
//  oControl.processOnInputChange(oEvent);

////  oControl.processOnInputChange(oEvent).then(function () {
////  oControl._postProcessOnInputChange(oEvent);
////  });
////  oControl.processOnInputChange(oEvent).fail(function (errorContext) {
////  oControl._postProcessOnInputChange(oEvent, errorContext);
////  });

//  });
//  }
//  };

//  A.prototype._preProcessOnInputChange = function (oEvent, selection, fieldInfo, sectionDataPath) {
//  if (!oEvent.mParameters) {
//  oEvent.mParameters = {};
//  }
//  oEvent.mParameters['fieldInfo'] = fieldInfo;
//  oEvent.mParameters['dataPath'] = sectionDataPath;
//  oEvent.mParameters['selection'] = selection;
//  };

//  A.prototype.bindTypeAheadField = function(oControl, selection, field) {
//  var oControl = this;
//  var oController = oControl.getController();
//  selection.setShowSuggestion(true);
//  selection.setMaxSuggestionWidth("50%");
//  selection.setFilterSuggests(false);
//  if (field['INTLEN'] == 1)
//  selection.setStartSuggestion(1);
//  else
//  selection.setStartSuggestion(2);

//  selection.attachSuggest(function (oEvent) {
//  var source = oEvent.getSource();
//  source.bindAggregation("suggestionColumns", global.vui5.modelName + ">/TYPEAHEAD/" + fieldInfo['FLDNAME'] + "/FIELDS", function (sid, oContext) {
//  var contextObject = oContext.getObject();
//  return new sap.m.Column({
//  header: new sap.m.Text({
//  text: contextObject['LABEL']
//  })
//  });
//  });
//  source.bindAggregation("suggestionRows", global.vui5.modelName + ">/TYPEAHEAD/" + fieldInfo['FLDNAME'] + "/DATA", function (sid, oContext) {
//  var contextObject = oContext.getObject();
//  var model = oControl.getModel(global.vui5.modelName);
//  var fields = model.getProperty("/TYPEAHEAD/" + fieldInfo['FLDNAME'] + "/FIELDS");
//  var cells = [];
//  _.each(fields, function (obj) {
//  var label = new sap.m.Label({
//  text: contextObject[obj['FLDNAME']]
//  });
//  cells.push(label);
//  });
//  var listItem = new sap.m.ColumnListItem({
//  vAlign: sap.ui.core.VerticalAlign.Middle,
//  cells: cells
//  });
//  return listItem;
//  });
//  oController.handleTypeAhead(oEvent);
//  });
//  selection.attachSuggestionItemSelected(oController.handleSuggestionItemSelected.bind(oController));

//  selection.data("model", oControl.getModelName());
////  selection.data("path", fieldPath);

//  };


//  A.prototype.prepareDropdownField = function(oControl, field, dataPath, drpdnPath, bindingMode, editable, visible, contentData) {
//  var selection;
//  selection = new vistex.utility.VuiComboBox({
//  editable: editable,
//  visible: visible
//  });

//  selection.bindAggregation("items", drpdnPath, function(sid, oContext) {
//  var contextObject = oContext.getObject();
//  return new sap.ui.core.Item({
//  key: contextObject['VALUE'],
//  text: contextObject['NAME']
//  });
//  });

//  selection.bindProperty("selectedKey", dataPath, null, bindingMode);
//  oControl._onInputChange(selection, field);
//  contentData.push(selection);
//  };

//  A.prototype.onDropdownValueChange = function(oEvent) {

//  var oControl = this;
//  var addressModel = oControl.getModel("addressModel");
//  var dropdownPath = oEvent.getSource().data("drpdnPath");
//  var dataPath = oEvent.getSource().data("dataPath");

//  if (oEvent.getSource().getSelectedKey() == "" && oEvent.getSource().getValue() != "") {
//  var object = _.where(addressModel.getProperty(dropdownPath), {
//  VALUE: oEvent.getSource().getValue()
//  });

//  if (object.length == 0) {
//  oEvent.getSource().setShowValueStateMessage(true);
//  oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
//  oEvent.getSource().focus();
//  } else {
//  oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
//  oEvent.getSource().setShowValueStateMessage(false);
//  addressModel.setProperty(dataPath, oEvent.getSource().getValue());
//  }
//  } else {
//  oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
//  oEvent.getSource().setShowValueStateMessage(false);
//  }


//  };

//  A.prototype.handleSuggestionItemSelected = function(oEvent) {

//  var oControl = this;
//  var source = oEvent.getSource();
//  var addressModel = oControl.getModel("addressModel");
//  var field = source.data("field");

//  var item = oEvent.getParameter("selectedRow");

//  var rowData = item.getBindingContext("addressModel").getObject();

//  var returnField = addressModel.getProperty("/TYPEAHEAD/RETURNFIELD");

//  var path = source.getBinding("value").getPath();

//  var descrField;

//  if (field['SD'] == "A") {
//  addressModel.setProperty(path, rowData[returnField]);
//  } else if (field['VLPRT'] == "B") {
//  addressModel.setProperty(path, rowData[returnField]);
//  path = path.replace(field['FNAME'], "_" + field['FNAME'] + "_TXT");
//  descrField = addressModel.getProperty("/TYPEAHEAD/DESCRFIELD");
//  addressModel.setProperty(path, rowData[descrField]);

//  } else if (field['VLPRT'] == "") {
//  descrField = addressModel.getProperty("/TYPEAHEAD/DESCRFIELD");
//  addressModel.setProperty(path, rowData[descrField]);
//  path = path.replace("_" + field['FNAME'] + "_TXT", field['FNAME']);
//  addressModel.setProperty(path, rowData[returnField]);
//  }

//  //source.fireChange();

//  };

//  A.prototype.handleTypeAhead = function(oEvent) {
//  var oControl = this;
//  var dataArea = oControl._dataArea;
//  var source = oEvent.getSource();
//  var fieldInfo = source.data("field");
//  var addressModel = oControl.getModel(source.data("model"));

//  var rsparams = [];



//  if (fieldInfo['FNAME'] == "REGION" || fieldInfo['FNAME'] == "TRANSPZONE") {
//  var model = oControl.getModel("addressModel");
//  var depflData = model.getProperty("/DATA/COUNTRY");
//  rsparams.push({
//  "SHLPNAME": "",
//  "SHLPFIELD": "COUNTRY",
//  "SIGN": "I",
//  "OPTION": "EQ",
//  "LOW": depflData,
//  "HIGH": ""
//  });
//  }


//  addressModel.setProperty("/TYPEAHEAD/FIELDS", {});
//  addressModel.setProperty("/TYPEAHEAD/DATA", {});
//  addressModel.setProperty("/TYPEAHEAD/RETURNFIELD", "");
//  addressModel.setProperty("/TYPEAHEAD/DESCRFIELD", "");

//  var data = [];
//  var params = [];
//  params.push({
//  NAME: "FIELDVALUE",
//  VALUE: oEvent.getParameter("suggestValue")
//  });
//  params.push({
//  NAME: "FIELDNAME",
//  VALUE: fieldInfo['FNAME']
//  });
//  params.push({
//  NAME: "TABLENAME",
//  VALUE: fieldInfo['TABNM']
//  });
//  params.push({
//  NAME: "DATAAREA",
//  VALUE: dataArea
//  });

//  if (fieldInfo['VLPRT'] == "A") {
//  params.push({
//  NAME: "SEARCHTYPE",
//  VALUE: "VAL"
//  });
//  } else {
//  params.push({
//  NAME: "SEARCHTYPE",
//  VALUE: "DSC"
//  });
//  }

//  data.push({
//  "DATA": rsparams,
//  "PARAMS": params,
//  "DTAREA": "TYPEAHEAD",
//  "EVENT": "READ"
//  });

//  $.when(commonUtils.callServer({
//  data: data,
//  reqType: 'POST',
//  NoLoader: true
//  })).then(function(result) {
//  if (result) {
//  var response = _.find(result, {
//  DTAREA: "TYPEAHEAD",
//  EVENT: "READ"
//  });
//  if (response && response['RESULT']) {
//  addressModel.setProperty("/TYPEAHEAD/FIELDS", response['RESULT']['RESULT_FCAT']);
//  if (response['RESULT']['RESULT_FCAT']) {
//  var length = response['RESULT']['RESULT_FCAT'].length;
//  var width = (length + 1) * 10;
//  if (width > 90)
//  width = 90;
//  width = width + "%";
//  source.setMaxSuggestionWidth(width);
//  }
//  addressModel.setProperty("/TYPEAHEAD/DATA", response['RESULT']['RESULT_DATA']);
//  addressModel.setProperty("/TYPEAHEAD/RETURNFIELD", response['RESULT']['RETFIELD']);
//  addressModel.setProperty("/TYPEAHEAD/DESCRFIELD", response['RESULT']['DESCRFIELD']);
//  }
//  }
//  });



//  };

//  A.prototype.prepareCheckBoxFieldInput = function(oControl, field, dataPath, editable, visible, contentData) {
//  var oController = oControl.getController();

//  var selection = new sap.m.CheckBox({
//  select: [oController.onCheckBoxSelect, oControl],
//  editable: editable,
//  visible: visible,
//  selected: "{= ${" + dataPath + "} === 'X' }"
//  });

////  selection.data("model", modelName);
//  oControl._onInputChange(selection, field);
//  contentData.push(selection);
//  };

//  A.prototype.onCheckBoxSelect = function(oEvent) {
//  var source = oEvent.getSource();

//  var path;
//  if (source.getBindingContext(source.data("model"))) {
//  path = source.getBindingContext(source.data("model")).getPath();
//  path = path + "/" + source.getBinding("selected").getBindings()[0].getPath();
//  } else {
//  path = source.getBinding("selected").getBindings()[0].getPath();
//  }

//  var model = source.getModel(source.data("model"));

//  if (oEvent.getParameter("selected"))
//  model.setProperty(path, 'X');
//  else
//  model.setProperty(path, '');
//  };

//  A.prototype.onValueHelpRequest = function(oEvent) {

//  var oControl = this;


//  var src = oEvent.getSource();
//  var _inputHelpID = src.getId();

//  var field = src.data("field");


//  oControl.fireValueRequest({
//  "FLDNAME": field['FNAME'],
//  "TABNAME": field['TABNM'],
//  "LABEL": field['LABEL'],
//  "FIELDID": _inputHelpID,
//  "TXTFL": "_" + field['FNAME'] + "_TXT",
//  "DEPFL": field['DEPFL'],
//  "DATAAREA": oControl._dataArea
//  });



//  };


//  A.prototype.addressDataCheck = function(oEvent) {
//  var oControl = this;
//  var msg = [];
//  var source;
//  if (oEvent) {
//  source = oEvent.getSource();
//  }

//  var addressModel = oControl.getModel("addressModel");
//  addressModel.setProperty("/MESSAGES", msg);

//  var addressData = addressModel.getProperty("/DATA");
//  //var oReqrfldsError = false , oIndex = 0, error = false;

//  var oError = oControl.oController.checkRequiredFields();

//  if (oControl._popup == "" && oControl._onCheckPressed == undefined &&
//  oControl._onPrintPressed == undefined) {
//  var data1 = {
//  "DTAREA": "ADDRESS",
//  "EVENT": "UPDATE",
//  "DATA": addressData,
//  "ERROR": oError
//  };
//  return data1;
//  } else if (!oError) {


//  var data = [];

//  var event;

//  if (oControl._onPrintPressed) {
//  event = "PRINTPREVIEW";

//  } else if (oControl._onCheckPressed) {
//  event = "CHECK";

//  } else {
//  event = "UPDATE";
//  }

//  data.push({
//  "DATA": addressData,
//  "PARAMS": "",
//  "DTAREA": "ADDRESS",
//  "EVENT": event

//  });

//  if (oControl._popup != "X") {
//  data.push({
//  "DATA": [],
//  "PARAMS": [],
//  "DTAREA": "MESSAGES",
//  "EVENT": "READ"
//  });
//  }
//  $.when(commonUtils.callServer({
//  data: data,
//  reqType: 'POST'
//  })).then(function(result) {

//  if (result) {
//  var response = _.findWhere(result, {
//  DTAREA: "ADDRESS",
//  EVENT: event
//  });
//  addressModel.setProperty("/DATA", response['RESULT']['DATA']);
//  addressModel.setProperty("/CHECK_CHANGES", response['RESULT']['CHECK_CHANGES']);
//  if (oControl._popup != "X") {
//  if (response['RESULT']['PRINTFORM'] != undefined && response['RESULT']['PRINTFORM'] != "") {
//  oControl._addressPrintForm = response['RESULT']['PRINTFORM'];
//  oControl._preparePrintForm(source);
//  } else {
//  var messages = _.findWhere(result, {
//  DTAREA: "MESSAGES",
//  EVENT: "READ"
//  });

//  oControl.fireMessagesShow({
//  "MESSAGES_DATA": messages['RESULT']['MESSAGES_DATA'],
//  "DATA_CHANGED": messages['RESULT']['DATA_CHANGES'],
//  "ERRORS": messages['RESULT']['DOCUMENT_ERRORS']
//  });
//  }
//  } else {
//  addressModel.setProperty("/MESSAGES", response['RESULT']['MESSAGES']);
//  if (response['RESULT']['PRINTFORM'] != undefined && response['RESULT']['PRINTFORM'] != "") {
//  oControl._addressPrintForm = response['RESULT']['PRINTFORM'];
//  oControl._preparePrintForm(source);
//  } else {
//  var oError = response['RESULT']['ERROR'];
//  if (!oError && oControl._onCheckPressed == undefined) {
//  oControl._oDialog.close();
//  }

//  }
//  }
//  oControl._onCheckPressed = undefined;
//  oControl._onPrintPressed = undefined;
//  }
//  });

//  }
//  };

//  A.prototype._onCancel = function() {
//  var oControl = this;
//  oControl._oDialog.close();
//  };

//  A.prototype._onContinue = function() {
//  var oControl = this;
//  oControl.addressDataCheck();

//  };



//  A.prototype.onChange = function(oEvent) {

//  var oControl = this;
//  var source = oEvent.getSource();
//  var oKey = source.getValue();
//  var addressModel = oControl.getModel("addressModel");
//  var fieldInfo = source.data("field");
//  var path = source.getBinding("value").getPath();
//  var rsparams = [];
//  var arr = path.split("/");
//  var fieldname = arr[arr.length - 1];

//  if (_.isArray(fieldInfo['DEPFL']) && fieldInfo['DEPFL'].length > 0) {
//  for (var i = 0; i < fieldInfo['DEPFL'].length; i++) {

//  var depflPath;

//  depflPath = path.replace(fieldname, fieldInfo['DEPFL'][i]);


//  var depflData = addressModel.getProperty(depflPath);

//  rsparams.push({
//  "SHLPNAME": "",
//  "SHLPFIELD": fieldInfo['DEPFL'][i],
//  "SIGN": "I",
//  "OPTION": "EQ",
//  "LOW": depflData,
//  "HIGH": ""
//  });
//  }
//  }


//  var data = [];
//  var params = [];
//  params.push({
//  NAME: "FIELDVALUE",
//  VALUE: oKey
//  });
//  params.push({
//  NAME: "FIELDNAME",
//  VALUE: fieldInfo['FNAME']
//  });
//  params.push({
//  NAME: "TABLENAME",
//  VALUE: fieldInfo['TABNM']
//  });
//  params.push({
//  NAME: "CHECK_VALUE",
//  VALUE: "X"
//  });
//  params.push({
//  NAME: "GET_DESCR",
//  VALUE: "X"
//  });

//  data.push({
//  "DATA": rsparams,
//  "PARAMS": params,
//  "DTAREA": "FIELD_CHECK",
//  "EVENT": "READ"
//  });

//  $.when(commonUtils.callServer({ // callDescriptionServer
//  data: data,
//  reqType: 'POST',
//  NoLoader: true
//  })).then(function(result) {
//  if (result) {
//  var response = _.find(result, {
//  DTAREA: "FIELD_CHECK",
//  EVENT: "READ"
//  });
//  if (response) {
//  if (response['RESULT']['VALUE_NOT_FOUND'] == 'X') {
//  source.setShowValueStateMessage(true);
//  source.setValueState(sap.ui.core.ValueState.Error);
//  //source.data("error" , true);
//  var text;
//  if (source.getParent().getAggregation("label")) {
//  text = source.getParent().getAggregation("label").getText();
//  }
//  var bundle = source.getModel("i18n").getResourceBundle();
//  var errorText = bundle.getText("EnterValid", [text]);
//  source.setValueStateText(errorText);
//  source.focus();
//  //deffered.resolve(false);
//  } else {
//  var oDescr = response['RESULT']['DESCR'];
//  source.setShowValueStateMessage(false);
//  source.setValueState(sap.ui.core.ValueState.None);

//  //source.data("error" , false);
//  if (fieldInfo['VLPRT'] == "") {
//  addressModel.setProperty(path, oDescr);
//  path = path.replace(fieldname, fieldInfo['FNAME']);
//  addressModel.setProperty(path, oKey);
//  } else if (fieldInfo['VLPRT'] == "B") {
//  addressModel.setProperty(path, oKey);
//  path = path.replace(fieldInfo['FNAME'], "_" + fieldInfo['FNAME'] + "_TXT");
//  addressModel.setProperty(path, oDescr);
//  } else if (fieldInfo['VLPRT'] == "C") {
//  if (oDescr != "") {
//  var description = oDescr + "(" + oKey + ")";
//  addressModel.setProperty(path, description);
//  path = path.replace(fieldname, fieldInfo['FNAME']);
//  addressModel.setProperty(path, oKey);
//  }

//  } else {
//  addressModel.setProperty(path, oKey);
//  }

//  }
//  }
//  }
//  });
//  };


//  A.prototype._onCheck = function() {
//  var oControl = this;
//  oControl._onCheckPressed = "X";
//  oControl.addressDataCheck();
//  };

//  A.prototype._onPrintAddress = function(oEvent) {
//    var oControl = this;
//
//    var oController = oControl.getController();
//    var modelName = oControl.getModelName();
//    var dataPath = oControl.getDataPath();
//    var model = oController.getModel(modelName);
//    var addressData = model.getProperty(dataPath);
//
//    var promise = oControl.firePrintPreview({callBack:function(resp){
////      oControl._addressPrintForm = resp['RESULT']['PRINTFORM']; - set printform data here
//      oControl._preparePrintForm(source,resp);
//    }});
//  };


//  A.prototype.onMessages = function(oEvent) {
//  var oControl = this;
//  var addressModel = oControl.getModel("addressModel");
//  var oMessagePopover = new sap.m.MessagePopover({});

//  oMessagePopover.bindAggregation("items", "addressModel>/MESSAGES", function(sid, oContext) {
//  var oType;
//  if (oContext.getObject("MSGTY") == "S") {
//  oType = "Success";
//  } else if (oContext.getObject("MSGTY") == "E") {
//  oType = "Error";
//  } else if (oContext.getObject("MSGTY") == "I") {
//  oType = "Information";
//  }
//  return new sap.m.MessagePopoverItem({
//  type: oType,
//  title: oContext.getObject("MSGLI"),
//  description: ""
//  });
//  });

//  oMessagePopover.setModel(addressModel, "addressModel");

//  oMessagePopover.openBy(oEvent.getSource());


//  };



  A.prototype._onPrintFormClose = function() {
    var oControl = this;
    if (oControl._oPopver) {
      oControl._oPopver.close();
      oControl._oPopver = undefined;
    }
  };

//  A.prototype._onAddressDelete = function() {
//  var oControl = this;

//  var i18nModel = oControl.getModel("addressi18n");

//  sap.m.MessageBox.show(i18nModel.getProperty("DeleteAddress"), {
//  icon: sap.m.MessageBox.Icon.INFORMATION,
//  title: i18nModel.getProperty("DeleteAddressTitle"),
//  actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
//  onClose: function(oAction) {
//  if (oAction == sap.m.MessageBox.Action.YES) {
//  if (oControl._oDialog) {
//  oControl._oDialog.close();
//  }
//  oControl.fireDeleteAddress();
//  }
//  }
//  });

//  };

//  A.prototype.addressCheckChanges = function() {
//  var oControl = this;
//  var addressModel = oControl.getModel("addressModel");
//  if (addressModel.getProperty("/CHECK_CHANGES") != "") {
//  return true;
//  } else {
//  return false;
//  }

//  };

//  A.prototype.setFieldType = function (selection, fieldInfo) {
//  // var oController = this.getController();
//  if (fieldInfo['SDSCR'] == global.vui5.cons.fieldValue.value || fieldInfo['SDSCR'] == global.vui5.cons.fieldValue.value_descr) {
//  if (fieldInfo['INTTYPE'] == global.vui5.cons.intType.number ||
//  // fieldInfo['INTTYPE'] == 'I' ||
//  // fieldInfo['INTTYPE'] == 'P' ||
//  fieldInfo['INTTYPE'] == global.vui5.cons.intType.oneByteInteger || fieldInfo['INTTYPE'] == global.vui5.cons.intType.twoByteInteger || fieldInfo['INTTYPE'] == global.vui5.cons.intType.float
//  || fieldInfo['INTTYPE'] == global.vui5.cons.intType.decimal16 || fieldInfo['INTTYPE'] == global.vui5.cons.intType.decimal32) {
//  selection.setType(sap.m.InputType.Number);
//  }
//  }
//  };

//  A.prototype.handleDescriptionField = function (selection,contentData, fieldInfo, dataPath, fieldPath, bindingMode) {
//  var oControl = this;
//  var oController = oControl.getController();
//  var modelName = oControl.getModelName();
//  var descriptionPath;
//  var sectionDataPath = oControl.getDataPath();

//  if (fieldInfo['SDSCR'] == global.vui5.cons.fieldValue.description ||
//  fieldInfo['SDSCR'] == global.vui5.cons.fieldValue.value_cont_descr) {

//  descriptionPath = sectionDataPath + fieldInfo['TXTFL'];
//  selection.bindValue(modelName + ">" + descriptionPath, null, bindingMode);
//  selection.data("model", modelName);
//  selection.data("path", fieldPath);
//  selection.setMaxLength(60);

//  } else if (fieldInfo['SDSCR'] == global.vui5.cons.fieldValue.value_descr) {
//  selection.bindValue(modelName + ">" + dataPath, null, bindingMode);
//  selection.data("model", modelName);
//  selection.data("path", fieldPath);

//  descriptionPath = sectionDataPath + fieldInfo['TXTFL'];

//  var selection1 = new sap.m.Input({
//  type: sap.m.InputType.Text,
//  showValueHelp: false,
//  editable: false,
//  maxLength: 60// parseInt(groupFieldInfo['OUTPUTLEN'])
//  });
//  contentData.push(selection1);

//  } else {
//  selection.bindValue(modelName + ">" + dataPath, null, bindingMode);
//  }
//  };

//  var addressFormatter = {
//  messagesLength: function(value) {
//  if (value != undefined) {
//  return value.length;
//  }
//  },

//  showMessages: function(value) {

//  if (value != undefined) {
//  if (value.length != 0) {
//  return true;
//  } else {
//  return false;
//  }
//  }
//  }
//  };
//  return A;
});