sap.ui.define([vistexConfig.rootFolder + "/ui/core/underscore-min",
vistexConfig.rootFolder + "/ui/core/Formatter",

], function (underscoreJS, Formatter) {
    var vui5;
    window.underscoreJS = underscoreJS;
    window.Formatter = Formatter;

    function initializeControlVariables() {
        return vui5.ui = {
            controls: {
                Address: eval(vistexConfig.rootFolder + ".ui.controls.Address"),
                Attachments: eval(vistexConfig.rootFolder + ".ui.controls.Attachments"),
                ComboBox: eval(vistexConfig.rootFolder + ".ui.controls.ComboBox"),
                DateRange: eval(vistexConfig.rootFolder + ".ui.controls.DateRange"),
                EvaluationForm: eval(vistexConfig.rootFolder + ".ui.controls.EvaluationForm"),
                FilterBar: eval(vistexConfig.rootFolder + ".ui.controls.FilterBar"),
                List: eval(vistexConfig.rootFolder + ".ui.controls.List"),
                MicroChartControl: eval(vistexConfig.rootFolder + ".ui.controls.MicroChartControl"),
                NonResponsiveTable: eval(vistexConfig.rootFolder + ".ui.controls.NonResponsiveTable"),
                Notes: eval(vistexConfig.rootFolder + ".ui.controls.Notes"),
                ObjectHeader: eval(vistexConfig.rootFolder + ".ui.controls.ObjectHeader"),
                Partners: eval(vistexConfig.rootFolder + ".ui.controls.Partners"),
                Postings: eval(vistexConfig.rootFolder + ".ui.controls.Postings"),
                ProcessFlow: eval(vistexConfig.rootFolder + ".ui.controls.ProcessFlow"),
                ResponsiveTable: eval(vistexConfig.rootFolder + ".ui.controls.ResponsiveTable"),
                Selections: eval(vistexConfig.rootFolder + ".ui.controls.Selections"),
                Sets: eval(vistexConfig.rootFolder + ".ui.controls.Sets"),
                SetValues: eval(vistexConfig.rootFolder + ".ui.controls.SetValues"),
                SnappingHeader: eval(vistexConfig.rootFolder + ".ui.controls.SnappingHeader"),
                Status: eval(vistexConfig.rootFolder + ".ui.controls.Status"),
                //SummaryView: eval(vistexConfig.rootFolder + ".ui.controls.SummaryView"),
                Texts: eval(vistexConfig.rootFolder + ".ui.controls.Texts"),
                TilesGroup: eval(vistexConfig.rootFolder + ".ui.controls.TilesGroup"),
                Tree: eval(vistexConfig.rootFolder + ".ui.controls.Tree"),
                TreeTable: eval(vistexConfig.rootFolder + ".ui.controls.TreeTable"),

                Attributes: eval(vistexConfig.rootFolder + ".ui.controls.Attributes"),
                Form: eval(vistexConfig.rootFolder + ".ui.controls.Form"),
                InputHelp: eval(vistexConfig.rootFolder + ".ui.controls.InputHelp"),
                Messages: eval(vistexConfig.rootFolder + ".ui.controls.Messages"),
                UserPreferences: eval(vistexConfig.rootFolder + ".ui.controls.UserPreferences"),
                PersonalizationDialog: eval(vistexConfig.rootFolder + ".ui.controls.PersonalizationDialog"),
                MultiValue: eval(vistexConfig.rootFolder + ".ui.controls.MultiValue"),
                AggregationPanel: eval(vistexConfig.rootFolder + ".ui.controls.AggregationPanel"),
                QuickEntryForm: eval(vistexConfig.rootFolder + ".ui.controls.QuickEntryForm"),
                QuickEntryDialog: eval(vistexConfig.rootFolder + ".ui.controls.QuickEntryDialog"),
                MassEditDialog: eval(vistexConfig.rootFolder + ".ui.controls.MassEditDialog"),
                //*****Rel 60E_SP6
                MessageDialog: eval(vistexConfig.rootFolder + ".ui.controls.MessageDialog"),
                //*****
                //*****Rel 60E_SP7
                Switch: eval(vistexConfig.rootFolder + ".ui.controls.Switch"),
                Events: eval(vistexConfig.rootFolder + ".ui.controls.Events"),
                MultiGroupPanel: eval(vistexConfig.rootFolder + ".ui.controls.MultiGroupPanel"),
                //*****
            },
            callBack: {
                showPanelContent: "showPanelContentCallBack",
                serverResponse: 'serverResponseCallBack',
                callServer: 'callServerCallBack',
                updateProperties: 'updatePropertiesCallBack',
                processCommonSections: 'processCommonSectionsCallBack',
                handleRouteMatched: 'handleRouteMatchedCallBack',
                processAction: 'processActionCallBack',
                updateDocumentData: 'updateDocumentDataCallBack',
                getChangedData: 'getChangedDataCallBack'
            },


        }
    }

    function initializeGlobalVariables() {
        vui5 = {
            cons: {
                //*****Rel 60E_SP6
                handle: 'HANDLE',
                callBackCallFrom: {
                    metadata_data: "1"
                },

                bulkEditType: {
                    none: "",
                    client: "C",
                    server: "S"
                },
                quickEntryType: {
                    singleValue: "1",
                    multiValue: "2",
                    multiLineEntry: "3"
                },
                aggregate: {
                    sum: "1",
                    maximum: "2",
                    minimum: "3",
                    average: "4"
                },
                date_format: "yyyy-MM-dd",
                fromTableForm: "fromTableForm",
                keyValues: "keyValues",
                textValues: "textValues",
                multiValueField: "_MUL",
                //*****
                functionBehaviour: {
                    add: '1',
                    "delete": "2"
                },
                downloadType: {
                    server: "1",
                    client: "2"
                },
                specialCharacters: {
                    numeric: '_--3',
                    slash: '_-'
                },
                rowAsDetails: {
                    subPage: 'A'
                },
                applicationContext: {
                    list: 'list',
                    document: 'document',
                    popup: 'popup',
                    listProcess: 'listProcess'
                },
                variant: {
                    standard: "*standard*"
                },
                applicationIdentifier: {
                    dashboard: 'vzdshbd',
                    overviewPage: "OVP0",
                    reportingView: "VZRV0"
                },
                objectHeaderCategory: {
                    title: '1',
                    subTitle: '2',
                    attribute: '3',
                    numeric: '4',
                    status: '5'
                },
                facetGroups: {
                    formFacet: "1",
                    chartFacet: "3",
                    keyValueFacet: "2"
                },
                errorContext: {
                    onInputValueChange: "1",
                    onInputValueCheck: "2",
                    onInputValueConversion: "3"
                },
                //*****Rel 60E_SP6 - ECIP #16807*/
                regions: {
                    0: 'GB',
                    1: 'IT',
                    2: 'FI',
                    3: 'RU',
                    4: 'AE',
                    5: 'PK',
                    6: 'BD',
                    7: 'ID',
                    8: 'PH',
                    9: 'JP',
                    10: 'AU',
                    11: 'NC',
                    12: 'NZ',
                    13: 'TO',
                    14: 'TO',
                    15: 'US',
                    16: 'US',
                    17: 'US',
                    18: 'US',
                    19: 'US',
                    20: 'CL',
                    21: 'BR',
                    22: 'BR',
                    23: 'GL'
                },
                /**/
                eventName: {
                    cancel: 'CANCEL',
                    continue: 'CONTINUE',
                    update: 'UPDATE',
                    helpValuesGet: 'HELPVALUESGET',
                    layoutManage: 'LAYOUT_MANAGE',
                    fieldValueCheck: 'FIELDVALUECHECK',
                    fieldValueConversion: 'FIELDVALUECONVERSION',
                    fieldValueChange: "FIELDVALUECHANGE",
                    controlVariantsRead: 'CVARREAD',
                    controlVariantDataRead: 'CVARDATAREAD',
                    controlVariantMaintain: 'CVARMAINTAIN',
                    controlVariantsSave: 'CVARSAVE',
                    applicationInitialize: 'APPINIT',
                    applicationContinue: 'APPCNT',
                    multiLevelContinue: "MLVL_CONTINUE",
                    expand: 'EXPAND',
                    variantMaintain: "CVARMAINTAIN",
                    variantSelect: "CVARSELECT",
                    fileUpload: "FILEUPLOAD",
                    themeSave: "THEME_SAVE",
                    pageChange: 'PAGECHANGE',
                    attachmentUpload: 'ATUPL',
                    attachmentRename: 'ATRNM',
                    attachmentReplace: 'ATRPLC',
                    attachmentDeletion: 'ATDEL',
                    attachmentDownload: 'ATDNL',
                    commentUpdate: 'CTUPD',
                    dictionaryUpdate: 'DICTUPD',
                    snapshotManage: 'SNPMNG',
                    iGridDataGet : 'IGD_DATAGET',
                    check: 'CHECK',
                    fullScreen: 'FULLSCREEN',
                    setValues: 'SETVALUES',
                    setValuesApply: 'SETVALAPPLY',
                    save: 'SAVE',
                    excelExport: 'EXLEXPORT',
                    navigate: 'NAVIGATE',
                    chck: "CHCK",
                    //*****Rel 60E_SP6
                    quickEntry: "QUICKENTRY",
                    massEditApply: "MASSEDITAPPLY",
                    notesUpdate: 'NTUPD',
                    addMoreRowsDelete: "AMRDEL",
                    toolBarSpacer: "$$TBSPACER$$",
                    messageButton: "$$MSGBTN$$",
                    //*****
                    //*****Rel 60E_SP7
                    bookMarkManage: "BOOKMARK_MANAGE"
                    //*****
                },
                fieldSubEvent: {
                    typeAhead: 'TYPEAHEAD',
                    filter: 'FILTER',
                    showAll: 'SHOWALL',
                    search: 'SEARCH',
                    clear: 'CLEAR',
                    search_from_suggestion: 'SEARCH_FROM_SUGGESTION'
                },
                propName: {
                    loadMetaData: 'LDMDT'
                },
                loadMetaData: {
                    always: 'A',
                    once: 'B',
                    none: ''
                },
                context: {
                    role: 'Init',
                    worklist: 'Worklist',
                    infocus: 'Infocus',
                    modal_action: 'Modal_action'
                },
                params: {
                    uiProfile: '$UIProfile',
                    depObject: '$depobj',
                    docID: '$DocID',
                    metadata: '$metadata',
                    metadatanData: '$metadata_n_data',
                    fieldName: '$FieldName',
                    fieldValue: '$FieldValue',
                    eventType: '$EventType',
                    tableName: '$TabName',
                    searchHelpName: '$SearchHelp',
                    selectedSearchHelpName: '$SelSearchHelp',
                    rollName: '$RollName',
                    dataAreaID: '$DataAreaID',
                    maxRows: '$MaxRows',
                    parentSection: '$ParentSection',
                    parentSectionKey: '$ParentSectionKey',
                    mode: '$MODE',
                    initialCall: '$InitCall',
                    conversionExit: "$ConversionExit",
                    nrart: '$Nrart',
                    checkValue: "$CheckValue",
                    getDescription: "$GetDescription",
                    currency: "$Currency",
                    unit: "$Unit",
                    /**grid 3.0**/
                    entireData: "$entireData",
                    /***/
                    handle: "$Handle",
                    overwrite: "$Overwrite",
                    overwrite_properties: "$Overwrite_prop",
                    global: '$Global',
                    markStandardAsDefault: '$MarkStandardAsDefault',
                    selectedRow: '$RowId',
                    action: '$Action',
                    modal_action: '$Modal_action',
                    dashboardId: '$DashboardID',
                    widgetId: '$WidgetID',
                    actionId: '$ActionID',
                    objid: '$OBJID',
                    workspace: '$WRKSP',
                    counter: '$CONTR',
                    sumId: '$SumId',
                    entity: '$Entity',
                    variantID: '$VARID',
                    pageNumber: '$PAGNO',
                    theme: '$THEME',
                    valueLow: '$VALUEL',
                    valueHigh: '$VALUEH',
                    searchType: '$SEARCHTYPE',
                    modalFunctionSection: '$ModalFnSectn',
                    functionBehaviour: "$FNBVR",
                    displayOnly: '$DISOL',
                    updateCallFrom: "$updateCallFrom",
                    multiValue: "$MultiValue",
                    //*****Rel 60E_SP6
                    acnum: "$ACNUM",
                    outcome: "$outcome",
                    comment: "$comment",
                    //*****
                    dictionary: "$DICTIONARY",
                    label: "$LABEL",
                    cardID: "$CARDID",
                },
                attributes: {
                    onSearch: 'onSearch',
                    onClick: 'onClick',
                    showFilterConfiguration: 'showFilterConfiguration',
                    //*****Rel 60E_SP6
                    hideFilterBar: 'hideFilterBar',
                    //*****
                    onDrillDown: 'onDrilldown',
                    enableSearchAndReplace: "enableSearchAndReplace",
                    enableSetValues: "enableSetValues",
                    rowSelection: "rowSelection",
                    enablePersonalization: "enablePersonalization",
                    maxItems: "rowCount",
                    displayedPages: "displayedPages",
                    pageSize: "pageSize",
                    pageType: "pageType",
                    selectedFilter: "selectedFilter",
                    onSelectionChange: "onSelectionChange",
                    titleSeparator: "titleSeparator",
                    subTitleSeparator: "subTitleSeparator",
                    /****** Rel 60E_SP7 TASK #52848  */
                    mergeDuplicates: 'mergeDuplicates',
                    /***/
                    inlineEdit: "INEDT",
                    enableLocalSearch: "enableLocalSearch",
                    onVariantMaintain: "onVariantMaintain",
                    onVariantSelect: "onVariantSelect",
                    onUpdateNote: "OnNotesUpdate",
                    selectedVariant: "selectedVariant",
                    onTriggerSelect: "onTriggerSelect",
                    onFlowSelect: "onFlowSelect",
                    onTriggerUndo: "onTriggerUndo",
                    //Postings
                    onTriggerCreate: "onTriggerCreate",
                    onTriggerClick: "onTriggerClick",
                    onRowSelect: "onRowSelect",
                    //
                    onStepUndo: "onStepUndo",
                    onOutcomeSelect: "onOutcomeSelect",
                    onOutcomeUndo: "onOutcomeUndo",
                    onStatusSet: "onStatusSet",
                    onInactiveSet: "onInactiveSet",
                    //*****Rel 60E_SP6
                    onActivityNavigate: "onActivityNavigate",
                    //*****
                    onPartnerFunctionChange: "onPartnerFunctionChange",
                    onPartnerUpdate: "onPartnerUpdate",
                    onPartnerDelete: "onPartnerDelete",
                    onFilterSelect: "onFilterSelect",
                    gridElementKeyAdd: "gridElementKeyAdd",
                    onReevaluate: "onReevaluate",
                    onButtonProcess: "onButtonProcess",
                    onHyperLinkNav: "onHyperLinkNav",
                    onRename: "onAttachmentRename",
                    onDelete: "onAttachmentDelete",
                    onUpload: "onAttachmentUpload",
                    onReplace: "onAttachmentReplace",
                    onDownload: "onAttachmentDownload",
                    onDisableUpload: "disableUpload",
                    onTextUpdate: "onTextUpdate",
                    onTabSelect: "onTabSelect",
                    SelectedTextID: "SelectedTextID",
                    handle: "handle",
                    onTileClick: "onTileClick",
                    attributeFieldName: "attributeFieldName",
                    showCurrentAttrVal: "showCurrentAttrVal",
                    onPrintPreview: "onPrintPreview",
                    onDeleteAddress: "onDeleteAddress",
                    onCreateAddress: "onCreateAddress",
                    header: "header",
                    subHeader: "subHeader",
                    number: "number",
                    footer: "footer",
                    contentType: "contentType",
                    content: "content",
                    icon: "icon",
                    unit: "unit",
                    textFieldName: "textFieldName",
                    iconFieldName: "iconFieldName",
                    selectionFieldName: "selectionFieldName",
                    title: "titleField",
                    description: "subtitleField",
                    counter: "countField",
                    iconField: "iconField",
                    //Planning Grid
                    layoutChange: "layoutChange",
                    procedureExecute: "procedureExecute",
                    refreshDerivation: "refreshDerivation",
                    saveAsSnapshot: "saveAsSnapshot",
                    dictionary: "dictionary",
                    overwriteSnapshot: "overwriteSnapshot",
                    saveAsProforma: "saveAsProforma",
                    totalNumberofPages: "totalNumberOfPages",
                    backendSortFilter: "backendSortFilter",
                    commentUpdate: "commentUpdate",
                    saveAsPriceProposal: "saveAsPriceProposal",
                    enableSearch: 'enableSearch',
                    parentKeyField: "parentKeyField",
                    keyField: "keyField",
                    descriptionField: "descriptionField",
                    selectedField: "selectedField",
                    onNodeSelect: "onNodeSelect",
                    refreshLiveProforma: "refreshLiveProforma",
                    onNavigate: "onNavigate",
                    disableExcelExport: "disableExcelExport",
                    hideExpanderControl: "hideExpanderControl",
                    enableQuickEntry: "enableQuickEntry",
                    enableRowColor: "enableRowColor",
                    //MassEdit
                    enableBulkEdit: "bulkEdit",
                    //*****Rel 60E_SP6 - HeatMap, Hierarchy Tree
                    onCellClick: "onCellClick",
                    onDoubleClick: "onDoubleClick",
                    onLinkClick: "onLinkClick",
                    onSwitchState: "onSwitchState",
                    onDimensionChange: "onDimensionChange",
                    onCellExpand: "onCellExpand",
                    onDetails: "onDetails",
                    //*****
                    //*****Rel 60E_SP6 - Sanofi Req
                    enableDescriptionSearch: "enableDescriptionSearch",
                    //*****
                    dictionaryUpdate: "dictionaryUpdate",
                    snapshotManage: "snapshotManage",
                    enableLazyLoading : "enableLazyLoading",
                    pageChange: "pageChange",
                    hideVariantSave: "hideVar",
                    selectedLayout: "selectedLayout",
                    /***Rel 60E SP6 ECDM #4728 - Start ***/
                    hideShare: "hideShare",
                    /***Rel 60E SP6 ECDM #4728 - End ***/
                    //*****Rel 60E_SP7
                    onDateResolChange: "onDateResolChange",
                    onEventAdd: "onEventAdd",
                    onEventDelete: "onEventDelete",
                    onNoEarlierThanChange: "onNoEarlierThanChange",
                    onNoLaterThanChange: "onNoLaterThanChange",
                    onSwitchChange: "onSwitchChange",
                    onAvailabilityClick: "onAvailabilityClick"
                    //*****
                },
                tileContentType: {
                    numeric: 'NUMERIC',
                    image: 'IMAGE'
                },
                nodeName: {
                    elementAttributes: 'ELEMENT_ATTRB',
                    //*****Rel 60E_SP7
                    complexElementAttributes: 'CELEMENT_ATTRB',
                    //*****
                    sectionProperties: 'SECTN_PROP',
                    fieldProperties: 'FIELDS',
                    functionProperties: 'FUNCT',
                    propSuffix: '_PROP',
                    summaryViewSuffix: '_SMVW',
                    reportingViewSuffix: '_RPVW',
                    evalGridPrefix: 'EVG__',
                    sections: 'SECTN',
                    documentFunctions: 'DOFUN',
                    docFuncProp: 'DOFUN_PROP',
                    postings: 'PO',
                    tradeCalendar: 'TC',
                    dropdowns: 'DROPDOWNS',
                    variant: "_VARIANT",
                    layout: "_LAYOUT",
                    inclusions: "IL",
                    exclusions: "EL",
                    review: "RE",
                    fixedSectionProp: "FXSCT_PROP",
                    total: "_TOTAL",
                    popupFunctions: "POPUP_FUNC",
                    popupFunctionProp: "POPUP_FUNC_PROP",
                    quickEntry: "_QEM",
                    /***Rel 60E SP6 ECIP #17325 - Start ****/
                    sectionConfig: "SECCFG",
                    /***Rel 60E SP6 ECIP #17325 - End ****/
                    //*****Rel 60E_SP6
                    eventsSuffix: "__EVNT"
                    //*****
                },
                rowSelection: {
                    none: "",
                    single: "1",
                    multiple: "2"
                },
                //*****Rel 60E_SP6 - QA #11460
                selectionControl: {
                    none: "",
                    optional: "1",
                },
                //*****
                UIType: {
                    listWithProcessing: '2',
                    worklist: '1',
                    infocus: '0'
                },
                actionType: {
                    pageNavigation: '1',
                    drilldown: '2',
                    back: '3',
                    refresh: '4',
                    cancel: '5',
                    section_change: '6',
                    filters: '8',
                    popup: '9',
                    //*****Rel 60E_SP6
                    outcome: '10',
                    messageLog: '11'
                    //*****
                },
                layoutType: {
                    line: 'LL',
                    tab: 'TL',
                    pageWithTabs: 'PL'
                },
                modelPath: {
                    login: '/LOGIN',
                    appContext: '/APPCTX',
                    sessionInfo: '/SESSION_INFO',
                    worklistUIPrf: '/WLPRFINFO',
                    infocusUIPrf: '/INPRFINFO',
                    themes: '/THEMES'
                },
                route: {
                    worklist: 'worklist',
                    infocus: 'infocus',
                    launch: 'launch',
                    dashboard: 'dashboard'
                },
                mode: {
                    display: 'A',
                    change: 'V',
                    create: 'H'
                },
                modeValue: {
                    A: 'DISPLAY',
                    V: 'CHANGE',
                    H: 'CREATE'
                },
                modeText: {
                    display: 'DISPLAY',
                    change: 'CHANGE',
                    create: 'CREATE'
                },
                navType: {
                    ui_application: '1',
                    webgui: '2',
                    bsp_application: '3'
                },
                updkz: {
                    ins: "I",
                    upd: "U",
                    del: "D"
                },
                confirmActions: {
                    cancel: 'C',
                    yes: 'Y',
                    no: 'N'
                },
                element: {
                    input: 'A',
                    valueHelp: 'B',
                    dropDown: 'C',
                    checkBox: 'D',
                    link: 'I',
                    text: 'J',
                    progressIndicator: "P",
                    button: 'N',
                    textBox: 'R',
                    upload: 'U',
                    label: 'S',
                    //*****Rel 60E_SP6 - Task #39097
                    toggle: 'T',
                    //*****
                    //*****Rel 60E_SP7
                    toggle_inputs: 'TI',
                    objectStatus: 'OS',
                    slider: 'SL'
                    //*****
                },
                propertyType: {
                    form: 'F',
                    table: '1',
                    status: '2',
                    notes: '3',
                    partners: '4',
                    texts: '5',
                    attachments: '6',
                    proforma: '7',
                    attributes: '8',
                    time: '0',
                    evaluationForm: 'EF',
                    address: 'AD',
                    flowStatus: 'B',
                    dashboard: 'DB',
                    evaluation: 'E',
                    applicationExtension: 'X',
                    applicationFragment: 'Z',
                    rulesOverview: 'R',
                    selections: 'S',
                    variant: 'V',
                    snappingHeader: 'SH',
                    reportingView: 'RV',
                    summary: 'SV',
                    chart: 'CH',
                    objectheader: 'OH',
                    tilesGroup: 'TG',
                    tree: 'T',
                    treeTable: 'TT',
                    list: 'L',
                    HTML: 'H',
                    //Postings
                    postings: 'P',
                    processFlow: 'PF',
                    tradecalendar: 'TC',
                    planningGrid: 'PL',
                    pricingGrid: 'PG',
                    pdfViewer: 'PV',
                    sets: 'ST',
                    synopsis: "SY",
                    statementEditor: 'SE',
                    //*****Rel 60E_SP6
                    heatMap: "HM",
                    hierarchyTree: "HT",
                    availsHeader: "10",
                    //*****
                    //*****Rel 60E_SP7
                    events: "EV",
                    //*****,
                    overviewPage: "OV"
                },
                styleType: {
                    color: '1',
                    icon: '2'
                },
                stateConstants: {
                    None: "",
                    Error: "1",
                    Warning: "3",
                    Success: "2"
                },
                dateFormat: {
                    type0: "",
                    type1: 'dd.MM.yyyy',
                    type2: 'MM/dd/yyyy',
                    type3: 'MM-dd-yyyy',
                    type4: 'yyyy.MM.dd',
                    type5: 'yyyy/MM/dd',
                    type6: 'yyyy-MM-dd',
                    typeA: 'yyyy/MM/dd',
                    typeB: 'yyyy/MM/dd',
                    typeC: 'yyyy/MM/dd'
                },
                fieldType: {
                    dropdown: '1',
                    toolbar: '2',
                    segment: '3',
                    date: '4',
                    //*****Rel 60E_SP6
                    facetFilter: '5'
                    //*****

                },
                func: {
                    showAsIcon: 'A',
                    showInList: 'B'
                },
                functionDisplayType: {
                    icon: '1',
                    text: '2'
                },
                fieldValue: {
                    value: 'A',
                    description: '',
                    value_descr: 'B',
                    value_cont_descr: 'C'
                },
                tableType: {
                    responsive: "",
                    nonresponsive: '1',
                    grid: "2"
                },
                functControl: {
                    mainAndDetail: "",
                    main: "1",
                    detail: "2"
                },
                processingType: {
                    create: "1",
                    search: "2"
                },
                fileFormat: {
                    excel_format: "EXL",
                    csv_format: "CSV",
                    text_format: "TXT",
                    tab_delimited: "TAB",
                    fixed_format: "FIX",
                    pdf_format: "PDF"
                },
                pagingType: {
                    noPaging: "",
                    virtualPaging: "1",
                    serverPaging: "2"
                },
                reqType: {
                    post: "POST",
                    get: "GET"
                },
                reqTypeValue: {
                    local: "1",
                    post: "2",
                    get: "3"
                },
                changeEventType: {
                    noEvent: "",
                    serverEvent: "X",
                    clientEvent: "Y"
                },
                seloptSign: {
                    include: "I",
                    exclude: "E"
                },
                dataType: {
                    character: "CHAR",
                    date: "DATS",
                    time: "TIMS",
                    number: "NUMC",
                    decimal: "DEC",
                    amount: "CURR",
                    currencyKey: "CUKY",
                    quantity: "QUAN",
                    unit: "UNIT",
                    floatingPoint: "FLTP",
                    language: "LANG",
                    string: "STRG",
                    raw: "RAW",
                    sstring: "SSTR",
                    integer: "INT"
                },
                intType: {
                    character: "C",
                    number: "N",
                    date: "D",
                    time: "T",
                    integer: "I",
                    packed: "P",
                    hexaDecimal: "X",
                    oneByteInteger: "b",
                    twoByteInteger: "s",
                    xString: "y",
                    flatStructure: "u",
                    deepStructure: "v",
                    float: "F",
                    string: "g",
                    decimal16: "a",
                    decimal32: "e"
                },
                dropdownsDatar: "$DRPDN",
                procced_with_errors: "P",
                screenSize: {
                    desktop: "1400px",
                    tablet: "780px",
                    mobile: "420px"
                },
                maxDataLimit: 100000,
                operators: [{
                    value: 'EQ',
                    text: 'EQ',
                    symbol: '=='
                }, {
                    value: 'NE',
                    text: 'NE',
                    symbol: '!='
                }, {
                    value: 'BT',
                    text: 'BT',
                    symbol: '[ ]'
                }, {
                    value: 'NB',
                    text: 'NB',
                    symbol: '] ['
                }, {
                    value: 'LE',
                    text: 'LE',
                    symbol: '<='
                }, {
                    value: 'LT',
                    text: 'LT',
                    symbol: '<'
                }, {
                    value: 'GT',
                    text: 'GT',
                    symbol: '>'
                }, {
                    value: 'GE',
                    text: 'GE',
                    symbol: '>='
                }, {
                    value: 'CP',
                    text: 'CP',
                    symbol: '=*'
                }, {
                    value: 'NP',
                    text: 'NP',
                    symbol: '!=*'
                }],
                viewType: {
                    chart: "1",
                    grid: "3",
                    microchart: "M",
                    value: "4"
                },
                charts: {
                    column: "01",
                    bar: "02",
                    line: "03",
                    pie: "04",
                    donut: "05",
                    stackedColumn: "06",
                    stackedBar: "07",
                    combination: "08",
                    stackedCombination: "09",
                    bubble: "10",
                    scatter: "11",
                    heatmap: "12",
                },
                microcharts: {
                    radial: "05",
                    harvey: "04",
                    column: "01",
                    comparison: "02",
                    bullet: "07",
                    delta: "06",
                    stacked_bar: "03"
                },
                thresholds: {
                    Good: "1",
                    Error: "2",
                    Critical: "3",
                    Neutral: "4"
                },
                axsct: {
                    xaxis: "X",
                    yaxis: "Y",
                    chstc: "C",
                    bubbleWidth: "B",
                    sbcst: "S"
                },
                actionConfirmationType: {
                    noConfirm: "",
                    confirm: "1",
                    confirmForSave: "2",
                    confirmWithActions: "3"
                },
                selectionType: {
                    none: "",
                    single: "1",
                    multiple: "2"
                },
                customViewType: {
                    global: 'G',
                    application: 'A'
                },
                buttonType: {
                    none: "",
                    emphasize: "1",
                    accept: "2",
                    reject: "3",
                    menuButton: "4",
                    //*****Rel 60E_SP6
                    transparent: "5",
                    segmentedButton: "6"
                    //*****
                },
                //*****Rel 60E_SP6
                buttonStyle: {
                    none: "",
                    accept: "1",
                    reject: "2",
                    transparent: "3",
                    message: "4"
                },
                //*****
                menuDisplay: {
                    icon: "1",
                    text: "2"
                },
                groups: {
                    sectionGroup: "$GROUP"
                },
                updateCallFrom: {
                    tabChange: "1",
                    //*****Rel 60E_SP6 - QA #9410
                    searchAndReplace: "2",
                    //*****
                    personalization: "X"
                },
                //*****Rel 60E_SP6
                outcome: {
                    approve: "OCM_APPROVE",
                    reject: "OCM_REJECT"
                },
                outcomeType: {
                    accept: "1",
                    reject: "2"
                },
                //*****
                //MassEdit
                massEditType: {
                    keepExisting: 'KE',
                    leaveBlank: 'LB',
                    newValue: 'NV',
                    valueHelp: 'VH'
                },
                /*** Rel 60E SP7 - Display Messages in Dialog - Start***/
                messageDisplayType: {
                    popover: '',
                    dialog: "1"
                }
                /*** Rel 60E SP7 - Display Messages in Dialog - End***/
            },
            session: {
                maxTime: 60,
                ccounter: 60,
                scounter: 60,
                counterPause: false,
                extensionPath: "",
                notify: 15,
                sessionend_skip: false,
                fromFioriLaunchpad: false,
                user: ""
            },
            server: {
                url: {
                    full: "",
                    guiId: "",
                    baseUrl: "",
                    object: ""
                }
            },
            fromOtherApp: false,
            depApp: "",
            headerLess: false,
            showBusyIndicator: false,
            utilitiesDomain: "sap.vistex.utilities",
            utilitiesPath: "sap/vistex/utilities",
            app: "sap.vistex.document",
            appPath: "sap/vistex/document",
            asyncRequestCount: 0,
            themeRoot: "",
            theme: "",
            dateRangeDelimiter: "..."
        };

        initializeControlVariables();
        return vui5;
    }

    function fillFunctionDeclrations() {
        vui5.server.url.get = function (config) {
            var url = vui5.server.url.full;
            if (!vui5.server.url.full) {
                url = vui5.server.url.icf;
                var guiId;
                if (vui5.server.url.guiId == null || vui5.server.url.guiId == "") {
                    guiId = Math.floor((Math.random() * 100) + 1) + '' + Math.floor((Math.random() * 100) + 1);
                    vui5.server.url.guiId = guiId;
                } else {
                    guiId = vui5.server.url.guiId;
                }
                guiId = 'sid(' + guiId + ')';
                if (url.substring(url.length - 1) != '/') {
                    url += '/';
                }
                url += guiId + '/';
                vui5.server.url.baseURL = url;
                if (vui5.server.url.object) {
                    url += vui5.server.url.object;
                }
            }
            if (config.urlParams) {
                url += $.param(config.urlParams);
            }
            vui5.server.url.full = url;
            return url;
        };
        vui5.server.url.getDescriptionServerUrl = function () {
            var url = vui5.server.url.baseURL;
            url += vui5.server.url.descriptionServerICF;
            return url;
        };
    }

    function documentInitializeVariables() {
        if (jQuery.sap.getUriParameters().get('depapp')) {
            vui5.depApp = (jQuery.sap.getUriParameters().get('depapp')).toUpperCase();
        }
        vui5.appExtPath = "";
        vui5.appExtControllerPath = "";
        vui5.worklistReload = false;
        vui5.server.url.icf = vistexConfig.hcpDestination ? vistexConfig.hcpDestination + '/sap/vui/app' : '/sap/vui/app';
        vui5.server.url.appCls = '';
        vui5.server.url.guiId = '';
        vui5.server.url.object = '$obj=' + vui5.cons.applnObject + '&' + vui5.cons.application;
        vui5.i18n = "i18n";
        vui5.modelName = "mainModel";
        vui5.server.url.guiId = '';
        // vui5.rKey = "R_KEY";
        vui5.rowID = "ROWID";
        vui5.virtualRoot = "VRTLROOT";
        vui5.initColumns = "INITCOLUMNS";
        vui5.editableCells = "EDITABLECELLS";
        vui5.readOnlyColumns = "READONLYCOLUMNS";
        vui5.filterID = 'NAME';
        vui5.cons.actions = {
            variantSave: "VSAVE",
            variantDelete: "VDELE",
            search: "SEARCH"
        };
        vui5.cons.linkType = {
            reports: "4"
        };


    }

    initializeGlobalVariables();
    fillFunctionDeclrations();
    window.vui5 = vui5;
    return {
        vui5: vui5,
        initializeGlobalVariables: initializeGlobalVariables,
        documentInitializeVariables: documentInitializeVariables,
        initializeControlVariables: initializeControlVariables

    };
});