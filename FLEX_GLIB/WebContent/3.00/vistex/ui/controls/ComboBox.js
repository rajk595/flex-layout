sap.ui.define([
               "jquery.sap.global",
               "sap/m/ComboBox",
               'sap/m/ComboBoxBase'
               
               ],function(q,ComboBox,ComboBoxBase) {

    var T = ComboBox.extend(vistexConfig.rootFolder + ".ui.controls.ComboBox", {
    	metadata: {
          	 library : vistexConfig.rootFolder + ".ui"
          	},
        renderer : "sap.m.ComboBoxRenderer"
    });
    T.prototype.setSelectedKey = function(k) {
        k = this.validateProperty('selectedKey', k);
        var i = this.getItemByKey(k);
        if (i || (k === '')) {
            if (!i && k === '') {
                i = this.getDefaultSelectedItem();
            }
            this.setSelection(i);
            if (i) {
                this.setValue(i.getText());
            } else if (i = this.getDefaultSelectedItem()) {
                this.setValue(i.getText());
            } else {
                this.setValue('');
            }
            return this;
        }
        this._sValue = this.getValue();
        return this.setProperty('selectedKey', k);
    };

    T.prototype.oninput = function(e){
        ComboBoxBase.prototype.oninput.apply(this, arguments);
        if (e.isMarked('invalid')) {
            return;
        }

        /*Check whether value exist*/
        var o = this.getSelectedItem(),
        I = this.getItems(),
        d = e.target,
        v = d.value,
        f = true,
        V = false, g, m;

        if (!this.getEnabled() || !this.getEditable()) {
            return;
        }
        var i = this._getItemsStartingText(v);
        V = !!i.length;
        if (!V && v !== '') {
            this.updateDomValue('');
            this._showWrongValueVisualEffect();
        }
        /**/

        i = 0;
        for (; i < I.length; i++) {
            g = I[i];
            m = q.sap.startsWithIgnoreCase(g.getText(), v);
            if (v === '') {
                m = true;
            }
            this._setItemVisibility(g, m);
            if (m && !V) {
                V = true;
            }
            if (f && m && v !== '') {
                f = false;
                if (this._bDoTypeAhead) {
                    this.updateDomValue(g.getText());
                }
                this.setSelection(g);
                if (o !== this.getSelectedItem()) {
                    this.fireSelectionChange({
                        selectedItem: this.getSelectedItem()
                    });
                }
                if (this._bDoTypeAhead) {
                    if (sap.ui.Device.os.blackberry || sap.ui.Device.os.android) {
                        setTimeout(s.bind(this, v.length, this.getValue().length), 0);
                    } else {
                        this.selectText(v.length, 9999999);
                    }
                }
                this.scrollToItem(this.getSelectedItem());
            }
        }
        if (v === '' || !V) {
            this.setSelection(null );
            if (o !== this.getSelectedItem()) {
                this.fireSelectionChange({
                    selectedItem: this.getSelectedItem()
                });
            }
        }
        if (V) {
            this.open();
        } else {
            this.isOpen() ? this.close() : this.clearFilter();
        }
    };

    T.prototype._getItemsStartingText = function(t) {
        var i = [];
        this.getItems().forEach(function(o) {
            if (q.sap.startsWithIgnoreCase(o.getText(), t)) {
                i.push(o);
            }
        }, this);
        return i;
    };

    T.prototype._showWrongValueVisualEffect =  function() {
        var o = this.getValueState();
        if (o === sap.ui.core.ValueState.Error) {
            return;
        }
        this.setValueState(sap.ui.core.ValueState.Error);
        q.sap.delayedCall(1000, this, 'setValueState', [o]);
    };

    return T;
});