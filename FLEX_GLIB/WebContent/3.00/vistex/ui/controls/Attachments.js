sap.ui.define(["sap/ui/core/Control",
             vistexConfig.rootFolder + "/ui/core/global",
             vistexConfig.rootFolder + "/ui/core/underscore-min"], function (control, global, underscoreJS) {

                 var A = control.extend(vistexConfig.rootFolder + ".ui.controls.Attachments", {
                     metadata: {
                         library: vistexConfig.rootFolder + ".ui",
                         properties: {
                             controller: {
                                 type: "object",
                                 defaultValue: null
                             },
                             modelName: {
                                 type: "string",
                                 defaultValue: null
                             },
                             dataPath: {
                                 type: "string",
                                 defaultValue: null
                             },
                             sectionPath: {
                                 type: "string",
                                 defaultValue: null
                             },
                             mimtp: {
                                 type: "string",
                                 defaultValue: null
                             },
                             editable: {
                                 type: "boolean",
                                 defaultValue: false
                             },
                             disableUploadPath: {
                                 type: "any"
                             },
                             enableUpload: {
                                 type: "boolean",
                                 defaultValue: true
                             },
                             enableReplace: {
                                 type: "boolean",
                                 defaultValue: true
                             },
                             enableRename: {
                                 type: "boolean",
                                 defaultValue: true
                             },
                             enableDelete: {
                                 type: "boolean",
                                 defaultValue: true
                             },
                             enableDownload: {
                                 type: "boolean",
                                 defaultValue: true
                             }
                         },

                         events: {
                             messagesShow: {
                                 parameters: {
                                     selectionSet: {
                                         type: "sap.ui.core.Control[]"
                                     }
                                 }
                             },
                             onUpload: {},
                             onDelete: {},
                             onRename: {},
                             onReplace: {},
                             onDownload: {}
                         },
                         aggregations: {
                             _uploadCollection: {
                                 type: "sap.m.UploadCollection",
                                 multiple: false,
                                 visibility: "hidden"
                             }
                         }
                     },

                     init: function () {
                         var oControl = this;
                         fileDownloadLink = function (oControl) {
                         };
                         duplicateFile = function (oControl) {
                         };
                         fileDownloadLink.prototype = {
                             onAfterRendering: function (oEvent) {

                                 var oLinks = jQuery("#" + oEvent.srcControl.getId()).find("a");

                                 var oItems = oEvent.srcControl.getItems();

                                 if (oItems.length !== 0) {
                                     underscoreJS.each(oLinks, function (link, index) {

                                         var object = oItems[index].data("data");

                                         jQuery(link).removeClass("sapMLnkDsbl");

                                         jQuery(link).attr("disabled", false);

                                         jQuery(link).click(function () {
                                             oControl._onFileView(object);
                                         });
                                     });

                                 }


                             }
                         };

                         duplicateFile.prototype = {
                             onAfterRendering: function (oEvent) {

                                 var id = oEvent.srcControl.oHeaderToolbar.getId();
                                 $("#" + id).hide();

                             }
                         };

                     },

                     renderer: function (oRM, oControl) {
                    	 //*****Rel 60E_SP6 - QA #11673
                    	 oRM.write("<style>");
                         oRM.write(".dupFileDialogBox > .sapMDialogSection { background-color:white !important; }");
                         oRM.write(".VuiUploadCollection .sapUiFupInputMask { display: none !important; }"); 
                         oRM.write("</style>");
                         //*****                    	 
                    	 oRM.write("<div");
                         oRM.writeControlData(oControl);
                         oRM.write(">");
                         //*****Rel 60E_SP6 - QA #11673                         
                         /*oRM.write("<style>");
                         oRM.write(".dupFileDialogBox > .sapMDialogSection { background-color:white !important; }");
                         oRM.write("</style>");*/
                         oRM.renderControl(oControl.getAggregation("_uploadCollection"));
                         oRM.write("</div>");
                     }

                 });
                 A.prototype.setModelName = function (value) {
                     this.setProperty("modelName", value, true);
                 };

                 A.prototype.setDataPath = function (value) {
                     this.setProperty("dataPath", value, true);
                 };
                 A.prototype.setSectionPath = function (value) {
                     this.setProperty("sectionPath", value, true);
                 };
                 A.prototype.setEditable = function (value) {
                     this.setProperty("editable", value, true);
                 };
                 A.prototype.setMimtp = function (value) {
                     this.setProperty("mimtp", value, true);
                 };
                 A.prototype.setDisableUploadPath = function (value) {
                     this.setProperty("disableUploadPath", value, true);
                 };

                 A.prototype.setEnableUpload = function (value) {
                     this.setProperty("enableUpload", value, true);
                 };

                 A.prototype.setEnableReplace = function (value) {
                     this.setProperty("enableReplace", value, true);
                 };

                 A.prototype.setEnableRename = function (value) {
                     this.setProperty("enableRename", value, true);
                 };

                 A.prototype.setEnableDelete = function (value) {
                     this.setProperty("enableDelete", value, true);
                 };

                 A.prototype.setEnableDownload = function (value) {
                     this.setProperty("enableDownload", value, true);
                 };

                 A.prototype.attachmentProcess = function () {
                     var oControl = this;
                     var oControl = this;
                     oControl.attachmentObj = {
                         "BITM_TYPE": "",
                         "BITM_DESCR": "",
                         "CREATOR": "",
                         "CREADATE": "",
                         "CREATIME": "",
                         "BITM_FILENAME": "",
                         "ATTEX": "",
                         "ARCHIV_ID": "",
                         "DOCTYP": "",
                         "UPDKZ": "",
                         "ROWID": "",
                         "ATDAT": "",
                         "UPDKZ_UI": "",
                         "TIMESTAMP": "",
                         "USER_TEXT": ""
                     };
                     oControl._Attachment = jQuery.extend(true, {}, oControl.attachmentObj);
                     var oController = this.getProperty("controller");
                     var modelName = this.getModelName();
                     var dataPath = this.getDataPath();
                     var attachModel = oController.getModel(modelName);
                     if (oController.sectionData['DAQLF'] === "0") {
                         oControl._onGosAttachmentProcess();
                     }
                     else {
                         oControl._onDocumentAttachmentProcess();
                     }

                     if (sap.ui.getVersionInfo().version < "1.34") {
                         oControl._fileUploaderSendFiles(); //Override File Uploader Send Files Method in order to avoid IE Upload Issues
                     }

                 };

                 A.prototype._onGosAttachmentProcess = function () {
                     var oControl = this;
                     var oController = this.getProperty("controller");
                     var modelName = this.getModelName();
                     var dataPath = this.getDataPath();
                     var mimtp = this.getMimtp();
                     var attachModel = oController.getModel(modelName);
                     var oPath = modelName + ">" + dataPath;
                     var bundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls");
                     var oUploadCollection;

                     if (sap.ui.Device.browser.msie) {
                         oUploadCollection = new sap.m.UploadCollection({
                             change: [oControl._onFileChange, oControl],
                             fileDeleted: [oControl._onFileDeleted, oControl],
                             uploadComplete: [oControl._onFileUpload, oControl],
                             fileRenamed: [oControl._onFileRename, oControl],
                             //*****Rel 60E_SP7
                             uploadTerminated: [oControl._onUploadTerminate, oControl],
                             //*****
                         });
                     }
                     else {
                         oUploadCollection = new sap.m.UploadCollection({
                             uploadUrl: "",                             
                             change: [oControl._onFileChange, oControl],                             
                             fileDeleted: [oControl._onFileDeleted, oControl],
                             uploadComplete: [oControl._onFileUpload, oControl],
                             fileRenamed: [oControl._onFileRename, oControl],
                             //*****Rel 60E_SP7
                             uploadTerminated: [oControl._onUploadTerminate, oControl],
                             //*****
                         });
                     }

                     oUploadCollection.setProperty("uploadEnabled", oControl.getProperty("enableUpload"));
                     oUploadCollection.setModel(attachModel, modelName);
                     oUploadCollection.data("sectionData", oController.sectionData);
                     oUploadCollection.data("modelName", oController.modelName);

                     oUploadCollection.bindAggregation("items", oPath, function (sid, oContext) {
                         var object = oContext.getObject();
                         var path = oContext.getPath();
                         var oItem = new sap.m.UploadCollectionItem({
                             fileName: object['BITM_FILENAME'],
                             documentId: object['ROWID'],
                             visibleDelete: oControl.getProperty("enableDelete"),
                             visibleEdit: oControl.getProperty("enableRename"),
                             attributes: [new sap.m.ObjectAttribute({
                            	 title:bundle.getText("Title")
                             }).bindProperty("text",modelName+">"+path+"/BITM_DESCR")
                               .bindProperty("visible",modelName+">"+path+"/BITM_DESCR",function(val){
                            	   return val ? true:false
                               })],
                             statuses:[
                            	 new sap.m.ObjectStatus({
                                   text: bundle.getText("UploadedBy") + ": " + object['USER_TEXT'] + "  " + bundle.getText("UploadedOn") + ": " + object['TIMESTAMP']
                               })
                             ]
                         });
                         
                         oItem.data("data", object);
                         return oItem;
                     });
                     if (oControl.getProperty("enableDownload")) {
                         oUploadCollection.addDelegate(new fileDownloadLink(oUploadCollection));
                     }

                     //*****Rel 60E_SP6 - QA #11673
                     if(sap.ui.getVersionInfo().version >= "1.56"){
                    	 oUploadCollection.addStyleClass("VuiUploadCollection");
                     }
                     //*****
                     
                     oControl.setAggregation("_uploadCollection", oUploadCollection);
                 };

                 A.prototype._onDocumentAttachmentProcess = function () {
                     var oControl = this;
                     var oController = this.getProperty("controller");
                     var modelName = this.getModelName();
                     var dataPath = this.getDataPath();
                     var sectionPath = this.getSectionPath();
                     var attachModel = oController.getModel(modelName);
                     var bundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls");                     

                     var oPath = modelName + ">" + dataPath;
                     //var oPath = modelName + ">/DATA/" + oController.sectionData['DATAR'] + oController.sectionData['DAQLF'];
                     var oUploadCollection;
                     if (sap.ui.Device.browser.msie) {
                         oUploadCollection = new sap.m.UploadCollection({
                             change: [oControl._onDocFileChange, oControl],
                             uploadComplete: [oControl._onDocUploadComplete, oControl],
                             fileDeleted: [oControl._onDocFileDeleted, oControl],
                             fileRenamed: [oControl._onFileRename, oControl],
                             //*****Rel 60E_SP7
                             uploadTerminated: [oControl._onUploadTerminate, oControl],
                             //*****
                             typeMissmatch: function (oEvent) {
                                 var oMimeType = oEvent.getParameters("files").files[0]['mimeType'];
                                 var msg = [{
                                     MSGLI: bundle.getText("MimeType") + " " + oMimeType + " " + bundle.getText("NotAllowed"),
                                     MSGTY: "E"
                                 }];
                                 oControl.fireMessagesShow({
                                     "MESSAGES_DATA": msg,
                                     "DATA_CHANGED": "",
                                     "ERRORS": ""
                                 });
                             }
                         });
                     }
                     else {
                         oUploadCollection = new sap.m.UploadCollection({
                             uploadUrl: "",
                             change: [oControl._onDocFileChange, oControl],
                             uploadComplete: [oControl._onDocUploadComplete, oControl],
                             fileDeleted: [oControl._onDocFileDeleted, oControl],
                             fileRenamed: [oControl._onFileRename, oControl],
                             //*****Rel 60E_SP7
                             uploadTerminated: [oControl._onUploadTerminate, oControl],
                             //*****
                             typeMissmatch: function (oEvent) {
                                 var oMimeType = oEvent.getParameters("files").files[0]['mimeType'];
                                 var msg = [{
                                     MSGLI: bundle.getText("MimeType") + " " + oMimeType + " " + bundle.getText("NotAllowed"),
                                     MSGTY: "E"
                                 }];
                                 oControl.fireMessagesShow({
                                     "MESSAGES_DATA": msg,
                                     "DATA_CHANGED": "",
                                     "ERRORS": ""
                                 });
                             }
                         });
                     }

                     oUploadCollection.setModel(attachModel, modelName);
                     oUploadCollection.data("sectionData", oController.sectionData);
                     oUploadCollection.data("modelName", modelName);
                     var mPath = this.getProperty("mimtp");
                     var disableUploadPath = this.getDisableUploadPath();
                     //var allowUploadPath = "/SECCFG/"+oController.sectionData['SECTN']+"/attributes/disableUpload";
                     oUploadCollection.bindProperty("mimeType", global.vui5.modelName + ">" + mPath,
                             attachmentformatter.setMimeTypes,
                             sap.ui.model.BindingMode.OneWay);

                     if (oControl.getProperty("enableUpload")) {
                         oUploadCollection.bindProperty("uploadEnabled", {
                             parts: [{ path: modelName + ">" + disableUploadPath },
                                     { path: modelName + ">" + sectionPath + "/DISOL" }],
                             formatter: attachmentformatter.getUploadEnabled,
                             mode: sap.ui.model.BindingMode.OneWay
                         });
                     }
                     else {
                         oUploadCollection.setProperty("uploadEnabled", oControl.getProperty("enableUpload"));
                     }

                     oUploadCollection.bindAggregation("items", oPath, function (sid, oContext) {
                         var object = oContext.getObject();
                         var path = oContext.getPath();
                         var oUserText = modelName + ">" + oContext.sPath + "USER_TEXT";
                         var oItem = new sap.m.UploadCollectionItem({
                             fileName: object['BITM_FILENAME'],
                             documentId: object['ROWID'],
                             visibleDelete: oControl.getProperty("enableDelete"),
                             visibleEdit: oControl.getProperty("enableRename"),
                             attributes: [new sap.m.ObjectAttribute({
                            	 title:bundle.getText("Title")
                             }).bindProperty("text",modelName+">"+path+"/BITM_DESCR")
                               .bindProperty("visible",modelName+">"+path+"/BITM_DESCR",function(val){
                            	   return val ? true:false
                               })],
                             statuses:[
                            	 new sap.m.ObjectStatus({
                                   text: bundle.getText("UploadedBy") + ": " + object['USER_TEXT'] + "  " + bundle.getText("UploadedOn") + ": " + object['TIMESTAMP']
                               })
                             ]
                         });
                         
                         oItem.data("data", object);
                         return oItem;
                     });
                     if (oControl.getProperty("enableDownload")) {
                         oUploadCollection.addDelegate(new fileDownloadLink(oUploadCollection));
                     }
                     
                     //*****Rel 60E_SP6 - QA #11673
                     if(sap.ui.getVersionInfo().version >= "1.56"){
                    	 oUploadCollection.addStyleClass("VuiUploadCollection");
                     }
                     //*****
                     
                     oControl.setAggregation("_uploadCollection", oUploadCollection);
                 };

                 //*****Rel 60E_SP7
                 A.prototype._onUploadTerminate = function (oEvent) {
                	 oEvent.getSource().setBusy(false);
                 };                
                 //*****
                 
                 A.prototype._onFileChange = function (oEvent) {
                	 //*****Rel 60E_SP7
                     oEvent.getSource().setBusy(true);
                     //*****
                	 var oControl = this;                             
                     var oController = this.getProperty("controller");
                     var modelName = this.getModelName();
                     var dataPath = this.getDataPath();
                     var attachModel = oController.getModel(modelName);
                     var oFiles = oEvent.getParameter("files");
                     oControl._oMimeType = oFiles[0].type;
                     oControl._oFileName = oFiles[0].name;
                     var fileData = jQuery.extend(true, {}, oControl.attachmentObj);
                     //var fileData = attachModel.getProperty(dataPath+"FILEDATA");
                     var attachments = attachModel.getProperty(dataPath);
                     var rowId;
                     if (attachments.length !== 0)
                         rowId = attachments.length + 1;
                     else
                         rowId = 1;

                     oControl._filesData = [];
                     for (var i = 0; i < oFiles.length; i++) {
                         oControl._oFileReader = new FileReader();

                         oControl._oFileReader.onloadend = function () {
                             var result = this.result.split("base64,");
                             fileData['ROWID'] = rowId;
                             fileData['BITM_FILENAME'] = oControl._oFileName;
                             fileData['ATDAT'] = result[1];
                             fileData['BITM_DESCR'] = oControl._oFileName;
                             // fileData['MIMTP'] =  oControl._oMimeType;
                             fileData['UPDKZ_UI'] = "I";
                             oControl._filesData.push(fileData);
                         };
                         oControl._oFileReader.fileName = oFiles[0].name;
                         oControl._oFileReader.readAsDataURL(oFiles[0]);
                     }
                 };

                 A.prototype._onFileUpload = function (oEvent) {
                     //*****Rel 60E_SP7
                     oEvent.getSource().setBusy(false);
                     //*****
                	 var oControl = this;
                     var oController = this.getProperty("controller");
                     var modelName = this.getModelName();
                     var dataPath = this.getDataPath();
                     var model = oController.getModel(modelName);
                     var oAttachments = model.getProperty(dataPath);
                     if (oControl._filesData.length !== 0) {
                         var oPath = modelName + ">" + dataPath;
                         var model = oController.getModel(modelName);
                         oControl._oDuplicateFile = underscoreJS.where(oAttachments, {
                             BITM_FILENAME: oControl._filesData[0].BITM_FILENAME
                         });
                         if (oControl._oDuplicateFile != undefined && oControl._oDuplicateFile.length != 0) {
                             oControl._handleDuplicateFile();
                         } else {
                             oAttachments.push(oControl._filesData[0]);
                             model.setProperty(dataPath, oAttachments);
                             oControl.fireOnUpload();
                         }
                     }
                 };

                 A.prototype._getChangedData = function () {
                     var oControl = this;
                     var oController = this.getProperty("controller");
                     var modelName = this.getProperty("modelName");
                     var model = oController.getModel(modelName);
                     var dataPath = this.getProperty("dataPath");
                     var attachments = model.getProperty(dataPath);
                     var arr = [];
                     for (i = 0; i < attachments.length; i++) {
                         if (attachments[i].UPDKZ_UI != "") {
                             arr.push(attachments[i]);
                         }
                     }
                     return arr;
                 };

                 A.prototype._onFileRename = function (oEvent) {
                     var oControl = this;
                     var oController = this.getProperty("controller");
                     var modelName = this.getModelName();
                     var dataPath = this.getDataPath();
                     var attachModel = oController.getModel(modelName);
                     var attachments = attachModel.getProperty(dataPath);

                     var object = oEvent.getParameter("item").getBindingContext(oController.modelName).getObject();

                     object.UPDKZ_UI = "U";
                     object.BITM_FILENAME = oEvent.getParameter("item").getFileName();
                     oControl.fireOnRename();

                 };

                 A.prototype._handleDuplicateFile = function () {
                     var oControl = this;
                     var oController = this.getProperty("controller");
                     var modelName = this.getModelName();
                     var dataPath = this.getDataPath();
                     var attachModel = oController.getModel(modelName);
                     var bundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls");
                     var oPath = modelName + ">" + dataPath;
                     var oSameFileText = new sap.m.Text({
                         text: bundle.getText("SameFileName")
                     });

                     var mainModel = oController.getModel(modelName);
                     var oText = oControl._oDuplicateFile[0].TIMESTAMP + " " + bundle.getText("By") + " " + oControl._oDuplicateFile[0].USER_TEXT;

                     var oItem = new sap.m.UploadCollectionItem({
                         visibleEdit: false,
                         visibleDelete: false,
                         fileName: oControl._oDuplicateFile[0].BITM_FILENAME,
                         attributes: [new sap.m.ObjectAttribute({
                             text: oText
                         })]
                     });

                     var oDupUploadCollection = new sap.m.UploadCollection({
                         items: [oItem],
                         showSeparators: sap.m.ListSeparators.None
                     });

                     var oToolbar = new sap.m.OverflowToolbar({
                         visible: false
                     });

                     if (sap.ui.getVersionInfo().version < "1.34") {
                         oDupUploadCollection.addDelegate(new duplicateFile(oDupUploadCollection));
                     } else {
                         oDupUploadCollection.setToolbar(oToolbar);
                     }

                     oControl._oRadioBtnGrp = new sap.m.RadioButtonGroup({
                    	 width: "100%",
                    	 buttons: [
                             new sap.m.RadioButton({
                                 text: bundle.getText("UploadReplace"),
                                 useEntireWidth: true,
                                 width: "100%",
                                 visible: oControl.getProperty("enableReplace"),
                             }),
                             new sap.m.RadioButton({
                            	 useEntireWidth: true,
                            	 width: "100%",
                            	 text: bundle.getText("UploadRename"),
                             }),
                             new sap.m.RadioButton({
                            	 useEntireWidth: true,
                            	 width: "100%",
                            	 text: bundle.getText("SkipFile")
                             })
                         ]
                     });

                     oControl.getProperty("enableReplace") === true ? oControl._oRadioBtnGrp.setSelectedIndex(0) : oControl._oRadioBtnGrp.setSelectedIndex(1);

                     var oFlexBox = new sap.m.FlexBox({
                         direction: sap.m.FlexDirection.Column,
                         items: [oSameFileText, oDupUploadCollection, oControl._oRadioBtnGrp]
                     });

                     var oContinueBtn = new sap.m.Button({
                         text: bundle.getText("Continue"),
                         press: [oControl._onContinue, oControl]
                     });

                     var oCancelBtn = new sap.m.Button({
                         text: bundle.getText("Cancel"),
                         press: [oControl._onCancel, oControl]
                     });

                     oControl._oDialog = new sap.m.Dialog({
                         title: bundle.getText("Upload"),
                         buttons: [oContinueBtn, oCancelBtn],
                         content: [oFlexBox]
                     }).addStyleClass("dupFileDialogBox sapUiPopupWithPadding");

                     oControl._oDialog.open();
                 };


                 A.prototype._onContinue = function () {
                     var oControl = this;
                     var oController = this.getProperty("controller");
                     var modelName = this.getModelName();
                     var dataPath = this.getDataPath();
                     var model = oController.getModel(modelName);
                     var oPath = modelName + ">" + dataPath;

                     var oAttachments = model.getProperty(dataPath);

                     var oIndex = oControl._oRadioBtnGrp.getSelectedIndex();

                     var data = [];

                     var oFunctions = [];

                     if (oIndex == 0) {
                         var prevRowID = oControl._oDuplicateFile[0]['ROWID'];
                         var prevFile = underscoreJS.find(oAttachments, { ROWID: prevRowID });
                         prevFile['ATDAT'] = oControl._filesData[0]['ATDAT'];
                         prevFile.UPDKZ_UI = "U";
                         oControl.fireOnReplace();
                     } else if (oIndex == 1) {
                         var i = 0;
                         while (true) {
                             i = i + 1;

                             var oFileName = oControl._filesData[0].BITM_FILENAME.substr(0,
                                 oControl._filesData[0].BITM_FILENAME.lastIndexOf("."));

                             var oExtension = underscoreJS.last(oControl._filesData[0].BITM_FILENAME.split("."));

                             oFileName = oFileName + "(" + i + ")" + "." + oExtension;


                             if (underscoreJS.where(oAttachments, {
                                 NAME: oFileName
                             }).length != 0) {
                                 continue;
                             } else {

                                 oControl._filesData[0].BITM_FILENAME = oFileName;
                                 oControl._filesData[0].UPDKZ_UI = "I";
                                 break;
                             }
                         }
                         oAttachments.push(oControl._filesData[0]);
                         model.setProperty(dataPath, oAttachments);
                         oControl.fireOnUpload();
                     }

                     oControl._oDialog.close();

                     oControl._filesData = [];
                     oControl._oDuplicateFile = [];
                     oControl._oFileReader = undefined;
                 };

                 A.prototype._onCancel = function () {
                     var oControl = this;
                     oControl._oDialog.close();
                 };

                 A.prototype._onFileDeleted = function (oEvent) {
                     var oControl = this;
                     var oController = this.getProperty("controller");
                     var modelName = this.getModelName();
                     var dataPath = this.getDataPath();
                     var attachModel = oController.getModel(modelName);
                     //var object = oEvent.getSource().getBindingContext(oController.modelName).getPath();
                     var object = oEvent.getParameter("item").data("data");
                     object['UPDKZ_UI'] = "D";

                     oControl.fireOnDelete({
                         record: object
                     });
                 };

                 A.prototype._onFileView = function (object) {
                     global.vui5.session.sessionend_skip = true;
                     var oControl = this;
                     oControl.fireOnDownload({ record: object })
                 };

                 A.prototype._onDocFileChange = function (oEvent) {
                	 //*****Rel 60E_SP7
                     oEvent.getSource().setBusy(true);
                     //*****
                	 var oControl = this;
                     var oController = this.getProperty("controller");
                     var modelName = this.getModelName();
                     var dataPath = this.getDataPath();
                     var attachModel = oController.getModel(modelName);
                     var oFiles = oEvent.getParameter("files");
                     oControl._oMimeType = oFiles[0].type;
                     oControl._oFileName = oFiles[0].name;
                     oControl._filesData = [];
                     //var fileData = attachModel.getProperty(dataPath+"FILEDATA");
                     var fileData = jQuery.extend(true, {}, oControl.attachmentObj);
                     var attachments = attachModel.getProperty(dataPath);
                     var rowId = attachments.length + 1;
                     oControl._oFileReader = new FileReader();

                     oControl._oFileReader.onloadend = function () {
                         var result = this.result.split("base64,");
                         fileData['ROWID'] = rowId;
                         fileData['BITM_FILENAME'] = oControl._oFileName;
                         //fileData['MIMTP'] = oControl._oMimeType;
                         fileData['ATDAT'] = result[1];
                         fileData['BITM_DESCR'] = "";
                         fileData['UPDKZ_UI'] = "I";
                         oControl._filesData.push(fileData);
                     };
                     oControl._oFileReader.readAsDataURL(oFiles[0]);
                 };

                 A.prototype._onDocUploadComplete = function (oEvent) {
                	 //*****Rel 60E_SP7
                     oEvent.getSource().setBusy(false);
                     //*****
                     var oControl = this;
                     var oController = this.getProperty("controller");
                     var modelName = this.getModelName();
                     var dataPath = this.getDataPath();
                     var attachModel = oController.getModel(modelName);
                     // var oPath = "/DATA/" + oControl.oController.sectionData['DATAR'] + oControl.oController.sectionData['DAQLF'];
                     var oPath = modelName + ">" + dataPath;
                     if (oControl._filesData.length != 0) {
                         var oAttachments = attachModel.getProperty(dataPath);
                         oControl._oDuplicateFile = underscoreJS.where(oAttachments, {
                             BITM_FILENAME: oControl._filesData[0].BITM_FILENAME
                         });

                         if (oControl._oDuplicateFile != undefined && oControl._oDuplicateFile.length != 0) {
                             oControl._handleDuplicateFile();

                         } else {
                             oControl._filesData[0].UPDKZ_UI = "I";
                             oAttachments.push(oControl._filesData[0]);
                             attachModel.setProperty(dataPath, oAttachments);
                             oControl.fireOnUpload();
                         }

                     }

                 };

                 A.prototype._onDocFileDeleted = function (oEvent) {
                     var oControl = this;
                     var oController = this.getProperty("controller");
                     var modelName = this.getModelName();
                     var dataPath = this.getDataPath();
                     var attachModel = oController.getModel(modelName);
                     //  var object = oEvent.getSource().getBindingContext(oController.modelName).getPath();
                     var document = oEvent.getParameter("item").getBindingContext(modelName).getObject();
                     // var document = attachModel.getProperty(object);
                     document['UPDKZ_UI'] = "D";
                     oControl.fireOnDelete({
                         record: document
                     })
                 };

                 A.prototype.attachmentCheckChanges = function () {
                     var oControl = this;
                     var oController = this.getProperty("controller");
                     var modelName = this.getModelName();
                     var attachModel = oController.getModel(modelName);
                     if (attachModel.getProperty("/CHECK_CHANGES") != "") {
                         return true;
                     } else {
                         return false;
                     }

                 };

                 A.prototype._fileUploaderSendFiles = function () {
                     sap.ui.unified.FileUploader.prototype.sendFiles = function (x, I) {
                         var t = this;
                         var A = true;
                         for (var i = 0; i < x.length; i++) {
                             if (!x[i].bPosted) {
                                 A = false;
                                 break;
                             }
                         }
                         if (A) {
                             if (this.getSameFilenameAllowed() && this.getUploadOnChange()) {
                                 t.setValue('', true);
                             }
                             return;
                         }
                         var X = x[I];
                         var f = X.file.name ? X.file.name : 'MultipartFile';
                         //Version 1.32.11
                         //if (sap.ui.Device.browser.internet_explorer && X.file.type && X.xhr.readyState != 0) { //Changed Code
                         //Version >1.34
                         if (sap.ui.Device.browser.internet_explorer && X.file.type && X.xhr.readyState == 1) {
                             var c = X.file.type;
                             X.xhr.setRequestHeader('Content-Type', c);
                             X.requestHeaders.push({
                                 name: 'Content-Type',
                                 value: c
                             });
                         }
                         var r = X.requestHeaders;
                         var p = function (P) {
                             var o = {
                                 lengthComputable: !!P.lengthComputable,
                                 loaded: P.loaded,
                                 total: P.total
                             };
                             t.fireUploadProgress({
                                 'lengthComputable': o.lengthComputable,
                                 'loaded': o.loaded,
                                 'total': o.total,
                                 'fileName': f,
                                 'requestHeaders': r
                             });
                         }
                         ;
                         X.xhr.upload.addEventListener('progress', p);
                         X.xhr.onreadystatechange = function () {
                             var R;
                             var s;
                             var h = {};
                             var P;
                             var H;
                             var b;
                             var d;
                             d = X.xhr.readyState;
                             var S = X.xhr.status;
                             if (X.xhr.readyState == 4) {
                                 if (X.xhr.responseXML) {
                                     R = X.xhr.responseXML.documentElement.textContent;
                                 }
                                 s = X.xhr.response;
                                 P = X.xhr.getAllResponseHeaders();
                                 if (P) {
                                     H = P.split('\u000d\u000a');
                                     for (var i = 0; i < H.length; i++) {
                                         if (H[i]) {
                                             b = H[i].indexOf('\u003a\u0020');
                                             h[H[i].substring(0, b)] = H[i].substring(b + 2);
                                         }
                                     }
                                 }
                                 t.fireUploadComplete({
                                     'fileName': f,
                                     'headers': h,
                                     'response': R,
                                     'responseRaw': s,
                                     'readyStateXHR': d,
                                     'status': S,
                                     'requestHeaders': r
                                 });
                             }
                             t._bUploading = false;
                         }
                         ;
                         if (X.xhr.readyState === 0 || X.bPosted) {
                             I++;
                             t.sendFiles(x, I);
                         } else {
                             X.xhr.send(X.file);
                             X.bPosted = true;
                             I++;
                             t.sendFiles(x, I);
                         }
                     };
                 };

                 attachmentformatter = {
                     returnBoolean: function (value) {
                         if (value != undefined) {
                             if (value == "" || value == "A")
                                 return false;
                             else {
                                 return true;
                             }
                         }
                     },
                     gosUploadEnable: function (value) {
                         if (value != undefined) {
                             if (value == "") {
                                 return false;
                             }
                             else {
                                 return true;
                             }
                         }
                     },
                     getFolderText: function (value, table) {
                         if (value != undefined) {

                             var oFolderText = underscoreJS.where(table, {
                                 VALUE: value
                             });
                             return oFolderText[0].NAME;
                         }
                     },
                     getUserText: function (user, timestamp, value) {
                         return timestamp + " " + value + " " + user;
                     },
                     setMimeTypes: function (value) {
                         if (value != undefined) {

                             var oMimeTypes = [];
                             for (var i = 0; i < value.length; i++) {
                                 oMimeTypes.push(value[i].NAME);
                             }
                             return oMimeTypes;
                         }
                     },
                     getAttachmentText: function (table) {
                         var oText = "";
                         var sectionData = this.data("sectionData");
                         var oTitle = this.getModel(this.data("modelName")).getProperty("/DATA/" + sectionData['DATAR'] +
                                  sectionData['DAQLF'] + "/TITLE");

                         if (oTitle && oTitle != "") {
                             oText = oTitle + " " + "(" + table.length + ")";
                         }
                         return oText;
                     },
                     getUploadEnabled: function (Upload, displayOnly) {
                                     if (Upload == "X" || displayOnly == "X") {
			                             return false;
			                         } else {
			                             return true;
			                         }
                     },
                 };

                 return A;

             }, true);