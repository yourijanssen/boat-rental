import express from 'express';
import { SessionService } from '../business/service/session';
import { Session } from '../business/model/session';

/**
 * A class that contains all the methods that handle the logic for the session endpoints.
 * @author Thijs van Rixoort
 */
export class SessionController {
    public constructor(private sessionService: SessionService) {}

    /**
     * Sends the received email and password to the session service and resolves in a response.
     * If the userdata exists and is correct, the response contains a cookie named "session_token", with a session id as its value and expires after 2 weeks.
     * If the user data is incorrect, the response
     * @param request The express Request object.
     * @param response The express Response object.
     * @author Thijs van Rixoort
     */
    public async login(
        request: express.Request,
        response: express.Response
    ): Promise<void> {
        try {
            const session: Session = await this.sessionService.login(
                request.body.email,
                request.body.password
            );

            response
                .status(201)
                .cookie('session_token', session?.id, {
                    expires: session?.expirationDate,
                })
                .end();
        } catch (error: unknown) {
            if (error instanceof Error) {
                response.status(400).json(error.message);
            }
        }
    }

    /**
     * Sends the session_token cookie value to the sessionService.
     * @param request The express Request object.
     * @param response The express Response object.
     * @author Thijs van Rixoort
     */
    public async logout(
        request: express.Request,
        response: express.Response
    ): Promise<void> {
        try {
            const sessionId: string = request.cookies['session_token'];
            await this.sessionService.logout(sessionId);
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Logout Endpoint: ${error.message}`);
            }
        }

        response
            .status(200)
            .cookie('session_token', '', {
                expires: new Date(0),
            })
            .end();
    }
}
