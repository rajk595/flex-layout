sap.ui.define([
    "sap/ui/core/Control",
    vistexConfig.rootFolder + "/ui/core/global",
    vistexConfig.rootFolder + "/ui/core/Formatter",
    vistexConfig.rootFolder + "/ui/core/commonUtils",
    vistexConfig.rootFolder + "/ui/core/underscore-min"
], function(control,global,Formatter,commonUtils,underscoreJS) {

    var L = control.extend(vistexConfig.rootFolder + ".ui.controls.List", {
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
                 listMode : {
                     type: "string",
                     defaultValue: null
                  },
                  listTitle:{
                      type: "string",
                      defaultValue: null
                  },
                  listCount:{
                      type: "string",
                      defaultValue: null
                  },
                 dataPath : {
                    type: "string",
                    defaultValue: null
                 },
                 fieldsPath : {
                     type: "string",
                     defaultValue: null
                  },
                 editable : {
                    type: "boolean",
                    defaultValue: false
                 },
                 title : {
                     type: "string",
                     defaultValue: null
                 },
                 description : {
                      type: "string",
                      defaultValue: null
                 },
                 icon: {
                       type: "string",
                       defaultValue: null
                    },
                 counter : {
                     type: "string",
                     defaultValue: null
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
                   onDetailPress: {},
                   onItemSelect: {}

               },
               aggregations: {
                   _getListControl: {
                       type: "sap.ui.core.Control",
                       multiple: false,
                       visibility: "hidden"
                   }
               }
           },
           listPrepare : function(){
        	   var oControl = this,oController,model, modelName,descriptionPath,editable, dataPath, fieldsPath, 
        	    			  listMode,listTitle, itemTitleField, itemDescriptionField,itemIconField, itemCounterField,
        	    			  rowCount, listCount, listHeading;
               oController = this.getProperty("controller");
               modelName = this.getModelName();
               model = this.getModel(modelName);
               editable = this.getEditable();
               dataPath = this.getDataPath();
               fieldsPath = this.getFieldsPath();
               listMode = this.getListMode();
               listTitle = this.getListTitle();
               listCount = this.getListCount();
               itemTitleField = this.getTitle();
               itemDescriptionField = this.getDescription();
               itemIconField = this.getIcon();
               itemCounterField = this.getCounter();
               oControl.oList = new sap.m.List({
               }).setModel(model, oController.modelName);
              // oControl.oList.bindProperty("headerText", {
//                   parts: [
//                         {
//                             path:  listTitle
//                         },
//                         { path: oController.modelName + ">" + listCount
//                         
//                         }
//                   ],
//                   formatter: function(descr, count) {
//                       if (descr != undefined) {
//                           if (count != "" && count != undefined) {
//                               return descr + " " + "(" + count + ")";
//                           }
//                           else {
//                               return descr;
//                           }
//                       }
//                   },
//                   mode: sap.ui.model.BindingMode.OneWay
//               });
               
              oControl.oItems = model.getProperty(fieldsPath);
              oControl.oList.bindAggregation("items", oController.modelName + ">" + dataPath, function(sId, oContext){
            	   var contextObject = oContext.getObject();
            	   var oItem =  new sap.m.StandardListItem({
       				   type : listMode,
       				   iconDensityAware : false,
       				   iconInset : false
       			   });
            	   if (listMode === sap.m.ListType.Navigation) {
                       oItem.attachPress(function(oEvent) {
                           var record = oEvent.getSource().getBindingContext(oControl.getProperty('modelName')).getObject();
                           oControl.fireOnItemSelect({
                               oEvent: oEvent,
                               record: record
                           });
                       });
//                       oItem.attachDetailPress(function(oEvent) {
//                           var record = oEvent.getSource().getBindingContext(oControl.getProperty('modelName')).getObject();
//                           oControl.fireOnDetailPress({
//                               oEvent: oEvent,
//                               record: record
//                           });
//                       });
                   }

            	   underscoreJS.each(oControl.oItems, function(obj, index){
            		   switch(obj['FLDNAME']){
              	     	 case itemTitleField:
              	     		 oControl.bindField("title",obj,oItem, oContext);
              	    	     break;
              	     	 case itemDescriptionField:
              	     		oControl.bindField("description",obj,oItem, oContext);
//             	    		oItem.bindProperty("description",oController.modelName + ">" + oContext.sPath +"/"+ obj['FLDNAME']);
                     	    break;
            		   }
            		   if(obj['FLDNAME'] == itemIconField){
                		   oItem.bindProperty("icon",oController.modelName + ">" + oContext.sPath +  "/" + obj['FLDNAME'],listFormatter.getIcon,sap.ui.model.BindingMode.OneWay);
                	   }
            		   else{
            			   if(obj['FLDNAME'] == itemTitleField){
            				   if (obj['SDSCR'] == global.vui5.cons.fieldValue.description || obj['SDSCR'] == global.vui5.cons.fieldValue.value_cont_descr ||
                    		           obj['SDSCR'] == global.vui5.cons.fieldValue.value_descr) {
                    		           descriptionPath = oContext.sPath +"/"+ obj['TXTFL'];
                    			   }
                    			   else if(obj['SDSCR'] == global.vui5.cons.fieldValue.value){
                    				   descriptionPath = oContext.sPath + "/"+ obj['FLDNAME'];
                    			   }   
                    			   var name = oController.getModel(oController.modelName).getProperty(descriptionPath);
                                   var icon =commonUtils.getAvatarURI(name,"circle");
                                   oItem.setProperty("icon", icon);
            			   }
            		   }
            	});
            	   return oItem;
               });
               oControl.setAggregation("_getListControl",oControl.oList);
           },
           renderer: function(oRM, oControl) {
               oRM.write("<div");
               oRM.writeControlData(oControl);
               oRM.write(">");
               oRM.renderControl(oControl.getAggregation("_getListControl"));
               oRM.write("</div>");
           }
    });
    L.prototype.setModelName = function(value) {
        this.setProperty("modelName",value,true);
     };
     L.prototype.setListTitle = function(value) {
         this.setProperty("listTitle",value,true);
      };

    L.prototype.setListMode = function(value) {
       this.setProperty("listMode",value,true);
    };
    L.prototype.setTitle = function(value) {
       this.setProperty("title",value,true);
    };
    L.prototype.setListCount = function(value) {
        this.setProperty("listCount",value,true);
     };
    L.prototype.setDescription = function(value) {
       this.setProperty("description",value,true);
    };
    L.prototype.setIcon = function(value) {
       this.setProperty("icon",value,true);
    };
    L.prototype.setCounter= function(value) {
       this.setProperty("counter",value,true);
    };
    L.prototype.setDataPath = function(value) {
        this.setProperty("dataPath",value,true);
    };
    L.prototype.setFieldsPath = function(value) {
        this.setProperty("fieldsPath",value,true);
   };
   L.prototype.bindField = function(propertyName, obj, oItem, oContext) {
	   var oControl = this, oController, valuePath, modelName, descriptionPath, itemCounterField;
	   oController = this.getProperty("controller");
       modelName = this.getModelName();
       itemCounterField = this.getCounter();
       valuePath = oController.modelName + ">" + oContext.sPath + "/"+ obj['FLDNAME'];
       
	   if (obj['SDSCR'] == global.vui5.cons.fieldValue.description || obj['SDSCR'] == global.vui5.cons.fieldValue.value_cont_descr) {
           descriptionPath = oController.modelName + ">" + oContext.sPath + "/" + obj['TXTFL'];
           oItem.bindProperty(propertyName, descriptionPath, null, sap.ui.model.Binding.OneWay);
         }
	     else if (obj['SDSCR'] == global.vui5.cons.fieldValue.value_descr) {
           descriptionPath = oController.modelName + ">" + oContext.sPath +"/"+ obj['TXTFL'];
           oItem.bindProperty(propertyName, {
               parts: [
                  { path: valuePath},
                  { path: descriptionPath },
                  { path:  oController.modelName + ">" + oContext.sPath + "/" + itemCounterField}
               ],
               formatter: Formatter.valueDescr,
               mode: sap.ui.model.Binding.OneWay
           });
         }
	     else if(obj['SDSCR'] == global.vui5.cons.fieldValue.value){
	    	 oItem.bindProperty(propertyName,valuePath, null, sap.ui.model.Binding.OneWay);
       }
  	  
  };
     listFormatter = {
//      /     getMode: function(value) {
//
//               if (value != undefined) {
//                   if (value != "A") {
//                       return sap.m.ListMode.Delete;
//                   } else {
//                       return sap.m.ListMode.None;
//                       // return sap.m.ListMode.MultiSelect;
//                   }
//               }
//           },
           getIcon : function(name){
        	   var oControl = this;
              if(!name){
                 name = oControl.getTitle();
                 var icon =commonUtils.getAvatarURI(name,"circle");
                 return icon;
              }
              else{
            	  return name;
              }
          }

     
     };
     return L;
 
} , true);
