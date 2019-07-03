sap.ui.define([
  "sap/ui/model/json/JSONModel",
  "sap/ui/comp/valuehelpdialog/ValueHelpDialog",
  vistexConfig.rootFolder + "/ui/core/global",
  vistexConfig.rootFolder + "/ui/core/underscore-min",
  vistexConfig.rootFolder + "/ui/core/Formatter",
  'sap/m/DialogRenderer'
], function(JSONModel,valueHelpDialog, global, underscoreJS, Formatter,DialogRenderer) {
  var I = valueHelpDialog.extend(vistexConfig.rootFolder + ".ui.controls.InputHelp", {
	  metadata : {
	      properties : {	        
	    	//*****Rel 60E_SP6 - Sanofi Req
	    	controller: {
              type: "object",
              defaultValue: null
            },
            //*****
	    	modelName:{
		      type : "string",	
			  defaultValue : null
		    },
	        fieldInfo : {
	          type : "object",
	          defaultValue : null
	        },
	        fieldID:{
	        	type : "string",	
		        defaultValue : null
	        },
	        rowId:{
	        	type : "string",
		        defaultValue : null
	        },
	        dataArea :{
	        	type : "string",
		        defaultValue : null
	        },
	        typeAheadActive:{
	        	type : "boolean",
		        defaultValue : null
	        }
	      },
         events:{},
	      aggregations:{
	    	  _InputHelp : {
		          type : "sap.ui.core.Control",
		          multiple : false
		        }
	      }
	  },
	  init : function() {
		  valueHelpDialog.prototype.init.apply(this);
	      var oControl = this,inputHelpModel;
	      oControl._oBundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls");
	      inputHelpModel = new JSONModel();
	      inputHelpModel.loadData(jQuery.sap.getModulePath(vistexConfig.rootFolder + ".ui.controls") + "/model.json", "", false);
	      inputHelpModel.setSizeLimit(global.vui5.cons.maxDataLimit);
	      oControl.setModel(inputHelpModel,"inputHelpModel");
	      oControl.update = oControl.__vuiUpdate;
	      oControl.attachOk(this._onValueSelect.bind(this));
	      oControl.attachCancel(this._onCancel.bind(oControl));
	      /***Rel 60E SP6 ECIP #19732 - Start ***/
          oControl.currentSearchHelp = "";
          /***Rel 60E SP6 ECIP #19732 - End ***/

	     
	    },
	    renderer : function(oRM, oControl) {
	    	DialogRenderer.render(oRM, oControl);
	    }
	  });
	  I.prototype.setFieldInfo = function(object) {
	      this.setProperty('fieldInfo', object);
	      this.fieldInfo = object;
	  },
	  I.prototype.setFieldId = function(value) {
		 this.setProperty("fieldID", value, true);
	  };
	  I.prototype.setRowId = function(value) {
		 this.setProperty("rowId", value, true);
	  };
	  I.prototype.setModelName = function(value) {
			 this.setProperty("modelName", value, true);
      };
      I.prototype.setDataArea = function(value) {
 		 this.setProperty("dataArea", value, true);
 	  };
	  I.prototype.typeAheadActive = function(value) {
			 this.setProperty("typeAheadActive", value, true);
	  };
	  I.prototype._onCancel =  function () {
		  delete global.vui5.cons['inputHelpFieldInfo'];
          delete global.vui5.cons['controller']
	        this.close();
	  };
	  I.prototype.prepareInputHelpDialog= function(){
		  var oControl = this,mainModel,lv_multiselect,lv_supportRangesOnly,fieldInfo,model,inputHelp,filterBar;
		      mainModel = oControl.getModel(vui5.modelName);
		      fieldInfo = underscoreJS.clone(mainModel.getProperty("/INPUTHELP/"));
		      oControl.fieldInfo['SELECTED_SHLP'] = '';
//		      lv_multiselect = oControl.fieldInfo['MULTISELECT'] === "X";
//		      lv_supportRangesOnly = oControl.fieldInfo['SUPPORTRANGESONLY'] === true;
		      oControl.bindProperty("key","inputHelpModel>/INPUTHELP/RETURNFIELD",null,sap.ui.model.BindingMode.OneWay);
		      //*****Rel 60E_SP6 - Sanofi Req
		      if(oControl.getTokenDisplayBehaviour() === "DropDown Text" ||
		         oControl.getTokenDisplayBehaviour() === sap.ui.comp.smartfilterbar.DisplayBehaviour.idOnly) {
		    	  oControl.bindProperty("descriptionKey","inputHelpModel>/INPUTHELP/RETURNFIELD",sap.ui.model.BindingMode.OneWay);  
		      }		      
		      else {
		    	  oControl.bindProperty("descriptionKey","inputHelpModel>/INPUTHELP/DESCRFIELD",sap.ui.model.BindingMode.OneWay);
		      }
		      //*****
		      
		      oControl.oSelectionButton.attachPress(oControl._onSearchHelpButtonPress.bind(oControl));
		      oControl.oSelectionButton.setTooltip(oControl._oBundle.getText("SearchHelpList"));
		      model = new sap.ui.model.json.JSONModel();
		       setTimeout(function () {
		            var oEvent = new sap.ui.base.Event();
		            oControl._f4DataPrepare(oEvent);
		       });
	           filterBar = new sap.ui.comp.filterbar.FilterBar({
		            advancedMode: true,
		            filterBarExpanded: true,
		            showGoOnFB: !sap.ui.Device.system.phone,
		            search: oControl._onSearchValues.bind(oControl)
		       });
		        if (oControl.getSupportMultiselect()) {
		            var input = sap.ui.getCore().byId(oControl.getFieldID());
		            if (input != undefined) {
		            	 /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - Start ***/
		                var tokens = [], multiValuePath, arr, fieldName;
		                if (oControl._isMultiInputField(input)) {
		                    multiValuePath = oControl._getMultiInputDataPath(input);
		                    if (multiValuePath) {

		                        arr = multiValuePath.split("/");
		                        fieldName = arr[arr.length - 1];
		                        if (fieldName.indexOf("_TXT") !== -1) {
		                            multiValuePath = multiValuePath.replace(oControl.fieldInfo['TXTFL'] + vui5.cons.multiValueField, oControl.fieldInfo['FLDNAME'] + vui5.cons.multiValueField);
		                        }
		                    }

		                    underscoreJS.each(underscoreJS.pluck(oControl.getModel(oControl.getModelName()).getProperty(multiValuePath), "KEY"),
		                        function (keyValue) {
		                            tokens.push(new sap.m.Token({
		                                key: keyValue,
		                                text: keyValue
		                            }));
		                        });
		                }
		                else {
		                    tokens = input.getTokens();
		                }
		                
                      if (tokens) {
		                	underscoreJS.each(tokens,function(obj){
		                		if(obj.data('range')){
		                		  obj.setKey('');
		                		}
		                		obj.setTooltip(obj.getText());
		                	})
		                    oControl.setTokens(tokens);
		                }
		                /*var tokens = input.getTokens();
		                if (tokens) {
		                    oControl.setTokens(tokens);
		                }*/
		                /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - End ***/
		            }
		        }
	
		        if (filterBar.setBasicSearch) {
		            filterBar.setBasicSearch(new sap.m.SearchField({
		                showSearchButton: sap.ui.Device.system.phone,
		                placeholder: "Search",
		                liveChange: oControl._onFilterTable.bind(oControl)
		            }));
		        }
	
	
		        oControl.setFilterBar(filterBar);
	  };
	  /*Overwritten update method of sap.ui.comp.valuehelpdialog.ValueHelpDialog to support filter*/
	    I.prototype.__vuiUpdate = function () {
	        var i,j,r,o,d,e;
	            d = this._oSelectedItems.getItems();
	            e = {
	            tokenKeys: d,
	            useDefault: false
	        };
	        this._bIgnoreSelectionChange = true;
	        if (this._hasListeners("updateSelection")) {
	            this.fireUpdateSelection(e);
	        } else {
	            e.useDefault = true;
	        }
	        if (e.useDefault) {
	            if (sap.ui.table.Table && this._oTable instanceof sap.ui.table.Table) {
	                this.oRows = this._oTable.getBinding("rows");
	                this._oTable.clearSelection();
	                if (this.oRows.aKeys) {
	                    var k = this.getKeys();
	                    var R = k && k.length > 1 ? this.getKey() + "=" : "";
	                    for (j = 0; j < d.length; j++) {
	                        var K = d[j];
	                        var s = R + "'" + K + "'";
	                        for (i = 0; i < this.oRows.aKeys.length; i++) {
	                            var f = this.oRows.aKeys[i];
	                            var g = f === K;
	                            if (g || f.indexOf(s) >= 0) {
	                                if (!g) {
	                                    this._oSelectedItems.remove(K);
	                                    var t = this._getTokenByKey(K, this._oSelectedTokens);
	                                    if (t) {
	                                        t.setKey(f);
	                                    }
	                                }
	                                o = this._oTable.getContextByIndex(i);
	                                if (o) {
	                                    r = o.getObject();
	                                    this._oSelectedItems.add(f, r);
	                                }
	                                this._oTable.addSelectionInterval(i, i);
	                                break;
	                            }
	                        }
	                    }
	                } else {
	                    if (this.oRows.aIndices) {
	                        this._oTable.clearSelection();
	                        for (j = 0; j < d.length; j++) {
	                            var h = d[j];
	                            for (i = 0; i < this.oRows.aIndices.length; i++) {
	                                /*Changed Line*/
	                                //                              o = this._oTable.getContextByIndex(this.oRows.aIndices[i]);
	                                o = this._oTable.getContextByIndex(i);
	                                /**/
	                                if (o) {
	                                    r = o.getObject();
	                                    if (r[this.getKey()] === h) {
	                                        this._oSelectedItems.add(r[this.getKey()], r);
	                                        this._oTable.addSelectionInterval(i, i);
	                                        break;
	                                    }
	                                }
	                            }
	                        }
	                    }
	                }
	            } else {
	                var m = this._oTable;
	                for (j = 0; j < d.length; j++) {
	                    var K = d[j];
	                    for (i = 0; i < m.getItems().length; i++) {
	                        var n = m.getItems()[i];
	                        var p = n.getBindingContext().getObject();
	                        if (p[this.getKey()] === K) {
	                            m.setSelectedItem(n, true);
	                            break;
	                        }
	                    }
	                }
	            }
	        }
	        this._bIgnoreSelectionChange = false;
	        this._updateTitles();
	    };
	    I.prototype.checkFieldStatus = function () {
	        var filterItems = this.getFilterBar()._aBasicAreaSelection;
	        var error = false;
	        for (var i = 0; i < filterItems.length; i++) {
	            if (filterItems[i].control.getValueState() == sap.ui.core.ValueState.Error) {
	                filterItems[i].control.focus();
	                error = true;
	                break;
	            }
	        }
	        return error;
	    };
	    I.prototype.setFieldType = function (selection, fieldInfo) {

	        if (fieldInfo['INTTYPE'] == vui5.cons.intType.number ||
	            fieldInfo['INTTYPE'] == vui5.cons.intType.integer ||
	            fieldInfo['INTTYPE'] == vui5.cons.intType.oneByteInteger ||
	            fieldInfo['INTTYPE'] == vui5.cons.intType.twoByteInteger ||
	            fieldInfo['INTTYPE'] == vui5.cons.intType.packed ||
	            fieldInfo['INTTYPE'] == vui5.cons.intType.float ||
	            fieldInfo['INTTYPE'] == vui5.cons.intType.decimal16 ||
	            fieldInfo['INTTYPE'] == vui5.cons.intType.decimal32) {
	            selection.setType(sap.m.InputType.Number);
	        }
	    },

	    /*Collective Search Help Changes*/
	    I.prototype._onSearchHelpButtonPress = function (oEvent) {

	        if (!this._oSearchHelpPopover) {
	            this._oSearchHelpPopover = new sap.m.ResponsivePopover({
	                placement: sap.m.PlacementType.Bottom,
	                showHeader: false
	            });
	            this.addDependent(this._oSearchHelpPopover);
	        }

	        this._oSearchHelpPopover.removeAllContent();

	        var oList = new sap.m.SelectList({
	            selectionChange: [this._onSearchHelpSelect, this]
	        });

	        oList.bindItems("inputHelpModel>/INPUTHELP/SHLP_LIST", function (sid, oContext) {
	            var object = oContext.getObject();
	            return new sap.ui.core.Item({
	                text: object['TITLE'],
	                key: object['SHLPNAME']
	            });
	        });

	        oList.setSelectedKey(this.fieldInfo['SELECTED_SHLP']);

	        this._oSearchHelpPopover.addContent(oList);
	        this._oSearchHelpPopover.openBy(oEvent.getSource());
	    },

	    I.prototype._onSearchHelpSelect = function (oEvent) {
	        var source = oEvent.getSource(),searchFieldId,searchField;
	            this.fieldInfo['SELECTED_SHLP'] = source.getSelectedKey();
	            searchFieldId = this.getFilterBar().getBasicSearch();
	            searchField = sap.ui.getCore().byId(searchFieldId);
	            searchField.setValue("");
	           this._f4DataPrepare(oEvent);
	    };

	    I.prototype._onValueSelect = function (oEvent) {

	        var oControl = this,token,source;
	             delete global.vui5.cons['inputHelpFieldInfo'];
	             delete global.vui5.cons['controller'];
	            token = oEvent.getParameter("tokens")
	            source = sap.ui.getCore().byId(oControl.getFieldID());

	        //*****Rel 60E_SP6 - Sanofi Req
	        var oController,modelName, dataPath, controlModel;
	        var dappt = source.data("dappt");
	        oController = this.getController();
	        if(dappt && dappt === vui5.cons.propertyType.selections) {	          
	          modelName = source.data("model");
	          dataPath = source.data("dataPath");
	          controlModel = oController.getModel(modelName);	
	        }        
	        //*****
	            
	        if (oEvent.getSource().getSupportMultiselect()) {
	            /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - Start ***/
	            source.data("descrField", this.getModel("inputHelpModel").getProperty("/INPUTHELP/DESCRFIELD"));
	            /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - End ***/
	            //*****Rel 60E_SP7 - Version Upgrade Issue
	            source.setTokens(token);	
	           /* if(sap.ui.getVersionInfo().version < "1.58") {
	            	source.setTokens(token);	
	            }	            
	            else {
	            	source.removeAllTokens();
		            underscoreJS.each(token, function(obj,i){
		            	source.addToken(obj);
		            });
		            
		            debugger;
		            if(!oController.isVuiMultiInputField(source)){
		            	oController.onF4Select(oEvent,true,source);
		            }
		            	
	            }*/	            
	            //*****
	            //          oController.descriptionGet(source,token);
	        } else {
	        	
	        	var mainModel,model,descrField;
	        	    model = oControl.getModel("inputHelpModel");
	                descrField = model.getProperty("/INPUTHELP/DESCRFIELD");
	                mainModel = oControl.getModel(vui5.modelName);
	            /* Rel 60E_SP5 - Only for Evaluation Form*/
	            if (oControl.fieldInfo['RETURNTOKENSONLY']) {
	                source.setTokens(token);
	                source.fireChange();
	                oControl.close();
	                return;
	            } else {
	                /* Rel 60E_SP5 */
	                source.setValue(token[0].getKey());
	            }
	             
	            if (descrField != '') {
	                var descriptionBuffer = mainModel.getProperty("/DESCRIPTION_BUFFER");
	                var bufferEntry = underscoreJS.find(descriptionBuffer, {
	                    'FLDNAME': oControl.fieldInfo['FLDNAME'],
	                    'TABNAME': oControl.fieldInfo['TABNAME'],
	                    'FLDVAL': token[0].getKey()
	                });

	                if (bufferEntry) {
	                    bufferEntry['DESCRIPTION'] = token[0].data("row")[descrField];
	                } else {
	                    descriptionBuffer.push({
	                        'FLDNAME': oControl.fieldInfo['FLDNAME'],
	                        'TABNAME': oControl.fieldInfo['TABNAME'],
	                        'FLDVAL': token[0].getKey(),
	                        'DESCRIPTION': token[0].data("row")[descrField]
	                    });
	                }
	                
	                //*****Rel 60E_SP6 - Sanofi Req
	            	if(dappt && dappt === vui5.cons.propertyType.selections) {
	            		controlModel.setProperty(dataPath+"/LOW", token[0].getKey());
	            		controlModel.setProperty(dataPath+"/TEXT", token[0].getText());            		
	            	}
	            	//*****
	            }

	            source.fireChange();
	        }
	        oControl.close();
	    };
	    I.prototype._onSearchValues = function (oEvent) {
	        if (this.checkFieldStatus())
	            return;

	        var oControl = this,source,inputHelpModel,rsparams,lt_rsparams,fieldInfo;
	            fieldInfo = oControl.getFieldInfo();
	            source = sap.ui.getCore().byId(oControl.getFieldID());
	            inputHelpModel = oControl.getModel("inputHelpModel");
	            rsparams = inputHelpModel.getProperty("/INPUTHELP/SRCH_DATA");
	            lt_rsparams = commonUtils.selectionsPrepare(rsparams);

	        if (!oEvent.mParameters) {
	            oEvent.mParameters = {};
	        }
	        lt_rsparams = underscoreJS.union(lt_rsparams,oControl.getDependentFields(source,fieldInfo, lt_rsparams));
	        oEvent.mParameters['eventType'] = vui5.cons.fieldSubEvent.search;
	        oEvent.mParameters['fieldInfo'] = fieldInfo;
	        oEvent.mParameters['rsparams'] = lt_rsparams;
	        oEvent.mParameters['rowId'] = oControl.getRowId();
	        /***Rel 60E SP6 ECIP #19732 - Start ***/
	        oEvent.mParameters['currentSearchHelp'] = oControl.currentSearchHelp;
	        /***Rel 60E SP6 ECIP #19732 - End ***/
	        promise = oControl.preProcessFieldEvent(oEvent);
	        if (promise && promise.then) {
	            promise.then(function (response) {
	                //response = response['RESULT'];
	                if (response) {

	                    var searchData = oControl.getModel("inputHelpModel").getProperty("/INPUTHELP/SRCH_DATA");
	                    if (searchData['MAXHITS-1']) {
	                        var max_hits = underscoreJS.findWhere(searchData['MAXHITS-1'], {
	                            "SHLPFIELD": "MAXHITS"
	                        });

	                        /*if (underscoreJS.isEmpty(max_hits['LOW'])) {
	                            max_hits['LOW'] = 500;
	                        }*/
	                    }

	                    if (max_hits) {
	                        if (response['RSLTVAL'] && response['RSLTVAL'].length == max_hits['LOW']) {

	                            sap.m.MessageToast.show(oControl._oBundle.getText('SelectionRestricted', [max_hits['LOW']]));
	                        }
	                    }

	                    var model = oControl.getModel("inputHelpModel");

	                    model.setProperty("/INPUTHELP/RETURNFIELD", response['RETFLD']);
	                    model.setProperty("/INPUTHELP/DESCRFIELD", response['DESCRFLD']);
	                    model.setProperty("/INPUTHELP/RSLT_DATA", response['RSLTVAL']);

	                    if (underscoreJS.isEmpty(response['RSLTVAL'])) {
	                        sap.m.MessageToast.show(oControl._oBundle.getText('NoValues'));
	                    }
	                    oControl.getTable().getModel().setData(response['RSLTVAL']);
	                    oControl.update();
	                }
	            });
	        }
	    },

	    I.prototype._f4DialogOpen = function () {
	        var sType,label,oControl= this;
	        if (oControl.fieldInfo['INTTYPE'] == vui5.cons.intType.date) {
	            sType = 'date';
	        }
	        else if(oControl.fieldInfo['DATATYPE'] ===  global.vui5.cons.dataType.quantity || oControl.fieldInfo['DATATYPE'] ===  global.vui5.cons.dataType.amount){
	        	sType = 'string';
	        }
	        else if (oControl.fieldInfo['INTTYPE'] == vui5.cons.intType.time) {
	            sType = 'time';
	        } else if (oControl.fieldInfo['INTTYPE'] == vui5.cons.intType.number ||
	            oControl.fieldInfo['INTTYPE'] == vui5.cons.intType.integer ||
	            oControl.fieldInfo['INTTYPE'] == vui5.cons.intType.oneByteInteger ||
	            oControl.fieldInfo['INTTYPE'] == vui5.cons.intType.twoByteInteger ||
	            oControl.fieldInfo['INTTYPE'] == vui5.cons.intType.packed ||
	            oControl.fieldInfo['INTTYPE'] == vui5.cons.intType.float ||
	            oControl.fieldInfo['INTTYPE'] == vui5.cons.intType.decimal16 ||
	            oControl.fieldInfo['INTTYPE'] == vui5.cons.intType.decimal32) {
	            sType = 'numeric';
	        } else {
	            sType = 'string';
	        }
	        label = oControl.fieldInfo['LABEL'];
	        oControl.setRangeKeyFields([{
	            label: label,
	            key: oControl.fieldInfo['FLDNAME'],
	            type: sType,
	            maxLength: parseInt(oControl.fieldInfo['OUTPUTLEN'])
	        }]);
	        oControl.setTitle(label);
	        if (!oControl.isOpen()) {
	            oControl.open();
	        }
	    },
	    I.prototype._f4DataPrepare =function (oEvent) {

	        var oControl = this,eventType,promise,maxRows,model,source;

	        source = oEvent.getSource() || "";
	        if (!source) {
	            source = sap.ui.getCore().byId(oControl.getFieldID());
	        }

	        if (oControl.getSupportRangesOnly()) {
	            oControl._f4DialogOpen();
	        } else {
	            model = oControl.getModel("inputHelpModel");
	            if (!oEvent.mParameters) {
	                oEvent.mParameters = {};
	            }
	            oEvent.mParameters['eventType'] = eventType = oControl.getTypeAheadActive() ? vui5.cons.fieldSubEvent.search_from_suggestion : vui5.cons.fieldSubEvent.filter;
	            oEvent.mParameters['fieldInfo'] = oControl.fieldInfo;
	            oEvent.mParameters['maxRows'] = maxRows = 500;
	            oEvent.mParameters['rsparams'] = oControl.getDependentFields(source, oControl.fieldInfo);
	            oEvent.mParameters['rowId'] = oControl.getRowId();
	            /***Rel 60E SP6 ECDM #4695 - Start ***/
	            if(source && source.getValue && eventType === vui5.cons.fieldSubEvent.search_from_suggestion){
	            	oEvent.mParameters['fieldValue'] = source.getValue();
	            }
	            /***Rel 60E SP6 ECDM #4695 - End ***/
	            
	            /***Rel 60E SP6 ECIP #19732 - Start ***/
	            oEvent.mParameters['currentSearchHelp'] = oControl.currentSearchHelp;
	            /***Rel 60E SP6 ECIP #19732 - End ***/
	            promise = oControl.preProcessFieldEvent(oEvent);
	            
	            
	            if (promise && promise.then) {
	                promise.then(function (response) {
	                    //response = response['DATA'];
	                    if (response) {
	                        if (response['RSLTFCAT'] && response['RSLTFCAT'].length === 0 &&
	                            response['SRCH_DATA'] && response['SRCH_DATA'].length === 0 &&
	                            response['SRCHFCAT'] && response['SRCHFCAT'].length === 0) {
	                            sap.m.MessageToast.show(oControl._oBundle.getText('NoInputHelpAvailable'));
	                            return false;
	                        }
	                        /***Rel 60E SP6 ECIP #19732 - Start ***/
	                        oControl.currentSearchHelp = response['CURRENT_SHLP'] || "";
	                        /***Rel 60E SP6 ECIP #19732 - End ***/
	                        var result_fields = [];
	                        underscoreJS.each(response['RSLTFCAT'], function (obj) {
	                            result_fields.push({
	                                "label": obj['LABEL'],
	                                "template": obj['FLDNAME']
	                            });
	                        });

	                        var filterBar = oControl.getFilterBar();
	                        filterBar.removeAllFilterItems();

	                        commonUtils.defaultFieldsAppend(response['SRCHFCAT']);

	                        if (response['SRCHFCAT']) {
	                            var search_data = commonUtils.selectionsFill(response['SRCH_DATA'], response['SRCHFCAT']);
	                            if (search_data['MAXHITS-1'] && search_data['MAXHITS-1'][0].LOW === '') {
	                                search_data['MAXHITS-1'][0].LOW = maxRows;
	                            }
	                            /*if (search_data['MAXHITS'] && search_data['MAXHITS'][0].LOW === '') {
	                                search_data['MAXHITS'][0]['LOW'] = maxRows;
	                            }*/
	                            model.setProperty("/INPUTHELP/SRCH_DATA", search_data);
	                        }

	                        model.setProperty("/INPUTHELP/RSLT_FCAT", result_fields);
	                        model.setProperty("/INPUTHELP/SRCH_FCAT", response['SRCHFCAT']);
	                        model.setProperty("/INPUTHELP/RSLT_DATA", response['RSLTVAL']);
	                        model.setProperty("/INPUTHELP/RETURNFIELD", response['RETFLD']);
	                        model.setProperty("/INPUTHELP/DESCRFIELD", response['DESCRFLD']);
	                        model.setProperty("/INPUTHELP/SHLP_LIST", response['SHLP_LIST']);

	                        oControl._prepareFilterItems(filterBar);

	                        if (response['SHLP_LIST'] && response['SHLP_LIST'].length) {
	                            oControl.oSelectionTitle.setText("Select Search Template");
	                            oControl.oSelectionTitle.setVisible(true);
	                            oControl.oSelectionButton.setVisible(true);
	                        } else {
	                            oControl.oSelectionTitle.setVisible(false);
	                            oControl.oSelectionButton.setVisible(false);
	                        }

	                        oControl.fieldInfo['SELECTED_SHLP'] = response['SELECTED_SHLP'];
	                        var shlpname = underscoreJS.find(response['SHLP_LIST'], {
	                            'SHLPNAME': oControl.fieldInfo['SELECTED_SHLP']
	                        });
	                        if (shlpname) {
	                            oControl.oSelectionTitle.setText(shlpname['TITLE']);
	                            oControl.oSelectionTitle.setTooltip(shlpname['TITLE']);
	                        }

	                        if (response['RSLTFCAT'] && response['RSLTFCAT'].length !== 0) {

	                            var colModel = new sap.ui.model.json.JSONModel();
	                            colModel.setData({
	                                cols: model.getProperty("/INPUTHELP/RSLT_FCAT")
	                            });
	                            oControl.getTable().setModel(colModel, "columns");

	                            //****Rel 60E SP6 ECIP #15886 - Changes to Support Sorting in F4 - Start
	                            if (oControl.getTable()) {
	                                oControl.getTable().onAfterRendering = function () {
	                                    var columns;
	                                    if (sap.ui.table.Table.prototype.onAfterRendering) {
	                                        sap.ui.table.Table.prototype.onAfterRendering.apply(this, arguments);
	                                    }

	                                    columns = this.getColumns();
	                                    if (columns && response['RSLTFCAT']) {
	                                        underscoreJS.each(response['RSLTFCAT'], function (resultFcat, index) {
	                                            columns[index].setSortProperty(resultFcat['FLDNAME']);
	                                        });
	                                    }

	                                }

	                            }
	                            //*** Rel 60E SP6 ECIP #15886 - Changes to Support Sorting in F4 - End
	                            var rowModel = new sap.ui.model.json.JSONModel();
	                            rowModel.setData(response['RSLTVAL']);
	                            oControl.getTable().setModel(rowModel);

	                            if (oControl.getTable().bindRows) {
	                                oControl.getTable().bindRows("/");
	                            }
	                            if (oControl.getTable().bindItems) {
	                                var oTable = oControl.getTable();

	                                oTable.bindAggregation("items", "/", function (sId, oContext) {
	                                    var aCols = oTable.getModel("columns").getData().cols;

	                                    return new sap.m.ColumnListItem({
	                                        cells: aCols.map(function (column) {
	                                            var colname = column.template;
	                                            return new sap.m.Label({
	                                                text: "{" + colname + "}"
	                                            });
	                                        })
	                                    });
	                                });
	                            }

	                            oControl._f4DialogOpen();
	                            if (oControl != undefined) {
	                                oControl.update();

	                                if (response['RSLTVAL'] && response['RSLTVAL'].length == maxRows) {
	                                    sap.m.MessageToast.show(oControl._oBundle.getText('SelectionRestricted', [maxRows]));
	                                }
	                            }
	                        }
	                    } else {
	                        oControl.destroy();
	                    }
	                });
	            }
	        }
	    };
	    I.prototype._onFilterTable = function (event) {
	        var oDialog = this,tokens,value,binding;
	        if (oDialog.getSupportMultiselect()) {
	            tokens =  oDialog._oSelectedTokens.getTokens();
	        }
	           value = event.getParameter("newValue");
	           binding = oDialog.getTable().getBinding("rows");

	        if (value != "" && value != undefined) {
	            var mainModel = oDialog.getModel("inputHelpModel");
	            var fields = mainModel.getProperty("/INPUTHELP/RSLT_FCAT");

	            var filter = [];
	            underscoreJS.each(fields, function (field) {
	                filter.push(new sap.ui.model.Filter(field['template'], sap.ui.model.FilterOperator.Contains, value));
	            });

	            /*** Rel 60E SP6 - Focus leaving Search field - Start ***/
	            //oDialog.getTable().clearSelection();
	            /*** Rel 60E SP6 - Focus leaving Search field - End ***/
	            binding.filter(new sap.ui.model.Filter(filter, false), sap.ui.model.FilterType.Application);
	        } else {
	            binding.filter();
	        }

	        if (oDialog.getSupportMultiselect()) {
	            /*** Rel 60E SP6 - Focus leaving Search field - Start ***/
	        	 //oDialog._oSelectedTokens.removeAllTokens();
	        	 //oDialog.setTokens(tokens);
	        	 /*** Rel 60E SP6 - Focus leaving Search field - End ***/
	        	 oDialog.update();
	        }

	    },

	    I.prototype.createToken = function (object) {
	        var token;
	        if (object['SIGN'] == vui5.cons.seloptSign.include) {
	            token = new sap.m.Token({
	                key: object['LOW'],
	                text: object['TEXT']
	            }).data("range", {
	                "exclude": false,
	                "operation": object['OPTION'],
	                "keyField": object['SELNAME'],
	                "value1": object['LOW'],
	                "value2": object['HIGH']
	            });
	        } else if (object['SIGN'] == vui5.cons.seloptSign.exclude) {
	            token = new sap.m.Token({
	                key: object['LOW'],
	                text: object['TEXT']
	            }).data("range", {
	                "exclude": true,
	                "operation": object['OPTION'],
	                "keyField": object['SELNAME'],
	                "value1": object['LOW'],
	                "value2": object['HIGH']
	            });
	        } else {
	            token = new sap.m.Token({
	                key: object['LOW'],
	                text: object['LOW']
	            });
	        }
	        return token;
	    };
	    I.prototype._prepareFilterItems = function (filterBar) {
	        var oControl = this,oSrchFcat;
	            oSrchFcat = oControl.getModel("inputHelpModel").getProperty("/INPUTHELP/SRCH_FCAT");

	        underscoreJS.each(oSrchFcat, function (obj, index) {
	            var fieldPath = "/INPUTHELP/SRCH_FCAT" + "/" + index;
	            var selection,
	                itemsPath;
	            /*Rel 60E_SP5 */
	            //var dataPath = "VUI_INPUTHELP>/SRCH_DATA/" + obj['FLDNAME'];
	            var tabname = obj['TABNAME'];
	            tabname = tabname.substr(tabname.lastIndexOf("/") + 1, tabname.length);
	            var dataPath = "inputHelpModel>/INPUTHELP/SRCH_DATA/" + obj['FLDNAME'] + "-" + tabname;
	            /*Rel 60E_SP5 */

	            if (obj['DATATYPE'] == vui5.cons.dataType.date) {
	                obj['ELTYP'] = vui5.cons.element.input;
	            }

	            switch (obj['ELTYP']) {
	                case vui5.cons.element.input:
	                    if (obj['DATATYPE'] == vui5.cons.dataType.date) {
	                        selection = new sap.m.DatePicker({
	                            placeholder: " ",
	                            // Value comes in this format and should be returned in YYYYMMdd format
	                            //*****Rel 60E_SP6
	                            valueFormat: "yyyyMMdd",
	                            //*****
	                            editable: "{= ${inputHelpModel>" + fieldPath + "/DISABLED} === '' }",
	                            change: function (oEvent) {
	                                var oSource = oEvent.getSource();
	                                if (oEvent.getParameter("valid")) {
	                                    oSource.setValueState(sap.ui.core.ValueState.None);
	                                    oSource.setValueStateText("");
	                                    oControl._handleCheckFieldsMessages(
	                                        "",
	                                        "",
	                                        oSource.getId() + "/value");
	                                } else {
	                                    oSource.setValueState(sap.ui.core.ValueState.Error);
	                                    var text = oSource.getParent().getAggregation("content")[0].mProperties.text;
	                                    var errorText = oControl._oBundle.getText("EnterValid", [text]);
	                                    oSource.setValueStateText(errorText);

	                                    oControl._handleCheckFieldsMessages(
	                                        errorText,
	                                        sap.ui.core.MessageType.Error,
	                                        oSource.getId() + "/value");
	                                }
	                            }
	                        });
	                        selection.bindProperty("displayFormat", vui5.modelName + ">" + vui5.cons.modelPath.sessionInfo + "/DATFM", Formatter.displayFormat, sap.ui.model.Binding.OneWay);

	                        selection.bindValue(dataPath + "/0/LOW");
	                    } else {
	                        if (obj['MULTISELECT'] == "X") {
	                            selection = new sap.m.MultiInput({
	                                showValueHelp: false,
	                                maxLength: obj['INTLEN'],
	                                enableMultiLineMode: true,
	                                editable: "{= ${inputHelpModel>" + fieldPath + "/DISABLED} === '' }",
	                                tokenChange: [oControl.onF4Select, oControl]
	                            });

	                            selection.addValidator(function (args) {
	                                var text = args.text;
	                                if (obj['LOWERCASE'] == '' && obj['INTTYPE'] == vui5.cons.intType.character) {
	                                    text = text.toUpperCase();
	                                }
	                                return new sap.m.Token({
	                                    key: text,
	                                    text: text
	                                });
	                            });
	                            selection.data("model", "inputHelpModel");
	                            selection.data("path", fieldPath);
	                            selection.data("dataArea", oControl.getDataArea());
	                            selection.bindAggregation("tokens", dataPath, function (sId, oContext) {
	                                var object = oContext.getObject();
	                                var token = oControl.createToken(object);
	                                return token;
	                            });
	                            if (obj['FLDNAME'] == oControl.fieldInfo['FLDNAME']) {
	                                selection.data("SUPPORTRANGESONLY", true);
	                            }
	                            oControl.setFieldType(selection, obj);
	                        } else {
	                            selection = new sap.m.Input({
	                                type: sap.m.InputType.Text,
	                                editable: "{= ${inputHelpModel>" + fieldPath + "/DISABLED} === '' }",
	                                maxLength: obj['INTLEN']
	                            });

	                            selection.attachChange(function (oEvent) {
	                                if (obj['LOWERCASE'] == '' && obj['INTTYPE'] == vui5.cons.intType.character) {
	                                    var source = oEvent.getSource();
	                                    var value = source.getValue();
	                                    value = value.toUpperCase();
	                                    source.setValue(value);
	                                }
	                            });
	                            oControl.setFieldType(selection, obj);
	                            selection.bindValue(dataPath + "/0/LOW");
	                        }
	                    }
	                    break;

	                case vui5.cons.element.valueHelp:
	                    if (obj['MULTISELECT'] == "X") {
	                        selection = new sap.m.MultiInput({
	                            showValueHelp: true,
	                            maxLength: obj['INTLEN'],
	                            enableMultiLineMode: true,
	                            editable: "{= ${inputHelpModel>" + fieldPath + "/DISABLED} === '' }",
	                            valueHelpRequest: [oControl.onValueHelpRequest, oControl],
	                            tokenChange: [oControl.onF4Select, oControl]
	                        });

	                        selection.addValidator(function (args) {
	                            var text = args.text;
	                            if (obj['LOWERCASE'] == '' && obj['INTTYPE'] == vui5.cons.intType.character) {
	                                text = text.toUpperCase();
	                            }
	                            return new sap.m.Token({
	                                key: text,
	                                text: text
	                            });
	                        });
	                        selection.data("model", "inputHelpModel");
	                        selection.data("path", fieldPath);
	                        selection.data("dataArea", oControl.getDataArea());
	                        selection.bindAggregation("tokens", dataPath, function (sId, oContext) {
	                            var object = oContext.getObject();
	                            var token = oControl.createToken(object);
	                            return token;
	                        });
	                        if (obj['FLDNAME'] == oControl.fieldInfo['FLDNAME']) {
	                            selection.data("SUPPORTRANGESONLY", true);
	                        }
	                        oControl.setFieldType(selection, obj);
	                    } else {
	                        selection = new sap.m.MultiInput({
	                            showValueHelp: true,
	                            maxLength: obj['INTLEN'],
	                            enableMultiLineMode: false,
	                            editable: "{= ${inputHelpModel>" + fieldPath + "/DISABLED} === '' }",
	                            valueHelpRequest: [oControl.onValueHelpRequest, oControl]
	                        });
	                        selection.data("model", "inputHelpModel");
	                        selection.data("path", fieldPath);
	                        selection.data("dataArea", oControl.getDataArea());
	                        selection.bindValue(dataPath + "/0/LOW");
	                        oControl.setFieldType(selection, obj);
	                    }
	                    break;

	                case vui5.cons.element.dropDown:

	                    itemsPath = vui5.modelName + ">/DROPDOWNS/" + vui5.cons.dropdownsDatar + "/" + obj['FLDNAME'];
	                    if (obj['MULTISELECT'] == "X") {
	                        selection = new sap.m.MultiComboBox({
	                            width: "100%",
	                            editable: "{= ${inputHelpModel>" + fieldPath + "/DISABLED} === '' }"
	                        });
	                        selection.bindAggregation("items", itemsPath, function (sid, oContext) {
	                            var contextObject = oContext.getObject();
	                            return new sap.ui.core.Item({
	                                key: contextObject['VALUE'],
	                                text: contextObject['TEXT']
	                            });
	                        });
	                        selection.bindProperty("selectedKeys", dataPath + "/0/LOW");
	                    } else {
	                        //selection = new sap.m.ComboBox({
	                        selection = new global.vui5.ui.controls.ComboBox({
	                            width: "100%",
	                            editable: "{= ${inputHelpModel>" + fieldPath + "/DISABLED} === '' }"
	                        });

	                        selection.bindAggregation("items", itemsPath, function (sid, oContext) {
	                            var contextObject = oContext.getObject();
	                            return new sap.ui.core.Item({
	                                key: contextObject['VALUE'],
	                                text: contextObject['TEXT']
	                            });
	                        });
	                        selection.bindProperty("selectedKey", dataPath + "/0/LOW");
	                    }
	                    break;
	                case vui5.cons.element.checkBox:
	                    selection = new sap.m.CheckBox({
	                        select: oControl._onCheckBoxSelect.bind(oControl),
	                        selected: "{= ${" + dataPath + "/0/LOW" + "} === 'X' }",
	                        editable: "{= ${inputHelpModel>" + fieldPath + "/DISABLED} === '' }"
	                    });
	                    selection.data("model", "inputHelpModel");
	                    break;
	            }

	            if (typeof obj['ONCHANGE'] == "function") {
	                selection.attachChange(obj['ONCHANGE']);
	            }

	            selection.data("fieldName", obj['FLDNAME'] + "-" + tabname);

	            var oItem = new sap.ui.comp.filterbar.FilterItem({
	                label: obj['LABEL'],
	                name: obj['FLDNAME'],
	                control: selection
	            });

	            filterBar.addFilterItem(oItem);

	        });
	    }

	    return I;
	  
});