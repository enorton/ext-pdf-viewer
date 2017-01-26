ext-pdf-viewer (Sencha ExtJS v6 package)
========================================

This package is heavily based on the <a href="http://SunboX.github.com/ext_ux_pdf_panel/demo/">ext_ux_pdf_panel</a> from SunboX. I have updated his version to a 
Extjs 6.x package.

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

Sencha CMD has the habit to compress all the javascript when creating a build. To avoid
this "compression attack" for the Mozilla pdfjs files it is required to add the following
at the top of your app.js:

    Ext.require([
       'Ext.container.Viewport',
       'PdfViewer.singleton.Loader' // this is the one
    ]);
        
This singleton puts dynamically the needed pdfjs files in the head of your index.html file.
This reduces the effort of adding the tags in this file yourself and it will give no errors
when creating your own build, for the paths are always correctly set.

### Usage 1 (as xtype) ###

    items: [{
        title: 'Viewer',
        xtype: 'pdfviewer_panel',
        layout: 'fit',
        src: '/data/sample2.pdf'
    },
    ...    


### Usage 2 (with Ext.create) ###

    Ext.create('PdfViewer.view.panel.PDF', {
        title    : 'PDF Panel',
        width    : 600,
        height   : 500,
        pageScale: 1.25, 
        src      : 'http://cdn.mozilla.net/pdfjs/tracemonkey.pdf', 
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

For an demo, please visit <a href="https://enovision.github.io/Viewer">https://enovision.github.io/Viewer</a>

