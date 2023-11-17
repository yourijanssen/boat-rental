import express from 'express';
import { Roles, User } from '../business/model/user';
import { RegisterService } from '../business/service/register';

/**
 * @author Youri Janssen
 * Controller class for handling registration-related actions.
 */
export class RegisterController {
    /**
     * @author Youri Janssen
     * Creates an instance of RegisterController.
     * @param {RegisterService} registerService - The service responsible for registration-related operations.
     */
    public constructor(private registerService: RegisterService) {}

    /**
     * @author Youri Janssen
     * Creates a new user based on the provided email and password.
     * @param {express.Request} request - The Express request object containing user data.
     * @param {express.Response} response - The Express response object to send the HTTP response.
     * @returns {Promise<void>} A Promise that resolves once the user creation process is complete.
     */
    public async createUser(
        request: express.Request,
        response: express.Response
    ): Promise<void> {
        const userData = this.extractUserData(request);
        const userCreationResult = await this.attemptUserCreation(userData);
        this.handleUserCreationResponse(response, userCreationResult);
    }

    /**
     * @author Youri Janssen
     * Extracts the user data from the request object.
     * @param {express.Request} request - The Express request object.
     * @returns {object} The user data extracted from the request.
     */
    private extractUserData(request: express.Request): User {
        const userData: User = User.createUser(
            request.body.email,
            request.body.password,
            Roles.USER,
            1
        );

        return userData;
    }

    /**
     * @author Youri Janssen
     * Attempts to create the user based on the provided data.
     * @param {object} userData - The user data to be used for creating the user.
     * @returns {Promise<boolean | string[] | 'user_exists'>} A Promise indicating the user creation result.
     */
    private async attemptUserCreation(
        userData: User
    ): Promise<boolean | string[] | 'user_exists'> {
        return await this.registerService.createUser(userData);
    }

    /**
     * @author Youri Janssen
     * Handles the response based on the user creation result.
     * @param {express.Response} response - The Express response object.
     * @param {boolean | string[] | 'user_exists'} userCreationResult - The user creation result.
     */
    private handleUserCreationResponse(
        response: express.Response,
        userCreationResult: boolean | string[] | 'user_exists'
    ): void {
        if (typeof userCreationResult === 'boolean') {
            this.handleSuccessResponse(response, userCreationResult);
        } else if (userCreationResult === 'user_exists') {
            this.handleUserExistsResponse(response);
        } else {
            this.handleValidationErrorResponse(response, userCreationResult);
        }
    }

    /**
     * @author Youri Janssen
     * Handles the success response.
     * @param {express.Response} response - The Express response object.
     * @param {boolean} userCreationResult - The user creation result.
     */
    private handleSuccessResponse(
        response: express.Response,
        userCreationResult: boolean
    ): void {
        if (userCreationResult) {
            response.status(201).json({
                message: 'Registration successful. You can now log in.',
            });
        } else {
            response.status(500).json({
                error: 'Internal server error.',
                message:
                    'An internal server error occurred while processing your request.',
            });
        }
    }

    /**
     * @author Youri Janssen
     * Handles the response when the user already exists.
     * @param {express.Response} response - The Express response object.
     */
    private handleUserExistsResponse(response: express.Response): void {
        response.status(409).json({
            error: 'User already exists.',
            message: 'A user with the provided email address already exists.',
        });
    }

    /**
     * @author Youri Janssen
     * Handles the response in case of validation error.
     * @param {express.Response} response - The Express response object.
     * @param {string[]} userCreationResult - The array of validation error messages.
     */
    private handleValidationErrorResponse(
        response: express.Response,
        userCreationResult: string[]
    ) {
        response.status(400).json({
            error: 'Validation error',
            message: userCreationResult,
        });
    }
}
