import express, { Request, Response, Router } from 'express';
import { SessionController } from '../../controller/session';

/**
 * A class that contains all the session routes in a router attribute.
 * @author Thijs van Rixoort
 */
export class SessionRoutes {
    private router: Router = express.Router();

    constructor(private sessionController: SessionController) {
        this.setupRoutes();
    }

    /**
     * Sets up all the routes in the router attribute.
     * @author Thijs van Rixoort
     */
    private setupRoutes(): void {
        this.router.post('/', this.login.bind(this));
        this.router.delete('/', this.logout.bind(this));
    }

    /**
     * An endpoint method that makes users able to log in.
     * @param request The express Request object.
     * @param response The express Response object.
     * @author Thijs van Rixoort
     */
    private login(request: Request, response: Response): void {
        this.sessionController.login(request, response);
    }

    /**
     * An endpoint method that makes users able to log out.
     * @param request The express Request object.
     * @param response The express Response object.
     * @author Thijs van Rixoort
     */
    private logout(request: Request, response: Response): void {
        this.sessionController.logout(request, response);
    }

    /**
     * Returns the router attribute from this class.
     * @returns the login router with all the initialized routes.
     * @author Thijs van Rixoort
     */
    public getRouter(): Router {
        return this.router;
    }
}
