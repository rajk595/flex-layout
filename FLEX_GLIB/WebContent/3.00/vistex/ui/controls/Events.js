sap.ui.define(["sap/ui/core/Control",
             vistexConfig.rootFolder + "/ui/core/global",
             vistexConfig.rootFolder + "/ui/core/underscore-min"
], function(control,global,underscoreJS) {
		
	 var E = control.extend(vistexConfig.rootFolder + ".ui.controls.Events", {
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
	        sectionID : {
	          type: "string",
	          defaultValue: null
	        },
	        index : {
		       type: "string",
		       defaultValue: null
		    },
	        sectionPath: {
                type: "string",
                defaultValue: null
            },
            editable: {
                type: "boolean",
                defaultValue: false
            },
            noEarlierThan: {
                type: "string",
                defaultValue: null
            },
            noLaterThan: {
                type: "string",
                defaultValue: null
            },
            hideBlock1: {
            	type: "string",
                defaultValue: null
            },
            hideBlock2: {
            	type: "string",
                defaultValue: null
            },
            hideBlock5: {
            	type: "string",
                defaultValue: null
            }
	      },
	      events: {
	    	  dateResolChange: {},
	    	  eventAdd: {},
	    	  eventDelete: {},
	    	  noLaterThanChange: {},
	    	  noEarlierThanChange: {},
	    	  switchChange: {}
	      },
	      aggregations: {
	        _events: {
	          type: "sap.ui.core.Control",
	          multiple: false,
	          visibility: "hidden"
	        }

	      }
	    },
	    init: function() {
	    	this._oBundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls");
	    },
	    
	    renderer: function(oRM, oControl) {
	      oRM.write("<div");
	      oRM.writeControlData(oControl);
	      oRM.write(">");
	      oRM.renderControl(oControl.getAggregation("_events"));
	      oRM.write("</div>");
	    }	        
	  
	 });
	    
	 E.prototype.setModelName = function(value) {	        
		 this.setProperty("modelName",value,false);
	 };
	 E.prototype.setSectionID = function(value) {	        
		 this.setProperty("sectionID",value,false);
	 };
	 E.prototype.setIndex = function(value) {	        
		 this.setProperty("index",value,false);
	 };
	 E.prototype.setSectionPath = function (value) {	         
		 this.setProperty("sectionPath", value, true);
	 };	      
	 E.prototype.setEditable = function (value) {	 
		 this.setProperty("editable", value, true);
	 };   
	 E.prototype.setNoEarlierThan = function (value) {	 
		 this.setProperty("noEarlierThan", value, true);
	 };  
	 E.prototype.setNoLaterThan = function (value) {	          
		 this.setProperty("noLaterThan", value, true);
	 };
	 E.prototype.setHideBlock1 = function (value) {	          
		 this.setProperty("hideBlock1", value, true);
	 };
	 E.prototype.setHideBlock2 = function (value) {	          
		 this.setProperty("hideBlock2", value, true);
	 };
	 E.prototype.setHideBlock5 = function (value) {	          
		 this.setProperty("hideBlock5", value, true);
	 };
	 	    
	 E.prototype.prepareEventsControl = function() {	    	  
	       
		 var oControl = this,	     
		 block1, block2, block3, block4, block5, blockFunc,		    
		 sectionPath = oControl.getSectionPath(),    
		 oController =  oControl.getController(),	    
		 dataPath = oController._getPath(),	    
		 sectionID = oControl.getSectionID(),	    
		 section = oController.getSectionBy("SECTN", sectionID),	    
		 modelName = oControl.getModelName(),	    
		 model = oController.getModel(modelName),	    
		 mainModel = oController.getModel(global.vui5.modelName),	    	   
		 noEarlierThan = oControl.getNoEarlierThan(),	    
		 noLaterThan = oControl.getNoLaterThan(),
		 hideBlock1 = oControl.getHideBlock1(),
		 hideBlock2 = oControl.getHideBlock2(),
		 hideBlock5 = oControl.getHideBlock5(),
		 editable = oControl.getEditable(),	    
		 dmode = mainModel.getProperty("/DOCUMENT_MODE"),	    
		 index = oControl.getIndex(),	    
		 sectionEditable = section['DISOL'] === '' && (section['EDIT'] !== '' || dmode !== global.vui5.cons.mode.display);
		 blockFunc = model.getProperty(sectionPath + "METADATA/" + section['DARID'] + "_B2" + global.vui5.cons.nodeName.eventsSuffix + "/FUNC/");
	       
		 block1  = new global.vui5.ui.controls.Form({         
			 modelName: modelName,             
			 dropDownModelName: global.vui5.modelName,             
			 sectionPath: sectionPath ,             
			 sectionFieldPath: sectionPath + "METADATA/" + section['DARID'] + "_B1"+ global.vui5.cons.nodeName.eventsSuffix + "/FLGRP/",
             sectionDataPath: dataPath + section['DARID'] + "_B1"+ global.vui5.cons.nodeName.eventsSuffix + "/",
             fieldsPath: sectionPath +  "METADATA/" + section['DARID'] + "_B1"+ global.vui5.cons.nodeName.eventsSuffix + "/FIELDS/",
             dataArea: section['DARID'],
             visible: "{= ${" + modelName + ">" + hideBlock1 + "} !== 'X' }",
             sectionEditable:  sectionEditable,             
		 }).setModel(model, modelName)
           .setModel(mainModel, global.vui5.modelName);

		 block1.onValueHelpRequest = function (oEvent) {
             oController.onValueHelpRequest(oControl.getSectionID(), oEvent);
         };
		 
		 block1.processOnInputChange = function (oEvent) {			 
			 return oController.processOnInputChange(oControl.getSectionID(), oEvent);
         };
         
         block1.dateFieldCheck = function (oEvent) {
             oController.dateFieldCheck(oEvent)
         };
         
	     block1.prepareFormControl();	     
	     jQuery.sap.syncStyleClass(oController.getOwnerComponent().getContentDensityClass(),oControl, block1);
	     block1.addStyleClass("vuiEventsForm");
	    	  	     	     	     
	     block2 = new global.vui5.ui.controls.ResponsiveTable({	          
	    	 controller: oController,
	         modelName: modelName,
	         sectionID: oControl.getSectionID(),
	         fieldPath: sectionPath +  "METADATA/" + section['DARID'] + "_B2"+ global.vui5.cons.nodeName.eventsSuffix + "/FIELDS/",
	         dataPath:  dataPath + section['DARID'] + "_B2"+ global.vui5.cons.nodeName.eventsSuffix + "/",
	         dataAreaPath: sectionPath + "DARID/",
	         layoutDataPath: "/EVENTS/LAYOUT/",//dummy path
	         visible: "{= ${" + modelName + ">" + hideBlock2 + "} !== 'X' }",
             editable: "{= ${" + global.vui5.modelName + ">/DOCUMENT_MODE} !== 'A' }",
             enableLocalSearch: false,	
             enablePersonalization: false,	         
             enableSearchAndReplace: false,	         
             disableExcelExport: true,
	         fullScreen: false, 
	         disableTableHeader: false,
	         hideHeader: "{= ${" + global.vui5.modelName + ">/DOCUMENT_MODE} === 'A' }",
	         onValueHelpRequest: oController.onValueHelpRequest.bind(oController, oControl.getSectionID())
	     }).setModel(model, modelName)
	       .setModel(mainModel, global.vui5.modelName); 
	      
	     block2.bindProperty("mode", {
             path: modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.rowSelection,
             formatter: function (rowSelection) {
                 var mode = rowSelection === 'X' ? sap.m.ListMode.MultiSelect : sap.m.ListMode.None;                 
                 return mode;
             },
             mode: sap.ui.model.BindingMode.OneWay
         });

	     block2.attachOnFieldClick(function (oEvent) {
             oController.preProcessFieldClickEvent(sectionID, oEvent);
         });
	     
	     block2.processOnInputChange = function (oEvent) {
	    	 return oController.processOnInputChange(oControl.getSectionID(), oEvent);
	     }
	     
	     block2.prepareTable();	      	       	       
	     block2.addStyleClass("vuiEventsTable");	     	     	     
	     
	     if(dmode !== global.vui5.cons.mode.display) {
		     underscoreJS.each(blockFunc, function(func){	    	 
		    	 if(func['BTNTP'] == global.vui5.cons.buttonType.menuButton) {	    		 
		    		 var sMenu = [];	    			    		 	    		 
		    		 underscoreJS.each(func['MNITM'], function (obj) {
	                     var subactions = new sap.m.MenuItem({
	                         text: obj['VALUE'],
	                         key: obj['NAME']
	                     });
	                     sMenu.push(subactions);
	                 });
		    		 var oMenu = new sap.m.Menu({
	                     items: sMenu,
	                     itemSelected: function (oEvt) {
	                         var params = {};
	                         var selectedAction = oEvt.getParameter('item');
	                         params['$SELMNITM'] = selectedAction.getKey();
	                         oController.processAction(sectionID, func, null, params);
	                     }
	                 });
		    		 
		    		 block2.addToolBarButton(new sap.m.MenuButton({                   
	                     menu: oMenu,
	                     icon: func['FNICN'],
	                     tooltip: func['DESCR'],
	                     visible: "{= ${" + global.vui5.modelName + ">/DOCUMENT_MODE} !== 'A' }"
	                 }));	    		 
		    	 }
		    	 else {
		    		 block2.addToolBarButton(new sap.m.Button({                   
	                     icon: func['FNICN'],
	                     tooltip: func['DESCR'],
	                     visible: "{= ${" + global.vui5.modelName + ">/DOCUMENT_MODE} !== 'A' }",
	                     press: function(oEvt) {
	                    	 oController.processAction(sectionID, func, block2.getSelectedRows());
	                    	 block2.clearSelection();
	                     }
	                 }));	    		 
		    		 
		    	 }	    	 	    	 
		     });	     		    
	     }

	     var checkBoxField = model.getProperty(sectionPath + "METADATA/" + section['DARID'] + "_B5"+ global.vui5.cons.nodeName.eventsSuffix + "/FIELDS/0/FLDNAME");
	     var checkBoxPath = global.vui5.modelName + ">/DROPDOWNS/" + section['DARID'] + "/" + checkBoxField;
	     var block5Drpdn;
	     
	     if(dmode != "A") {
	    	 block5Drpdn = new global.vui5.ui.controls.ComboBox({ 
                 selectionChange: [oControl.onFieldChange, oControl]	    			 
    		 }).bindAggregation("items", checkBoxPath, function (sid, oContext) {
                 var contextObject = oContext.getObject();
                 return new sap.ui.core.Item({
                     key: contextObject['NAME'],
                     text: contextObject['VALUE']
                 });
             }).bindProperty("selectedKey", modelName + ">" + dataPath + section['DARID'] + "_B5"+ global.vui5.cons.nodeName.eventsSuffix + "/" + checkBoxField)
               .addStyleClass("sapUiTinyMarginEnd");
	     }
	     else {
	    	 block5Drpdn = new sap.m.Label({
    		 }).bindProperty("text",{
    			 parts: [{path: modelName + ">"+ dataPath + section['DARID'] + "_B5"+ global.vui5.cons.nodeName.eventsSuffix + "/" + checkBoxField},
                         {path: checkBoxPath }],
                 formatter: function(val, drpdn) {
                	 if(val != undefined && drpdn != undefined) {
                       var selVal = underscoreJS.findWhere(drpdn, {NAME: val});
                       if(selVal) return selVal['VALUE'];
                	 }
                 }
    		 }).addStyleClass("sapUiTinyMarginTop sapUiTinyMarginEnd");
	     }
	     
	     block5 = new sap.m.FlexBox({	    	 
	    	 renderType: "Div",
	    	 alignItems: "Start",
		     justifyContent: "Start",
		     visible: "{= ${" + modelName + ">" + hideBlock5 + "} !== 'X' }",
	    	 items: [
	    		 new sap.m.Label({
	    			 text: "{" + modelName + ">"+ dataPath + section['DARID'] + "_B5"+ global.vui5.cons.nodeName.eventsSuffix + "/PRTXT}",
	    		 }).addStyleClass("sapUiTinyMarginTop sapUiTinyMarginEnd"),
	    		 block5Drpdn,
	    		 new sap.m.Label({
	    			 text: "{" + modelName + ">" + dataPath + section['DARID'] + "_B5"+ global.vui5.cons.nodeName.eventsSuffix + "/PSTXT}",
	    		 }).addStyleClass("sapUiTinyMarginTop sapUiTinyMarginEnd")
	    	 ]
	     }).setModel(model, modelName)
	       .setModel(mainModel, global.vui5.modelName);
	     
	     block3 = new global.vui5.ui.controls.ResponsiveTable({               
	    	 controller: oController,             
	    	 modelName: modelName,
	    	 sectionID: oControl.getSectionID(),
	    	 fieldPath: sectionPath +  "METADATA/" + section['DARID'] + "_B3"+ global.vui5.cons.nodeName.eventsSuffix + "/FIELDS/",
             dataPath: dataPath + section['DARID'] + "_B3"+ global.vui5.cons.nodeName.eventsSuffix + "/",
             dataAreaPath: sectionPath + "DARID/",
             layoutDataPath: "/EVENTS/LAYOUT/",//dummy path
             visible: "{= ${" + modelName + ">" + noEarlierThan + "} === 'X' }",
             editable: "{= ${" + global.vui5.modelName + ">/DOCUMENT_MODE} !== 'A' }",
             enableLocalSearch: false,
             enablePersonalization: false,
             enableSearchAndReplace: true,
             disableExcelExport: true,
             fullScreen: false,
             disableTableHeader: false,
             hideHeader: true,
             onValueHelpRequest: oController.onValueHelpRequest.bind(oController, oControl.getSectionID())
	     }).setModel(model, modelName)   
           .setModel(mainModel, global.vui5.modelName); 
	     
	     block3.processOnInputChange = function (oEvent) {
	    	 return oController.processOnInputChange(oControl.getSectionID(), oEvent);
	     }
	     
	     block3.prepareTable();     	 
	     block3.addStyleClass("vuiEventsTable");
     	     	     	   
	     block4 = new global.vui5.ui.controls.ResponsiveTable({         
	    	 controller: oController,             
	    	 modelName: modelName,
	    	 sectionID: oControl.getSectionID(),
             fieldPath: sectionPath +  "METADATA/" + section['DARID'] + "_B4"+ global.vui5.cons.nodeName.eventsSuffix + "/FIELDS/",
             dataPath: dataPath + section['DARID'] + "_B4"+ global.vui5.cons.nodeName.eventsSuffix + "/",
             dataAreaPath: sectionPath + "DARID/",
             layoutDataPath: "/EVENTS/LAYOUT/",//dummy path               
             visible: "{= ${" + modelName + ">" + noLaterThan + "} === 'X' }",
             editable: "{= ${" + global.vui5.modelName + ">/DOCUMENT_MODE} !== 'A' }",
             enableLocalSearch: false,
             enablePersonalization: false,
             enableSearchAndReplace: true,
             disableExcelExport: true,
             fullScreen: false,
             disableTableHeader: false,
             hideHeader: true,     
             onValueHelpRequest: oController.onValueHelpRequest.bind(oController, oControl.getSectionID())
	     }).setModel(model, modelName)
	       .setModel(mainModel, global.vui5.modelName); 
	  	  
	     block4.processOnInputChange = function (oEvent) {
	    	 return oController.processOnInputChange(oControl.getSectionID(), oEvent);
	     }
	     
	     block4.prepareTable(); 	     
	     block4.addStyleClass("vuiEventsTable");
	    	  	       
	     var oLayout = new sap.ui.layout.VerticalLayout({	    		  
	    	 width: "100%",	    		    	 
	    	 content:[block1,	    			
	    		 block2,
	    		 block5,
	    	     new sap.m.CheckBox({       			
	    	    	 text: oControl._oBundle.getText("NoEarlierThan"),       				 
	    	    	 editable: "{= ${" + global.vui5.modelName + ">/DOCUMENT_MODE} !== 'A' }",
       				 selected: "{= ${" + modelName + ">" + noEarlierThan + "} === 'X' }",
       		         select: function(oEvt) {       				
       		        	 var params = {};
       		        	 params['$SELECTED'] = oEvt.getParameter("selected");
       		        	 oControl.fireNoEarlierThanChange({params: params});       		        	 
       		         }       			      
	    	     }),	  	    	     
	    	     block3,	    			
	    	     new sap.m.CheckBox({       				    
	    	    	 text: oControl._oBundle.getText("NoLaterThan"),       				    
	    	    	 editable: "{= ${" + global.vui5.modelName + ">/DOCUMENT_MODE} !== 'A' }",       				    
	    	    	 selected: "{= ${" + modelName + ">" + noLaterThan + "} === 'X' }",       				    
	    	    	 select: function(oEvt) {       					   
	    	    		 var params = {};
       		        	 params['$SELECTED'] = oEvt.getParameter("selected");
       		        	 oControl.fireNoLaterThanChange({params: params});       		        	 	   
	    	    	 }       			      
	    	     }),	    			  
	    	     block4]	       
	     });	
	       
	     oControl.setAggregation("_events", oLayout);	  
	    	    
	 };
	    	 
	 return E;
});
	
	