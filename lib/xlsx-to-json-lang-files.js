
/*
 * xlsx-to-json-lang-files
 * Copyright (c) 2019, @Gendie
 * Licensed under the MIT license.
 * https://github.com/Gendie/xlsx-to-json-lang-files.git
 */

'use strict';

const XLSX = require('xlsx');
const fs = require('fs');
var jsonFormat = require('json-format');
const Helper = require('./private/Helper.js')

function getXlsxSheets(pathToXlsxFile) {
    var workbook = XLSX.readFile(pathToXlsxFile);
    var sheetNamesList = workbook.SheetNames;
    return sheetNamesList.map(
        sheetName => {
            return {
                name: Helper.toCamelCase(sheetName),
                content: workbook.Sheets[sheetName]
            }
        }
    )
}

function sheetDataToJson(sheet, sheetName, generalBoundry, skipColumns, useSheetName) {
    var sheetBoundry = Object.assign({}, generalBoundry)
    sheetBoundry.endRow = sheetBoundry.endRow || getMaxRow(sheetBoundry, sheet);
    const columns = Helper.generateCharSeries(sheetBoundry.startColumn, sheetBoundry.endColumn, skipColumns);
    
    let json = {};
    let columnsNames = {};

    for(let c = 0; c < columns.length; c++) {
        const row = sheetBoundry.startRow
        const column = columns[c];
        const columnName = sheet[column+row].v;
        columnsNames[column] = Helper.toCamelCase(columnName);
    }
    
    if(useSheetName) {
        var sheetNameAsParentKey = Helper.toCamelCase(sheetName) + '.';
    }

    for(let row = sheetBoundry.startRow+1;  row <= sheetBoundry.endRow; row++) {
        const key = (sheetNameAsParentKey || '') + Helper.toCamelCase(sheet[columns[0]+row].v); // TODO: check if key is not duplicated
        for(let c = 1; c < columns.length; c++) {
            const column = columns[c];
            json[columnsNames[column]] =  json[columnsNames[column]] || {};
            json[columnsNames[column]][key] = ((sheet[column+row] || {}).v) || '';
        }
    }
    return json;
}

function getMaxRow(boundry, sheet) {
    let maxRow = 0;
    for(let c = boundry.startColumn.charCodeAt(0); c < boundry.endColumn.charCodeAt(0); c++) {
        let r = boundry.startRow;
        do {
            r++;
        } while(sheet[String.fromCharCode(c)+r]);
        r--;
        maxRow = r > maxRow ? r : maxRow;
    }
    return maxRow;
}

module.exports = function xlsxToJsonLangFiles (pathToXlsx, distPath, options) {
    
    // options validation
    options = options || {};
    options.useSheetName = options.useSheetName || false;
    options.oneJsonFilePerSheet = options.oneJsonFilePerSheet || false; // implement
    options.startColumn = options.startColumn || 'A';
    options.endColumn = options.endColumn > options.startColumn ? options.endColumn : 'Z';
    options.skipColumns = options.skipColumns || [];
    options.startRow = options.startRow > 0 ? options.startRow : 0;
    options.endRow = !Number.isNaN(options.endRow) && options.endRow > options.startRow ? options.endRow : null;
    
    // set boundry from options
    let boundry = {
        startColumn: options.startColumn,
        endColumn: options.endColumn,
        startRow: options.startRow,
        endRow: options.endRow
    }

    // read xlsx file and get array of its sheets
    const sheetsContainers = getXlsxSheets(pathToXlsx);

    const JSONs = sheetsContainers.map(
        sheetContainer => sheetDataToJson(sheetContainer.content, sheetContainer.name, boundry, options.skipColumns, options.useSheetName)
    )

    JSONs.forEach(
        (json, index) => {
            const keys = Object.keys(json);
            for ( let i = 0; i < keys.length; i++ ) {
                fs.writeFileSync(distPath+`/sheet-${index}-${keys[i]}.json`, jsonFormat(json[keys[i]])); 
            }
        }
    )
    
}