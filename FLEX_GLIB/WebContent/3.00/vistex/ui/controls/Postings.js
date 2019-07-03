sap.ui.define([
    "sap/ui/core/Control",
    vistexConfig.rootFolder + "/ui/core/global",
    vistexConfig.rootFolder + "/ui/core/underscore-min"
], function(control,global,underscoreJS) {
    var A = control.extend(vistexConfig.rootFolder + ".ui.controls.Postings", {
        metadata: {
            properties: {
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

              enableTriggerCreate: {
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

                triggerCreate: {

                },
                
                triggerClick:{


                },
                postingCreate:{}

            },
            aggregations: {
                _getPostingsPanel: {
                    type: "sap.m.Panel",
                    multiple: false,
                    visibility: "hidden"
                }
               
            }
        },
        init: function() {
          var oControl  = this;
          var id;
          var cells = [];
          var moreCell;
           
            var oRows = [];
            oControl.docs  = [];
            var morecount = 0;
            var buttonCount = 1;
            var documentFound;
            var editionToolbar;
            var button;

           oControl.totalPanel = new sap.m.Panel({
              expandable:false,
              expanded:false,
              content:[]
           	}).addStyleClass("mainPanel").addStyleClass("sapUiSizeCompact");
           

           oControl.setAggregation("_getPostingsPanel", oControl.totalPanel);
           
        },

        
        renderer: function(oRM, oControl) {
          oRM.write("<style>");
          oRM.write(".outcomesList, .reviewList{padding: 0px !important;}");
          oRM.write(".reviewCell{padding-top: 10px !important;}");
          oRM.write(".reviewLabel{font-size: small !important; padding-right: 5px !important; color: gray !important;}");
          oRM.write(".reviewValue{font-size: small; !important}");
         // oRM.write(".poTile >.sapUiRespGridSpanL3.sapUiRespGridSpanM4.sapUiRespGridSpanS6.sapUiRespGridSpanXL3{");
          oRM.write(".poTile .sapUiRespGridSpanL3.sapUiRespGridSpanM4.sapUiRespGridSpanS6.sapUiRespGridSpanXL3{");
          oRM.write("-moz-box-shadow: rgba(0,0,0,0.55) 0px 0px 10px !important;");
          oRM.write("-webkit-box-shadow: rgba(0,0,0,0.55) 0px 0px 10px !important;");
          oRM.write("box-shadow: rgba(0,0,0,0.55) 0px 0px 10px !important;");
          oRM.write("border-radius: 4px !important;");
          oRM.write("margin-left: 10px !important");
          oRM.write("height: 167px !important;");
          oRM.write("}");
          oRM.write(".postingDocument{");
          oRM.write("padding-left:30px;");
          oRM.write("}");
          oRM.write(".postingCreate{");
          oRM.write("float:right !important;");
          oRM.write("padding-right: 6px;");
          oRM.write("padding-bottom: 15px;");
          oRM.write("margin-top:-21px!important;");
          oRM.write("}");
          oRM.write(".postingGrid{");
          oRM.write("border-top: 1px solid rgb(229, 229, 229) !important;");
          oRM.write("}");
          oRM.write(".postingCell{");
          oRM.write("width:200px;");
          oRM.write("}");
          oRM.write(".postingItem{");
          oRM.write("height:5rem !important;");
          oRM.write("}");
          oRM.write(".postingTitle{");
          oRM.write("font-size:1rem !important;");
          oRM.write("margin-top:7px !important;");
          oRM.write("}");
          oRM.write(".postingCount{");
          oRM.write("color:green !important;");
          oRM.write("font-size:2rem !important;");
          oRM.write("float:right !important;");
          oRM.write("margin-right:6px !important;");
          oRM.write("}");
          oRM.write(".postingCustomList{");
          oRM.write("border-top: 1px solid rgb(229, 229, 229) !important;");
          oRM.write("height: auto !important;");
          oRM.write("min-height:150px !important;");
          oRM.write("}");
          oRM.write(".panelBorderBackground .sapMPanelWrappingDiv {");
          oRM.write("background: rgb(222,239,242);");
          oRM.write("border: 1px solid #D5E9EC;");
          oRM.write("}");
          oRM.write(".panelBorderBackground .sapMPanelContent {");
          oRM.write("border: 1px solid #D5E9EC;");
          oRM.write("}");
          oRM.write(".postingTitle > .sapMFlexItem{");
          oRM.write("left:1px");
          oRM.write("}");
          oRM.write(".postingTitle > div > .sapMLabel{");
          oRM.write("white-space:pre-wrap;");
          oRM.write("}");
          oRM.write(".flexLeft > .sapMFlexItem {");
          oRM.write("left:29px");
          oRM.write("}");
          oRM.write("</style>");
          oRM.write("<div");
          oRM.writeControlData(oControl);
          oRM.write(">");
          oRM.renderControl(oControl.getAggregation("_getPostingsPanel"));
         
          oRM.write("</div>");
        }
    });

    A.prototype.setModelName = function(value) {
      this.setProperty("modelName",value,true);
    };

    A.prototype.setDataPath = function(value) {
      this.setProperty("dataPath",value,true);
    };

    A.prototype.setEnableTriggerCreate = function(value) {
      this.setProperty("enableTriggerCreate",value,true);
    };

    A.prototype.setEditable = function(value) {
      this.setProperty("editable",value,true);
    };

    A.prototype.postingInfocusSet = function() {
       var oControl = this,documentFound,buttonCount,morecount;
       var oController = this.getProperty("controller");
       var modelName = this.getProperty("modelName");
       var model = oController.getModel(modelName);
       var stageDetails = model.getProperty('/DATA/PO/STAGES');
       if(stageDetails != undefined){
       oControl.totalPanel.removeAllContent();
       for (var z = 0; z < stageDetails.length; z++) {
          var  cells = [];

           var postings = stageDetails[z].STEPS;
           var oRows = [];
           var oTitle = [];
           var oPostingTitle, oPostingCount;

           for (i = 0; i < postings.length; i++) {

              documentFound = '';
              buttonCount = 1;
               var oLayout = new sap.m.FlexBox({  direction: "Column"});

               var postingTitleLayout = new sap.m.FlexBox({
                   items: [
                       new sap.m.Label({
                           design: sap.m.LabelDesign.Bold,
                           text: postings[i].DESCR

                       })
                   ]

               }).addStyleClass('postingTitle');

               var postingCountLayout = new sap.m.FlexBox({
                   direction:"RowReverse",
                   items: [

                       new sap.m.Text({

                           text: postings[i].COUNT

                       }).addStyleClass("postingCount")
                   ]
               })

               var count = 0;
               morecount = 0;

               var documentNumbers = model.getProperty('/DATA/PO/STEPS');
               if(documentNumbers != undefined){
               for (j = 0; j < documentNumbers.length; j++) {
                   if (documentNumbers[j].AYNUM == postings[i].AYNUM) {

                       documentFound = 'X';
                       count = count + 1;

                       if (count <= 3) {
                           var document = new sap.m.Link({

                               text: documentNumbers[j].DOCNO,
                               press: [oControl.onPostingDocumentClick, oControl]

                           }).data({

                               "PAGE": documentNumbers[j].PAGE,
                               "APP": documentNumbers[j].APP,
                               "DOCNO":documentNumbers[j].DOCNO,
                               "CLASS":documentNumbers[j].CLASS
                           }).addStyleClass('postingDocument')

                           oLayout.addItem(document);
                       } else {

                           morecount = morecount + 1;

                           oControl.docs.push({
                               "DOCNO": documentNumbers[j].DOCNO,
                               "AYNUM": postings[i].AYNUM
                           });
                       }

                   } else {
                       continue;
                   }
               }
               }

               if (postings[i].COUNT == 1) {

                   for (k = 0; k < 3; k++) {
                       var document = new sap.m.Link({
                           text: ""
                       })

                       oLayout.addItem(document);
                   }


               } else if (postings[i].COUNT == 2) {


                   for (k = 0; k < 2; k++) {
                       var document = new sap.m.Link({

                           text: ""


                       })

                       oLayout.addItem(document);

                   }



               } else if (postings[i].COUNT == 3) {



                   for (k = 0; k < 1; k++) {
                       var document = new sap.m.Link({

                           text: ""


                       })

                       oLayout.addItem(document);
                   }


               }

               if (documentFound != 'X') {

                   for (k = 0; k < 4; k++) {
                       var document = new sap.m.Link({

                           text: ""


                       })

                       oLayout.addItem(document);
                   }


               }

               if (morecount > 0) {



                   moreCell = new sap.ui.commons.layout.MatrixLayoutCell({
                       padding: sap.ui.commons.layout.Padding.Both,
                       hAlign: sap.ui.commons.layout.HAlign.Left,

                       content: [
                           new sap.m.Link({
                               text: morecount + " " + " " + "More",
                               press: [oControl.onPostingClick, oControl]

                           }).data({
                               //
                               "AYNUM": postings[i].AYNUM,
                               "COUNT": morecount,


                           }).addStyleClass('postingDocument')
                       ]

                   });



                   var createCell = new sap.ui.core.Icon({
                       src: "sap-icon://document-text",
                       color: "#8875E7",
                       visible : true,
                      // visible: {
                      //     path: oController.modelName + '>/VISIBLEEDITION',
                      //     formatter: function(val) {

                      //         if (val == "" || val == "undefined")
                      //             return true;
                      //         else
                      //             return false;
                      //     }
                      // },
                       size: "23px",
                       press: [oControl._onPostingCreate, oControl]
                   }).data({
                       "AYNUM": postings[i].AYNUM
                   }).addStyleClass('postingCreate')


                   var oLayout1 = new sap.m.FlexBox({
                       justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                       alignContent: sap.m.FlexAlignContent.Start,
                       items: [
                           new sap.m.Link({
                               text: morecount + " " + " " + "More",
                               press: [oControl.onPostingClick, oControl]

                           }).data({

                               "AYNUM": postings[i].AYNUM,
                               "COUNT": morecount,


                           }).addStyleClass('postingDocument'),
                           createCell
                       ]

                   })


               } else {




                   createCell = new sap.ui.core.Icon({
                       src: "sap-icon://document-text",
                       color: "#8875E7",
                       visible : true,
                       //visible: {
                       //    path: oController.modelName + '>/VISIBLEEDITION',
                       //    formatter: function(val) {
                       //        if (val == "" || val == "undefined")
                       //            return true;
                       //        else
                       //            return false;
                       //    }
                      // },
                       size: "23px",
                       press: [oControl._onPostingCreate, oControl]
                   }).data({
                       "AYNUM": postings[i].AYNUM
                   }).addStyleClass('postingCreate');

                   var oLayout1 = new sap.m.FlexBox({
                       justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                       alignContent: sap.m.FlexAlignContent.Start,
                       items: [
                           new sap.m.Link({

                               text: ""


                           }),
                           createCell
                       ]

                   });
               }



               var listItem = new sap.m.CustomListItem({
                   type: sap.m.ListType.Inactive,

                   vAlign: "Middle",
                   content: [postingTitleLayout, postingCountLayout, oLayout, oLayout1, createCell]
               }).data({
                   "AYNUM": postings[i].AYNUM
               }).addStyleClass("postingCustomList");



               cells.push(listItem);




           }



           var oPostingsGrid = new sap.ui.layout.Grid({
               defaultSpan: "L3 M4 S6",
               content: cells

           }).addStyleClass('poTile')




           var oPostingsPanel = new sap.m.Panel({
                   headerText: stageDetails[z].STG_NAME,
                   expandable: true,
                   expanded: true,
                   backgroundDesign: sap.m.BackgroundDesign.Solid,
                   content: oPostingsGrid


               }).addStyleClass("panelBorderBackground")

               .addStyleClass("sapUiSizeCompact");

           oPostingsPanel.addContent(oPostingsGrid);

           oControl.totalPanel.addContent(oPostingsPanel);
          // totalPanel.addContent(oPostingsPanel);

       }
      // return totalPanel;
       }
    };
    A.prototype._onPostingCreate = function(oEvent){
    	var oControl = this;
    	oControl.firePostingCreate({
            aynum: oEvent.getSource().getCustomData()[0].getValue()
    	});
    }
    A.prototype.onPostingDocumentClick = function(oEvent) {
       var oControl = this;
       var oController = this.getProperty("controller");
       var rowPath = oEvent.getSource().getParent().getBindingContext(oControl.getModelName());
      // var rowdata = oControl.getModel(oControl.getModelName()).getProperty(rowPath.sPath);
       var params = {};

       params['DOCNO'] = oEvent.getSource().data("DOCNO");
       params['APPLN'] = oEvent.getSource().data("APP");
       params['CLASS'] = oEvent.getSource().data("CLASS");
     //  params[global.vui5.cons.params.fieldName] = oEvent.getSource().data("fieldname") || "";
       oControl.fireTriggerClick({
          'urlParams': params,
          'fieldInfo': {
                       "FLEVT": 'NAVIGATE',
                       }

     //  params[global.vui5.cons.params.selectedRow] = rowdata['ROWID'] || oEvent.getSource().getText();
     //  params[global.vui5.cons.params.fieldName] = oEvent.getSource().data("fieldname") || "";
     //  oControl.firetriggerClick({
     //     'urlParams': params,
     //     'fieldInfo': oEvent.getSource().data("fieldInfo")
       });
    };

    A.prototype.onPostingClick = function(oEvent) {
      var oControl = this;
      var cells = [];
      var numbersExist = [];
      var aynum = oEvent.getSource().getCustomData()[0].getValue();
      var morecount = oEvent.getSource().getCustomData()[1].getValue();
      var oController = this.getProperty("controller");
      var modelName = this.getProperty("modelName");
      var model = oController.getModel(modelName);
      var documentNumbers = model.getProperty('/DATA/PO/STEPS');;
     // var infocusModel = oControl.getModel(oController.modelName);
     // var documentNumbers = infocusModel.getProperty("/POSTINGDOCUMENTS");
     for (i = 0; i < oControl.docs.length; i++) {
         if(oControl.docs[i].AYNUM == aynum){
           var number = underscoreJS.findWhere(documentNumbers, {
                DOCNO: oControl.docs[i].DOCNO,
                AYNUM: oControl.docs[i].AYNUM
             });
           var listItem = new sap.m.StandardListItem({
               title: oControl.docs[i].DOCNO,
               type: sap.m.ListType.Active,
               press: [oControl.onPostingDocumentClick, oControl]
               }).data({
                  "PAGE": number.PAGE,
                  "APP": number.APP,
                  "CLASS":number.CLASS,
                  "DOCNO":number.DOCNO,
                  "AYNUM": aynum
                  })
                  cells.push(listItem);
            }
          }
          var page = new sap.m.Page({
             title: "Documents",
           content: cells,
            footer: [
                     new sap.m.Bar({
                        contentRight: []
                    })
                    ]
            });
            var navContainer = new sap.m.NavContainer({
                pages: page
            });
            var popover = new sap.m.Popover({
                content: page,
                showHeader: false,
                contentWidth: "250px",
                contentHeight: "350px",
                placement: sap.m.PlacementType.Right
            });
            popover.openBy(oEvent.getSource());

    };

   
});