jQuery.sap.includeStyleSheet("//maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css");
jQuery.sap.includeStyleSheet("//fonts.googleapis.com/css?family=Roboto:300,500,700");
jQuery.sap.includeStyleSheet("//fonts.googleapis.com/css?family=Ubuntu:400,700");

jQuery.sap.registerModulePath("ViziDashboardBundle", vistexConfig.vzuiResourcePath + "/" + vistexConfig.dashboardBundleLibraryVersion + "/" + vistexConfig.vzrootFolder + "/ui/widgets/DashboardBundle")

sap.ui.define([ "sap/ui/core/Control",
              vistexConfig.rootFolder + "/ui/core/commonUtils",
              "ViziDashboardBundle/dashboard.bundle",
               ],
        function(control, commonUtils) {
          var A = control.extend(vistexConfig.rootFolder + ".ui.widgets.Dashboard.DashboardV2", {
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
                    dashboardConfig : {
                      type : "string",
                      defaultValue : null
                    },
                    urlPath: {
                      type: "string",
                      defaultValue: null
                    },
                    defaultBookMarkPath: {
                      type: "string",
                      defaultValue: null
                    }
                  },
                  events : {
                    renderDashboard : {},
                    onFullScreen: {},
                    onBookmarkManage: {}
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
          A.prototype.setLanguage = function(value) {
              this.setProperty("language", value, true);
          };
          A.prototype.setClientId = function(value) {
              this.setProperty("clientId", value, true);
          };
          A.prototype.setModelName = function(value) {
              this.setProperty("modelName", value, true);
          };
          A.prototype.setVersion = function(value) {
              this.setProperty("version", value, true);
          };
          A.prototype.setDashboardConfig = function(value) {
              this.setProperty("dashboardConfig", value, true);
          };
          A.prototype.setUrlPath = function(value) {
              this.setProperty("urlPath", value, true);
          };
          A.prototype.setDefaultBookMarkPath = function (value) {
              this.setProperty("defaultBookMarkPath", value, true);
          };

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
            }).addEventDelegate({
                onAfterRendering : function(e) {                    
                    if(!oControl.skipRendering && model.getProperty(oControl.getVersion()) === "V2"){                    
                      $(document.getElementsByClassName(oControl.randomClass)).removeClass("this-is-vizi vizi-standalone-mode vizi-darkforce");
                      $(document.getElementsByClassName(oControl.randomClass)).addClass("dashboardv2");
                      oControl.skipRendering = true; 
                      oControl.renderDashboardVersion2();
                    }                   
               }
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
            var oController = this.getController();
            var modelName = this.getModelName();
            var model = oController.getModel(modelName);
            var version = model.getProperty(this.getVersion());
            if(underscoreJS.isEmpty(version)) {
            	version = "1";
            }
            if(version === "1" || version === "2") {
            	var url = this.getJsonUrl() + this.getDashboardId();
                oControl.getDashboardJson(url,
                  function(json){
                    oControl.updateDashboard(json);
                  }
                );	
            }            
          };

          A.prototype.fullScreenDialog = function(oEvent) {
            var source = oEvent.getSource();
            this.fireOnFullScreen({
              "fullScreen": oEvent.getSource().getIcon() === 'sap-icon://full-screen'
            });
          };

          A.prototype.renderDashboardVersion2 = function() {
        	var oControl = this, oController, modelName, model, dashboardConfig, url, userInfo, auth, bookmarkData;
        	oController = this.getController();
        	modelName = this.getModelName();
        	model = oController.getModel(modelName);
        	dashboardConfig = model.getProperty(this.getDashboardConfig());
        	url = model.getProperty(this.getUrlPath());
            userInfo = {
              userId : this.getUserId(),
              language: this.getLanguage(),
              clientId: this.getClientId(),
              token : commonUtils.server.xcsrftoken.toLowerCase()
            };        	
            auth = { 
              type: "BearerToken", 
              token: btoa(JSON.stringify(userInfo))
            };          
        	
        	if(!underscoreJS.isEmpty(dashboardConfig)){
               dashboardConfig = JSON.parse(dashboardConfig);	
            }        	
			
            if(model.getProperty(oControl.getDefaultBookMarkPath())){
            	bookmarkData = model.getProperty(oControl.getDefaultBookMarkPath());
            	bookmarkData['data'] = JSON.stringify(bookmarkData['data']);
            }
            //var dashboardVersion2 = dashboard.init(document.querySelector("." + oControl.randomClass), oControl.getDashboardId(), url, dashboardConfig, auth);
            var dashboardVersion2 = dashboard.init(document.querySelector("." + oControl.randomClass), oControl.getDashboardId(), url, dashboardConfig,
            		{ auth: auth, 
            		  bookmarkAdapter: oControl.prepareBookMarkAdapter(),
            		  bookmark: bookmarkData,
            		  timeout:parseInt(oControl.getModel("mainModel").getProperty(global.vui5.cons.modelPath.sessionInfo + '/SSTIM')) * 1000
            		}
            		);
        	dashboardVersion2.render();
          };
          
          A.prototype.prepareBookMarkAdapter = function () {
              var oControl = this;
              return {
                  listAll: function () {
                      return oControl.onBookMarkAction({
                          actionID: "listAll"
                      });

                  },
                  get: function (bookMarkID) {
                      return oControl.onBookMarkAction({
                          bookMarkID: bookMarkID,
                          actionID: "get"
                      });
                  },
                  remove: function (bookMarkID) {
                      return oControl.onBookMarkAction({
                          bookMarkID: bookMarkID,
                          actionID: "remove"
                      });
                  },
                  save: function (name, data, shared) {
                      return oControl.onBookMarkAction({
                          name: name,
                          data: data,
                          shared: shared,
                          actionID: "save"
                      });
                  },
                  setAsDefault: function (bookMarkID) {
                      return oControl.onBookMarkAction({
                          bookMarkID: bookMarkID,
                          actionID: "setAsDefault"
                      });
                  },
                  update: function (bookMarkID, data) {
                      return oControl.onBookMarkAction({
                          bookMarkID: bookMarkID,
                          data: data['data'],
                          actionID: "update"
                      });
                  },


              }
          };
          
          A.prototype.onBookMarkAction = function (config) {
              var oControl = this, params = {}, resolver, data = {};

              var promise = new Promise(function (resolve) {
                  switch (config.actionID) {
                      case "listAll":
                          params['EVENT_TYPE'] = config.actionID;
                          break;
                      case "get":
                      case "remove":
                      case "setAsDefault":
                          params['EVENT_TYPE'] = config.actionID;
                          params['BOOKMARK_ID'] = config.bookMarkID;
                          break;
                      case "save":
                          params['EVENT_TYPE'] = config.actionID;
                          data['NAME'] = config.name;
                          data['DATA'] = config.data;
                          data['SHARED'] = config.shared;
                          break;
                      case "update":
                      	params['EVENT_TYPE'] = config.actionID;
                      	params['BOOKMARK_ID'] = config.bookMarkID;
                      	data['DATA'] = config.data;
                      	break;                          
                  }

                  oControl.fireOnBookmarkManage({
                      params: params,
                      data: data,
                      callBack: function (response) {
                          
                          if (response[config.actionID]) {

                              if (config.actionID === "get") {
                                  response[config.actionID]['data'] = JSON.stringify(response['get'].data);
                              }
                              resolve(response[config.actionID]);
                          }
                          else {
                              resolve();
                          }

                      }
                  });
              });


              return promise;
          };

          return A;
        });