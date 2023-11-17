import { RegisterDatabaseInterface } from '../interfaces/register';
import { User } from '../../business/model/user';
import { FieldPacket, Pool, ResultSetHeader, RowDataPacket } from 'mysql2';
import { MysqlDatabaseConfig } from '../../util/database/mysql/mysql';

/**
 * @author Youri Janssen
 * A class that implements the RegisterDatabaseInterface for MySQL-based registration operations.
 * @implements {RegisterDatabaseInterface}
 */
export class RegisterMysqlDatabase implements RegisterDatabaseInterface {
    /**
     * @author Youri Janssen
     * Creates a new user with the provided email and password in the MySQL database.
     * @param {User} userData - The user data to create the user with.
     * @returns {Promise<boolean>} A Promise that resolves with `true` if successful, or `false` if an error occurs.
     * @designpattern Singleton Pattern, Dependency Injection (DI) Pattern
     * The method utilizes the Singleton pattern by accessing the MySQL connection pool through the MysqlDatabaseConfig class, ensuring a single instance of the connection pool is used throughout the application. Additionally, the Dependency Injection pattern is employed for the Pool object, promoting loose coupling and enhancing code modularity and testability.
     */
    public async createUser(userData: User): Promise<boolean> {
        const pool = this.getDatabasePool();

        if (pool) {
            try {
                const [result] = await this.insertUserIntoDatabase(
                    pool,
                    userData
                );
                if (result.affectedRows > 0) {
                    return true;
                }
            } catch (error) {
                return false;
            }
        }
        return false;
    }

    /**
     * @author Youri Janssen
     * Insert a user into the MySQL database.
     * @param {Pool} pool - The MySQL database connection pool.
     * @param {User} userData - The user data to be inserted into the database.
     * @returns {Promise<[ResultSetHeader, FieldPacket[]]>} A Promise containing information about the database operation.
     */
    private async insertUserIntoDatabase(
        pool: Pool,
        userData: User
    ): Promise<[ResultSetHeader, FieldPacket[]]> {
        return await pool
            .promise()
            .execute<ResultSetHeader>(
                'INSERT INTO `user` (`email`, `password`, `type`, `active`) VALUES (?, ?, ?, ?)',
                [
                    userData.getEmail,
                    userData.getPassword,
                    userData.getType,
                    userData.getActive,
                ]
            );
    }

    /**
     * @author Youri Janssen
     * Find a user by email address in the MySQL database.
     * @param {string} email - The email address to search for.
     * @returns {Promise<User | null>} A Promise that resolves with the user if found, or `null` if not found.
     */
    public async getUserByMail(email: string): Promise<User | null> {
        const pool = this.getDatabasePool();

        if (pool) {
            const [rows]: [RowDataPacket[], FieldPacket[]] =
                await this.selectUserByEmail(pool, email);

            if (rows.length > 0) {
                const userData: RowDataPacket = rows[0];
                return User.createUser(
                    userData.email,
                    userData.password,
                    userData.type,
                    userData.active
                );
            }
        }
        return null;
    }

    /**
     * @author Youri Janssen
     * Retrieve a user by email from the MySQL database.
     * @param {Pool} pool - The MySQL database connection pool.
     * @param {string} email - The email address to search for.
     * @returns {Promise<[RowDataPacket[], FieldPacket[]]>} A Promise containing the user's data along with other database operation information.
     */
    private async selectUserByEmail(
        pool: Pool,
        email: string
    ): Promise<[RowDataPacket[], FieldPacket[]]> {
        return await pool
            .promise()
            .query<RowDataPacket[]>(
                'SELECT * FROM `user` WHERE `email` = ? LIMIT 1',
                [email]
            );
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
