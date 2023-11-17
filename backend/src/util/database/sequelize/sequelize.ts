import { Sequelize } from 'sequelize-typescript';
import config from 'dotenv';
import { Dialect } from 'sequelize/types/sequelize';
import { UserModel } from './models/user';
import { BoatModel } from './models/boat';
import { SequelizeSeeder } from './seeder';
import { FacilityModel } from './models/facility';
import { BoatfacilityModel } from './models/boatFacility';

// Initialize environment variables from a .env file.
config.config();

/**
 * @author Youri Janssen
 * A utility class for managing a Sequelize instance for Sequelize-based database connections.
 */
export class SequelizeDatabaseConfig {
    public static sequelize: Sequelize;
    private static instance: SequelizeDatabaseConfig;

    /**
     * @author Youri Janssen
     * Creates a new instance of the SequelizeDatabaseConfig class and initializes the Sequelize instance.
     */
    private constructor() {
        SequelizeDatabaseConfig.sequelize = this.createSequelizeInstance();
    }

    /**
     * @author Youri Janssen
     * Initialize the Sequelize instance using environment (.env) variables.
     * @returns {SequelizeOptions} The Sequelize options.
     */
    private createSequelizeInstance(): Sequelize {
        const sequelizeOptions = {
            dialect: (process.env.DIALECT as Dialect) || 'mysql',
            host: process.env.HOST_RELATIONAL_DB,
            port: parseInt(process.env.PORT_RELATIONAL_DB || '3306', 10),
            username: process.env.USER_RELATIONAL_DB,
            password: process.env.PASSWORD_RELATIONAL_DB,
            database: process.env.SCHEMA_RELATIONAL_DB,
            waitForConnections: this.convertToBoolean(
                process.env.WAIT_FOR_CONNECTIONS_RELATIONAL_DB
            ),
            connectionLimit: parseInt(
                process.env.CONNECTION_LIMIT_RELATIONAL_DB || '10',
                10
            ),
            queueLimit: parseInt(
                process.env.QUEUE_LIMIT_RELATIONAL_DB || '0',
                10
            ),
        };
        return new Sequelize(sequelizeOptions);
    }

    /**
     * @author Youri Janssen
     * Gets the singleton instance of the SequelizeDatabaseConfig class.
     * If an instance doesn't exist, it creates one.
     * @returns {SequelizeDatabaseConfig} The singleton instance of SequelizeDatabaseConfig.
     * @designpattern Singleton
     */
    public static getInstance(): SequelizeDatabaseConfig {
        if (!SequelizeDatabaseConfig.instance) {
            SequelizeDatabaseConfig.instance = new SequelizeDatabaseConfig();
        }
        return SequelizeDatabaseConfig.instance;
    }

    /**
     * @author Youri Janssen
     * Synchronize the database and create tables.
     */
    public async syncDatabase(): Promise<void> {
        try {
            SequelizeDatabaseConfig.sequelize.addModels([
                UserModel,
                BoatModel,
                FacilityModel,
                BoatfacilityModel,
            ]);
            // new SequelizeSeeder().seedFacility();
            // new SequelizeSeeder().seedBoatFacility();
            // new SequelizeSeeder().seedBoats();
            await SequelizeDatabaseConfig.sequelize.sync(); // { force: true }
            console.log('Database synced successfully');
        } catch (error) {
            console.error('Error syncing database:', error);
        }
    }

    /**
     * @author Youri Janssen
     * Converts a string input to a boolean value.
     * @param {string | undefined} input - The string to convert.
     * @returns {boolean} The converted boolean value.
     */
    private convertToBoolean(input: string | undefined): boolean {
        return !!input && input.toLowerCase() === 'true';
    }
}
