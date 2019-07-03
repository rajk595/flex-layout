define = undefined;
window.CKEDITOR_BASEPATH = "/sap/bc/ui5_ui5/vui/glib/3.00/vistex/ui/widgets/Designer/StatementEditor/";
//var cssFiles = function (files) {
//    var link,
//    head = document.getElementsByTagName('head')[0],
//    path;
//    
//    if (typeof files != "object") {
//        return false;
//    } 
//    for (var i = 0, l = files.length; i < l; i++) {
//      if(files[i]['p'] == "S"){
//        path = './StatementEditor/styles/css/';
//      }
//      else{
//        path = './Content/css/';
//      }
//        link = document.createElement('link');
//        link.setAttribute('rel', "stylesheet");
//        link.setAttribute('href',  path + files[i]['f']);
//        head.append(link);
//    }
//};
//
//cssFiles([
//          {f : 'font-awesome.min.css', p: 'G'},
//          {f : 'bootstrap.min.css', p: 'G'},
//          {f : 'jquery-ui.min.css', p: 'G'},
//          {f : 'formDesigner.min.css', p: 'S'}
//          ]);

jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath(vistexConfig.rootFolder + ".ui.widgets.Designer") + "/Content/css/font-awesome.min.css");
jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath(vistexConfig.rootFolder + ".ui.widgets.Designer") + "/Content/css/bootstrap.min.css");
jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath(vistexConfig.rootFolder + ".ui.widgets.Designer") + "/Content/css/jquery-ui.min.css");
jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath(vistexConfig.rootFolder + ".ui.widgets.Designer") + "/StatementEditor/styles/css/formDesigner.min.css");

