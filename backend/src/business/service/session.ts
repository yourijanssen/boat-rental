import { SessionDatabaseInterface } from '../../data/interfaces/session';
import { UserDatabaseInterface } from '../../data/interfaces/user';
import { Session } from '../model/session';
import { User } from '../model/user';

/**
 * A class that handles the business logic for sessions.
 * @author Thijs van Rixoort
 */
export class SessionService {
    public constructor(
        private sessionDatabase: SessionDatabaseInterface,
        private userDatabase: UserDatabaseInterface
    ) {}

    /**
     * Handles the login functionality.
     * @param email The email from the user that wants to log in.
     * @param password The password from the user that wants to log in.
     * @returns a session if everything is correct, else null.
     * @author Thijs van Rixoort
     */
    public async login(email: string, password: string): Promise<Session> {
        const user: User = await this.userDatabase.getUserByEmail(email);

        if (user.id !== undefined && (await user.validatePassword(password))) {
            this.sessionDatabase.deleteExpiredSessionsByUserId(user.id);
            return await this.sessionDatabase.createSession(user.id);
        }

        throw new Error('Het e-mailadres of wachtwoord klopt niet.');
    }

    /**
     * Log out a user by removing their session from the database.
     * @param sessionId The id of the session that you want to remove.
     * @author Thijs van Rixoort
     */
    public async logout(sessionId: string): Promise<void> {
        await this.sessionDatabase.deleteSessionById(sessionId);
    }
}
