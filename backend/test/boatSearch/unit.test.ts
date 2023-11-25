import { expect } from 'chai';
import { Boat } from '../../src/business/model/boats';
import { SearchQuery } from '../../src/business/model/searchQuery';

/**
 * @author Youri Janssen
 * Unit test suite for the SearchQuery and Boat classes.
 */
describe('Unit Tests: SearchQuery class', () => {
    it('should return no errors when using a valid search query', () => {
        const searchQuery = new SearchQuery('ship');
        const queryValidation: string[] | null = searchQuery.validateQuery();
        expect(queryValidation).to.be.null;
    });

    it('should return an error when using an empty search query', () => {
        const searchQuery = new SearchQuery('');
        const queryValidation: string[] | null = searchQuery.validateQuery();
        expect(queryValidation).to.deep.equal([
            'A search query should contain at least 1 character',
        ]);
    });

    it('should return no error when using a search query with minimum length (1 character)', () => {
        const searchQuery = new SearchQuery('T');
        const queryValidation: string[] | null = searchQuery.validateQuery();
        expect(queryValidation).to.be.null;
    });

    it('should return no error when using a search query with maximum length (150 characters)', () => {
        const searchQuery = new SearchQuery('T'.repeat(150));
        const queryValidation: string[] | null = searchQuery.validateQuery();
        expect(queryValidation).to.be.null;
    });

    it('should return an error when using a search query over the maximum length (151 characters)', () => {
        const searchQuery = new SearchQuery('T'.repeat(151));
        const queryValidation: string[] | null = searchQuery.validateQuery();
        expect(queryValidation).to.deep.equal([
            'A search query cannot contain more than 150 characters',
        ]);
    });
});
describe('Unit Tests: Boat class', () => {
    it('should return boats in alphabetical order', () => {
        const boats: Boat[] = [
            Boat.createBoat('Sailboat', 1000, 6, true, true, ['Toilet']),
            Boat.createBoat('Speedboat', 1200, 4, false, true, ['Toilet']),
            Boat.createBoat('Rowboat', 800, 8, false, false, ['Toilet']),
        ];

        const sortedBoats = Boat.returnBoatsAlphabetically(boats);

        expect(sortedBoats[0].testName).to.deep.equal('Rowboat');
        expect(sortedBoats[1].testName).to.deep.equal('Sailboat');
        expect(sortedBoats[2].testName).to.deep.equal('Speedboat');
    });
});