sap.ui.define(['sap/ui/core/Control',
	          vistexConfig.rootFolder + "/ui/core/global",
	          vistexConfig.rootFolder + "/ui/core/underscore-min",
	           './Designer_library',
	           './StatementEditor/formDesigner-min'],
	           function(Control,global,underscoreJS){
  var _Control = Control.extend(vistexConfig.rootFolder + ".ui.widgets.Designer.Designer",{
    metadata:{
      properties: {
	                  controller : {
	                     type : "object",
	                     defaultValue: null
	                    },
	                  sectionName:{
	                     type: "string"
	                  },
		               modelName : {
		                   type: "string",
		                   defaultValue: null
		                },
                       dataPath : {
		                   type: "string",
		                   defaultValue: null
                       },
                       fullScreen: {
                          type: "boolean",
                       },
                       hidePreview: {
                    	 type: "boolean",
                       },
                       hideLanguage: {
                    	 type: "boolean",
                       }
                },
      events:{
    	  		    messagesShow: {
	                    parameters: {
	                        selectionSet: {
	                            type: "sap.ui.core.Control[]"
	                        }
	                    }
                    },
                    configGet: {

                    },
                    dataGet: {

                    },
                    languageChange: {

                    },
                    preview: {
                	
                    },
                    onFullScreen: {

                    },
                    assignedLanguages:{
                	
                    }
      },
      aggregations:{
        _designer: {
          type: "sap.ui.core.HTML",
          multiple: false,
          visibility: "hidden"
        },
        _toolbar: {
          //type: "sap.m.Bar",
          type: "sap.m.OverflowToolbar",
          multiple: false,
          visibility: "hidden"
        }
      }
    },
    init: function(){
      var oControl = this;
      var model = new sap.ui.model.json.JSONModel();
      oControl.modelName = "designerModel";
      oControl.setModel(model, oControl.modelName);
      this._oBundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.widgets.Designer");
      var sLocale = sap.ui.getCore().getConfiguration().getLanguage() || "";
            if (sLocale.length > 2) {
                sLocale = sLocale.substring(0, 2);
            }
            oControl.getModel(oControl.modelName).setProperty("/SPRAS",sLocale.toUpperCase());            
            
    },
    renderer: function(oRM, oControl) {
            oRM.write("<div");
            oRM.writeControlData(oControl);
            oRM.write(">");
            oRM.write("<style>");
            oRM.write("div[id*='__designer']:parent:-webkit-full-screen { width:100%; height:100%; }");
            oRM.write("div[id*='__designer']:parent:-moz-full-screen { width:100%; height:100%; }");
            oRM.write("div[id*='__designer']:parent:-ms-fullscreen { width:100%; height:100%; }");
            oRM.write("div[id*='__designer']:parent:fullscreen { width:100%; height:100%; }");
            oRM.write(".dupFileDialogBox > .sapMDialogSection { background-color:white !important; }");
            oRM.write(".modal-backdrop{display: none;} " +
            		"#DesignerHTML_POPUP{ height: calc(100% - 2rem);position: absolute; top:2rem;left:0;right:0;bottom:0; } " +
            		"#DesignerHTML{ height: 100% !important; } " +
            		".modal{    background: rgba(120, 120, 120, 0.2);}");
            oRM.write("</style>");
            
            oRM.write("<script> /*($('[id*=\"-opwrapper\"]').height() - $('[id*=\"-scroll\"]').height() + 20)*/ var _height = window.innerHeight / 1.5; if(_height < 100){ _height = window.innerHeight || 100; } $('[id^=\"__designer\"]').height( _height + 'px' );  </script>");
            
            oRM.renderControl(oControl.getAggregation("_toolbar"));
            oRM.renderControl(oControl.getAggregation("_designer"));
            oRM.write("</div>");            
        }
  });
  
  var Constants = {
		  data: "DATA",
		  config: "CONFIG",
		  languages: "LANGUAGES",
		  selectedLanguage: "Language",
  };

  var Formatter =  {
	  Boolean: function(value) {
          if (value != undefined) {
              if (value == "" || value == "A")
                  return false;
              else
                  return true;
          }
	  }  
  };
  var getProperties = function(oEvent, property){
	  var selectedItem;
	  if(!oEvent){ return { key: "", text: "" } }
	  selectedItem = oEvent.getSource().getSelectedItem();
	  if(property){
		  return selectedItem.getProperty(property) || "";
	  }
	  return {
		  key: selectedItem.getProperty('key') || "",
		  text: selectedItem.getProperty('text') || ""
	  }
  }
  _Control.prototype.onLanguageChange = function(oEvt){
    var oControl = this,
      dataModel = oControl.getModel(oControl.modelName);
    //oControl.getUpdatedData();
    oControl.fireLanguageChange({
      callBack:function(resp){
        oControl.refreshData();
      },
      SPRAS: getProperties(oEvt,"key") //dataModel.getProperty('/SPRAS')
    });
  };
  
  _Control.prototype.onAssignedLanguages = function(oEvt){
	  var oControl = this,
      dataModel = oControl.getModel(oControl.modelName);
	  oControl.fireAssignedLanguages({
	      callBack:function(resp){
	        oControl.refreshData();
	      }
	  });
  },

  _Control.prototype.onPreview = function(){
    var oControl = this;
    oControl.firePreview({
      callBack:function(resp){

      }
    });
  };

  _Control.prototype.onToggleScreen = function(oEvent){
	  var oControl = this, lv_fullscreen, element = [];
	  /*var source = oEvent.getSource();
        this.fireOnFullScreen({
            "fullScreen": oEvent.getSource().getIcon() === 'sap-icon://full-screen'
        });*/
	  oControl.fullScreen = oControl.fullScreen || false;
	  element = $('[id*="__designer"]').parent();
	  if(element.length){
		element = element[0];
		$(element).off('webkitfullscreenchange mozfullscreenchange fullscreenchange msfullscreenchange');
		$(element).on('webkitfullscreenchange mozfullscreenchange fullscreenchange msfullscreenchange', function() {
			var height =  oControl.originalHeight, 
				lv_fullscreen = document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen || !oControl.fullScreen;
			oControl.fullScreen = lv_fullscreen;
			if (lv_fullscreen) {
				console.log('fullscreen');
		        $(this).width('100%').height('100%');
		        height =  window.screen.height - 44;
		    } else {   
				console.log('not fullscreen');
		        //$(this).width('auto').height('auto');
				$(this).width('').height('');
				height =  oControl.originalHeight
		    }
			$('[id^=\"__designer\"]').height(height+'px');
			$('#' + oControl.designerID).height(height);
	        oControl.getController().getModel(global.vui5.modelName).setProperty('/FULLSCREEN', lv_fullscreen);
		});
		if(oEvent.getSource().getIcon() === 'sap-icon://full-screen'){
//			lv_fullscreen = true;
		  if (element.requestFullscreen) {
			  element.requestFullscreen();
		  } else if (element.mozRequestFullScreen) { /* Firefox */
			  element.mozRequestFullScreen();
		  } else if (element.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
			  element.webkitRequestFullscreen();
		  } else if (element.msRequestFullscreen) { /* IE/Edge */
			  element.msRequestFullscreen();
		  } 
	  }
	  else{
//		  lv_fullscreen = false;
		  if (document.exitFullscreen) {
			  document.exitFullscreen();
		  } else if (document.mozCancelFullScreen) { /* Firefox */
		    document.mozCancelFullScreen();
		  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
		    document.webkitExitFullscreen();
		  } else if (document.msExitFullscreen) { /* IE/Edge */
		    document.msExitFullscreen();
		  }
	  }      
	  }
  };
  _Control.prototype.getConfig = function(){
    var deffer = jQuery.Deferred(),
      oControl = this;
    setTimeout(function(){
      parentControl = oControl.getController();
      data = parentControl.getModel(oControl.getModelName()).getProperty(oControl.getDataPath() + Constants.config) || {};
      deffer.resolve(data);
    });
    return deffer.promise();
  };

  _Control.prototype.getData = function(){
    var deffer = jQuery.Deferred(),
      oControl = this;
    setTimeout(function(){
      parentControl = oControl.getController();
      data = parentControl.getModel(oControl.getModelName()).getProperty(oControl.getDataPath() + Constants.data) || {};
      if(!oControl.allowedContext){
    	  oControl.allowedContext = data['AllowedContext'] || [];  
      }
      else{
    	  data['AllowedContext'] = oControl.allowedContext || [];
      }
      deffer.resolve(data);
    },100);
    return deffer.promise();
  };

  _Control.prototype.refreshData = function(){
    var oControl = this;
    oControl.formDesigner.refreshStatement();
  },

  _Control.prototype.getUpdatedData = function(){
	  var oControl = this, data = {},
	    dataModel = oControl.getModel(oControl.modelName),
	    mode =  dataModel.getProperty("/DMODE"),
	    parentControl = oControl.getController();
	  	if(!oControl.formDesigner){
	  		return data;
	  	}
	    data = oControl.formDesigner.getFormData() || {};
	    parentControl.getModel(oControl.getModelName()).setProperty(oControl.getDataPath() + Constants.data, data);
	    if(mode && mode != global.vui5.cons.mode.display){
	    	oControl.refreshData();
	    }
    //parentControl.getModel(oControl.getModelName()).setProperty(oControl.getDataPath(), data);
    return (data || {});
  },

  _Control.prototype.updateData = function(data){
    return (data || {}); 
  };

  _Control.prototype.getDesigner = function(){
    var oControl = this;

    return new FormDesigner({
            serviceEndPoint: "", 
            getConfig: function(){
              return oControl.getConfig();
            },
            getData: function(){
              return oControl.getData();
            },
            updateData: function(data){
              var deffer = jQuery.Deferred();
              oControl.updateData(data);
              setTimeout(function(){
                deffer.resolve(true);
              });
              return deffer.promise();
            }
    });
  };

  _Control.prototype.setFullScreen = function(value) {
         this.setProperty("fullScreen", value, true);
         if (this._fullScreenBtn) {
             this._fullScreenBtn.setVisible(value);
         }
  };
  _Control.prototype.addLanguage = function(oEvt){
	  var selectedObject = getProperties(oEvt);
	  var oControl = this;
      var oController = this.getController();
      var modelName = this.getModelName();
      var dataPath = this.getDataPath();
      var model = oController.getModel(modelName);
      var languages = model.getProperty(dataPath + Constants.languages) || [];
      var selectedLanguage = getProperties(oEvt);
      var isExist = underscoreJS.find(languages, { "TDSPRAS":  selectedLanguage['key']}) || false;
      if(isExist){
    	  sap.m.MessageToast.show(this._oBundle.getText("LangExists"));
    	 return false; 
      }
//      languages.push({
//    	  TDSPRAS: selectedLanguage['key'],
//    	  LANGU: selectedLanguage['text']
//      });
//      model.setProperty(dataPath + Constants.selectedLanguage , selectedLanguage['key']);
      oControl.onLanguageChange(oEvt);
  },
  _Control.prototype.onLanguageDrdn = function(oEvt) {
      var oControl = this;
      var oController = this.getController();
      var modelName = this.getModelName();
      var dataPath = this.getDataPath();
      var model = oController.getModel(modelName);
      var mainModel = oController.getModel(global.vui5.modelName);
      var _section = oControl.getSectionName() || "DG";
      var langList = new sap.m.SelectList({
        selectionChange: [oControl.addLanguage, oControl]
      }).setModel(mainModel, global.vui5.modelName);
      //+ oController.sectionData['DARID'] + 
      langList.bindAggregation("items",global.vui5.modelName + ">/DROPDOWNS/" + _section + "/TDSPRAS", function(sId, oContext) {
        return new sap.ui.core.Item({
          key: oContext.getObject("NAME"),
          text: oContext.getObject("VALUE")
        });
      });
      var langPopover = new sap.m.ResponsivePopover({
        placement: sap.m.PlacementType.Bottom,
        title: this._oBundle.getText("Language"),
        content: langList
      });
      langPopover.openBy(oEvt.getSource());
    };
  _Control.prototype.setDesignerInfocus = function(mode,language){
    var oControl = this,
      SAPLanguage = "",
      dataModel = {},
      baseController = {},
      value = false,
      toolbar = {},
      buttons = {},
      profileInfo,
      languagesPath,
      selectedLanguage,
      isLanguageVisible = !oControl.getHideLanguage();
      isPreviewVisible = !oControl.getHidePreview();
    baseController = oControl.getController();
    profileInfo = baseController.getProfileInfo() || {};
    
//    var bundle = this.getController().getModel("i18n").getResourceBundle();
    
    languagesPath = oControl.getModelName() + '>'  + oControl.getDataPath() + Constants.languages;
    selectedLanguage = oControl.getModelName() + '>'  + oControl.getDataPath() + Constants.selectedLanguage;

    dataModel = oControl.getModel(oControl.modelName);
    dataModel.setProperty("/DMODE", mode);
    
    var toolbarContent = [];
    
    if(isLanguageVisible){
    	buttons.label = new sap.m.Label({
    		//text: bundle.getText('Language')
    		text: this._oBundle.getText('Language')
    	}).addStyleClass('sapUiVisibleOnlyOnDesktop');
    	toolbarContent.push(buttons.label);
    	
    	buttons.languages = new sap.m.Select({
    	   selectedKey:'{' + selectedLanguage + '}',  //'{' + oControl.modelName + '>/SPRAS}',
    	   change: [oControl.onLanguageChange, oControl]
    	}).bindAggregation("items", languagesPath, function(sId, oContext){
    	    return new sap.ui.core.Item({
    	       key: oContext.getObject("TDSPRAS"),
    	       text: oContext.getObject("LANGU")
    	    });
    	}).setModel(dataModel, oControl.modelName);    	
    	toolbarContent.push(buttons.languages);
    	toolbarContent.push(new sap.m.Button({
    					   type: sap.m.ButtonType.Transparent,	
                           icon: "sap-icon://add",
                           tooltip: this._oBundle.getText('Add'),
                           press: [oControl.onLanguageDrdn, oControl]
                         })
    			.bindProperty("visible", 
    						   global.vui5.modelName+">/DOCUMENT_MODE",
    						   Formatter.Boolean, sap.ui.model.BindingMode.OneWay)
        );
    	toolbarContent.push(new sap.m.Button({
    		type: sap.m.ButtonType.Transparent,
            icon: "sap-icon://delete",
            tooltip: this._oBundle.getText('Delete'),
            press: [oControl.onAssignedLanguages, oControl]
          }).bindProperty("visible", global.vui5.modelName + ">/DOCUMENT_MODE",Formatter.Boolean, sap.ui.model.BindingMode.OneWay));
//    	buttons.assignedLanguages = new sap.m.OverflowToolbarButton({
//    		type: sap.m.ButtonType.Transparent,
//        	icon: 'sap-icon://attachment-html',
//        	tooltip: '{i18n>MaintainedLanguages}',
//        	//tooltip: bundle.getText('MaintainedLanguages'),
//            press: [oControl.onAssignedLanguages, oControl]
//        });
//    	toolbarContent.push(buttons.assignedLanguages);
    }
    
    
    //Empty Space
    toolbarContent.push(new sap.m.ToolbarSpacer());
    
    if(isPreviewVisible){
    	buttons.preview = new sap.m.OverflowToolbarButton({
    		type: sap.m.ButtonType.Transparent,
        	icon: 'sap-icon://inspection',
            //tooltip: bundle.getText('Preview'),
        	tooltip: this._oBundle.getText('Preview'),
        	press: [oControl.onPreview, oControl],
            visible: isPreviewVisible
        });
    	toolbarContent.push(buttons.preview);
    }
    
    oControl._fullScreenBtn = buttons.fullScreen =  new sap.m.OverflowToolbarButton({
        type: sap.m.ButtonType.Transparent,
        //tooltip: bundle.getText('FullScreen'),
        tooltip: this._oBundle.getText('FullScreen'),
        icon: {
            path: global.vui5.modelName + ">" + "/FULLSCREEN",
            formatter: function(fullScreen) {
                return fullScreen === true ? 'sap-icon://exit-full-screen' : 'sap-icon://full-screen';
            },
            mode: sap.ui.model.BindingMode.TwoWay
        },
        press: [oControl.onToggleScreen, oControl] 
	});
    toolbarContent.push(buttons.fullScreen);
    
    toolbar = new sap.m.OverflowToolbar({
    	content: toolbarContent
    });

//    toolbar = new sap.m.Bar({
//      contentLeft: [buttons.label, buttons.languages, buttons.assignedLanguages],
//      contentRight: [ buttons.preview, buttons.fullScreen]
//    });
    
    oControl.designerID = 'DesignerHTML';
    oControl.getController().getModel(global.vui5.modelName).getProperty('/FULLSCREEN') && (oControl.designerID = 'DesignerHTML_POPUP');
    
    oControl.designer = new sap.ui.core.HTML(oControl.designerID,{
     // content: "<div><ng-include src=\"'./StatementEditor/formDesigner.html'\"></ng-include></div>",
      content: "<div style='widht:100%;height:100%;'><ng-include src=\"'" + jQuery.sap.getModulePath(vistexConfig.rootFolder + ".ui.widgets.Designer") + "/StatementEditor/formDesigner.html'\"></ng-include></div>",
      afterRendering: function(e){
        if(!oControl.formDesigner){
          var htmlData = $('#' + oControl.designerID)[0];
          var _parentHeight = $('#' + oControl.designerID).closest('section[role="main"]').height();
          var _tabPanel =  $('#' + oControl.designerID).closest('[role="tabpanel"]') || [];
          if(!_tabPanel.length){
        	  _tabPanel =  $('#' + oControl.designerID).closest('[role="region"]') || [];
          }
          if(_tabPanel.length){
        	  var _id_ = _tabPanel.attr('id').split('-')[0] || "";
              var prevElmHeight = $('#' + _id_).prev().height();
              var setHeight = _parentHeight - prevElmHeight - $('#' + oControl.designerID).prev().height(); 
              if(setHeight < 100){
            	  setHeight = window.innerHeight / 1.5;
            	  if(setHeight < 100){
            		  setHeight = window.innerHeight;  
            	  }  
              }
              oControl.originalHeight = setHeight; 
              $('#' + oControl.designerID).height(setHeight);  
          }
                //angular.module("Designer",["FormDesigner"]);
                angular.element(htmlData).ready(function() {
//                	 	angular.module('FormDesigner')
//                      .config(['$locationProvider', function($locationProvider) {
//							$locationProvider.hashPrefix('');
//							$locationProvider.html5Mode({
//							    enabled: false,
//							    requireBase: true
//							  });
//						}]);
                        angular.bootstrap(htmlData, ['FormDesigner']); //Designer
//                        oControl.formDesigner = oControl.getDesigner();
                  });
          oControl.formDesigner = oControl.getDesigner();
          
        }
      }
    });

    oControl.setAggregation("_toolbar", toolbar);
    oControl.setAggregation("_designer", oControl.designer);

    return oControl.designer; 
  };
});