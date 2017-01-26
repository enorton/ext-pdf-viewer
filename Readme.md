ext-pdf-viewer (Sencha ExtJS v6 package)
========================================

This package is heavily based on the <a href="http://SunboX.github.com/ext_ux_pdf_panel/demo/">ext_ux_pdf_panel</a> from SunboX. I have updated his version to a 
Extjs 6.x package.

This package is developed for classic browser applications. It doesn't require
the use of Sencha CMD but it is very much recommended.

No Browser Plugin required, pure JavaScript. PDF Rendering is done using the great Mozilla PDF.js Library (<a href="https://github.com/mozilla/pdf.js">https://github.com/mozilla/pdf.js</a>).

### Install ###
Place this package in the 'packages/local' folder of your application or workspace.
Then put the following in your app.json:

    "classic": {
        "requires": [
           "ext-pdf-viewer",
           ....
        ],
        ...
  },

### Usage 1 (as xtype) ###

    items: [{
        title: 'Viewer',
        xtype: 'pdfviewer_panel',
        layout: 'fit',
        src: '/data/sample2.pdf'
    },
    ...    


### Usage 2 (with Ext.create) ###

    Ext.create('PdfViewer.panel.PDF', {
        title    : 'PDF Panel',
        width    : 489,
        height   : 633,
        pageScale: 0.75,                                           // Initial scaling of the PDF. 1 = 100%
        src      : 'http://cdn.mozilla.net/pdfjs/tracemonkey.pdf', // URL to the PDF - Same Domain or Server with CORS Support
        renderTo : Ext.getBody()
    });
    
### Config settings ###
    
#### pageBorders ####
Places a border in the SASS value $color_neutral around the page (default:true)<br/>
See folder sass/etc/ext.all   

#### pageScale ####
Initial scale of shown pages, 1 = 100%, 2 = 200% (default:1)

#### tooltips and other text ####
See PDF.js in the 'src/view/panel' folder for all the configs, but
currently all texts are in English, but are editable to configure in your
own language. You could extend the panel to your own and making it German,
Dutch or whatever language you like.

    
### Demo ###

For an demo, please visit <a href="http://SunboX.github.com/ext_ux_pdf_panel/demo/">http://SunboX.github.com/ext_ux_pdf_panel/demo/</a>

