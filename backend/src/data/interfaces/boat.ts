import { RowDataPacket } from 'mysql2';
import { Boat } from '../../business/model/boats';
import { BoatModel } from '../../util/database/sequelize/models/boat';
import BoatImageModel from '../../util/database/sequelize/models/boatimage';
import { detailedBoat } from '../../business/model/boat-detailed';

/**
 * @author Youri Janssen && Marcus K.
 * An interface for managing boat-related database operations.
 */
export interface BoatDatabaseInterface {
    searchBoats(searchTerm: string): Promise<Boat[] | 'server_error'>;
    searchBoats(name: string): Promise<Boat[] | 'server_error'>;

    /**
     * This second chunk of the interface is dedicated to getting even more specific data about a sIngular boat.
     */

    findOneBoat(
        returnedBoat: RowDataPacket | BoatModel | null,
        returnedFacilities: RowDataPacket[] | BoatModel[] | null,
        returnedImages: RowDataPacket[] | BoatImageModel[] | null
    ): Promise<detailedBoat | null>;

    getMainData(id: number): Promise<RowDataPacket | BoatModel | null>;

    getFacilityData(id: number): Promise<RowDataPacket[] | BoatModel[] | null>;

    getImageData(
        id: number
    ): Promise<RowDataPacket[] | BoatImageModel[] | null>;
}
