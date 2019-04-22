
const xlsxToJson = require("../../lib/xlsx-to-json-lang-files");

xlsxToJson(
    './example-file.xlsx', 
    './translation-output',
    {
        startColumn: 'A',   // Default is A
        endColumn: 'F',     // Default is Z
        startRow: 1,        // Default is 0
        endRow: 'auto',        // Default is auto
        useSheetName: true
    }
);