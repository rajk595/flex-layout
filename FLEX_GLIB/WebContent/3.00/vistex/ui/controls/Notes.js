sap.ui.define([
    "sap/ui/core/Control",
    vistexConfig.rootFolder + "/ui/core/global",
    vistexConfig.rootFolder + "/ui/core/underscore-min",
	vistexConfig.rootFolder + "/ui/core/commonUtils"
], function(control,global,underscoreJS,commonUtils) {

    var N = control.extend(vistexConfig.rootFolder + ".ui.controls.Notes", {
        metadata: {
            properties:{
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
                   nauth:{
                   type: "any",
                      defaultValue: null
                   },
                   notyp :{
                     type : "any",
                     defaultValue: null
                     
                   },
                   editable : {
                      type: "boolean",
                      defaultValue: false
                   }
            },
            events: {
               updateNote:{

                }

            },
            aggregations: {
                _flexBox: {
                    type: "sap.ui.core.Control",
                    multiple: false,
                    visibility: "hidden"
                }
            }
        },
        notesProcess: function() {
          var oControl = this;
          oControl.notesObj = {  
               "ADJDT":"",
               "AEDAT":"",
               "AENAM":"",
               "AEZET":"",
               "CONTR":"",
               "DESCR":"",
               "LINE":[  

               ],
               "NOTYP":"",
               "POSNR":"",
               "SECUR":"",
               "TDNUM":"",
               "TIMESTAMP":"",
               "UPDKZ":"",
               "UPDKZ_UI":"",
               "USER_TEXT":""
            };
          //oControl._cloneNote =  jQuery.extend(true,{}, oControl.notesObj);
          oControl._Note = jQuery.extend(true,{},oControl.notesObj);
            var oControl = this;
            oControl._oFlexBox = new sap.m.FlexBox({
                width: "100%",
                height: "100%",
                direction: sap.m.FlexDirection.Column
            });
            oControl._onListPrepare();
            oControl._oFlexBox.addItem(oControl._oFeedInput);
            oControl._oFlexBox.addItem(oControl._oFeedList);
            oControl.setAggregation("_flexBox", oControl._oFlexBox);
        },

        _onListPrepare: function() {

            var oControl = this;
            var oController = this.getProperty("controller");
            var modelName = this.getModelName();
            var model = this.getModel(modelName);
            var editable = this.getEditable();
            var dataPath = this.getDataPath();
            var nauth = this.getNauth();
            //*****Rel 60E_SP6
                /*oControl._oFeedInput = new sap.m.FeedInput({
                    post: [oControl._onCreatePost, oControl],
                    showIcon: true,
                    icon : notesFormatter.getIcon(),
                    enabled:editable
                }).bindProperty("visible", {
                    parts: [{path: modelName+">"+nauth+"/CREATE"}],
                    formatter: notesFormatter.setFeedInputVis,
                    mode: sap.ui.model.BindingMode.OneWay
                });*/
            //*****
            
            if(editable){
            	//*****Rel 60E_SP6
            	oControl._oFeedInput = new sap.m.FeedInput({
                    post: [oControl._onCreatePost, oControl],
                    showIcon: true,
                    icon : notesFormatter.getIcon(),
                    enabled:editable
                }).bindProperty("visible", {
                    parts: [{path: modelName+">"+nauth+"/CREATE"}],
                    formatter: notesFormatter.setFeedInputVis,
                    mode: sap.ui.model.BindingMode.OneWay
                });
            	//*****
            	oControl._oFeedList = new sap.m.List({
                    delete: [oControl._onListDelete, oControl],
                    mode: sap.m.ListMode.Delete
                //*****Rel 60E_SP6
            	}).bindProperty("mode", {
                	parts: [{path: modelName+">"+nauth+"/DELETE"}],
                    formatter: notesFormatter.setFeedListType,
                    mode: sap.ui.model.BindingMode.OneWay
                });
            	//*****
            }
            else {
            	oControl._oFeedList = new sap.m.List({});
            }

            oControl._oFeedList.bindAggregation("items", modelName+">"+dataPath, function(sid, oContext) {

                var dataPath = modelName+">"+oContext.sPath +"/AENAM";
                var textPath = modelName+">"+oContext.sPath +"/USER_TEXT";
                var object = oContext.getObject();
                var line = object['LINE'];
                var note = line[0];
                for (var i = 1; i < line.length; i++) {
                    note = note.concat("\n", line[i]);
                }
                object.TEXT = note;
                var oFeedList;
                if (object['UPDKZ_UI'] === 'E') {

                  oControl._oChangeNoteInput = new sap.m.FeedInput({
                        value: object['TEXT'],
                        icon: notesFormatter.getIcon(object['USER_TEXT']),
                        post: [oControl._onChangePost, oControl]
                    });
                    return new sap.m.CustomListItem({
                        content: [oControl._oChangeNoteInput]
                    });
                }
                else{
                  var feedList = new sap.m.FeedListItem({
                        senderActive: false,
                        iconDensityAware: false,
                        timestamp: object['TIMESTAMP'],
                        text: object.TEXT,
                        icon: notesFormatter.getIcon(object['USER_TEXT']),
                        sender:object.USER_TEXT,
                        detailPress: [oControl._onListItemPress, oControl]
                  });
                  if(editable){
                	  feedList.bindProperty("type", {
                          parts: [{path:  modelName+">"+nauth+"/CHANGE"}],
                          formatter: notesFormatter.getListType,
                          mode: sap.ui.model.BindingMode.OneWay
                      });
                  }
                  else {
                	  feedList.setType(sap.m.ListType.Active);
                  }
                  
                  return feedList;                  
                }
            });
        },
        renderer: function(oRM, oControl) {
            oRM.write("<div");
            oRM.writeControlData(oControl);
            oRM.write(">");
            oRM.renderControl(oControl.getAggregation("_flexBox"));
            oRM.write("</div>");
        }
    });
 N.prototype.setModelName = function(value) {
     this.setProperty("modelName",value,true);
  };

 N.prototype.setDataPath = function(value) {
     this.setProperty("dataPath",value,true);
  };
 N.prototype.setEditable = function(value) {
     this.setProperty("editable",value,true);
     this.notesProcess();
  };
 N.prototype.setNauth = function(value) {
     this.setProperty("nauth",value,true);
  };
  N.prototype.setNotyp = function(value) {
       this.setProperty("notyp",value,true);
    };
 N.prototype._onCreatePost = function(oEvent) {
   var oControl = this;
   oControl._notesDataAdjusted = false;
   var data = oControl._splitIntoLines(oEvent.getParameter("value"), 80);
   oControl._onCreateNote(data);
 };
 N.prototype._onCreateNote = function(value) {
   var oControl = this;
   var oController = this.getProperty("controller");
   var modelName = this.getProperty("modelName");
   var model = oController.getModel(modelName);
   var dataPath = this.getProperty("dataPath");
   var noteValue = value.split("\n");
   var dataAdjust = "";
   var notesData =  jQuery.extend(true,{}, oControl.notesObj);
   //var notesData = model.getProperty(dataPath+"NOTE");
   var notesData1 = model.getProperty(dataPath);
   notesData['UPDKZ_UI'] = global.vui5.cons.updkz.ins;
   notesData['NOTYP'] = this.getProperty('notyp');
   notesData['LINE'] = noteValue;
   if(oControl._notesDataAdjusted)
   {
	   notesData['ADJDT'] = "X";
   }
   notesData1.push(notesData);
   oController.getModel(modelName).setProperty(dataPath,notesData1);
   oControl._oFeedInput.setValue(""); 
   oControl.fireUpdateNote();

 };

 N.prototype._onChangePost = function(oEvent) {
        var oControl = this;
        var modelName = this.getProperty("modelName");
        oControl._notesDataAdjusted = false;
        oControl._oFeedInput.setEnabled(true);
        var data = oControl._splitIntoLines(oEvent.getParameter("value"), 80);
        var object = oEvent.getSource().getBindingContext(modelName).getObject();
        oControl._onUpdateNote(data,object.POSNR);
    };

  N.prototype._onUpdateNote = function(value,posnr) {
     var oControl = this;
     var oController = this.getProperty("controller");
     var modelName = this.getProperty("modelName");
     var model = oController.getModel(modelName);
     var dataPath = this.getProperty("dataPath");
     var noteValue = value.split("\n");
     var dataAdjust = "";
       var notesData1 = model.getProperty(dataPath);
       
       var updateObject = underscoreJS.find(notesData1,{'POSNR':posnr});
       if(posnr == "")
         {
       updateObject.UPDKZ_UI = "I";
         }
       else
      {
       updateObject.UPDKZ_UI = "U";
      }
       value = value.split("\n");
       updateObject.LINE = value;
       if(oControl._notesDataAdjusted)
       {
    	   updateObject.ADJDT = "X";
       }
       oControl.fireUpdateNote();
       oControl._Note = jQuery.extend(true,{},oControl.notesObj);
       oControl._oFeedInput.setEnabled(true);
//
    };

    N.prototype._onDeleteNote = function(notesData) {
        var oControl = this;
        var oController = this.getProperty("controller");
        var modelName = this.getProperty("modelName");
        var model = oController.getModel(modelName);
        var dataPath = this.getProperty("dataPath");
        notesData['UPDKZ_UI'] = global.vui5.cons.updkz.del;
        oControl.fireUpdateNote();
    };

    N.prototype._onListItemPress = function(oEvent) {
        var oControl = this;
        var oController = this.getProperty("controller");
        var modelName = this.getProperty("modelName");
        var model = oController.getModel(modelName);
        var dataPath = this.getProperty("dataPath");
       // oControl._onCreateNewObject();
        //var notesData =  jQuery.extend(true,{}, oControl.notesObj);
       // var notesData = model.getProperty(dataPath+"NOTE");
        oControl._selectedObject = oEvent.getSource().getBindingContext(modelName).getObject();
        var dt = model.getProperty(dataPath);
        var tmp = underscoreJS.findWhere(dt,{"UPDKZ_UI":"E"});
        if(tmp)
        {
        	tmp["UPDKZ_UI"]="";
        }
        var NotesCheck = oControl._getNoteChanged(true);
//        if(NotesCheck === true)
//        {
//           var note = model.getProperty(dataPath+"NOTE");
//           var prevPosnr = note['POSNR']
//           oControl.editPosnr = oEvent.getSource().getBindingContext(modelName).getObject()['POSNR'];
//           oControl._setChangedNote(prevPosnr);
//           var data = model.getProperty(dataPath);
//           var temp = underscoreJS.findWhere(data,{"POSNR":oControl._selectedObject['POSNR'] });
//               temp['UPDKZ_UI'] = "E"
//            oController.getModel(modelName).setProperty(dataPath,"");
//            oController.getModel(modelName).setProperty(dataPath,data);
//            oControl.editPosnr ="";
////
//        }
       // else{
        model.setProperty(oEvent.getSource().getBindingContext(modelName).sPath+'/UPDKZ_UI','E');
        var dt = model.getProperty(dataPath);
        model.setProperty(dataPath,"");
       
        model.setProperty(dataPath,dt);
       // }
        oControl._Note = oControl._selectedObject;
        //model.setProperty(dataPath+"NOTE", oControl._selectedObject);
        oControl._oFeedInput.setEnabled(false);

    };
    N.prototype._setChangedNote = function(posnr){
      var oControl = this;
      var oController = this.getProperty("controller");
      var modelName = this.getProperty("modelName");
        var model = oController.getModel(modelName);
        var dataPath = this.getProperty("dataPath");
       var notes = model.getProperty(dataPath);
       var updateObject = underscoreJS.find(notes,{'POSNR':posnr});
         updateObject.UPDKZ_UI = "U";
         model.setProperty(dataPath,"");
         model.setProperty(dataPath,notes);
    },
    N.prototype._getNoteChanged = function(flag){
      var oControl = this, oData, noteValue;
      var oController = this.getProperty("controller");
      var modelName = this.getProperty("modelName");
        var model = oController.getModel(modelName);
        var dataPath = this.getProperty("dataPath");
      var notes = model.getProperty(dataPath);
      var notesData = oControl._Note;
     // var notesData =  jQuery.extend(true,{}, oControl.notesObj);
      //var notesData = model.getProperty(dataPath+"NOTE");
      oControl._notesDataAdjusted = false;
      var oChanged = false;
       if (oControl._oFeedInput && oControl._oFeedInput.getEnabled() == true) {
             if (oControl._oFeedInput.getValue() != "") {
                 oChanged = true;
                 oData = oControl._splitIntoLines(oControl._oFeedInput.getValue(), 80);
                 noteValue = oData.split("\n");
                 notesData['LINE'] = noteValue;
                 //model.setProperty(dataPath+"NOTE/LINE", noteValue);
                // notesData = model.getProperty(dataPath+"NOTE");
                 notesData['NOTYP'] = this.getProperty('notyp');
                 notesData['USER_TEXT'] = global.vui5.session.user;
                 //notesData['NOTYP']=oController.sectionData.DAQLF
                 notesData['UPDKZ_UI'] = global.vui5.cons.updkz.ins;
                 if(oControl._notesDataAdjusted)
                 {
                	 notesData['ADJDT'] = "X";
                 }
                 oControl._oFeedInput.setValue("");
                 //notesData.NOTYP = oController.sectionData['DAQLF']
             }


         } else {
             if (oControl._oChangeNoteInput && oControl._oChangeNoteInput.getValue() != "") {
                 oChanged = true;
                 oData = oControl._splitIntoLines(oControl._oChangeNoteInput.getValue(), 80);
                 noteValue = oData.split("\n");
                // oControl._Note['LINE']= noteValue;
                 notesData['LINE'] = noteValue;
                 //model.setProperty(dataPath+"NOTE/LINE", noteValue);
                /// notesData = model.getProperty(dataPath+"NOTE");
                 notesData.UPDKZ_UI = global.vui5.cons.updkz.upd;
                  if(oControl._notesDataAdjusted)
                    {
                	  notesData['ADJDT'] = "X";
                    }
                //  oControl._Note = notesData;
                // notesData.NOTYP = oController.sectionData['DAQLF'];

             }
//             if(flag){
//                
//               //var note = model.getProperty(dataPath+"NOTE");
//                 var prevPosnr = oControl._Note['POSNR'];
//                // oControl.editPosnr = oEvent.getSource().getBindingContext(modelName).getObject()['POSNR'];
//                 oControl._setChangedNote(prevPosnr);
//                 var data = model.getProperty(dataPath);
//                 var temp = underscoreJS.findWhere(data,{"POSNR":oControl._selectedObject['POSNR'] });
//                     temp['UPDKZ_UI'] = "E"
//                  oController.getModel(modelName).setProperty(dataPath,"");
//                  oController.getModel(modelName).setProperty(dataPath,data);
//                 // oControl.editPosnr ="";
//               
//                return oChanged;
//             }


         }

       if(oChanged == true){
           var updateObject = underscoreJS.find(notes,{'POSNR':notesData.POSNR});
           if(updateObject){
             updateObject = notesData;
           }
           else{

             notes.push(notesData);
             oControl._oFeedInput.setValue("");
             
           }
           oControl._Note = jQuery.extend(true,{},oControl.notesObj);
             model.setProperty(dataPath,"");
             model.setProperty(dataPath,notes);
             oControl._oFeedInput.setEnabled(true);

          }


    },
    N.prototype._getChangedData = function(){
      var oControl = this;
      var oController = this.getProperty("controller");
      var modelName = this.getProperty("modelName");
        var model = oController.getModel(modelName);
        var dataPath = this.getProperty("dataPath");
        oControl._getNoteChanged();
      var notes = model.getProperty(dataPath);
      var arr=[];
      for(i=0;i<notes.length;i++){
        if(notes[i].UPDKZ_UI !=""){
          arr.push(notes[i]);
        }
      }
      return arr;
    };
    N.prototype._onCreateNewObject = function(value){
       var oControl = this;
       var oController = this.getProperty("controller");
       var modelName = this.getProperty("modelName");
       var model = oController.getModel(modelName);
       var dataPath = this.getProperty("dataPath");
       var notesData1 = model.getProperty(dataPath);
       var notesObject = notesData1[0];
       oControl.newNoteobj= underscoreJS.mapObject(notesObject, function(val, key) {
          return val = "";
        });
        var obj = jQuery.extend(true,{}, oControl.newNoteobj);
        model.setProperty(dataPath+"NOTE",obj);
    };
    N.prototype._onListDelete = function(oEvent) {
        var oControl = this;
        var oController = this.getProperty("controller");
        var modelName = this.getProperty("modelName");
        var model = oController.getModel(modelName);
        var dataPath = this.getProperty("dataPath");
        var bundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls")
        var object = oEvent.getParameter("listItem").getBindingContext(modelName).getObject();
        sap.m.MessageBox.show(bundle.getText("DeleteNote"), {
            icon: sap.m.MessageBox.Icon.INFORMATION,
            title: bundle.getText("DeleteNoteTitle"),
            actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
            onClose: function(oAction) {
                if (oAction == sap.m.MessageBox.Action.YES) {
                    oControl._onDeleteNote(object);
                }
            }
        });
    };

//    N.prototype.notesDataCheck = function() {
//        var oControl = this;
//        var oController = this.getProperty("controller");
//        var modelName = this.getProperty("modelName");
//        var model = oController.getModel(modelName);
//        var dataPath = this.getProperty("dataPath");
//        var notesData = model.getProperty(dataPath+"NOTE");
//        var oChanged = false;
//        var oData,noteValue,notesData,notes;
//        if (oControl._oFeedInput && oControl._oFeedInput.getEnabled() == true) {
//            if (oControl._oFeedInput.getValue() != "") {
//                oChanged = true;
//                oData = oControl._splitIntoLines(oControl._oFeedInput.getValue(), 80);
//                noteValue = oData.split("\n");
//                model.setProperty(dataPath+"NOTE/LINE", noteValue);
//                notesData = model.getProperty(dataPath+"NOTE");
//                notesData['UPDKZ'] = global.vui5.cons.updkz.ins;
//                //notesData.NOTYP = oController.sectionData['DAQLF']
//            }
//
//
//        } else {
//            if (oControl._oChangeNoteInput && oControl._oChangeNoteInput.getValue() != "") {
//                oChanged = true;
//                oData = oControl._splitIntoLines(oControl._oChangeNoteInput.getValue(), 80);
//                noteValue = oData.split("\n");
//                model.setProperty(dataPath+"NOTE/LINE", noteValue);
//                notesData = model.getProperty(dataPath+"NOTE");
//                notesData.UPDKZ = global.vui5.cons.updkz.upd;
//               // notesData.NOTYP = oController.sectionData['DAQLF'];
//
//            }
//
//
//        }
//        var params = [];
//        if (oControl._notesDataAdjusted) {
//            params.push({
//                "NAME": "DATA_ADJUST",
//                "VALUE": "X"
//            });
//        }
//        var data = {
//            "PARAMS": params,
//            "DTAREA": "NOTE",
//            "EVENT": "UPDATE",
//            "DATA": [notesData],
//            "DATA_CHANGES": oChanged
//        };
//        return data;
//    };

//    N.prototype.notesCheckChanges = function() {
//        var oControl = this;
//        var mainModel = oControl.getModel("notesModel");
//        if (mainModel.getProperty("/CHECK_CHANGES") != "") {
//            return true;
//        } else {
//            return false;
//        }
//
//    };
    N.prototype._splitIntoLines = function(data, length) {
        var oControl = this;
        var oFinalData = [];
        var oLines = data.split("\n");

        for (var j = 0; j < oLines.length; j++) {
            var oLineData = "";
            var temp;
            var words = oLines[j].split(" ");
            for (var i = 0; i < words.length;) {
                temp = oControl._addWordToLine(oLineData, words[i]);

                if (temp.length > length) {
                    oControl._notesDataAdjusted = true;
                    if (oLineData.length == 0) {
                        var oRemTxt = temp.substring(length, temp.length);
                        oLineData = temp.substring(0, length);
                        if (oLines[j + 1] != undefined) {
                            oLines[j + 1] = oRemTxt + oLines[j + 1];
                        } else {
                            oLines.push(oRemTxt);
                        }
                        //oLineData = temp;
                        i++;
                    }

                    oFinalData.push(oLineData);
                    oLineData = "";
                } else {
                    oLineData = temp;
                    i++;
                }
            }

            if (oLineData.length > 0) {
                oFinalData.push(oLineData);
            }
        }
        return oFinalData.join("\n");
    };

    N.prototype._addWordToLine = function(oLineData, word) {
        if (oLineData.length != 0) {
            oLineData += " ";
        }
        return (oLineData += word);
    };

     notesFormatter = {
        getListType: function(change) {
            if (change != undefined) {
                if (change != "00"){
                  return sap.m.ListType.Active;
                }
                else{
                  return sap.m.ListType.DetailAndActive;
                }
            }
        },
        getUserText: function(value, table) {
            if (value != undefined) {
                var oUserText = underscoreJS.where(table, {
                    NAME: value
                });
                return oUserText[0].VALUE;
            }
        },

        getIcon : function(name){
           //var text = notesFormatter.getUserText(name);
           if(!name){
             name = global.vui5.session.user;
           }
           var icon =commonUtils.getAvatarURI(name,"circle");
           return icon;
        },

        setFeedInputVis: function(create) {
            if (create != undefined) {
                if (create != "00") {
                    return false;
                } else {
                    return true;
                }
            }
        },
        
//*****Rel 60E_SP6
        setFeedListType: function(del) {
            if(del != undefined ) {
            	if(del != "00") {
            		return sap.m.ListMode.None;
            	}
            	else {
            		return sap.m.ListMode.Delete;
            	}
            }	
        }        
//*****        
    };


    return N;


}, true);