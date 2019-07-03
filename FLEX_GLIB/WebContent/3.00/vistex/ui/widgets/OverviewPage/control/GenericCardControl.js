sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/Control"
], function (jQuery, Control) {
    "use strict";

    /**
     * Creates the GenericCardControl
     *
     *
     * @class GenericCardControl
     * @param {object} mProperties
     *
     * @author DRAKSHIT
     * @version 2.0
     *
     * @constructor
     * @public
     * @name vistex.ui.widgets.OVP.control.GenericCardControl
     *
     */

    return Control.extend(vistexConfig.rootFolder + ".ui.widgets.OverviewPage.control.GenericCardControl", {
        metadata: {
            properties: {
                showHeader: {
                    type: 'boolean',
                    defaultValue: true
                },
                showFooter: {
                    type: 'boolean',
                    defaultValue: true
                },
                contentMargin: {
                    type: 'boolean',
                    defaultValue: false
                },
                title: 'string',
                subtitle: 'string',
                enableFilters: {
                    type: 'boolean',
                    defaultValue: false
                },
                cardSize: {
					type: "string",
                    defaultValue: 0
                },
                dataSize: {
					type: "string",
                    defaultValue: 0
                }
            },
            aggregations: {
                content: {
                    type: 'sap.ui.core.Control',
                    multiple: false
                },
                headerLeftContent: {
                    type: 'sap.m.ComboBox',
                    multiple: true
                }
            }
        },

        init: function () {
            this._oToolbar = new sap.m.Toolbar({
                style: "Clear"
            });
            
            this._oBundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.widgets.OverviewPage");
        },

        renderer: function (oRm, oControl) {
            var oTitle = new sap.m.Text({
                    text: oControl.getTitle()
                }),
                oSubtitle = new sap.m.Text({
                    text: oControl.getSubtitle()
                }),
                oHeader = new sap.m.VBox({
                    items: [
                        new sap.m.FlexBox({
                            items: [oTitle]
                        }),
                        new sap.m.FlexBox({
                            items: [oSubtitle]
                        })
                    ]
                });
            
            var oFooter = new sap.m.FlexBox({
				alignItems: "Start",
				justifyContent: "SpaceBetween"
			});

            oTitle.addStyleClass('sapOvpCardTitle');
            oSubtitle.addStyleClass('sapOvpCardSubtitle');
            oHeader.addStyleClass('sapOvpCardHeader');
            oFooter.addStyleClass('sapOvpCardFooter');

            if(parseInt(oControl.getCardSize()) > 0 && parseInt(oControl.getDataSize()) > 0 &&
            		parseInt(oControl.getCardSize()) !== parseInt(oControl.getDataSize())){
            	var oText = new sap.m.Text({
					text: oControl._oBundle.getText("Showing") + " " + oControl.getCardSize().replace(/^0+/, '') + " of " + oControl.getDataSize().replace(/^0+/, '')
				});
            	oFooter.addItem(oText);
            }else{
            	oFooter.setVisible(false);
            }
            
            
            oRm.write("<div ");
            oRm.addClass(vistexConfig.rootFolder + "-generic-card");
            oRm.addClass("sapOvpBaseCard");
            oRm.writeClasses();
            // oRm.addStyle("width", "20rem");
            oRm.writeStyles();

            oRm.writeControlData(oControl);
            oRm.write('>');
            if (oControl.getShowHeader()) {
                oRm.renderControl(oHeader);
            }

            if (oControl.getEnableFilters() || oControl.getHeaderLeftContent()) {
                // oRm.renderControl(oControl._addHeaderContent(oControl));
            }

            oRm.write("<div ");
            oRm.addClass(vistexConfig.rootFolder + "-generic-card-content");
            oRm.writeClasses();

            oRm.write('>');
            oRm.write("<div ");
            if (oControl.getContentMargin()) {
                oRm.addClass(vistexConfig.rootFolder + "-generic-card-item-margin");
                oRm.writeClasses();
            }
            oRm.write('>');

            oRm.renderControl(oControl.getContent());
            oRm.write('</div>');

            oRm.write('</div>');
            
            if (oControl.getShowFooter()) {				
				oRm.renderControl(oFooter);
			}
            
            oRm.write('</div>');
        },

        _addHeaderContent: function (oControl) {
            this._oToolbar.destroyContent();

            var oHeaderLeftContent = oControl.mAggregations["headerLeftContent"];
            if (oHeaderLeftContent) {
                this._oToolbar.addContent(oHeaderLeftContent.addStyleClass("sapUiSmallMarginBegin"));
            }

            if (oControl.getEnableFilters()) {
                this._oToolbar.addContent(new sap.m.ToolbarSpacer());
                this._oToolbar.addContent(new sap.ui.core.Icon({
                    src: "sap-icon://filter"
                }).addStyleClass("sapUiSmallMarginEnd"));
            }

            return this._oToolbar;
        }
    });
});