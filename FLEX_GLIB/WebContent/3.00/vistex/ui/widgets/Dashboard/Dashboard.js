jQuery.sap.includeStyleSheet("//maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css");
jQuery.sap.includeStyleSheet("//fonts.googleapis.com/css?family=Roboto:300,500,700");
jQuery.sap.includeStyleSheet("//fonts.googleapis.com/css?family=Ubuntu:400,700");

/*sap.ui.getCore().loadLibrary(vistexConfig.vzrootFolder + ".ui.widgets.DashboardBundle", {
    url: vistexConfig.vzuiResourcePath + "/" + vistexConfig.dashboardBundleLibraryVersion + "/" + vistexConfig.vzrootFolder + "/ui/widgets/DashboardBundle"
});*/

jQuery.sap.registerModulePath("ViziDashboard", vistexConfig.vzuiResourcePath + "/" + vistexConfig.dashboardBundleLibraryVersion + "/" + vistexConfig.vzrootFolder + "/ui/widgets/DashboardBundle")

sap.ui.define([ "sap/ui/core/Control",
              vistexConfig.rootFolder + "/ui/core/commonUtils",
              "ViziDashboard/vizi",
               ],
        function(control, commonUtils) {
          var A = control.extend(vistexConfig.rootFolder + ".ui.widgets.Dashboard.Dashboard", {
                metadata : {
                  properties : {
                    controller : {
                      type : "object",
                      defaultValue : null
                    },   
                    jsonUrl : {
                      type : "string",
                      defaultValue : null
                    },
                    userId : {
                      type : "string",
                      defaultValue : null
                    },
                    dashboardId : {
                      type : "string",
                      defaultValue : null
                    },
                    fullScreen: {
                      type: "boolean",
                      defaultValue: false
                    },
                    initialTab: {
                      type: "string",
                      defaultValue: null
                    },
                    bufferKey: {
                      type: "string",
                      defaultValue: null
                    },
                    dashboardBuffer: {
                      type: "array",
                      defaultValue: null
                    },
                    filters: {
                      type: "array",
                      defaultValue: null
                    },
                    language : {
                      type : "string",
                      defaultValue : null
                    },
                    clientId : {
                      type : "string",
                      defaultValue : null
                    },
                    modelName : {
                      type : "string",
                      defaultValue : null
                    },
                    version : {
                      type : "string",
                      defaultValue : null
                    },
                    dictionariesPath: {
                      type : "string",
                      defaultValue : null	
                    }     
                  },
                  events : {
                    renderDashboard : {},
                    onNavigate : {},
                    onFullScreen: {},
                  },
                  aggregations : {
                    _getDashboard : {
                      type : "sap.ui.core.Control",
                      multiple : false,
                      visibility : "hidden"
                    },
                    _getFlowBar: {
                      type: "sap.ui.core.Control",
                      multiple: false,
                      visibility: "hidden"
                    }
                  }
                },
                renderer : function(oRM, oControl) {
                  oRM.write("<div");
                  oRM.writeControlData(oControl);
                  oRM.write(">");
                  oRM.renderControl(oControl.getAggregation("_getFlowBar"));
                  oRM.renderControl(oControl.getAggregation("_getDashboard"));
                  oRM.write("</div>");
                }
              });
          A.prototype.setJsonUrl = function(value) {
            this.setProperty("jsonUrl", value, true);
          };
          A.prototype.setUserId = function(value) {
            this.setProperty("userId", value, true);
          };
          A.prototype.setDashboardId = function(value) {
            this.setProperty("dashboardId", value, true);
          };
          A.prototype.setFullScreen = function(value) {
            this.setProperty("fullScreen",value,true);
          };
//*****Rel 60E_SP6
          A.prototype.setInitialTab = function(value) {
            this.setProperty("initialTab",value,true);
          };
          A.prototype.setBufferKey = function(value) {
            this.setProperty("bufferKey",value,true);
          };
          A.prototype.setDashboardBuffer = function(value) {
            this.setProperty("dashboardBuffer",value,true);
          };
          A.prototype.setFilters = function(value) {
              this.setProperty("filters",value,true);
          };
          A.prototype.setLanguage = function(value) {
              this.setProperty("language", value, true);
          };
          A.prototype.setClientId = function(value) {
              this.setProperty("clientId", value, true);
          };
//*****
//*****Rel 60E_SP7
          A.prototype.setModelName = function(value) {
              this.setProperty("modelName", value, true);
          };
          A.prototype.setVersion = function(value) {
              this.setProperty("version", value, true);
          };
          A.prototype.setDictionariesPath = function (value) {
              this.setProperty("dictionariesPath", value, true);
          };
//*****          

          A.prototype.onDashboardInfocusSet = function() {
        	  
            var oControl = this, params = {};
            var url = this.getJsonUrl() + this.getDashboardId();
            var oController = this.getController();
            var modelName = this.getModelName();
            var model = oController.getModel(modelName);            
            
            oControl.randomClass = Math.floor((Math.random() * 100) + 1) + '' + Math.floor((Math.random() * 100) + 1);
            oControl.randomClass = oControl.getDashboardId() + "-" + oControl.randomClass;
            oControl.skipRendering = false;
            var oHtml = new sap.ui.core.HTML({
              content : "<div class='this-is-vizi vizi-darkforce "+ oControl.randomClass +"'> </div>;"
            });

            oControl._fullScreenButton = new sap.m.OverflowToolbarButton({
              type: sap.m.ButtonType.Transparent,
              icon: {
                 path: vui5.modelName + ">" + "/FULLSCREEN",
                 formatter: function (fullScreen) {
                   return fullScreen === true ? 'sap-icon://exit-full-screen' : 'sap-icon://full-screen';
                 },
                 mode: sap.ui.model.BindingMode.TwoWay
              },
              visible: this.getProperty("fullScreen"),
              press: oControl.fullScreenDialog.bind(oControl)
            });

            var oBar = new sap.m.Toolbar({
             design: sap.m.ToolbarDesign.Solid,
             visible: this.getProperty("fullScreen"),
             content: [new sap.m.ToolbarSpacer({}),
                       oControl._fullScreenButton
              ]
            });

            oControl.setAggregation("_getFlowBar", oBar);
            oControl.setAggregation("_getDashboard", oHtml);

          };

          A.prototype.renderDashboard = function(){
            var oControl = this;            
            //*****Rel 60E_SP7 
            var oController = this.getController();
            var modelName = this.getModelName();
            var model = oController.getModel(modelName);
            var version = model.getProperty(this.getVersion());
            if(underscoreJS.isEmpty(version)) {
            	version = "1";
            }
            if(version === "1" || version === "2") {
            //*****
            	var url = this.getJsonUrl() + this.getDashboardId();
                oControl.getDashboardJson(url,
                  function(json){
                    oControl.updateDashboard(json);
                  }
                );	
            //*****Rel 60E_SP7
            }            
            //*****
          };

          A.prototype.getDashboardJson = function(jsonUrl, fnSuccess) {
            var params = {};
            //*****Rel 60E_SP6
            var token = commonUtils.server.xcsrftoken;
            var userInfo = {
                    userId : this.getUserId(),
                    language: this.getLanguage(),
                    clientId: this.getClientId(),
                    //token : commonUtils.server.xcsrftoken
                    token: token.toLowerCase()
                  };
            //*****
            jQuery.ajax({
              url : jsonUrl,
              contentType : "json",
              dataType : "json",
              type : "GET",
              data : JSON.stringify(params),
              async : true,
              cache : true,
              beforeSend : function(xhr) {
              //xhr.setRequestHeader ("Authorization", JSON.stringify(userInfo) );
              xhr.setRequestHeader ("Authorization", "Vizi " + btoa(JSON.stringify(userInfo)));
              },
              success : function(oData) {
                if (typeof fnSuccess == "function")
                  fnSuccess(oData);
              },
              error : function(err) {
              }
            });
          };

          A.prototype.updateDashboard = function(json) {
            var oControl = this;
            var oController = this.getController();
            var dashboardId = this.getDashboardId();
            var fullScreen = this.getFullScreen();

            var token = commonUtils.server.xcsrftoken;
            var userInfo = {
              userId : this.getUserId(),
              language: this.getLanguage(),
              clientId: this.getClientId(),
              token : token.toLowerCase()
            };
//*****Rel 60E_SP7            
            var modelName = this.getModelName();
            var model = oController.getModel(modelName);
            var dictionaries = model.getProperty(this.getDictionariesPath());
//*****
            
//*****Rel 60E_SP6
            var initialTab, filters;
            var bufferKey = this.getBufferKey();
            var dashboardBuffer = this.getDashboardBuffer() || [];
            var dashboardPrevState = underscoreJS.findWhere(dashboardBuffer,{KEY: bufferKey});
            if(dashboardPrevState){
              //*****Rel 60E_SP6 - ECIP #17879
              //json = oControl.applyStateOnConfig(dashboardPrevState['STATE'], dashboardPrevState['JSON']);
              json = dashboardPrevState['STATE'];
                dashboardBuffer = underscoreJS.without(dashboardBuffer,dashboardPrevState);
                oController.getMainModel().setProperty("/DSHBD_BUFFER", dashboardBuffer);
                //*****
            }
            else {

//*****Rel 60E_SP7            	
              //filters = this.getFilters();
              filters = model.getProperty(this.getFilters());
//*****            	
              initialTab = this.getInitialTab();

              if(!underscoreJS.isEmpty(initialTab)){
                json.initialTab = initialTab;
              }

              var unique_filterIds = underscoreJS.uniq(underscoreJS.pluck(filters,"FLTID"));
              //*****Rel 60E_SP7 - Task #56801
              /*underscoreJS.each(unique_filterIds, function(filterID,i){
                var filterObjs = underscoreJS.where(filters,{FLTID:filterID});
                var obj = filterObjs[0];
                var members = [];
                underscoreJS.each(filterObjs,function(obj){
                  underscoreJS.each(obj['VALUE'], function(val){
                    members.push(val['FVALUE']);
                  });
                });

                if(underscoreJS.isEmpty(obj['MAPID'])){
                  if(!underscoreJS.isArray(json.filters.find(function(f){return f.id === obj['FLTID'];}).members.selected)){
                    json.filters.find(function(f){return f.id === obj['FLTID'];}).members.selected = [];
                  }
                  var selectedMembers = json.filters.find(function(f){return f.id === obj['FLTID'];}).members.selected;
                  if(selectedMembers.length > 0){
                    underscoreJS.each(selectedMembers, function(member,i){
                      if(member.length == 0){
                        json.filters.find(function(f){return f.id === obj['FLTID'];}).members.selected[i] = members;
                      }
                      else {
                        json.filters.find(function(f){return f.id === obj['FLTID'];}).members.selected.push(members);
                      }
                      return;
                    });
                  }
                  else {
                    json.filters.find(function(f){return f.id === obj['FLTID'];}).members.selected.push(members);
                  }

                }
                if(!underscoreJS.isEmpty(obj['MAPID'])){
                  if(underscoreJS.isArray(json.scopes[obj['MAPID']])){
                    json.scopes[obj['MAPID']].push(members);
                  }
                  else {
                    json.scopes[obj['MAPID']] = members;
                  }
                }
              });*/
              
              underscoreJS.each(unique_filterIds, function(filterID,i){
                  var filterObjs = underscoreJS.where(filters,{FLTID:filterID});
                    
                  underscoreJS.each(filterObjs,function(obj){                    
                  	var members = [];
                  	underscoreJS.each(obj['VALUE'], function(val){
                        members.push(val['FVALUE']);
                      });
                      
                      if(underscoreJS.isEmpty(obj['MAPID'])){
                        if(!underscoreJS.isArray(json.filters.find(function(f){return f.id === obj['FLTID'];}).members.selected)){
                          json.filters.find(function(f){return f.id === obj['FLTID'];}).members.selected = [];
                        }
                        
                        var selectedMembers = json.filters.find(function(f){return f.id === obj['FLTID'];}).members;
                        var selectedIndex = selectedMembers.fields.findIndex(function(f){return f === obj["FTFLD"];});                       
                        var member = selectedMembers.selected[selectedIndex];
                        
                        if(member.length == 0){
                          json.filters.find(function(f){return f.id === obj['FLTID'];}).members.selected[selectedIndex] = members;
                        }
                        else {
                          json.filters.find(function(f){return f.id === obj['FLTID'];}).members.selected[selectedIndex].push(members);
                        }                                                                
                      }
                        
                      if(!underscoreJS.isEmpty(obj['MAPID'])){                    
                        if(underscoreJS.isArray(json.scopes[obj['MAPID']])){
                          json.scopes[obj['MAPID']].push(members);
                        }
                        else {
                          json.scopes[obj['MAPID']] = members;
                        }
                      }                    
                      
                });                  
                    
              });
              //*****
            }

            oControl.json = json;
//*****
            //oControl.dashboard = new Vizi.Dashboard(document.querySelector("."+oControl.randomClass), json, function(context){}, userInfo);
            oControl.dashboard = new Vizi.Dashboard(document.querySelector("."+oControl.randomClass), json, function(context){}, btoa(JSON.stringify(userInfo)));
            Vizi.Dashboard.dictionary = dictionaries;

            oControl.dashboard.on("ACTION", function(action, actionContext){
             var params = {}, data = [];
             params[vui5.cons.params.dashboardId] = dashboardId;
             params[vui5.cons.params.widgetId] = actionContext['widgetId'];
             params[vui5.cons.params.actionId] = action['id'];
             underscoreJS.each(actionContext["data"], function(dataObject,i){
               var keys = underscoreJS.keys(dataObject);
               var rowData = {}, fldval = [];
               rowData['ROW_ID'] = i;
               underscoreJS.each(keys, function(key){
                 var fldvalues = {};
                 fldvalues["FNAME"] = key;
                 fldvalues["FVALUE"] = dataObject[key]['value'];
                 fldval.push(fldvalues);
               });
               rowData["FLDVAL"] = fldval;
               data.push(rowData);
             });

//*****Rel 60E_SP6 - ECIP #17879
             if(oControl.dashboard){
               var sectn;
               var bufferData = oControl.getDashboardActiveState();
               oController.dashboardBufferFill(sectn,bufferData);
             }
//*****

             var promise = oControl.fireOnNavigate({rowData: data, params: params,
                callBack:function(resp){
                  if(oControl.dashboard){
//*****Rel 60E_SP6 - ECIP #17879
                    /*var sectn;
                    var bufferData = oControl.getDashboardActiveState();
                    oController.dashboardBufferFill(sectn,bufferData);*/
//*****
                    oControl.dashboard.destroy();
                  }
             }});

            });

          };

          A.prototype.fullScreenDialog = function(oEvent) {
            var source = oEvent.getSource();
            this.fireOnFullScreen({
              "fullScreen": oEvent.getSource().getIcon() === 'sap-icon://full-screen'
            });
          };
          
//*****Rel 60E_SP6
          A.prototype.applyStateOnConfig = function(state, config) {
            config.filters.forEach(function (filter) {
              var members = filter.members;
              var ids = members.fields.reduce(function (arr, field) {
                arr.push(field + "_" + members.dataSource);
                return arr;
              }, [filter.id + "_" + members.dataSource]);
              var contextFilter = state.filters.find(function (f) {
                return ids.find(function (id) {
                  return f.id === id;
                });
              });
              if (contextFilter) {
                members.selected = [contextFilter.members.selected];
              };
            });
            return config;
          };

          A.prototype.getDashboardActiveState = function(state, config) {
            var oControl = this;
            var bufferKey = this.getBufferKey();
            //*****Rel 60E_SP6 - ECIP #17879
            var oController = oControl.getController();
            var mainModel = oController.getMainModel();
            var dashboardId = oControl.getDashboardId();
            //*****
            var bufferData;
            if(oControl.dashboard){
              var activeState = oControl.dashboard.getState();
              //*****Rel 60E_SP6 - ECIP #17879
              bufferData = {KEY: bufferKey, STATE: activeState, JSON: oControl.json, APTIT: mainModel.getProperty("/APTIT"), DSHBD: dashboardId};
              //*****
            }

            return bufferData;
          };
//*****
          return A;
        });