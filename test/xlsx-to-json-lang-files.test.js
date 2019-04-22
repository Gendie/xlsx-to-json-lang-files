

const assert = require('assert');
const rewire = require('rewire');
const xlsxToJsonPath = '../lib/xlsx-to-json-lang-files';
// const xlsxToJson = require(xlsxToJsonPath);

describe('xlsx-to-json-lang-files', () => {

    describe('getXlsxSheets(pathToXlsx)', () => {
        it('Read xlsx file from path', () => {
            const getXlsxSheets = rewire(xlsxToJsonPath).__get__('getXlsxSheets');
            const xlsxSheets = getXlsxSheets(__dirname + '\\test-files\\test-file.xlsx');
            const xlsxFirstSheet = xlsxSheets[0];
            const xlsxSheetName = xlsxFirstSheet.name;
            const xlsxSheetData = xlsxFirstSheet.content;
            
            return expect(xlsxSheetName).toBe('page') && 
                    expect(xlsxSheetData['A2']).toBe('text on banner') && 
                    expect(xlsxSheetData['C3']).toBe('gå til favorit') && 
                    expect(xlsxSheetData['D3']).toBe(undefined);
        });

    });

    describe('sheetDataToJson(pathToXlsx)', () => { //sheetDataToJson(sheet, sheetName, generalBoundry, skipColumns, useSheetName)
        const sheetDataToJson = rewire(xlsxToJsonPath).__get__('sheetDataToJson');
        const testingSheet = {
            B1: { v: 'en' }, C1: { v: 'dk' }, A2: { v: 'text on banner' }, B2: { v: 'welcome to website' },
            C2: { v: 'velkommen til hjemmesiden' }, A3: { v: 'text on menu 1' }, B3: { v: 'go to favorite' },
            C3: { v: 'gå til favorit' }
        }
        it('Happy path!', () => 
            assert.deepEqual(
                sheetDataToJson(
                    testingSheet, 
                    'page',
                    {
                        startColumn: 'A',
                        endColumn: 'C',
                        startRow: 1
                    }
            ),
                {
                    en: {
                        textOnBanner: "welcome to website",
                        textOnMenu1: "go to favorite"
                    },
                    dk: {
                        textOnBanner: "velkommen til hjemmesiden",
                        textOnMenu1: "gå til favorit"
                    }
                }
            )
        );
        it('Skip Column', () => 
            assert.deepEqual(
                sheetDataToJson(
                    testingSheet, 
                    'page',
                    {
                        startColumn: 'A',
                        endColumn: 'C',
                        startRow: 1
                    },
                    ['C']
            ),
                {
                    en: {
                        textOnBanner: "welcome to website",
                        textOnMenu1: "go to favorite"
                    }
                }
            )
        );
        it('Use sheet names', () => 
            assert.deepEqual(
                sheetDataToJson(
                    testingSheet, 
                    'page',
                    {
                        startColumn: 'A',
                        endColumn: 'C',
                        startRow: 1
                    },
                    null,
                    true
            ),
                (() => {
                    let obj = {};
                    obj.en = {};
                    obj.en["page.textOnBanner"] = "welcome to website";
                    obj.en["page.textOnMenu1"] = "go to favorite";
                    obj.dk = {};
                    obj.dk["page.textOnBanner"] = "velkommen til hjemmesiden";
                    obj.dk["page.textOnMenu1"] = "gå til favorit";
                    return obj;  
                })()
            )
        );
    });
    
});