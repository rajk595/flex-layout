sap.ui.define(['jquery.sap.global', 'sap/ui/Device', 'sap/ui/base/DataType',
  'sap/ui/core/library', // library dependency
  'jquery.sap.mobile'], // referenced here to enable the Support feature
  function (jQuery, Device, DataType, CoreLibrary) {
      sap.ui.getCore().initLibrary({
          name: vistexConfig.rootFolder + ".ui.controls",
          version: "2.00",
          dependencies: ["sap.m", "sap.ui.core", "sap.ui.table", "sap.uxap", "sap.ui.comp", "sap.suite.ui.microchart", "sap.suite.ui.commons", "sap.ui.commons"],
          types: [],
          interfaces: [],
          controls: [
            vistexConfig.rootFolder + ".ui.controls.Address",
            vistexConfig.rootFolder + ".ui.controls.Attachments",
            vistexConfig.rootFolder + ".ui.controls.ChartControl",
            vistexConfig.rootFolder + ".ui.controls.ComboBox",
            vistexConfig.rootFolder + ".ui.controls.DateRange",
            vistexConfig.rootFolder + ".ui.controls.EvaluationForm",
            vistexConfig.rootFolder + ".ui.controls.FilterBar",
            vistexConfig.rootFolder + ".ui.controls.FlowStatus",
            vistexConfig.rootFolder + ".ui.controls.List",
            vistexConfig.rootFolder + ".ui.controls.MicroChartControl",
            //*****Rel 60E_SP7
            vistexConfig.rootFolder + ".ui.controls.MultiGroupPanel",
            //*****
            vistexConfig.rootFolder + ".ui.controls.NonResponsiveTable",
            vistexConfig.rootFolder + ".ui.controls.Notes",
            vistexConfig.rootFolder + ".ui.controls.ObjectHeader",
            vistexConfig.rootFolder + ".ui.controls.Partners",
            vistexConfig.rootFolder + ".ui.controls.Postings",
            vistexConfig.rootFolder + ".ui.controls.ProcessFlow",
            vistexConfig.rootFolder + ".ui.controls.ReportingView",
            vistexConfig.rootFolder + ".ui.controls.ResponsiveTable",
            vistexConfig.rootFolder + ".ui.controls.RulesOverView",
            vistexConfig.rootFolder + ".ui.controls.Selections",
            vistexConfig.rootFolder + ".ui.controls.Sets",
            vistexConfig.rootFolder + ".ui.controls.SetValues",
            vistexConfig.rootFolder + ".ui.controls.SnappingHeader",
            vistexConfig.rootFolder + ".ui.controls.Status",
            vistexConfig.rootFolder + ".ui.controls.Switch",
            vistexConfig.rootFolder + ".ui.controls.Texts",
            vistexConfig.rootFolder + ".ui.controls.TilesGroup",
            vistexConfig.rootFolder + ".ui.controls.TreeTable",
            vistexConfig.rootFolder + ".ui.controls.Tree",
            vistexConfig.rootFolder + ".ui.controls.Form",
            vistexConfig.rootFolder + ".ui.controls.InputHelp",
            vistexConfig.rootFolder + ".ui.controls.Attributes",
            vistexConfig.rootFolder + ".ui.controls.PersonalizationDialog",
            vistexConfig.rootFolder + ".ui.controls.Messages",
            vistexConfig.rootFolder + ".ui.controls.UserPreferences",
            vistexConfig.rootFolder + ".ui.controls.MultiValue",
            vistexConfig.rootFolder + ".ui.controls.AggregationPanel",
            vistexConfig.rootFolder + ".ui.controls.QuickEntryForm",
            vistexConfig.rootFolder + ".ui.controls.QuickEntryDialog",
            vistexConfig.rootFolder + ".ui.controls.MassEditDialog",
            vistexConfig.rootFolder + ".ui.controls.MessageDialog",
            vistexConfig.rootFolder + ".ui.controls.Events",
          ],
          elements: [],
          noLibraryCSS: true
      });

      jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath(vistexConfig.rootFolder + ".ui.controls") + "/styles.css");
      return eval(vistexConfig.rootFolder + ".ui.controls");
  });