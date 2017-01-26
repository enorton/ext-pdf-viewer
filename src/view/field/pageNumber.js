/**
 * Copyright(c) 2017 Johan van de Merwe, <https://www.enovision.net>
 *
 * license: MIT-style license
 */
Ext.define('PdfViewer.view.field.pageNumber', {
    extend: 'Ext.form.field.Number',
    xtype: 'pdfviewer_pagenumber',
    allowDecimals: false,
    minValue: 1,
    hideTrigger: true,
    enableKeyEvents: true,
    keyNavEnabled: false,
    selectOnFocus: true,
    submitValue: false,
    isFormField: false
});