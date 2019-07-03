//jQuery.sap.declare(vistexConfig.rootFolder + ".ui.core.Formatter");
sap.ui.define([], function () {
    var formatter;
    return formatter = {
        _statusStateMap: {
            "1": "Warning",
            "2": "Success",
            "3": "Error",
            "4": "Warning"
        },

        dateFormat: function (value, header) {
            var output;
            if (value) {

            	/**** Rel 60E SP6 ECDM #4736 - Start ***/
            	//if(value == "0000-00-00")
                if (value == "0000-00-00" || value.indexOf("-") === -1) {
                    return '';
                }
                /**** Rel 60E SP6 ECDM #4736 - Start ***/
                if (header) {
                    var mainModel = header.getModel(vui5.modelName);
                }
                else {
                    var mainModel = this.getModel(vui5.modelName);
                }
                if (mainModel.getProperty("/SESSION_INFO/DATFM") != undefined) {
                    var dateData = value.split('-');
                    var year = dateData[0];
                    var month = dateData[1];
                    var day = dateData[2];
                    switch (mainModel.getProperty("/SESSION_INFO/DATFM")) {
                        case vui5.cons.dateFormat.type0:
                            var months = mainModel.getProperty("/DROPDOWNS/" + vui5.cons.dropdownsDatar + "/MONTHS");
                            if (months) {
                                var monthData = underscoreJS.find(months, { NAME: month });
                                if (monthData) {
                                    output = monthData['VALUE'] + " " + day + ", " + year;
                                } else {
                                    output = value;
                                }
                            } else {
                                output = value;
                            }
                            break;
                        case vui5.cons.dateFormat.type1:
                            output = day + "." + month + "." + year;
                            break;
                        case vui5.cons.dateFormat.type2:
                            output = month + "/" + day + "/" + year;
                            break;
                        case vui5.cons.dateFormat.type3:
                            output = month + "-" + day + "-" + year;
                            break;
                        case vui5.cons.dateFormat.type4:
                            output = year + "." + month + "." + day;
                            break;
                        case vui5.cons.dateFormat.type5:
                        case vui5.cons.dateFormat.typeA:
                        case vui5.cons.dateFormat.typeB:
                        case vui5.cons.dateFormat.typeC:
                            output = year + "/" + month + "/" + day;
                            break;
                        case vui5.cons.dateFormat.type6:
                            output = year + "-" + month + "-" + day;
                            break;
                        default:
                            output = value;
                            break;
                    }
                }

            } else {
                output = "";
            }

            return output;
        },
        displayFormat: function (value) {
            if (value != undefined) {
                if (value == "") {
                    var format = "long";
                    return format;
                }
                else {
                    return value;
                }
            }
        },
        timeFormatter: function (value) {

            if (value === "00:00:00") {
                return " ";
            } else {
                return value;
            }
        },
        showPopupMessages: function (value) {

            if (value != undefined) {
                if (value.length != 0) {
                    return true;
                } else {
                    return false;
                }
            }
            else {
                return false;
            }

        },
        showMessages: function (value) {
            return false;
            //        if (value != undefined) {
            //            if (value.length != 0) {
            //                return false;
            //            } else {
            //                return true;
            //            }
            //        }
            //        else{
            //          return false;
            //        }

        },
        popupMessagesText: function (arr) {
            if (arr) {
                return arr.length;
            }
            else {
                return "";
            }

        },
        setFileType: function (fileTypes) {
            var arr= [];
	        if (fileTypes) {
	            underscoreJS.map(fileTypes, function (obj) {
	             arr.push(obj['VALUE']);
	
	              });
	              return arr;
	        }

          },
        statusState: function (value) {
            var map = Formatter._statusStateMap;
            return (value && map[value]) ? map[value] : "None";
        },

        statusText: function (value) {
            if (value) {
                var bundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.core");
                return bundle.getText("StatusText" + value);
            }
        },

        amountFormat: function (value) {
            if (value != undefined && (value % 1 == 0)) {
                return value + ".00";
            } else if (value != undefined) {
                return value;
            }
        },

        amtFormat: function (value, unitVal) {
            var outputVal;
            if (value != undefined && value % 1 == 0)
                {
            	outputVal = value + ".00";
                }
            else{
            	outputVal = value;
            }
                
            if (unitVal != undefined)
                {
            	outputVal = outputVal + " " + unitVal;
                }

            return outputVal;
        },

        getState: function (value) {
            if (value != undefined) {
                if (value == "") {
                    return "Success";
                } else {
                    return "Warning";
                }
            }
        },

        getIcon: function (value) {
            if (value != undefined) {
                if (value == "") {
                    return "sap-icon://status-positived";
                } else {
                    return "sap-icon://status-in-process";
                }
            }
        },

        partnerText: function (value) {
            if (value != undefined) {
                var mainModel = this.getModel(vui5.modelName);
                var partners = mainModel.getProperty("/DROPDOWNS/" + vui5.cons.dropdownsDatar + "/KUNAG");
                //var valLength = value.length;
                //var aLength = 10 - value.length;
                var tempVal = value;
                //              for(i=1;i<=aLength;i++){
                //              tempVal = "0" + tempVal;
                //              }
                var data = underscoreJS.findWhere(partners, { NAME: tempVal });
                var descr = "";
                if (data != undefined) {
                    descr = data['TEXT'];
                } else {
                    descr = value;
                }
                return descr;
            }
        },

        variantText: function (value) {
            if (value != undefined) {
                var mainModel = this.getModel(vui5.modelName);
                var variants = mainModel.getProperty("/VARIANTS/DATA");
                var data = underscoreJS.findWhere(variants, { VARIANT: value });
                var descr = value;
                if (data != undefined) {
                    descr = data['VTEXT'];
                }
                return descr;
            } else {
                return "";
            }
        },

        langText: function (value) {
            if (value != undefined) {
                var mainModel = this.getModel(vui5.modelName);
                var langs = mainModel.getProperty("/DROPDOWNS/" + vui5.cons.dropdownsDatar + "/SPRAS");
                var data = underscoreJS.findWhere(langs, { NAME: value });
                var descr = "";
                if (data) {
                    descr = data['TEXT'];
                }
                return descr;
            } else {
                return "";
            }
        },
        valueDescr: function (value, textFieldValue) {
            if (value == undefined)
                {
            	return "";
                }
            else {
                return value + " " + textFieldValue;
            }


        },
        valueText: function (value, field, dataArea) {
            var descr;
            if (!dataArea) {
                dataArea = vui5.cons.dropdownsDatar;
            }

            if (value === undefined || field === undefined) {
                return value;
            }

            if (field['FLSTL'] == vui5.cons.styleType.icon) {
                return "";
            }

            if (field['SDSCR'] == vui5.cons.fieldValue.value) {
                return value;
            }
            var mainModel = this.getModel(vui5.modelName);
            var dropdown = mainModel.getProperty("/DROPDOWNS/" + dataArea + "/" + field['FLDNAME']);
            var dropdownData = "";
            if (dropdown) {
                dropdownData = underscoreJS.find(dropdown, { NAME: value });
            }
            if (dropdownData) {
                descr = dropdownData['VALUE'];
            } else {
                descr = "";
            }
            return descr;

        },

        stateText: function (value, field) {
            var descr;
            if (value != undefined && field != undefined) {
                var styleObject = underscoreJS.findWhere(field["STYLES"], { "VALUE": value });
                if (!styleObject) {
                    return sap.ui.core.ValueState.None;
                }
                if (field["FLSTL"] == "") {
                    return sap.ui.core.ValueState.None;
                }
                else if (field["FLSTL"] == vui5.cons.styleType.color || field["FLSTL"] == vui5.cons.styleType.icon) {
                    if (field["FLSTL"] == vui5.cons.styleType.icon) {
                        this.setIcon(styleObject["ICON"]);
                    }
                    switch (styleObject["STATE"]) {
                        case "":
                            return sap.ui.core.ValueState.None;
                            break;
                        case "1":
                            return sap.ui.core.ValueState.Error;
                            break;
                        case "2":
                            return sap.ui.core.ValueState.Success;
                            break;
                        case "3":
                            return sap.ui.core.ValueState.Warning;
                            break;
                        default:
                            return sap.ui.core.ValueState.None;
                            break;

                    }
                }
            }
            else {
                return sap.ui.core.ValueState.None;
            }
        },

        dropdownDescriptionGet: function (value, dropdownData) {
            var descr = '';
            if (dropdownData && value != null && value != undefined) {
                var dropdown = underscoreJS.find(dropdownData, { NAME: value });
                if (dropdown) {
                    descr = dropdown['VALUE'];
                } else {
                    descr = '';
                }
            } else if (value) {
                return value;
            }
            return descr;
        },
        listMode: function (value) {
            if (value == '0') { return sap.m.ListMode.None ; }
            if (value == '1') { return sap.m.ListMode.SingleSelectMaster; }
            if (value == '2') { return sap.m.ListMode.MultiSelect ;  }

        },
        objectNumericFormat: function (data, field, label) {
            if (!data || !field) {
                return;
            }
            var numberValue, nValue;
            var textField = field['TXTFL'];
            var fieldName = field['FLDNAME'];
            if (field['DATATYPE'] == vui5.cons.dataType.amount || field['DATATYPE'] == vui5.cons.dataType.quantity || field['DATATYPE'] == vui5.cons.dataType.decimal) {
                if (textField != "") {
                    nValue = data[textField];
                } else {
                    nValue = data[fieldName];
                }
            } else if (field['DATATYPE'] == vui5.cons.dataType.date) {
                nValue = Formatter.dateFormat(data[fieldName], this);
            } else if (field['SDSCR'] == vui5.cons.fieldValue.description) {
                nValue = data[textField];
            } else {
                nValue = data[fieldName];
            }

            if (field['HDLBL'] == "") {

                return numberValue = label + ": " + nValue;

            }
            else {
                return nValue;
            }
        },
        setTitle: function (fields, data, separator) {
            if (!data || !fields) { return; }
            var title, path;
            var titles = underscoreJS.where(fields, { "OBHCT": vui5.cons.objectHeaderCategory.title });
            underscoreJS.each(titles, function (obj, index) {
                if (obj['SDSCR'] == vui5.cons.fieldValue.description || obj['SDSCR'] == vui5.cons.fieldValue.value_cont_descr) {
                    path = '_' + obj['FLDNAME'] + "_TXT";
                }
                else {
                    path = obj['FLDNAME'];
                }
                if (!title) {
                    title = data[path];
                }
                else {
                    if (separator) {
                        title = title + " " + separator + " " + data[path];
                    }
                    else {
                        title = title + " " + data[path];
                    }
                }
            });
            return title;
        },
        returnBoolean: function (value) {
            if (value != undefined) {
                return underscoreJS.isEmpty(value);
            }
        },
        setSubTitle: function (fields, data, separator) {
            if (!data || !fields) { return; }
            var subTitle, path;
            var subTitles = underscoreJS.where(fields, { "OBHCT": vui5.cons.objectHeaderCategory.subTitle });
            underscoreJS.each(subTitles, function (obj, index) {
                if (obj['SDSCR'] == vui5.cons.fieldValue.description || obj['SDSCR'] == vui5.cons.fieldValue.value_cont_descr) {
                    path = '_' + obj['FLDNAME'] + "_TXT";
                }
                else {
                    path = obj['FLDNAME'];
                }
                if (!subTitle) {
                    subTitle = data[path];
                }
                else {
                    if (separator) {
                        subTitle = subTitle + separator + data[path];
                    }
                    else {
                        subTitle = subTitle + " " + data[path];
                    }
                }
            });
            return subTitle;
        },
        javascriptDateFormat: function (value) {
            if (value != undefined && value != "") {
                var value1 = value.trim(), date1, newDate;
                //date1 = value1.slice(0, 4) + '-' + value1.slice(4, 6) + '-' + value1.slice(6, 8);
                date1 = value1.slice(4, 6) + '/' + value1.slice(6, 8) + '/' + value1.slice(0, 4);
                newDate = new Date(date1);
                return newDate;
            }
        },
        dateRangeDateValue: function (value) {
            if (this.data("dateValue")) {
                return this.data("dateValue");
            }
            else {
                return formatter.javascriptDateFormat(value);
            }

        },

        dateRangeSecondDateValue: function (value) {
            if (this.data("secondDateValue")) {
                return this.data("secondDateValue");
            }
            else {
                return formatter.javascriptDateFormat(value);
            }
        }
    };
});