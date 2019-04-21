
const Helper = require('../../lib/private/Helper');

describe('Helper', () => {

    describe('toCamelCase', () => {
        
        it('Happy Path!', () => 
        expect(
            Helper.toCamelCase('Text On Banner')
        ).toBe('textOnBanner')
        )
        
        it('Happy Path 2!', () => 
            expect(
                Helper.toCamelCase('Text on banner')
            ).toBe('textOnBanner')
        )
        
        it('Forbidden Symboles', () => 
            expect(
                Helper.toCamelCase('Text-On.banner')
            ).toBe('textOnBanner')
        )
        
        it('Forbidden Symboles at the last char', () => 
            expect(
                Helper.toCamelCase('Text-On.Banner$')
            ).toBe('textOnBanner')
        )
        
        it('Number at first char', () => 
            expect(
                Helper.toCamelCase('1 text on banner')
            ).toBe('_1TextOnBanner')
        )
        
        it('Number at first char 2', () => 
            expect(
                Helper.toCamelCase('1.Text OnBanner')
            ).toBe('_1TextOnBanner')
        )
        
        it('Only Numbers', () => 
            expect(
                Helper.toCamelCase('12')
            ).toBe('_12')
        )

    })

    describe('generateCharSeries', () => {

        it('No skip', () => 
        expect(
            JSON.stringify(Helper.generateCharSeries('B', 'E'))
        ).toBe(JSON.stringify(['B', 'C', 'D', 'E']))
        )
        
        it('With skip', () => 
            expect(
                JSON.stringify(Helper.generateCharSeries('B', 'E', ['D']))
            ).toBe(JSON.stringify(['B', 'C', 'E']))
        )
        
        it('Skip First and Last', () => 
            expect(
                JSON.stringify(Helper.generateCharSeries('B', 'E', ['B', 'E']))
            ).toBe(JSON.stringify(['C', 'D']))
        )
        
        it('Skip all', () => 
            expect(
                JSON.stringify(Helper.generateCharSeries('B', 'E', ['B', 'C', 'D', 'E']))
            ).toBe(JSON.stringify([]))
        )
        
        it('Start is greater then End', () => 
            expect(
                JSON.stringify(Helper.generateCharSeries('E', 'B'))
            ).toBe(JSON.stringify([]))
        )
        })

})



