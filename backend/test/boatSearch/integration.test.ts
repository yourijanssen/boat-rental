import { BoatSequelizeDatabase } from '../../src/data/sequelize/boat';
import sinon from 'sinon';
import { expect } from 'chai';
import { Boat } from '../../src/business/model/boat';
import { BoatService } from '../../src/business/service/boat';

/**
 * @author Youri Janssen
 * Integration test suite for the BoatService.
 * Here we use a mock.
 */
describe('Integration Tests: BoatService', async () => {
    let boatService: BoatService;
    let boatSequelizeDatabaseMock: sinon.SinonMock;

    beforeEach(() => {
        const boatSequelizeDatabaseInstance = new BoatSequelizeDatabase();
        boatSequelizeDatabaseMock = sinon.mock(boatSequelizeDatabaseInstance);
        boatService = new BoatService(boatSequelizeDatabaseInstance);
    });

    afterEach(() => {
        boatSequelizeDatabaseMock.verify();
    });

    it('should return a boat when an existing boat is searched', async () => {
        const expectedBoat = {
            name: 'test',
            price_per_day_in_cents: 100,
            capacity: 5,
            license_required: false,
            skipper_required: false,
            facilities: ['test'],
        };

        boatSequelizeDatabaseMock
            .expects('searchBoats')
            .withArgs('test')
            .resolves(expectedBoat);

        const result = await boatService.searchBoats('test');
        expect(result).to.include(expectedBoat);

        boatSequelizeDatabaseMock.verify();
    });

    it('should return an empty array when no boats are found', async () => {
        const noDataResponse: Boat[] = [];

        boatSequelizeDatabaseMock
            .expects('searchBoats')
            .withArgs('test')
            .resolves(noDataResponse);

        const result = await boatService.searchBoats('test');
        expect(result).to.equal(noDataResponse);

        boatSequelizeDatabaseMock.verify();
    });
});
