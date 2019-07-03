sap.ui.define([
	"jquery.sap.global",
	"sap/ui/comp/filterbar/FilterBar",
	"sap/ui/model/json/JSONModel",
	"sap/ui/comp/variants/VariantItem",
	vistexConfig.rootFolder + "/ui/core/underscore-min",
	vistexConfig.rootFolder + "/ui/core/global"
], function (q, FilterBar, JSONModel, VariantItem, underscoreJS, global) {
    var T = FilterBar.extend(vistexConfig.rootFolder + ".ui.controls.FilterBar", {
        metadata: {
            properties: {
                variantDataPath: {
                    type: "string",
                    defaultValue: null
                },
                objectType: {
                    type: "string",
                    defaultValue: null
                },
                application: {
                    type: "string",
                    defaultValue: null
                },
                searchProfile: {
                    type: "string",
                    defaultValue: null
                },
                searchDataPath: {
                    type: "string",
                    defaultValue: null
                },
                searchFieldsPath: {
                    type: "string",
                    defaultValue: null
                },
                modelName: {
                    type: "string",
                    defaultValue: null
                },
                selectedVariant: {
                    type: "string",
                    defaultValue: null
                },
                /***Rel 60E SP6 ECDM #4728 - Start ***/
                hideShare: {
                    type: "boolean",
                },
                /***Rel 60E SP6 ECDM #4728 - End ***/
                /* Apply WorkSpace Variant - START*/
                workspaceVariant: {
                    type: "string",
                    defaultValue: ""
                }
                /* Apply WorkSpace Variant - END*/
            },
            events: {
                variantSelect: {},
                variantSave: {}
            }
        },
        renderer: "sap.ui.comp.filterbar.FilterBarRenderer"
    });

    T.INTERNAL_GROUP = "__$INTERNAL$";

    T.prototype.init = function () {
        FilterBar.prototype.init.apply(this);

        var oControl = this;

        //this.setPersistencyKey("XXX");

        var sLocale = sap.ui.getCore().getConfiguration().getLanguage();
        if (sLocale.length > 2) {
            sLocale = sLocale.substring(0, 2);
        }

        this._oVariantManagement.setShowExecuteOnSelection(true);
        /***Rel 60E SP6 ECDM #4728 - Start ***/
        //this._oVariantManagement.setShowShare(true);
        /***Rel 60E SP6 ECDM #4728 - End ***/
        this._oVariantManagement.fireManage = this._onfireManage.bind(this);
        this._oVariantManagement.attachSave(this.onVuiVariantSave.bind(this));

        this._oVariantManagement.data("filterBarID", oControl.getId());

        /* "10More" issue in Multi-Input field Filter Items are not re-rendered after variant change */
        this._oVariantManagement.fireSelect = function (v) {
            var oVariant = this;
            var o = null,
				variants,
				selectedVariant,
				filterBarControl;
            filterBarControl = sap.ui.getCore().byId(this.data("filterBarID"));
            variants = filterBarControl.getModel(filterBarControl.getModelName()).getProperty(filterBarControl.getVariantDataPath());
            if (v && v.key) {
                if (this._oVariantSet) {
                    if (v.key === this.STANDARDVARIANTKEY) {
                        o = this._getStandardVariant();
                        oControl.getModel(oControl.getModelName()).setProperty(oControl.getSelectedVariant(), v.key);
                        //  this.setInitialSelectionKey(v.key);
                    } else {
                        o = this._oVariantSet.getVariant(v.key);
                    }
                }

                selectedVariant = underscoreJS.findWhere(variants, {
                    "VARID": v.key
                });
                if (!selectedVariant) {
                    selectedVariant = {
                        "ROWID": 0
                    };
                }
                if (selectedVariant) {
                    filterBarControl.fireVariantSelect({
                        record: selectedVariant,
                        callback: function () {
                            if (o && o['key'] == "*standard*") {
                                oVariant._applyVariant(o);
                            }
                            oControl.rerender();
                        }
                    });
                }
            }
            /*if (o) {
                this._applyVariant(o);
            }
            oControl.rerender();*/
        };
        /**/


        /*Over Riding Tooltip*/
        var bundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls");
        this._oVariantManagement.oVariantPopoverTrigger.setTooltip(bundle.getText('SelectVariant'));
        /**/

        this.fVariantStub();
    };

    T.prototype.fVariantStub = function () {
        var oControl = this;
        this._oVariantManagement.initialise = function () {
            this.fireEvent("initialise");
            this._setStandardVariant();

            /*If Filter Count does not increase on change of field which is visible only in Filter Popup*/
            oControl.__createStandardVariant();

            this._setSelectedVariant();
        };

        this.nKey = 0;
        this.mMap = {};
        this.sCurrentVariantKey = null;
        this._oVariantManagement._oVariantSet = {
            getVariant: function (sKey) {
                return oControl.mMap[sKey];
            },
            addVariant: function (sName) {
                var sKey = "$$$" + oControl.nKey++;

                var oVariant = oControl._createVariantObject(sKey, sName, []);

                oControl.mMap[sKey] = oVariant;

                return oVariant;
            },
            setCurrentVariantKey: function (sKey) {
                // default scenario
                oControl.sCurrentVariantKey = sKey;
            },
            getCurrentVariantKey: function () {
                return oControl.sCurrentVariantKey;
            },
            delVariant: function (sKey) {
                if (oControl.mMap[sKey]) {
                    delete oControl.mMap[sKey];
                }
            },
            //*****Rel 60E_SP6 - QA #11189
            getVariantNamesAndKeys: function (value) {
                return oControl.mMap;
            }
            //*****

        };
    };

    T.prototype.__createStandardVariant = function () {

        var oControl = this;
        var model = oControl.getModel(oControl.getModelName());
        var fields = model.getProperty(oControl.getSearchFieldsPath());
        var filterbar = [];

        for (var i = 0; i < fields.length; i++) {
            var visible;
            if (fields[i]['NO_OUT'] == '') {
                visible = true;
            } else {
                visible = false;
            }

            filterbar.push({
                group: T.INTERNAL_GROUP,
                /*Rel 60E_SP5*/
                //name: fields[i].FLDNAME,
                name: fields[i].FLDNAME + "-" + fields[i].TABNAME,
                /*Rel 60E_SP5*/
                partOfCurrentVariant: true,
                visibleInFilterBar: visible
            });
        }

        var varid = "*standard*";

        var oVariant = oControl._createVariantObject(
			varid,
			"",
			[],
			filterbar,
			false
		);
        oControl.mMap[varid] = oVariant;
        this._oVariantManagement._oStandardVariant = oVariant;
    };

    T.prototype._createVariantObject = function (sKey, name, filterBarVariant, filterbar, executeOnSelection) {
        var oVariant = {
            key: sKey,
            name: name,
            //filterBarVariant : filterBarVariant,
            executeOnSelection: executeOnSelection,
            filterbar: filterbar,
            //              getItemValue: function(s) {
            //              return this[s];
            //              },
            setItemValue: function (s, oObj) {
                this[s] = oObj;
            },
            getVariantKey: function () {
                return this.key;
            },
            setVariantName: function (name) {
                this.name = name;
            },
            setExecuteonSelection: function (value) {
                this.executeOnSelection = value;
            }
        };
        return oVariant;
    };

    //T.prototype.fFetchData =  function() {
    //    var lt_rsparams = this.prepareVariantsData();
    //    return lt_rsparams;
    //};

    //T.prototype.fApplyData = function(oJsonData) {
    // have to send/set what selection molecule needs.
    //var model = this.getModel(this.getModelName());
    //var selections = oJsonData;
    //var searchDataPath = this.getSearchDataPath();
    //var searchFieldPath = this.getSearchFieldsPath();
    //var fields = model.getProperty(searchFieldPath);
    //var search_data = commonUtils.selectionsFill(selections, fields);
    //model.setProperty(searchDataPath,search_data);
    //this.updateToolbarText();
    //};

    T.prototype.setObjectType = function (value) {
        this.setProperty("objectType", value, true);

    };

    T.prototype.setApplication = function (value) {
        this.setProperty("application", value, true);

    };

    T.prototype.setSearchProfile = function (value) {
        this.setProperty("searchProfile", value, true);

    };

    T.prototype.setModelName = function (value) {
        this.setProperty("modelName", value, true);
    };

    T.prototype.setVariantDataPath = function (value) {
        this.setProperty("variantDataPath", value, true);
        //this.fetchVariants();
    };

    T.prototype.setSelectedVariant = function (value) {
        this.setProperty("selectedVariant", value, true);
    };

    /***Rel 60E SP6 ECDM #4728 - Start ***/
    T.prototype.setHideShare = function (value) {
        this.setProperty("hideShare", value, true);
    };
    /***Rel 60E SP6 ECDM #4728 - End ***/

    /* Apply WorkSpace Variant - START*/
    T.prototype.setWorkspaceVariant = function (value) {
        this.setProperty("workspaceVariant", value, true);

    };
    /* Apply WorkSpace Variant - END*/

    T.prototype.prepareVariants = function () {

        var oControl = this;
        var objectType = this.getObjectType();
        var application = this.getApplication();
        var searchProfile = this.getSearchProfile();
        var variantDataPath = this.getVariantDataPath();
        var dataPath = "/DATA/" + this.getSearchDataPath().split("/")[2];
        var model = oControl.getModel(oControl.getModelName());
        var oPath = oControl.getModelName() + ">" + variantDataPath;
        var selectedVariant = oControl.getModelName() + ">" + oControl.getSelectedVariant();
        // var oPath = oControl.getModelName() + ">/DATA/" + this.getSearchDataPath().split("/")[2] + "/VARIANTS";
        if (objectType && application && model) {
            oControl.fireInitialise();
            /***Rel 60E SP6 ECDM #4728 - Start ***/
            oControl._oVariantManagement.setShowShare(!oControl.getHideShare());
            /***Rel 60E SP6 ECDM #4728 - End ***/
            oControl._oVariantManagement.setModel(model, oControl.getModelName());
            oControl._setVariantInitialKey();
            // oControl._oVariantManagement.setDefaultVariantKey(this.getProperty("selectedVariant"));
            //  oControl._oVariantManagement.fireSelect({key : this.getProperty("selectedVariant")});

            oControl._oVariantManagement.bindAggregation("variantItems", oPath, function (sid, oContext) {

                var object = oContext.getObject();
                var path = oContext.getPath();

                var executeOnSelect = false;
                if (object['EXESL'] == 'X') {
                    executeOnSelect = true;
                }

                /*Global Variant Changes-START*/
                var global = false;
                if (object['SHRVR'] != '') {
                    global = true;
                }
                /*Global Variant Changes-END*/


                var variantItem = new VariantItem({
                    text: object['DESCR'],
                    key: object['VARID'],
                    executeOnSelection: executeOnSelect,
                    /*Global Variant Changes-START*/
                    global: global,
                    author: object['AENAM_TXT']
                    /*Global Variant Changes-END*/
                });/*.bindProperty("readOnly", oControl.getModelName() + ">" + path + "/DISOL", function (displayOnly) {
                    return displayOnly === "X" ? true : false;
                }, sap.ui.model.BindingMode.OneWay);*/
                
                /***Rel 60E SP6 ECDM #4754 - Start ***/
                if(object['DISOL'] === 'X' || (global && oControl.getHideShare())){
                	variantItem.setReadOnly(true);
                }
                /***Rel 60E SP6 ECDM #4754 - End ***/
                
                var fieldProperty = object['FLDPPTY'];
                var filterbar = [];
                for (var i = 0; i < fieldProperty.length; i++) {
                    var visible;
                    if (fieldProperty[i].VISIBLE == 'X') {
                        visible = true;
                    }
                    else {
                        visible = false;
                    }

                    filterbar.push({
                        group: fieldProperty[i].GROUP,
                        name: fieldProperty[i].FLDNAME,
                        partOfCurrentVariant: true,
                        visibleInFilterBar: visible
                    });
                }
                var oVariant = oControl._createVariantObject(
					object['VARID'],
					object['DESCR'],
					[],
					filterbar,
					executeOnSelect
				);
                oControl.mMap[object['VARID']] = oVariant;
                if(oControl._oVariantManagement){
	                if (object['SELVAR'] == "X") {
	                    oControl._oVariantManagement._applyVariant(oVariant);
	                }
	
	                if (object['DEFLT'] == "X") {
	                    oControl._oVariantManagement.setDefaultVariantKey(object['VARID']);
	                }
	                oControl._oVariantManagement.setInitialSelectionKey('');
                }
                return variantItem;
            });
            oControl._oVariantManagement.addEventDelegate({
                onAfterRendering: function (e) {
                    var oControl = this;
                    var model = oControl.getModel(oControl.getModelName());
                    var selectedVariant = model.getProperty(oControl.getSelectedVariant());
                    e.srcControl.setInitialSelectionKey(selectedVariant);

                }
            }, this);

        }
    };


    T.prototype.updateToolbarText = function () {
        this._updateToolbarText();
    };

    T.prototype._onfireManage = function (manageObject) {

        var oControl = this;
        var i;
        var renamed = null;
        var deleted = null;
        var executeOnSelect = null;
        var data = [];
        var params = [];
        var o;
        if (!oControl._oVariantManagement._oVariantSet) {
            return;
        }

        var dataPath = "/DATA/" + oControl.getSearchDataPath().split("/")[2];
        var model = oControl.getModel(oControl.getModelName());
        var variantList = model.getProperty(oControl.getVariantDataPath());
        var item,
			changed;
        if (manageObject) {

            renamed = manageObject.renamed;
            deleted = manageObject.deleted;
            executeOnSelect = manageObject.exe;

            // Rename Varaint
            // var overwriteItem = [];
            if (renamed.length > 0) {
                changed = true;
                for (i = 0; i < renamed.length; i++) {
                    o = oControl._oVariantManagement._oVariantSet.getVariant(renamed[i].key);
                    if (o) {
                        if (o.setVariantName) {
                            o.setVariantName(renamed[i].name);
                        }
                    }

                    item = underscoreJS.find(variantList, {
                        'VARID': renamed[i].key
                    });
                    if (item && item.UPDKZ !== "D") {
                        item.DESCR = renamed[i].name;
                        item.UPDKZ = "U";
                        // overwriteItem.push(item);
                    }
                }
            }

            //Execute on Select on Variant
            if (executeOnSelect.length > 0) {
                changed = true;
                for (i = 0; i < executeOnSelect.length; i++) {

                    o = oControl._oVariantManagement._oVariantSet.getVariant(executeOnSelect[i].key);
                    if (o) {
                        if (o.setExecuteonSelection) {
                            o.setExecuteonSelection(executeOnSelect[i].exe);
                        }
                    }
                    item = undefined;
                    item = underscoreJS.find(variantList, {
                        'VARID': executeOnSelect[i].key
                    });
                    if (item) {
                        if (executeOnSelect[i].exe) {
                            item.EXESL = 'X';
                        }
                        else {
                            item.EXESL = '';
                        }
                    }
                    if (item.UPDKZ !== "D") {
                        item.UPDKZ = "U";
                    }
                }
            }

            // Variant Delete
            if (deleted.length > 0) {
                changed = true;
                var s = oControl._oVariantManagement._oVariantSet.getCurrentVariantKey();

                for (i = 0; i < deleted.length; i++) {
                    o = oControl._oVariantManagement._oVariantSet.getVariant(deleted[i]);
                    if (o) {
                        if (s && s === o.getVariantKey()) {
                            oControl._oVariantManagement._oVariantSet.setCurrentVariantKey(null);
                        }
                        oControl._oVariantManagement._oVariantSet.delVariant(deleted[i]);
                    }
                    item = undefined;
                    item = underscoreJS.find(variantList, {
                        'VARID': deleted[i]
                    });
                    if (item && item.UPDKZ !== "D") {
                        item.UPDKZ = "D";
                    }
                }

            }


            //default variant
            if (manageObject.def) {
                changed = true;
                var variant;
                variant = underscoreJS.findWhere(variantList, {
                    "DEFLT": "X"
                });
                if (variant && variant['UPDKZ'] !== 'D') {
                    variant['DEFLT'] = '';
                    variant['UPDKZ'] = "U";
                }

                var defaultVariant = manageObject.def;
                variant = underscoreJS.find(variantList, {
                    'VARID': defaultVariant
                });
                if (variant && variant['UPDKZ'] !== 'D') {
                    variant['DEFLT'] = "X";
                    variant['UPDKZ'] = 'U';
                }



            }
        }

        if (changed) {
            oControl.fireVariantSave();
        }
    };


    T.prototype.onVuiVariantSave = function (oEvent) {

        var oControl = this;
        var dataPath = "/DATA/" + oControl.getSearchDataPath().split("/")[2];
        var model = oControl.getModel(oControl.getModelName());
        //var variantList = model.getProperty(dataPath + "/VARIANTS");
        var variantList = model.getProperty(oControl.getVariantDataPath());
        var filterItems = this.getFilterGroupItems();
        var filters = [];

        var overwrite = '';
        if (oEvent.getParameter("overwrite")) {
            overwrite = 'X';
        }

        /*Global Variant Changes-START*/
        var global = oEvent.getParameter("global");
        if (global) {
            global = 'X';
        }
        else {
            global = '';
        }
        /*Global Variant Changes-START*/

        var header;
        for (var i = 0; i < filterItems.length; i++) {
            var visible;
            if (filterItems[i].getVisibleInFilterBar()) {
                visible = 'X';
            }
            else {
                visible = '';
            }

            filters.push({
                GROUP: filterItems[i].getGroupName(),
                FLDNAME: filterItems[i].getName(),
                VISIBLE: visible
            });
        }

        if (overwrite == 'X') {
            header = underscoreJS.find(variantList, {
                'VARID': oEvent.getParameter("key")
            });
            header['UPDKZ'] = 'U';
            header['OVRSL'] = 'X';
            header['FLDPPTY'] = filters;
        } else {
            header = {};
            header['VARID'] = oEvent.getParameter("key");
            header['DESCR'] = oEvent.getParameter("name");
            header['SRCHP'] = this.getSearchProfile();
            header['OBJTP'] = this.getObjectType();
            header['APPLN'] = this.getApplication();
            header['UPDKZ'] = "I";
            header['SHRVR'] = global;
            header['FLDPPTY'] = filters;

            //header['RSPARAMS'] = oControl.prepareVariantsData();
            var defaultVar = oEvent.getParameter("def");
            if (defaultVar == true) {
                header['DEFLT'] = 'X';
                this._oVariantManagement._oVariantSet.setCurrentVariantKey(header['VARID']);
            } else if (defaultVar == false) {
                header['DEFLT'] = '';
            }

            var executeOnSelect = oEvent.getParameter("exe");
            if (executeOnSelect == true)
                header['EXESL'] = 'X';
            else if (executeOnSelect == false)
                header['EXESL'] = '';
            variantList.push(header);
        }

        model.setProperty(oControl.getVariantDataPath(), variantList);

        oControl.fireVariantSave({
            callback: function () {
                oControl._setVariantInitialKey();
            }
        });

    };

    T.prototype.getVuiVariantManagement = function () {
        return this._oVariantManagement;
    };

    T.prototype._setVariantInitialKey = function () {
        var oControl = this;
        var selectedVariant = oControl.getModelName() + ">" + oControl.getSelectedVariant();
        oControl._oVariantManagement.bindProperty("initialSelectionKey", selectedVariant, null, sap.ui.model.BindingMode.OneWay);
    };


    return T;

});