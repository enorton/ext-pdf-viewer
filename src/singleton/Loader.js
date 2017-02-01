/**
 * @copyright   Enovision GmbH
 * @author      Johan van de Merwe
 * @licence     MIT-Styled License
 * @date        31 Jan 2017
 * @class       PdfViewer.singleton.Loader
 *
 */
Ext.define('PdfViewer.singleton.Loader', {
    singleton: true,
    alternateClassName: ['PdfViewerLoader'],

    /**
     * @cfg{String} loadingMessage
     * Shown when the document loads
     * default: 'Loading PDF, please wait...'
     */
    loadingMessage: 'Loading PDF, please wait...',
    /**
     * @cfg{String} beforePageText
     * default: 'Page'
     */
    beforePageText: 'Page',
    /**
     * @cfg{String} afterPageText
     * default: 'of {0}'
     */
    afterPageText: 'of {0}',
    /**
     * @cfg{String} firstText
     * default: 'First Page'
     */
    firstText: 'First Page',
    /**
     * @cfg{String} prevText
     * default: 'Previous Page'
     */
    prevText: 'Previous Page',
    /**
     * @cfg{String} nextText
     * default: 'Next Page'
     */
    nextText: 'Next Page',
    /**
     * @cfg{String} lastText
     * default: 'Last Page'
     */
    lastText: 'Last Page',

    config: {
        /**
         * @cfg{Boolean} disableTextLayer
         * When set to false the Textlayer Builder will not be available
         * used for text select (copy & paste)
         */
        disableTextLayer: false,
        /**
         * @cfg{Boolean} showPerPage
         * when true pages will show one page at a time, otherwise it will
         * show the document as a contineous flow
         */
        showPerPage: true,
        /**
         * @cfg{Double} pageScale
         * default: 1 = 100% (f.e. 1.25 = 125% etc...)
         */
        pageScale: 1,
        /**
         * @cfg{Boolean} pageBorders
         * default: true, shows a border in the SASS $neutral_color color
         * see: sass/etc/all.scss for more details
         */
        pageBorders: true
    },

    callBack: function () {
        this.setLoadingMessage(this.loadingMessage);
    },

    constructor: function (config, callBack) {
        this.initConfig(config);

        var filename;
        filename = Ext.getResourcePath('lib/pdf.js/build/minified/web/compatibility.js', null, 'ext-pdf-viewer');
        this.loader(filename, 'js');
        filename = Ext.getResourcePath('lib/pdf.js/build/minified/build/pdf.js', null, 'ext-pdf-viewer');
        this.loader(filename, 'js');

        if (this.getDisableTextLayer() === false) {
            filename = Ext.getResourcePath('lib/pdf.js/build/minified/build/text_layer_builder.js', null, 'ext-pdf-viewer');
            this.loader(filename, 'js');
        }

        // filename = Ext.getResourcePath('lib/pdf.js/text_layer_builder.css', null, 'ext-pdf-viewer');
        // this.loader(filename, 'css');

    },

    loader: function (filename, filetype) {
        var fileref;
        if (filetype == "js") { //if filename is a external JavaScript file
            fileref = document.createElement('script');
            fileref.setAttribute("type", "text/javascript");
            fileref.setAttribute("src", filename);
        }
        else if (filetype == "css") { //if filename is an external CSS file
            fileref = document.createElement("link");
            fileref.setAttribute("rel", "stylesheet");
            fileref.setAttribute("type", "text/css");
            fileref.setAttribute("href", filename);
        }
        if (typeof fileref != "undefined")
            document.getElementsByTagName("head")[0].appendChild(fileref);
    }
});