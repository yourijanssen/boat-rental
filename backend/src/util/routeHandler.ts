import express, { Router } from 'express';
import { RegisterController } from '../controller/register';
import { RegisterDatabaseInterface } from '../data/interfaces/register';
import { RegisterSequelizeDatabase } from '../data/sequelize/register';
import { RegisterMysqlDatabase } from '../data/mysql/register';
import { RegisterRoutes } from './routes/register';
import { BoatController } from '../controller/boat';
import { BoatDatabaseInterface } from '../data/interfaces/boat';
import { BoatMysqlDatabase } from '../data/mysql/boat';
import { BoatSequelizeDatabase } from '../data/sequelize/boat';
import { BoatRoutes } from './routes/boat';
import { BoatService } from '../business/service/boat';
import { RegisterService } from '../business/service/register';

/**
 * @author Youri Janssen
 * Handles the initialization and assignment of routes for the Express application.
 * @designpattern Factory Pattern - The Factory pattern is used to create objects based on certain conditions. In this case, the initialization of different types of controllers and databases based on the environment variable is managed by the Factory pattern.
 */
export class RouteHandler {
    private _router: Router = express.Router();

    public get router(): Router {
        return this._router;
    }

    /**
     * @author Youri Janssen
     * Creates a new instance of the RouteHandler class
     */
    constructor() {
        this.testRoute();
        this.initRegisterController();
        this.initBoatController();
    }

    /**
     * @author Youri Janssen
     * Configures a test route for checking server health.
     */
    private testRoute(): void {
        this.router.get('/ping', (req, res) => {
            res.status(200).json('pong');
        });
    }

    /**
     * @author Youri Janssen
     * Initializes the register controller based on the database type and loads routes.
     */
    public initRegisterController(): void {
        let database: RegisterDatabaseInterface;

        if (process.env.DB_TYPE === 'sql') {
            database = new RegisterMysqlDatabase();
        } else {
            database = new RegisterSequelizeDatabase();
        }
        const usedService: RegisterService = new RegisterService(database);
        const registerController = new RegisterController(usedService);
        this.loadRegisterAPI(registerController);
    }

    /**
     * @author Youri Janssen
     * Initializes the boat controller based on the database type and loads routes.
     */
    public initBoatController(): void {
        let database: BoatDatabaseInterface;

        if (process.env.DB_TYPE === 'sql') {
            database = new BoatMysqlDatabase();
        } else {
            database = new BoatSequelizeDatabase();
        }
        const usedService: BoatService = new BoatService(database);
        const boatController = new BoatController(usedService);
        this.loadBoatAPI(boatController);
    }

    /**
     * @author Youri Janssen
     * Loads route for the register controller.
     * @param {RegisterController} registerController - loads route for the register controller.
     */
    private loadRegisterAPI(registerController: RegisterController): void {
        this.router.use(
            '/register',
            new RegisterRoutes(registerController).getRegisterRouter()
        );
    }

    /**
     * @author Youri Janssen
     * Loads route for the boat controller.
     * @param {BoatController} boatController - The boat controller instance.
     */
    private loadBoatAPI(boatController: BoatController): void {
        this.router.use(
            '/boat',
            new BoatRoutes(boatController).getBoatRouter()
        );
    }
}
