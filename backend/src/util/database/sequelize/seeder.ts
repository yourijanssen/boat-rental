import { BoatModel } from './models/boat';
import { BoatfacilityModel } from './models/boatFacility';
import { FacilityModel } from './models/facility';

/**
 * @author Youri Janssen
 * Class for seeding boats in the database.
 * @class
 */
export class SequelizeSeeder {
    /**
     * @author Youri Janssen
     * Seeds boats into the database.
     * @returns {Promise<void>} A Promise that resolves when the boats are seeded.
     */
    public async seedBoats(): Promise<void> {
        await BoatModel.bulkCreate([
            {
                name: 'Speedboat',
                price_per_day_in_cents: 300,
                capacity: 4,
                license_required: true,
                skipper_required: true,
            },
            {
                name: 'Rowboat',
                price_per_day_in_cents: 300,
                capacity: 4,
                license_required: true,
                skipper_required: true,
            },
            {
                name: 'Sailboat',
                price_per_day_in_cents: 300,
                capacity: 4,
                license_required: true,
                skipper_required: true,
            },
        ] as BoatModel[]);
    }
    /**
     * @author Youri Janssen
     * Seeds facilities into the database.
     * @returns {Promise<void>} A Promise that resolves when the facilities are seeded.
     */
    public async seedFacility(): Promise<void> {
        await FacilityModel.bulkCreate([
            {
                facility: 'Toilet',
            },
            {
                facility: 'Shower',
            },
            {
                facility: 'Electricity',
            },
        ] as FacilityModel[]);
    }

    /**
     * @author Youri Janssen
     * Seeds boat-facility relationships into the database.
     * @returns {Promise<void>} A Promise that resolves when the boat-facility relationships are seeded.
     */
    public async seedBoatFacility(): Promise<void> {
        const boatFacilities = [
            { boat_id: 1, facility_id: 1 },
            { boat_id: 1, facility_id: 2 },
            { boat_id: 2, facility_id: 2 },
            { boat_id: 3, facility_id: 1 },
            { boat_id: 3, facility_id: 3 },
        ];

        await BoatfacilityModel.bulkCreate(
            boatFacilities as BoatfacilityModel[]
        );
    }
}
