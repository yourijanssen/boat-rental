import { Boat } from '../../business/model/boats';
import { Pool, RowDataPacket } from 'mysql2';
import { detailedBoat } from '../../business/model/boat-detailed';
import { MysqlDatabaseConfig } from '../../util/database/mysql/mysql';
import { BoatDatabaseInterface } from '../interfaces/boat';

/**
 * @author Youri Janssen && Marcus K.
 * A class that implements the BoatDatabaseInterface for MySQL-based boat operations.
 * @implements {BoatDatabaseInterface}
 */
export class BoatMysqlDatabase implements BoatDatabaseInterface {
    /**
     * @author Youri Janssen
     * Searches for boats in the MySQL database based on the provided searchTerm.
     * @param {string} searchTerm - The searchTerm to search for.
     * @returns {Promise<Boat[] | 'server_error'>} A Promise containing the search results or an error.
     */
    public async searchBoats(
        searchTerm: string
    ): Promise<Boat[] | 'server_error'> {
        const pool = this.getDatabasePool();

        if (pool) {
            try {
                const result = await this.selectBoatsByName(pool, searchTerm);

                if (result.length === 0) {
                    return [];
                }

                const boats = await this.mapRowsToBoats(result, pool);
                return Boat.returnBoatsAlphabetically(boats);
            } catch (error) {
                return 'server_error';
            }
        }
        return 'server_error';
    }

    /**
     * @author Youri Janssen
     * Executes the query to retrieve boats from the MySQL database.
     * @param {string} searchTerm - The value to search for.
     * @param {Pool} pool - The MySQL pool.
     * @returns {Promise<RowDataPacket[]>} A Promise containing the query results.
     */
    private async selectBoatsByName(
        pool: Pool,
        searchTerm: string
    ): Promise<RowDataPacket[]> {
        const query = 'SELECT * FROM `boat` WHERE `name` LIKE ?';
        const parameters = [`%${searchTerm}%`];
        const [results] = await pool
            .promise()
            .execute<RowDataPacket[]>(query, parameters);
        return results;
    }

    /**
     * @author Youri Janssen
     * Maps the rows from the database to Boat objects.
     * @param {RowDataPacket[]} result - The database rows to map.
     * @param {Pool} pool - The MySQL pool.
     * @returns {Promise<Boat[]>} A Promise containing the mapped Boat objects.
     */
    private async mapRowsToBoats(
        result: RowDataPacket[],
        pool: Pool
    ): Promise<Boat[]> {
        const boats: Boat[] = [];
        for (const row of result) {
            const facilities = await this.getFacilitiesForBoat(row.id, pool);
            const boat = Boat.createBoat(
                row.name,
                row.price_per_day_in_cents,
                row.capacity,
                row.license_required,
                row.skipper_required,
                facilities
            );
            boats.push(boat);
        }
        return boats;
    }

    /**
     * @author Youri Janssen
     * Retrieves facilities for a specific boat from the MySQL database.
     * @param {number} boatId - The ID of the boat.
     * @param {Pool} pool - The MySQL pool.
     * @returns {Promise<string[]>} A Promise containing boat facilities or an empty array.
     */
    private async getFacilitiesForBoat(
        boatId: number,
        pool: Pool
    ): Promise<string[]> {
        const [results] = await this.selectBoatsById(pool, boatId);
        if (typeof results === typeof []) {
            return results.map((row: RowDataPacket) => row.facility);
        }
        return [];
    }

    /**
     * @author Youri Janssen
     * Executes the query to retrieve facilities for a specific boat from the MySQL database.
     * @param {number} boatId - The ID of the boat.
     * @param {Pool} pool - The MySQL pool.
     * @returns {Promise<RowDataPacket[]>} A Promise containing the query results.
     */
    private async selectBoatsById(
        pool: Pool,
        boatId: number
    ): Promise<RowDataPacket[]> {
        const query = `SELECT facility.facility 
        FROM facility 
        JOIN boatfacility 
        ON facility.id = boatfacility.facility_id 
        WHERE boatfacility.boat_id = ?`;
        const parameters = [boatId];
        const [results] = await pool
            .promise()
            .execute<RowDataPacket[]>(query, parameters);
        return results;
    }

    /**
     * @author Youri Janssen
     * Retrieve the MySQL database connection pool.
     * @returns {Pool | null} The MySQL database connection pool or `null` if it does not exist.
     */
    private getDatabasePool(): Pool | null {
        return MysqlDatabaseConfig.pool;
    }

    /**
     * The following chunk is dedicated to requesting a singular boat with all their details.
     * @author Marcus K.
     */

    /**
     * A query that grabs a boat that matches the given ID
     * @param id is the id of a given boat.
     * @author Marcus K.
     */
    public async getMainData(id: number): Promise<RowDataPacket> {
        return (
            await MysqlDatabaseConfig.pool
                .promise()
                .execute<RowDataPacket[]>(
                    'SELECT boat.*, boatmodel.model, boatmodel.brandname FROM boat LEFT OUTER JOIN boatmodel ON boatmodel.id = boat.model_id where boat.id = ?;',
                    [id]
                )
        )[0][0];
    }

    /**
     * A query that grabs all the Facilities that a boat with this ID has.
     * @param id is the id of a given boat.
     * @author Marcus K.
     */
    public async getFacilityData(id: number): Promise<RowDataPacket[]> {
        return (
            await MysqlDatabaseConfig.pool
                .promise()
                .query<RowDataPacket[]>(
                    'SELECT facility FROM het_vrolijke_avontuur.boatfacility as b JOIN facility AS ba ON b.facility_id = ba.id where boat_id = ?',
                    [id]
                )
        )[0];
    }

    /**
     * A query that grabs all the Images that a boat with this ID has.
     * @param id is the id of a given boat.
     * @author Marcus K.
     */
    public async getImageData(id: number): Promise<RowDataPacket[]> {
        return (
            await MysqlDatabaseConfig.pool
                .promise()
                .query<RowDataPacket[]>(
                    'SELECT image_path FROM het_vrolijke_avontuur.boatimage where boat_id = ?;',
                    [id]
                )
        )[0];
    }

    /**
     * @function findOneBoat is technically not an accurate name, as it assembles all the data found for a boat. Still, it uses all found data to compile a boat instance.
     * @param returnedBoat are all the details about a boat.
     * @param returnedFacilities are all the facilities related to a boat.
     * @param returnedImages are all the images related to a boat.
     * @returns all those datapoints as one instanced boat.
     * @author Marcus K.
     */
    public async findOneBoat(
        returnedBoat: RowDataPacket,
        returnedFacilities: RowDataPacket[],
        returnedImages: RowDataPacket[]
    ): Promise<detailedBoat | null> {
        /**
         * A modified instancer for boats, checking if core data returns at all and if the boat is active. If it goes well, it should get send back to the front.
         * @author Marcus K.
         */
        if (returnedBoat && returnedBoat.active) {
            return new detailedBoat(
                returnedBoat.id,
                returnedBoat.name,
                returnedBoat.description,
                returnedBoat.price_per_day_in_cents,
                returnedBoat.capacity,
                returnedBoat.license_required,
                returnedBoat.skipper_required,
                returnedBoat.model_id,
                returnedBoat.fabrication_year,
                returnedBoat.length_in_meters,
                returnedBoat.active,
                returnedBoat.model,
                returnedBoat.brandname,

                returnedFacilities,
                returnedImages
            );
        } else {
            return null;
        }
    }
}
