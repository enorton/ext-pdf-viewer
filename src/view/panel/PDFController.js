/**
 * Copyright(c) 2017 Johan van de Merwe, <https://www.enovision.net>
 *
 * license: MIT-style license
 */
Ext.define('PdfViewer.view.panel.PDFController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.PDFController',

    requires: [
        'PdfViewer.util.PDF.TextLayerBuilder'
    ],

    init: function (view) {
    },

    control: {
        '#': {
            boxready: 'onBoxReady',
            onSetSrc: 'onSetSrc',
            onGetDocument: 'onGetDocument',
            afterrender: 'onAfterrender'
        }
    },

    onSetSrc: function (src) {
        var me = this.getView();
        me.src = src;
        return this.getDocument();
    },

    onGetDocument: function () {
        this.getDocument();
    },

    onBoxReady: function () {
        var view = this.getView();
        view.loader = new Ext.LoadMask({
            msg: view.loadingMessage,
            target: view
        });
        view.loader.show();
    },

    onAfterrender: function () {
        var view = this.getView();
        view.pageContainer = view.el.query('.pdf-page-container')[0];
        view.pageContainer.mozOpaque = true;

        var ctx = view.pageContainer.getContext('2d');
        ctx.save();
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.fillRect(0, 0, view.pageContainer.width, view.pageContainer.height);
        ctx.restore();

        if (!PDFJS.disableTextLayer) {
            view.textLayerDiv = view.el.query('.pdf-text-layer')[0];
        }
    },

    onLoad: function () {
        try {
            var view = this.getView(), isEmpty;

            isEmpty = view.pdfDoc.numPages === 0;
            view.currentPage = view.currentPage || (isEmpty ? 0 : 1);

            this.renderPage(view.currentPage);
        }
        catch (error) {
            Ext.log({level: "warning"}, "PDF: Can't render: " + error.message);
        }
    },

    getDocument: function () {
        var me = this;
        var view = me.getView();
        if (!!view.src) {
            PDFJS.getDocument(view.src).then(function (pdfDoc) {
                view.pdfDoc = pdfDoc;
                me.onLoad();
            });
        }
        return view;
    },

    renderPage: function (num) {
        var view = this.getView(),
            toolbar = this.lookupReference('PagingToolbar'),
            isEmpty, pageCount,
            currPage, afterText;

        if (view.isRendering) return;

        view.isRendering = true;
        view.currentPage = num;

        currPage = view.currentPage;
        pageCount = view.pdfDoc.numPages;
        afterText = Ext.String.format(view.afterPageText, isNaN(pageCount) ? 1 : pageCount);
        isEmpty = pageCount === 0;
        Ext.suspendLayouts();
        this.lookup('afterTextItem').setText(afterText);
        this.lookup('inputItem').setDisabled(isEmpty).setValue(currPage);
        this.lookup('first').setDisabled(currPage === 1 || isEmpty);
        this.lookup('prev').setDisabled(currPage === 1 || isEmpty);
        this.lookup('next').setDisabled(currPage === pageCount || isEmpty);
        this.lookup('last').setDisabled(currPage === pageCount || isEmpty);
        this.lookup('scaleCombo').setDisabled(isEmpty).setValue(view.pageScale);

        // Using promise to fetch the page
        view.pdfDoc.getPage(num).then(function (page) {

            if (!view.pageContainer) {
                // pageContainer not available. Widget destroyed already?
                Ext.log({level: "warning"}, "PDF: pageContainer not ready to render page.");

                Ext.resumeLayouts(true);
                view.isRendering = false;

                return;
            }

            var viewport = page.getViewport(view.pageScale);
            view.pageContainer.height = viewport.height;
            view.pageContainer.width = viewport.width;

            var ctx = view.pageContainer.getContext('2d');
            ctx.save();
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.fillRect(0, 0, view.pageContainer.width, view.pageContainer.height);
            ctx.restore();

            var textLayer = view.textLayerDiv ? Ext.create('PdfViewer.util.PDF.TextLayerBuilder', {
                    textLayerDiv: view.textLayerDiv
                }) : null;

            // Render PDF page into canvas context
            var renderContext = {
                canvasContext: ctx,
                viewport: viewport,
                textLayer: textLayer
            };

            page.render(renderContext);

            Ext.resumeLayouts(true);

            view.isRendering = false;

            if (view.loader) {
                view.loader.destroy();
            }

            if (view.rendered) {
                view.fireEvent('change', view, {
                    current: view.currentPage,
                    total: view.pdfDoc.numPages
                });
            }
        });
    },

    moveFirst: function () {
        var me = this.getView();
        if (me.fireEvent('beforechange', me, 1) !== false) {
            this.renderPage(1);
        }
    },

    movePrevious: function () {
        var me = this.getView(),
            prev = me.currentPage - 1;

        if (prev > 0) {
            if (me.fireEvent('beforechange', me, prev) !== false) {
                this.renderPage(prev);
            }
        }
    },

    moveNext: function () {
        var me = this.getView(),
            total = me.pdfDoc.numPages,
            next = me.currentPage + 1;

        if (next <= total) {
            if (me.fireEvent('beforechange', me, next) !== false) {
                this.renderPage(next);
            }
        }
    },

    moveLast: function () {
        var me = this.getView(),
            last = me.pdfDoc.numPages;

        if (me.fireEvent('beforechange', me, last) !== false) {
            this.renderPage(last);
        }
    },

    onPagingBlur: function (e) {
     //   var curPage = this.getView().currentPage;
     //   this.lookup('inputItem').setValue(curPage);
    },

    onPagingKeyDown: function (field, e) {
        var me = this.getView(),
            k = e.getKey(),
            increment = e.shiftKey ? 10 : 1,
            pageNum, total = me.pdfDoc.numPages;

        if (k == e.RETURN) {
            e.stopEvent();
            pageNum = this.readPageFromInput();
            if (pageNum !== false) {
                pageNum = Math.min(Math.max(1, pageNum), total);
                if (me.fireEvent('beforechange', me, pageNum) !== false) {
                    this.renderPage(pageNum);
                }
            }
        } else if (k == e.HOME || k == e.END) {
            e.stopEvent();
            pageNum = k == e.HOME ? 1 : total;
            field.setValue(pageNum);
        } else if (k == e.UP || k == e.PAGE_UP || k == e.DOWN || k == e.PAGE_DOWN) {
            e.stopEvent();
            pageNum = this.readPageFromInput();
            if (pageNum) {
                if (k == e.DOWN || k == e.PAGE_DOWN) {
                    increment *= -1;
                }
                pageNum += increment;
                if (pageNum >= 1 && pageNum <= total) {
                    field.setValue(pageNum);
                }
            }
        }
    },

    onPagingFocus: function () {
        this.lookup('inputItem').select();
    },

    onScaleBlur: function (e) {
       var me = this.getView();
       this.lookup('scaleCombo').setValue(me.pageScale);
    },

    onScaleChange: function (combo, newValue) {
        var view = this.getView();
        view.pageScale = newValue;
        this.renderPage(view.currentPage);
    },

    readPageFromInput: function () {
        var view = this.getView(),
            v = this.lookup('inputItem').getValue(),
            pageNum = parseInt(v, 10);

        if (!v || isNaN(pageNum)) {
            this.lookup('inputItem').setValue(view.currentPage);
            return false;
        }
        return pageNum;
    }
});