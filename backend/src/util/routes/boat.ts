import express, { Router, Request, Response } from 'express';
import BoatController from '../../controller/boat';
import { BoatService } from '../../business/service/boat';
import { BoatMysqlDatabase } from '../../data/mysql/get-boat';
import { BoatSequelizeDatabase } from '../../data/sequelize/get-boat';

/**
 * A simple type for both our database files. I purposefully want these two split so I won't be destructive with his code.
 * I mostly want this type so it doesn't fill so much space over and over everywhere.
 * @author Marcus K.
 */
type boatType = BoatMysqlDatabase | BoatSequelizeDatabase;

export class BoatRoutes {
    private router: Router = express.Router();

    constructor() {
        this.setBoatsRoutes();
    }

    /**
     * @author Youri Janssen && Marcus K.
     * Checks which database we're currently using. This defaults to Sequelize which doesn't make me too happy though.
     */
    private databaseSwitch(): boatType {
        if (process.env.DB_TYPE === 'sql') {
            return new BoatMysqlDatabase();
        } else {
            return new BoatSequelizeDatabase();
        }
    }

    /**
     * @author Youri Janssen && Marcus K.
     * Initializes the boat controller based on the database type and loads routes.
     */
    private createController(boatDatabase: boatType): BoatController {
        const boatService: BoatService = new BoatService(boatDatabase);
        const boatsController: BoatController = new BoatController(boatService);
        return boatsController;
    }

    /**
     * This function opens up the database routes related to boats under these paths. Binded mine just like Thijs did with his.
     * @author Marcus K. && Youri Janssen (with the help of Thijs van Rixoort)
     */
    private setBoatsRoutes(): void {
        this.router.get('/detailed', this.openRoute.bind(this));

        this.router.get('/:name', this.searchBoats);
    }

    /**
     * This function takes the database we're currently using and creates the controller with it.
     * @author Marcus K.
     */
    private openRoute(
        request: Request<object, object, object, { id: string }>,
        response: Response
    ): void {
        const database: boatType = this.databaseSwitch();

        const boatsController = this.createController(database);
        boatsController.getBoat(request, response);
    }

    /**
     * @author Youri Janssen
     * Handles the search for boats based on the provided name.
     * @param {Request} request - The Express request object.
     * @param {Response} response - The Express response object.
     */
    private searchBoats = (request: Request, response: Response): void => {
        const database: boatType = this.databaseSwitch();

        const boatsController = this.createController(database);
        boatsController.searchBoats(request, response);
    };

    /**
     * This function simply returns the router here, so that the route can use these.
     * @returns BoatRoutes.Router
     * @author Marcus K.
     */
    public assignRoutes(): Router {
        return this.router;
    }
}
