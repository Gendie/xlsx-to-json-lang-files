
'use strict';

function toCamelCase(text) {
    if(!text) return '';
    text = String(text);
    let forbiddenCharIndex = text.search(/[^A-Za-z0-9_]/);
    for(let i = 0; i < 255 && forbiddenCharIndex > -1; i++) {
            text = removeBreak(text, forbiddenCharIndex);
            forbiddenCharIndex = text.search(/[^A-Za-z0-9_]/);
        }
    if(text[0].search(/[0-9]/) > -1) {
        text = "_" +  text;
    } else {
        text = text[0].toLowerCase() +  text.substr(1);
    }
	return text;
}
function removeBreak(text, breakIndex) {
    return text.substr(0, breakIndex) 
            + (text[breakIndex+1] || '').toUpperCase()
            + text.substr(breakIndex+2);
}

function generateCharSeries(start, end, skip) {
    const startASCII = start.charCodeAt(0);
    const endASCII = end.charCodeAt(0);
    let chars = [];
    for(let asci = startASCII; asci <= endASCII; asci++) {
        if(skip.findIndex(char => char === String.fromCharCode(asci)) > -1) {
            continue;
        }
        chars.push(String.fromCharCode(asci));
    }
    return chars;
}

module.exports = {
    toCamelCase: toCamelCase,
    generateCharSeries: generateCharSeries
}