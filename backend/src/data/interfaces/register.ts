import { User } from '../../business/model/user';

/**
 * An interface for managing registration-related database operations.
 * @author Youri Janssen
 */
export interface RegisterDatabaseInterface {
    createUser(userData: User): Promise<boolean>;
    getUserByMail(email: string): Promise<User | null>;
}
