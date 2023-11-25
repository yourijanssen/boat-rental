import express, { Router } from 'express';
import { RegisterController } from '../controller/register';
import { RegisterDatabaseInterface } from '../data/interfaces/register';
import { RegisterSequelizeDatabase } from '../data/sequelize/register';
import { RegisterMysqlDatabase } from '../data/mysql/register';
import { RegisterRoutes } from './routes/register';
import { SessionDatabaseInterface } from '../data/interfaces/session';
import { SessionMysqlDatabase } from '../data/mysql/session';
import { SessionSequelizeDatabase } from '../data/sequelize/session';
import { SessionService } from '../business/service/session';
import { SessionController } from '../controller/session';
import { SessionRoutes } from './routes/session';
import { UserDatabaseInterface } from '../data/interfaces/user';
import { UserMysqlDatabase } from '../data/mysql/user';
import { UserSequelizeDatabase } from '../data/sequelize/user';
import { BoatRoutes } from './routes/boat';
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
        this.initLoginController();
        this.boatsRoutes();
        // this.initBoatController();
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
     * Initializes the LoginController with the correct database implementation.
     * @author Thijs van Rixoort
     */
    private initLoginController(): void {
        let sessionDatabase: SessionDatabaseInterface;
        let userDatabase: UserDatabaseInterface;

        if (process.env.DB_TYPE === 'sql') {
            sessionDatabase = new SessionMysqlDatabase();
            userDatabase = new UserMysqlDatabase();
        } else {
            sessionDatabase = new SessionSequelizeDatabase();
            userDatabase = new UserSequelizeDatabase();
        }

        const usedService: SessionService = new SessionService(
            sessionDatabase,
            userDatabase
        );
        const usedController = new SessionController(usedService);

        this.loadSessionAPI(usedController);
    }

    /**
     * Initializes the endpoints for the login functionality.
     * @author Thijs van Rixoort
     */
    private loadSessionAPI(sessionController: SessionController): void {
        this.router.use(
            '/session',
            new SessionRoutes(sessionController).getRouter()
        );
    }

    /**
     * Gets the Express Router instance with the application's routes loaded.
     * @returns {Router} The Express Router instance.
     * @function boatsRoutes() very simply sets up the route for boats related content.
     * @author Marcus K && Youri Janssen.
     */
    private boatsRoutes(): void {
        this.router.use('/boat', new BoatRoutes().assignRoutes());
    }
}
