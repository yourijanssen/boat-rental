import { User } from '../../business/model/user';

/**
 * The user database interface. Use this to execute any queries on the user table.
 * @author Thijs van Rixoort
 */
export interface UserDatabaseInterface {
    getUserByEmail(email: string): Promise<User>;
}
