/**
 * Copyright(c) 2017 Johan van de Merwe, <https://www.enovision.net>
 *
 * license: MIT-style license
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
     * @cfg{String} src
     * URL to the PDF - Same Domain or Server with CORS Support
     */
    src: '',

    /**
     * @cfg{Boolean} pageBorders
     * Show light borders on the left and right of the pages
     */
    pageBorders: true,

    /**
     * @cfg{Double} pageScale
     * Initial scaling of the PDF. 1 = 100%
     */
    pageScale: 1,

    /**
     * @cfg{Boolean} disableWorker
     * Disable workers to avoid yet another cross-origin issue(workers need the URL of
     * the script to be loaded, and currently do not allow cross-origin scripts)
     */
    disableWorker: true,

    /**
     * @cfg{Boolean} disableTextLayer
     * Enable to render selectable but hidden text layer on top of an PDF-Page.
     * This feature is buggy by now and needs more investigation!
     */
    disableTextLayer: true, // true by now, cause it´s buggy

    /**
     * @cfg{String} loadingMessage
     * The text displayed when loading the PDF.
     */
    loadingMessage: 'Loading PDF, please wait...',

    /**
     * @cfg{String} beforePageText
     * The text displayed before the input item.
     */
    beforePageText: 'Page',

    /**
     * @cfg{String} afterPageText
     * Customizable piece of the default paging text. Note that this string is formatted using
     *{0} as a token that is replaced by the number of total pages. This token should be preserved when overriding this
     * string if showing the total page count is desired.
     */
    afterPageText: 'of {0}',

    /**
     * @cfg{String} firstText
     * The quicktip text displayed for the first page button.
     * **Note**: quick tips must be initialized for the quicktip to show.
     */
    firstText: 'First Page',

    /**
     * @cfg{String} prevText
     * The quicktip text displayed for the previous page button.
     * **Note**: quick tips must be initialized for the quicktip to show.
     */
    prevText: 'Previous Page',

    /**
     * @cfg{String} nextText
     * The quicktip text displayed for the next page button.
     * **Note**: quick tips must be initialized for the quicktip to show.
     */
    nextText: 'Next Page',

    /**
     * @cfg{String} lastText
     * The quicktip text displayed for the last page button.
     * **Note**: quick tips must be initialized for the quicktip to show.
     */
    lastText: 'Last Page',

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
     * @cfg {Boolean} mouseWheelEnabled
     * Specifies whether the mouse wheel should trigger spinning up and down while the field has focus.
     * Defaults to true.
     */
    mouseWheelEnabled: true,
    /**
     * @cfg{string} html
     * This element is modified in the initComponent function
     */
    html: '',

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            dockedItems: [{
                dock: 'bottom',
                reference: 'PagingToolbar',
                xtype: 'toolbar',
                items: [{
                    reference: 'first',
                    tooltip: this.firstText,
                    overflowText: this.firstText,
                    iconCls: 'ext ext-double-chevron-left',
                    disabled: true,
                    handler: 'moveFirst'
                }, {
                    reference: 'prev',
                    tooltip: this.prevText,
                    overflowText: this.prevText,
                    iconCls: 'ext ext-chevron-left',
                    disabled: true,
                    handler: 'movePrevious'
                }, '-', this.beforePageText, {
                    xtype: 'pdfviewer_pagenumber',
                    reference: 'inputItem',
                    name: 'inputItem',
                    cls: Ext.baseCSSPrefix + 'tbar-page-number',
                    width: this.inputItemWidth,
                    margins: '-1 2 3 2',
                    disabled: true,
                    listeners: {
                        keydown: 'onPagingKeyDown',
                        blur: 'onPagingBlur'
                    }
                }, {
                    xtype: 'tbtext',
                    reference: 'afterTextItem',
                    text: Ext.String.format(this.afterPageText, 1),
                    margins: '0 5 0 0'
                }, '-', {
                    reference: 'next',
                    tooltip: this.nextText,
                    overflowText: this.nextText,
                    iconCls: 'ext ext-chevron-right',
                    disabled: true,
                    handler: 'moveNext'
                }, {
                    reference: 'last',
                    tooltip: this.lastText,
                    overflowText: this.lastText,
                    iconCls: 'ext ext-double-chevron-right',
                    disabled: true,
                    handler: 'moveLast'
                }, '->', {
                    reference: 'scaleCombo',
                    xtype: 'pdfviewer_scalecombo',
                    disabled: true,
                    width: this.scaleWidth,
                    listeners: {
                        change: 'onScaleChange',
                        blur: 'onScaleBlur'
                    }
                }]
            }]
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

    privates: {
        getHtml: function () {
            PDFJS.disableTextLayer = this.disableTextLayer;
            var extraCls = this.pageBorders ? ' bordered' : '';
            var html = '<canvas class="pdf-page-container' + extraCls + '"></canvas>';
            html += !PDFJS.disableTextLayer ? '<div class="pdf-text-layer"></div>' : '';
            return html;
        }
    }
});