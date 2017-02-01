/**
 * @copyright   Enovision GmbH
 * @author      Johan van de Merwe
 * @licence     MIT-Styled License
 * @date        31 Jan 2017
 * @class       PdfViewer.view.panel.PDF
 *
 */
Ext.define('PdfViewer.view.panel.PDF', {
    extend: 'Ext.panel.Panel',
    controller: 'PDFController',

    xtype: 'pdfviewer_panel',

    requires: [
        'PdfViewer.view.combo.scaleCombo',
        'PdfViewer.view.field.pageNumber',
        'PdfViewer.view.panel.PDFController'
    ],

    extraBaseCls: Ext.baseCSSPrefix + 'pdf',
    extraBodyCls: Ext.baseCSSPrefix + 'pdf-body',

    autoScroll: true,

    /**
     * @cfg{Boolean|null} showPerPage
     * Show per page or as a contineous scroll as in
     * complete document as once
     */
    showPerPage: null,

    /**
     * @cfg{String} src
     * URL to the PDF - Same Domain or Server with CORS Support
     */
    src: '',

    /**
     * @cfg{Boolean|null} pageBorders
     * Show light borders on the left and right of the pages
     */
    pageBorders: null,

    /**
     * @cfg{Double|null} pageScale
     * Initial scaling of the PDF. 1 = 100%
     */
    pageScale: null,

    /**
     * @cfg{Boolean} disableWorker
     * Disable workers to avoid yet another cross-origin issue(workers need the URL of
     * the script to be loaded, and currently do not allow cross-origin scripts)
     */
    disableWorker: true,

    /**
     * @cfg{Boolean|null} disableTextLayer
     * Enable to render selectable but hidden text layer on top of an PDF-Page.
     * This feature is buggy by now and needs more investigation!
     */
    disableTextLayer: null, // see PdfViewerLoader singleton !!!

    /**
     * @cfg{String|null} loadingMessage
     * The text displayed when loading the PDF.
     */
    loadingMessage: null,

    /**
     * @cfg{String} beforePageText
     * The text displayed before the input item.
     */
    beforePageText: null,

    /**
     * @cfg{String|null} afterPageText
     * Customizable piece of the default paging text. Note that this string is formatted using
     *{0} as a token that is replaced by the number of total pages. This token should be preserved when overriding this
     * string if showing the total page count is desired.
     */
    afterPageText: null,

    /**
     * @cfg{String|null} firstText
     * The quicktip text displayed for the first page button.
     * **Note**: quick tips must be initialized for the quicktip to show.
     */
    firstText: null,

    /**
     * @cfg{String|null} prevText
     * The quicktip text displayed for the previous page button.
     * **Note**: quick tips must be initialized for the quicktip to show.
     */
    prevText: null,

    /**
     * @cfg{String|null} nextText
     * The quicktip text displayed for the next page button.
     * **Note**: quick tips must be initialized for the quicktip to show.
     */
    nextText: null,

    /**
     * @cfg{String|null} lastText
     * The quicktip text displayed for the last page button.
     * **Note**: quick tips must be initialized for the quicktip to show.
     */
    lastText: null,

    /**
     * @cfg{Number} inputItemWidth
     * The width in pixels of the input field used to display and change the current page number.
     */
    inputItemWidth: 60,

    /**
     * @cfg{Number} inputItemWidth
     * The width in pixels of the combobox used to change display scale of the PDF.
     */
    scaleWidth: 100,
    /**
     * @cfg {Boolean|null} showLoadMaskOnInit
     * Specifies whether the loadmask should show by default
     * Defaults to true.
     */
    showLoadMaskOnInit: null,
    /**
     * @cfg{string} html
     * This element is modified in the initComponent function
     */


    html: '',

    initComponent: function () {
        var me = this, dockedItems;

        dockedItems = [{
            dock: 'bottom',
            reference: 'PagingToolbar',
            xtype: 'toolbar',
            items: [{
                reference: 'first',
                tooltip: me.firstText,
                overflowText: me.firstText,
                iconCls: 'ext ext-double-chevron-left',
                disabled: true,
                handler: 'moveFirst'
            }, {
                reference: 'prev',
                tooltip: me.prevText,
                overflowText: me.prevText,
                iconCls: 'ext ext-chevron-left',
                disabled: true,
                handler: 'movePrevious'
            }, '-', me.beforePageText, {
                xtype: 'pdfviewer_pagenumber',
                reference: 'inputItem',
                name: 'inputItem',
                cls: Ext.baseCSSPrefix + 'tbar-page-number',
                width: me.inputItemWidth,
                margins: '-1 2 3 2',
                disabled: true,
                listeners: {
                    keydown: 'onPagingKeyDown',
                    blur: 'onPagingBlur'
                }
            }, {
                xtype: 'tbtext',
                reference: 'afterTextItem',
                text: Ext.String.format(me.afterPageText, 1),
                margins: '0 5 0 0'
            }, '-', {
                reference: 'next',
                tooltip: me.nextText,
                overflowText: me.nextText,
                iconCls: 'ext ext-chevron-right',
                disabled: true,
                handler: 'moveNext'
            }, {
                reference: 'last',
                tooltip: me.lastText,
                overflowText: me.lastText,
                iconCls: 'ext ext-double-chevron-right',
                disabled: true,
                handler: 'moveLast'
            }, '->', {
                reference: 'scaleCombo',
                xtype: 'pdfviewer_scalecombo',
                disabled: true,
                width: me.scaleWidth,
                listeners: {
                    change: 'onScaleChange',
                    blur: 'onScaleBlur'
                }
            }]
        }];

        if (typeof(me.dockedItems) !== 'undefined') {
            dockedItems = dockedItems.concat(me.dockedItems);
        }

        Ext.apply(me, {
            dockedItems: dockedItems
        });

        me.bodyCls = me.bodyCls || '';
        me.bodyCls += (' ' + me.extraBodyCls);

        me.cls = me.cls || '';
        me.cls += (' ' + me.extraBaseCls);

        me.callParent(arguments);

        if (me.disableWorker) {
            PDFJS.disableWorker = true;
        }

        me.html = me.getHtml();

        me.fireEvent('onGetDocument');

    },

    setSrc: function (src) {
        this.fireEvent('onSetSrc', src);
    },

    unset: function () {
        this.fireEvent('onUnset');
    },

    privates: {
        getHtml: function () {
            var html;
            // PDFJS.disableTextLayer = this.disableTextLayer;
            // var extraCls = this.pageBorders ? ' bordered' : '';
            var extraCls = '';
            html = '<div class="canvasWrapper">';
            // html += '<canvas class="pdf-page-container' + extraCls + '"></canvas>';
            // html += !PDFJS.disableTextLayer ? '<div class="textLayer"></div>' : '';
            html += '</div>';
            return html;
        }
    }
});