import { BoatDatabaseInterface } from '../../data/interfaces/boat';
import { Boat } from '../model/boat';
import { SearchQuery } from '../model/searchQuery';

/**
 * @author Youri Janssen
 * Service class for managing boat-related operations.
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
}
