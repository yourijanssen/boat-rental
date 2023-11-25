import request, { Response } from 'supertest';
import { expect } from 'chai';
import { SERVER } from '../../src/server';
import sinon from 'sinon';
import { BoatSequelizeDatabase } from '../../src/data/sequelize/get-boat';
import { Boat } from '../../src/business/model/boats';

/**
 * @author Youri Janssen
 * E2E test suite for the /register endpoint.
 * Here we use a stub, that we spy upon.
 */
describe('E2E Tests: /boat route', async () => {
    let searchBoatsStub: sinon.SinonStub;

    beforeEach(() => {
        searchBoatsStub = sinon.stub(
            BoatSequelizeDatabase.prototype,
            'searchBoats'
        );
    });

    afterEach(() => {
        searchBoatsStub.restore();
    });

    it('Should return 200 when boats are found or no boats are found', async () => {
        const mockBoat = Boat.createBoat('Mock Boat', 2000, 5, true, true, [
            'Toilet',
        ]);

        searchBoatsStub.resolves([mockBoat]);

        const expected = [mockBoat];

        const actual: Response = await request(SERVER.app).get(
            '/boat/search?q=boat'
        );

        expect(actual.statusCode).equals(200);
        expect(actual.body).to.deep.equals(expected);

        // Spy verification
        sinon.assert.calledOnce(searchBoatsStub);
        sinon.assert.calledWith(searchBoatsStub, 'boat');
    });

    it('Should return 500 when a server error occurs', async () => {
        searchBoatsStub.resolves('server_error');

        const expected = {
            error: 'A server error occurred',
        };

        const actual: Response = await request(SERVER.app).get(
            '/boat/search?q=boat'
        );
        expect(actual.statusCode).equals(500);
        expect(actual.body).to.deep.equals(expected);

        // Spy verification
        sinon.assert.calledOnce(searchBoatsStub);
        sinon.assert.calledWith(searchBoatsStub, 'boat');
    });
});
