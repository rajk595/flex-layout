sap.ui.define([
	"jquery.sap.global",
	"sap/m/DateRangeSelection"
], function(q, DateRangeSelection) {

	var T = DateRangeSelection.extend(vistexConfig.rootFolder + ".ui.controls.DateRange", {
		renderer : "sap.m.DateRangeSelectionRenderer"
	});

	T.prototype.onChange = function() {
		if (!this.getEditable() || !this.getEnabled()) {
			return;
		}
		var v = this._$input.val();
		var e = [ undefined, undefined ];
		this._oWantedDate = undefined;
		this._oWantedSecondDate = undefined;
		this._bValid = true;
		if (v) {
			e = this._parseValue(v);
			e = b.call(this, e[0], e[1]);
			if (e[0]) {
				v = this._formatValue(e[0], e[1], true);
			} else {
				this._bValid = false;
			}
		}
		if (v !== this._lastValue) {
			if (this.getDomRef() && (this._$input.val() !== v)) {
				this._$input.val(v);
				this._curpos = this._$input.cursorPos();
			}
			this._lastValue = v;
			this.setProperty('value', v, true);
			if (this._bValid) {
				this.setProperty('dateValue', e[0], true);
				this.setProperty('secondDateValue', e[1], true);
			}
			//this._setLabelVisibility();
			if (this._oPopup && this._oPopup.isOpen()) {
				var s = this.getDateValue();
				if (s) {
					if (!this._oDateRange.getStartDate() || this._oDateRange.getStartDate().getTime() !== s.getTime()) {
						this._oDateRange.setStartDate(new Date(s.getTime()));
						this._oCalendar.focusDate(s);
					}
				} else {
					if (this._oDateRange.getStartDate()) {
						this._oDateRange.setStartDate(undefined);
					}
				}
				var E = this.getSecondDateValue();
				if (E) {
					if (!this._oDateRange.getEndDate() || this._oDateRange.getEndDate().getTime() !== E.getTime()) {
						this._oDateRange.setEndDate(new Date(E.getTime()));
						this._oCalendar.focusDate(E);
					}
				} else {
					if (this._oDateRange.getEndDate()) {
						this._oDateRange.setEndDate(undefined);
					}
				}
			}
			_fireChange.call(this, this._bValid);

		}
	};
	T.prototype.setValue = function(sValue) {

		if (sValue !== this.getValue()) {
			this._lastValue = sValue;
		} else {
			return this;
		}
		// Set the property in any case but check validity on output
		this.setProperty("value", sValue, true);
		this._bValid = true;

		// Convert to date object(s)
		var aDates = [ undefined, undefined ];

		if (sValue) {
			aDates = this._parseValue(sValue);
			this._oWantedDate = aDates[0];
			this._oWantedSecondDate = aDates[1];
			aDates = b.call(this, aDates[0], aDates[1]);
			if (!aDates[0]) {
				this._bValid = false;
				jQuery.sap.log.warning("Value can not be converted to a valid dates", this);
			}




		}


		if (this._bValid) {
			this.setProperty("dateValue", aDates[0], true);
			this.setProperty("secondDateValue", aDates[1], true);
			this._oWantedDate = undefined;
			this._oWantedSecondDate = undefined;
		}

		// Do not call InputBase.setValue because the displayed value and the output value might have different pattern
		if (this.getDomRef()) {
			// Convert to output
			var sOutputValue = this._formatValue(aDates[0], aDates[1]);

			if (this._$input.val() !== sOutputValue) {
				this._$input.val(sOutputValue);
				//this._setLabelVisibility();
				this._curpos = this._$input.cursorPos();





			}



		}

		return this;

	};
	T.prototype.setSecondDateValue = function(s) {

		if (s && !(s instanceof Date)) {
			throw new Error('Date must be a JavaScript date object; ' + this);
		}
		if (q.sap.equal(this.getSecondDateValue(), s)) {
			return this;
		}
		if (s && (s.getTime() < this._oMinDate.getTime() || s.getTime() > this._oMaxDate.getTime())) {
			this._bValid = false;
			this._oWantedSecondDate = s;
			s = undefined;
		} else {
			this._bValid = true;
			this.setProperty('secondDateValue', s, true);
			this._oWantedSecondDate = undefined;
		}
		var o = this.getDateValue();
		var v = this._formatValue(o, s, true);
		if (v !== this.getValue()) {
			this._lastValue = v;
		}
		this.setProperty('value', v, true);
		if (this.getDomRef()) {
			var O = this._formatValue(o, s);
			if (this._$input.val() !== O) {
				this._$input.val(O);
				//this._setLabelVisibility();
				this._curpos = this._$input.cursorPos();
			}
		}
		return this;
	};
	T.prototype._getInputValue = function(sValue) {

		sValue = (typeof sValue == "undefined") ? this._$input.val() : sValue.toString();

		var aDates = this._parseValue(sValue);
		sValue = this._formatValue(aDates[0], aDates[1]);

		return sValue;

	};
	T.prototype._parseValue = function(sValue) {

		var oFormat;
		var aDates = [];
		var oDate1,
			oDate2;

		//If we have version of control with delimiter, then sValue should consist of two dates delimited with delimiter,
		//hence we have to split the value to these dates
		var sDelimiter = c.call(this);
		if ((sDelimiter && sDelimiter !== "") && sValue) {
			aDates = sValue.split(sDelimiter);
			if (aDates.length === 2) {
				// if delimiter only appears once in value (not part of date pattern) remove " " to be more flexible for input
				if (aDates[0].slice(aDates[0].length - 1, aDates[0].length) == " ") {
					aDates[0] = aDates[0].slice(0, aDates[0].length - 1);
				}
				if (aDates[1].slice(0, 1) == " ") {
					aDates[1] = aDates[1].slice(1);
				}
			} else {
				aDates = sValue.split(" " + sDelimiter + " "); // Delimiter appears more than once -> try with separators
			}
			if (aDates.length < 2) {
				// no delimiter found -> maybe only " " is used
				var aDates2 = sValue.split(" ");
				if (aDates2.length === 2) {
					aDates = aDates2;
				}
			}
		}

		if (sValue && aDates.length <= 2) {

			oFormat = d.call(this);

			//Convert to date object(s)
			if ((!sDelimiter || sDelimiter === "") || aDates.length === 1) {
				oDate1 = oFormat.parse(sValue);
			} else if (aDates.length === 2) {
				oDate1 = oFormat.parse(aDates[0]);
				oDate2 = oFormat.parse(aDates[1]);
				if (!oDate1 || !oDate2) {
					// at least one date can not be parsed -> whole value is incorrect
					oDate1 = undefined;
					oDate2 = undefined;
				}
			}
		}

		return [ oDate1, oDate2 ];

	};
	T.prototype._formatValue = function(o, s, flag) {
		var v = '';
		var e = c.call(this);
		if (o) {
			var f;
			f = d.call(this, flag);
			if (e && e !== '' && s) {
				v = f.format(o) + ' ' + e + ' ' + f.format(s);
			} else {
				v = f.format(o);
			}
		}
		return v;
	};

	return T;
});

