sap.ui.define([ "sap/ui/core/Control",
	'vistex/ui/core/global',
	'vistex/ui/core/underscore-min'
], function(control, global, underscoreJS) {
	var R = control.extend(vistexConfig.rootFolder + ".ui.controls.TilesGroup", {
		metadata : {
			properties : {
				controller : {
					type : "object",
					defaultValue : null
				},

				dataPath : {
					type : "string",
					defaultValue : null
				},

				groupBy : {
					type : "string",
					defaultValue : null
				},

				showPopover : {
					type : "string",
					defaultValue : ""
				}
			},

			events : {
				tileClick : {
					parameters : {
						selectionSet : {
							type : "sap.ui.core.Control[]"
						}
					}
				}
			},

			aggregations : {
				_toolbar : {
					type : "sap.m.OverflowToolbar",
					multiple : false,
					visibility : "hidden"
				},

				_content : {
					type : "sap.ui.core.Control",
					multiple : false,
					visibility : "hidden"
				}
			}
		},

		init : function() {
			var model = new sap.ui.model.json.JSONModel();
			var sLocale = sap.ui.getCore().getConfiguration().getLanguage();
			if (sLocale.length > 2) {
				sLocale = sLocale.substring(0, 2);
			}
			
			var data = {
				"GROUPS" : "",
				"TILEDATA" : ""
			};

			model.setData(data);
			this.setModel(model, "roModel");
			this._oBundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls");

		},

		renderer : function(oRM, oControl) {
			oRM.write("<div");
			oRM.writeControlData(oControl);
			oRM.write(">");
			oRM.renderControl(oControl.getAggregation("_toolbar"));
			oRM.renderControl(oControl.getAggregation("_content"));
			oRM.write("</div>");
		}
	});

	R.prototype.tilesInfocusSet = function() {
		var oControl = this;
		var oController = oControl.getController();
		var oToolbar,
			sectionId;

		var model = oController.getModel(oController.modelName);
		var dataPath = oControl.getDataPath();
		var data = model.getProperty(dataPath);

		oControl.sectionData = oController.sectionData;

		var headerAttr = underscoreJS.findWhere(oControl.sectionData.ATTRB, {
			"NAME" : global.vui5.cons.attributes.header
		});
		var subHeaderAttr = underscoreJS.findWhere(oControl.sectionData.ATTRB, {
			"NAME" : global.vui5.cons.attributes.subHeader
		});
		var footerAttr = underscoreJS.findWhere(oControl.sectionData.ATTRB, {
			"NAME" : global.vui5.cons.attributes.footer
		});
		var contentType = underscoreJS.findWhere(oControl.sectionData.ATTRB, {
			"NAME" : global.vui5.cons.attributes.contentType
		});
		var contentAttr = underscoreJS.findWhere(oControl.sectionData.ATTRB, {
			"NAME" : global.vui5.cons.attributes.content
		});
		var iconAttr = underscoreJS.findWhere(oControl.sectionData.ATTRB, {
			"NAME" : global.vui5.cons.attributes.icon
		});
		var unitAttr = underscoreJS.findWhere(oControl.sectionData.ATTRB, {
			"NAME" : global.vui5.cons.attributes.unit
		});

		if (data == undefined)
			{
			data = [];
			}

		var groupBy = oControl.getGroupBy();
		var tileData = [];

		underscoreJS.each(data, function(obj) {
			var group = underscoreJS.findWhere(tileData, {
				"GROUP" : obj[groupBy]
			});
			var tiles = underscoreJS.filter(data, function(o) {
				return o[groupBy] == obj[groupBy];
			});
			if (group == undefined) {
				tileData.push({
					"GROUP" : obj[groupBy],
					"TILES" : tiles
				});
			} else {
				group["TILES"] = tiles;
			}
		});

		var roModel = oControl.getModel("roModel");
		roModel.setProperty("/TILEDATA", tileData);

		var oLayout = new sap.ui.layout.VerticalLayout();

		oLayout.bindAggregation("content", "roModel>/TILEDATA", function(sId, oContext) {

			var object = oContext.getObject();

			var oPanel = new sap.m.Panel({
				headerText : object['GROUP'],
				expandAnimation : false,
				backgroundDesign : sap.m.BackgroundDesign.Transparent
			});

			var dataPath = oContext.sPath + "/TILES";

			oPanel.bindAggregation("content", "roModel>" + dataPath, function(sId, context) {
				var tileObject = context.getObject();

				var tileItem = new sap.m.GenericTile({
					press : function(oEvt) {
						oControl.fireTileClick({
							"tileData" : oEvt.getSource().data('tileData')
						});

					}
				}).addStyleClass("sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout").data("tileData", tileObject);

				if (headerAttr) {
					tileItem.setHeader(tileObject[headerAttr["VALUE"]]);
				}
				if (subHeaderAttr) {
					tileItem.setSubheader(tileObject[subHeaderAttr["VALUE"]]);
				}
				//        if(iconAttr){
				//          tileItem.setIcon(tileObject[iconAttr["VALUE"]]);
				//        }

				var tileContent = new sap.m.TileContent();

				var contentData;

				if (contentType) {
					switch (contentType['VALUE']) {
					case global.vui5.cons.tileContentType.numeric:
						var contentData = new sap.m.NumericContent({
							value : tileObject[contentAttr["VALUE"]]
						});
						if (iconAttr) {
							contentData.setIcon(tileObject[iconAttr["VALUE"]]);
						}
						break;
					case global.vui5.cons.tileContentType.image:
						var contentData = new sap.m.ImageContent({
							value : tileObject[contentAttr["VALUE"]]
						});
						break;
					}
				}
				tileContent.setContent(contentData);

				if (footerAttr['VALUE']) {
					tileContent.setFooter(tileObject[footerAttr["VALUE"]]);
				}
				if (unitAttr['VALUE']) {
					tileContent.setUnit(tileObject[unitAttr["VALUE"]]);
				}

				tileItem.addTileContent(tileContent);

				return tileItem;
			});

			return oPanel;

		});

		oControl.setAggregation("_content", oLayout);

		oToolbar = new sap.m.OverflowToolbar({
			visible : "{= ${mainModel>/DOCUMENT_MODE} !== 'A' }"
		});

		sectionId = oController.sectionData['SECTN'];

		//    underscoreJS.each(oController.sectionData.FUNC, function (object) {
		//            oButtonControl = oController._prepareButtonControl(object, sectionID);
		//            oToolbar.addToolBarButton(oButtonControl);
		//        });

		this.setAggregation("_toolbar", oToolbar);

	};

	R.prototype.setController = function(value) {
		this.setProperty("controller", value, true);
	}

	R.prototype.setDataPath = function(value) {
		this.setProperty("dataPath", value, true);
	};

	R.prototype.setGroupBy = function(value) {
		this.setProperty("groupBy", value, true);
	};

	R.prototype.setShowPopover = function(value) {
		this.setProperty("showPopover", value, true);
	};

	return R;

}, true);