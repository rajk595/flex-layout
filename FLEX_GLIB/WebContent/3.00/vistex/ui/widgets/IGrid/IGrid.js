define = undefined;
sap.ui.define([ "sap/ui/core/Control"
], function(control) {
	'use strict';
	var _grid = control.extend(vistexConfig.rootFolder + ".ui.widgets.IGrid.IGrid", {
		init: function(){
			this.randomNumber = Math.floor((Math.random() * 100) + 1) + '' + Math.floor((Math.random() * 100) + 1);
		},
		
		renderer : function(oRM, oControl) {
			var id = 'gridWrapper';			
			id  = id + oControl.randomNumber;
			oRM.write("<div class='ts-grid-standalone' style='height:100%'>");
			oRM.write("<div id=" + "'" + id + "'" + " data-bind='with: gridSettings'>");
/**ESP6 TASK# 31147 - Grid Integration **/
			//	var htmlStr = "<div data-bind=\" component: {'name': 'ts-grid', params: {data: data, config: config, comments: comments, scales: scales,assumptions: assumptions, type: type ,callbacks: callbacks}}\"></div>";
			var htmlStr = "<div data-bind=\" component: {'name': 'ts-grid', params: $data}\"></div>";
/****/
			oRM.write(htmlStr);
			oRM.write(" </div>");
			oRM.write(" </div>");
		}
	});
	return _grid;
});