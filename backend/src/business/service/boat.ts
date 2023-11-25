import { RowDataPacket } from 'mysql2';
import { BoatDatabaseInterface } from '../../data/interfaces/boat';
import { Boat } from '../model/boats';
import { detailedBoat } from '../model/boat-detailed';
import { SearchQuery } from '../model/searchQuery';
import { BoatModel } from '../../util/database/sequelize/models/boat';
import BoatImageModel from '../../util/database/sequelize/models/boatimage';

/**
 * @author Youri Janssen && Marcus K.
 * Service class for managing boat-related operations.
 * @class DetailedBoatService The second half of is dedicated to finding all the data relevant to a singular boat, to be displayed on pages that need all of it.
 */
export class BoatService {
    /**
     * @author Youri Janssen
     * Creates an instance of BoatService.
     * @param {BoatDatabaseInterface} boatDatabase - The database interface for boat operations.
     * @designpattern Dependency Injection (DI)
     */
    public constructor(private boatDatabase: BoatDatabaseInterface) {}

    /**
     * @author Youri Janssen
     * Searches for boats based on the provided searchTerm.
     * @param {string} searchTerm - The searchTerm to search for.
     * @returns {Promise<Boat[] | string[] | 'server_error'>} The search result.
     */
    public async searchBoats(
        searchTerm: string
    ): Promise<Boat[] | string[] | 'server_error'> {
        const queryValidation = this.validateSearchQuery(searchTerm);

        if (queryValidation) {
            return queryValidation;
        }
        return await this.performBoatSearch(searchTerm);
    }

    /**
     * @author Youri Janssen
     * Validates the search query.
     * @param {string} searchTerm - The searchTerm to validate.
     * @returns {string[] | null} The validation result.
     */
    private validateSearchQuery(searchTerm: string): string[] | null {
        const searchQuery = new SearchQuery(searchTerm);
        return searchQuery.validateQuery();
    }

    /**
     * @author Youri Janssen
     * Performs the boat search based on the provided search term.
     * @param {string} searchTerm - The searchTerm to perform the search.
     * @returns {Promise<Boat[] | 'server_error'>} The search result.
     */
    private async performBoatSearch(
        searchTerm: string
    ): Promise<Boat[] | 'server_error'> {
        return await this.boatDatabase.searchBoats(searchTerm);
    }

    /**
     * A small function that check's if the incoming ID is a number, if so, it passes it through to the boatsInterface to Query.
     * @param id is the incoming boat ID getting checked if it's a number or not and passes along if it is.
     * @returns status, which either contain details about the boat, or nothing at all.
     * @author Marcus K.
     */
    public async findBoat(id: number): Promise<detailedBoat | null> {
        const status: detailedBoat | null = !Number.isNaN(id)
            ? await this.compileBoatData(id)
            : null;

        return status;
    }

    /**
     * @function compileBoatData runs all the queries to get the data of one boat and then merges them into one.
     * @param id is the id for a given boat.
     * @returns either a detailedBoat or nothing.
     */
    private async compileBoatData(id: number): Promise<detailedBoat | null> {
        const boat: RowDataPacket | BoatModel | null =
            await this.boatDatabase.getMainData(id);

        const facilities: RowDataPacket[] | BoatModel[] | null =
            await this.boatDatabase.getFacilityData(id);

        const images: RowDataPacket[] | BoatImageModel[] | null =
            await this.boatDatabase.getImageData(id);

        return await this.boatDatabase.findOneBoat(boat, facilities, images);
    }
}
