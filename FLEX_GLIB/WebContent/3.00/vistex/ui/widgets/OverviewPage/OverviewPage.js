
sap.ui.define(["sap/ui/core/Control",
	"sap/ovp/ui/EasyScanLayout",
	"./control/GenericCardControl",
	"./control/vcharts",
vistexConfig.rootFolder + "/ui/core/global"],
	function (control, easyScanLayout, GenericCardControl, VUICharts, global) {
	    var A = control.extend(vistexConfig.rootFolder + ".ui.widgets.OverviewPage.OverviewPage", {
	        metadata: {
	            properties: {
	                controller: {
	                    type: "object",
	                    defaultValue: null
	                },
	                modelName: {
	                    type: "string",
	                    defaultValue: null
	                },
	            },
	            aggregations: {
	                content: {
	                    type: 'sap.ui.core.Control',
	                    multiple: false
	                }
	            },
	            events: {
	                onNavigate: {}
	            }
	        },
	        renderer: function (oRm, oControl) {
	            //	        	oControl.addStyleClass("floorPlan")
	            oRm.write("<div");
	            oRm.writeControlData(oControl);
	            oRm.write('>');
	            oRm.renderControl(oControl.getContent());
	            oRm.write("</div>");
	        }
	    });

	    A.prototype.setModelName = function (value) {
	        this.setProperty("modelName", value, true);
	    };

	    A.prototype.renderPageContent = function () {
	        var oControl = this;
	        global.vui5.ovpControl = oControl;
	        var oDATAModel = new sap.ui.model.json.JSONModel();

	        var model = oControl.getModel(oControl.getController().modelName)
	        var oData = model.getProperty("/DATA/OVP");

	        if (oData) {
	            oData = JSON.parse(oData);
	        }

	        if (oData) {
	            oDATAModel.setData(oData.data);

	            var aCards = oControl.createCards(oData.metadata);

	            var fnLoaded = function (oView) {
	                oControl.setModel(oDATAModel, "data");

	                oDATAModel.setProperty("/metadata", oData.metadata);

	                oView.addStyleClass("overview ovpApplication sapFDynamicPageContentWrapper");
	                oView.getContent()[0].addStyleClass("sapFDynamicPageContent");
	                oControl.setAggregation("content", oView);
	            };

	            oControl.getJSONView(aCards, fnLoaded);
	        }
	    };

	    A.prototype.createCards = function (oData) {
	        var oControl = this;
	        var aCards = [];
	        for (var i = 0; i < oData.length; i++) {
	            var oCard = {
	                "Type": vistexConfig.rootFolder + ".ui.widgets.OverviewPage.control.GenericCardControl",
	                "title": oData[i].title,
	                "subtitle": oData[i].subtitle,
	                "content": oData[i].CardContent,
	                "showHeader": oData[i].showHeader,
	                "cardSize": oData[i].cardSize,
	                "dataSize": oData[i].dataSize,
	            };

	            
	            if ((oData[i].CardContent.Type == "sap.m.Table" || oData[i].CardContent.Type == "sap.m.List")
	            	&& oData[i].actions) {
	                if (oData[i].actions.event == "press") {
	                    oCard.content.itemPress = oControl.onItemPress;
	                }
	            } else {

	                function getObject(theObject, key, value) {
	                    var result = null;
	                    if (theObject instanceof Array) {
	                        for (var i = 0; i < theObject.length; i++) {
	                            result = getObject(theObject[i], key, value);
	                            if (result) {
	                                break;
	                            }
	                        }
	                    }
	                    else {
	                        for (var prop in theObject) {
	                            console.log(prop + ': ' + theObject[prop]);
	                            if (prop == key) {
	                                if (theObject[prop] == value) {
	                                    return theObject;
	                                }
	                            }
	                            if (theObject[prop] instanceof Object || theObject[prop] instanceof Array) {
	                                result = getObject(theObject[prop], key, value);
	                                if (result) {
	                                    break;
	                                }
	                            }
	                        }
	                    }
	                    return result;
	                }


	                var object = getObject(oCard.content, "Type", vistexConfig.rootFolder + ".ui.widgets.OverviewPage.VCharts");
	                if (object) {
	                    object.onNavigate = oControl.onChartNavigate;
	                }


	            }


	            aCards.push(oCard);
	        }

	        return aCards;
	    };

	    A.prototype.onItemPress = function (oEvent) {
	        var oControl = this, actionObject, urlParams = {}, objConfig;
	        var oItem = oEvent.getParameter("listItem") || oEvent.getSource();
	        var sPath = oItem.getBindingContextPath();
	        var oDataModel = oControl.getModel("data");
	        var oSelectedData = oDataModel.getProperty(sPath);
	        var aStr = oEvent.getSource().getId().split("--");
	        var cardID = aStr[aStr.length - 1];
	        var cardMetdata = global.vui5.ovpControl.findCardMetadata(cardID);

	        urlParams[global.vui5.cons.params.cardID] = cardID;
	        urlParams[global.vui5.cons.params.selectedRow] = oSelectedData['ROW_ID'];

	        actionObject = {
	            "FNCNM": cardMetdata['actions']['action'],
	            "RQTYP": global.vui5.cons.reqTypeValue.post,
	            "ACTYP": global.vui5.cons.actionType.pageNavigation,
	            hideLoader: false
	        };

	        objConfig = {
	            method: actionObject['RQTYP'] === global.vui5.cons.reqTypeValue.post ? global.vui5.cons.reqType.post : global.vui5.cons.reqType.get,
	            action: actionObject['FNCNM'],
	            actionRef: actionObject,
	            context: 'overviewPage',
	            hideLoader: !!actionObject.hideLoader,
	            urlParams: urlParams
	        };
	        global.vui5.ovpControl.fireOnNavigate({
	            objConfig: objConfig
	        });
	    };

	    A.prototype.onChartNavigate = function (oEvent) {
	        var oControl = this, actionObject, objConfig, urlParams;
	        var aStr = oEvent.getSource().getParent().getId().split("--");
	        var cardID = aStr[aStr.length - 1];
	        var cardMetdata = global.vui5.ovpControl.findCardMetadata(cardID);

	        actionObject = {
	            "FNCNM": cardMetdata['actions']['action'],
	            "RQTYP": global.vui5.cons.reqTypeValue.post,
	            "ACTYP": global.vui5.cons.actionType.pageNavigation,
	            hideLoader: false
	        };

	        urlParams = oEvent.getParameter("params");
	        urlParams[global.vui5.cons.params.cardID] = cardID;
	        objConfig = {
	            method: actionObject['RQTYP'] === global.vui5.cons.reqTypeValue.post ? global.vui5.cons.reqType.post : global.vui5.cons.reqType.get,
	            action: actionObject['FNCNM'],
	            actionRef: actionObject,
	            context: 'overviewPage',
	            hideLoader: !!actionObject.hideLoader,
	            urlParams: oEvent.getParameter("params")
	        };

	        global.vui5.ovpControl.fireOnNavigate({
	            objConfig: objConfig
	        });

	    };

	    A.prototype.findCardMetadata = function (id) {
	        var oControl = this;
	        var oDataModel = oControl.getModel("data");
	        var metadata = oDataModel.getProperty("/metadata");
	        var requestedMetadata = {};
	        for (var i = 0; i < metadata.length; i++) {
	            if (metadata[i].CardContent.id == id) {
	                requestedMetadata = metadata[i];
	                break;
	            }
	        }

	        return requestedMetadata;
	    };

	    A.prototype.getJSONView = function (aCards, fnLoaded) {
	        var oControl = this;
	        var oJSON = {
	            "Type": "sap.ui.core.mvc.JSONView",
	            "controllerName": vistexConfig.rootFolder + ".ui.widgets.OverviewPage.controller.ovp",
	            "content": [{
	                "Type": "sap.ovp.ui.EasyScanLayout",
	                "dragAndDropEnabled": true,
	                "content": aCards
	            }]
	        };

	        sap.ui.core.Component.getOwnerComponentFor(oControl.getController().getView()).runAsOwner(function () {

	            sap.ui.view({
	                async: true,
	                type: sap.ui.core.mvc.ViewType.JSON,
	                viewContent: oJSON
	            }).loaded().then(function (oView) {
	                if (fnLoaded) {
	                    fnLoaded(oView);
	                }
	            });
	        });
	    };

	    return A;
	});