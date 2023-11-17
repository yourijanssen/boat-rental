import express, { Request, Response, Router } from 'express';
import { BoatController } from '../../controller/boat';

/**
 * @author Youri Janssen
 * Class for managing boat-related routes.
 */
export class BoatRoutes {
    private router: Router = express.Router();

    /**
     * @author Youri Janssen
     * Creates an instance of BoatRoutes.
     * @param {BoatController} boatController - The controller for managing boat-related actions.
     */
    constructor(private boatController: BoatController) {
        this.setupRoutes();
    }

    /**
     * @author Youri Janssen
     * Set up all boat-related routes.
     */
    private setupRoutes(): void {
        this.router.get('/search', this.searchBoats);
    }

    /**
     * @author Youri Janssen
     * Handles the search for boats based on the provided name.
     * @param {Request} request - The Express request object.
     * @param {Response} response - The Express response object.
     */
    private searchBoats = (request: Request, response: Response): void => {
        this.boatController.searchBoats(request, response);
    };

    /**
     * @author Youri Janssen
     * Gets the Express router for boat-related routes.
     * @returns {Router} The Express router for boat-related routes.
     */
    public getBoatRouter(): Router {
        return this.router;
    }
}
