/**
 * Copyright(c) 2017 Johan van de Merwe, <https://www.enovision.net>
 *
 * license: MIT-style license
 */
Ext.define('PdfViewer.view.combo.scaleCombo', {
    extend: 'Ext.form.field.ComboBox',
    xtype: 'pdfviewer_scalecombo',

    requires: [
        'Ext.data.ArrayStore'
    ],

    editable: false,
    keyNavEnabled: true,
    selectOnFocus: false,
    submitValue: false,

    // mark it as not a field so the form will not catch it when getting fields
    isFormField: false,

    autoSelect: true,
    store: new Ext.data.SimpleStore({
        id: 0,
        fields: ['scale', 'text'],
        data: [
            [0.5, '50%'],
            [0.75, '75%'],
            [1, '100%'],
            [1.25, '125%'],
            [1.5, '150%'],
            [2, '200%']
        ]
    }),
    valueField: 'scale',
    displayField: 'text',
    mode: 'local'
});