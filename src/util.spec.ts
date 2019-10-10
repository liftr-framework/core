import { expect } from 'chai';
import { flatten } from './util';

describe('src/util', () => {

    beforeEach(() => {
    });
    context('flatten', () => {
        it('should flatten any array that is given one level deep' , () => {
            const array = ['stuff', ['more stuff', 'and more stuff']]
            const expected = ['stuff', 'more stuff', 'and more stuff'];
            const flattendArray = flatten(array);
            expect(flattendArray).to.have.members(expected);
        });
    })
});

