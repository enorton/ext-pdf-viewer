ext-pdf-viewer (Sencha ExtJS v6 package)
========================================

This package is heavily based on the ExtJS 4 version <a href="http://SunboX.github.com/ext_ux_pdf_panel/demo/">ext_ux_pdf_panel</a> from SunboX. I have updated his version to
an Extjs 6.x package and added some extra features.

### Some features ###
* Based on Mozilla's PDF.js library
* Document view per page or contineous
* Text selection for copy and paste
* Surround pages with optional borders
* Language independent 

### Sencha CMD ###
This package is developed for classic browser applications. It doesn't require
the use of Sencha CMD but it is very much recommended.

No Browser Plugin required, pure JavaScript. PDF Rendering is done using the great Mozilla PDF.js Library (<a href="https://github.com/mozilla/pdf.js">https://github.com/mozilla/pdf.js</a>).

### Install ###
Git clone this repo in the 'packages/local' folder of your application or workspace.
After that put the following in your app.json:

    "classic": {
        "requires": [
           "ext-pdf-viewer",
           ....
        ],
        ...
    },

##### IMPORTANT !!! ######
Sencha CMD has the habit to compress all the javascript when creating a build. To avoid
this "compression attack" for the Mozilla pdfjs files it is **required** to add the following
at the top of your app.js:

    Ext.require([
       'Ext.container.Viewport',
       'PdfViewer.singleton.Loader' // this is the one
    ]);
    
This singleton puts dynamically the needed pdfjs files in the head of your index.html file.
This reduces the effort of adding the tags in this file yourself and it will give no errors
when creating your own build for the paths are always correctly set.

### Text select Layers (for copy and paste) ###
By default the required JavaScript for enabling text select layers is enabled. This is done
by using the value `disableTextLayer` in the singleton mentioned earlier. You can the config
setting `disableTextLayer` to `true`, if you don't want text layers enabled.

If you have more than one panel in your application with the PDFViewer panel, where one panel
requires text select layers and the other not then you should set the value to `false`, for it
will only use this value to load the required JavaScript dynamically.

The panel where you don't want text selection you can add:

    disableTextLayer: true
    
in your panel configuration.
    
### Custom docked items ###
The PDFViewer has a paging toolbar by default. That can't be changed. But you can have additional
docking items with your panel definition. 

Sample:
    
    {
        xtype: 'pdfviewer_panel',
        layout: 'fit',
        title: 'Viewer',
        bodyPadding: 20,
        iconCls: 'fa fa-file-pdf-o',
        showLoadMaskOnInit: false,
        disableTextLayer: false,
        showPerPage: false,
        pageScale: 1.25,
        dockedItems: [{
            dock: 'top',
            xtype: 'toolbar',
            items: [{
                text: 'Button 1',
                handler: function (b, e) {
                    this.up('panel').fireEvent('btnOneClicked', b, e);
                }
            }, {
                text: 'Button 2',
                handler: function (b, e) {
                    this.up('panel').fireEvent('btnTwoClicked', b, e);
                }
            }]
        }]
    }]
    
#### Usage 1 (as xtype, with document load) ####

    items: [{
        title: 'Viewer',
        xtype: 'pdfviewer_panel',
        layout: 'fit',
        src: '/data/sample2.pdf'
    },
    ...  
      
#### Usage 2 (as xtype, no document load) ####

    items: [{
        xtype: 'pdfviewer_panel',     // xtype
        layout: 'fit',                // layout           
        title: 'Viewer',              // title
        bodyPadding: 20,              // bodyPadding, default no padding !!!
        iconCls: 'fa fa-file-pdf-o',  // iconCls
        showLoadMaskOnInit: false,    // required if you don't load document at init
        disableTextLayer: false,      // see earlier remarks
        showPerPage: false,           // show contineous documents
        pageScale: 1.25,              // initial pageScale (125%, default = 1 (100%))
        dockedItems: [{                  
            dock: 'top',
            xtype: 'toolbar',
            items: [{
                text: 'Button 1',
                handler: function (b, e) {
                    this.up('panel').fireEvent('btnOneClicked', b, e);
                }
            }, {
                text: 'Button 2',
                handler: function (b, e) {
                    this.up('panel').fireEvent('btnTwoClicked', b, e);
                }
            }]
        }]
    },
    ...        


#### Usage 3 (with Ext.create) ####

    Ext.create('PdfViewer.view.panel.PDF', {
        title    : 'PDF Panel',
        width    : 600,
        height   : 500,
        pageScale: 1.25, 
        src      : 'http://cdn.mozilla.net/pdfjs/tracemonkey.pdf', 
        renderTo : Ext.getBody()
    });
    
### Language independency ###
In the `locale` folder of this package you will find the singleton that
holds the text variables. You can add your own locale easily by adding
another language folder as `de` or `nl` with the same structure.
    
### Config settings ###

Many of the defaults you will find in the singleton `PdfViewer.singleton.loader`.
By default these values will be loaded when in your panel definition are no 
corresponding config settings found.

If you would like to change the defaults, change them in the singleton, except
for the language properties that are not part of the `config` object. You can 
change them in the `locale` folder as mentioned above.


#### showPerPage ####
If set to `true` rendering will only be done page by page. If set to `false` then
rendering will render the complete document at once and shown as a contineous scrolling
document. Paging will animate between pages without additional rendering.
    
#### pageBorders ####
Places a border in the SASS value $color_neutral around the page (default:true)<br/>
See folder sass/etc/all.scss  

#### pageScale ####
Initial scale of shown pages, 1 = 100%, 2 = 200% (default:1)

#### tooltips and other text ####
See PDF.js in the 'src/view/panel' folder for all the configs. 

    
### Demo ###

For an demo, please visit <a href="https://enovision.github.io/Viewer">https://enovision.github.io/Viewer</a>

