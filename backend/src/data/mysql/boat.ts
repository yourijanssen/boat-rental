import { Boat } from '../../business/model/boat';
import { BoatDatabaseInterface } from '../interfaces/boat';
import { Pool, RowDataPacket } from 'mysql2';
import { MysqlDatabaseConfig } from '../../util/database/mysql/mysql';

/**
 * @author Youri Janssen
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
}