function b(o, s) {
	if (o && s && o.getTime() > s.getTime()) {
		var t = o;
		o = s;
		s = t;
	}
	if ((o && (o.getTime() < this._oMinDate.getTime() || o.getTime() > this._oMaxDate.getTime())) || (s && (s.getTime() < this._oMinDate.getTime() || s.getTime() > this._oMaxDate.getTime()))) {
		return [ undefined, undefined ];
	} else {
		return [ o, s ];
	}

}
function _fireChange(bValid) {
	this.fireChangeEvent(this.getValue(), {
		from : this.getDateValue(),
		to : this.getSecondDateValue(),
		valid : bValid
	});

}



function c() {
	var s = this.getDelimiter();
	if (!s) {
		if (!this._sLocaleDelimiter) {
			var L = sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();
			var o = sap.ui.core.LocaleData.getInstance(L);
			var p = o.getIntervalPattern();
			var i = p.indexOf('{0}') + 3;
			var I = p.indexOf('{1}');
			s = p.slice(i, I);
			if (s.length > 1) {
				if (s.slice(0, 1) == ' ') {
					s = s.slice(1);
				}
				if (s.slice(s.length - 1, s.length) == ' ') {
					s = s.slice(0, s.length - 1);
				}
			}
			this._sLocaleDelimiter = s;
		} else {
			s = this._sLocaleDelimiter;
		}
	}
	return s;
}

function d(flag) {
	if (flag == true) {
		var p = this.getValueFormat();
	} else {
		var p = (this.getDisplayFormat() || 'medium');
	}
	var f;
	var C = this.getDisplayFormatType();
	if (p == this._sUsedDisplayPattern && C == this._sUsedDisplayCalendarType) {
		f = this._oDisplayFormat;
	} else {
		if (this._checkStyle(p)) {
			f = sap.ui.core.format.DateFormat.getInstance({
				style : p,
				strictParsing : true,
				calendarType : C
			});
		} else {
			f = sap.ui.core.format.DateFormat.getInstance({
				pattern : p,
				strictParsing : true,
				calendarType : C
			});
		}
		this._sUsedDisplayPattern = p;
		this._sUsedDisplayCalendarType = C;
		this._oDisplayFormat = f;
	}
	return f;
}
