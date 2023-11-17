import { Boat } from '../../business/model/boat';

/**
 * @author Youri Janssen
 * An interface for managing boat-related database operations.
 */
export interface BoatDatabaseInterface {
    searchBoats(searchTerm: string): Promise<Boat[] | 'server_error'>;
}
