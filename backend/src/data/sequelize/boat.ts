import { Op } from 'sequelize';
import { Boat } from '../../business/model/boat';
import { BoatModel } from '../../util/database/sequelize/models/boat';
import { FacilityModel } from '../../util/database/sequelize/models/facility';
import { BoatDatabaseInterface } from '../interfaces/boat';

/**
 * @author Youri Janssen
 * A class handling database operations related to the Boat model using Sequelize.
 * @designpattern Repository Pattern - A design pattern that separates the data access logic from the business logic. It helps to achieve a separation of concerns and enables the application to have a more flexible architecture.
 */
export class BoatSequelizeDatabase implements BoatDatabaseInterface {
    /**
     * @author Youri Janssen
     * Searches for boats based on the searchTerm.
     * @param {string} searchTerm - The searchTerm to search for.
     * @returns {Promise<Boat[] | 'server_error'>} A promise containing an array of boats, an empty array if no boats are found, or 'server_error' in case of an error.
     */
    public async searchBoats(
        searchTerm: string
    ): Promise<Boat[] | 'server_error'> {
        try {
            const boats = await this.searchBoatsByName(searchTerm);
            if (boats.length === 0) {
                return [];
            }
            const mappedBoats = this.mapBoatsData(boats);
            const sortedBoats = this.sortBoatsAlphabetically(await mappedBoats);
            return sortedBoats;
        } catch (error) {
            return 'server_error';
        }
    }

    /**
     * @author Youri Janssen
     * Finds boats by name.
     * @param {string} searchTerm - The value to search for.
     * @returns {Promise<BoatModel[]>} A promise containing an array of BoatModel instances.
     */
    private async searchBoatsByName(searchTerm: string): Promise<BoatModel[]> {
        return await BoatModel.findAll({
            where: {
                name: {
                    [Op.like]: `%${searchTerm}%`,
                },
            },
            include: FacilityModel,
        });
    }

    /**
     * @author Youri Janssen
     * Maps the data of boats.
     * @param {BoatModel[]} boats - An array of BoatModel instances.
     * @returns {Promise<Boat[]>} A promise containing an array of Boat business model instances.
     * The $get method is used to retrieve associated data or related instances from an associated model.
     */
    private async mapBoatsData(boats: BoatModel[]): Promise<Boat[]> {
        const mappedBoats: Boat[] = [];
        for (const boat of boats) {
            const facilities: string[] = boat.facilities.map(
                facility => facility.facility
            );
            const mappedBoat = Boat.createBoat(
                boat.name,
                boat.price_per_day_in_cents,
                boat.capacity,
                boat.license_required,
                boat.skipper_required,
                facilities
            );
            mappedBoats.push(mappedBoat);
        }
        return mappedBoats;
    }

    /**
     * @author Youri Janssen
     * Sorts boats alphabetically.
     * @param {Boat[]} mappedBoats - An array of Boat instances.
     * @returns {Boat[]} An array of Boat instances sorted alphabetically.
     */
    private sortBoatsAlphabetically(mappedBoats: Boat[]): Boat[] {
        return Boat.returnBoatsAlphabetically(mappedBoats);
    }
}
