import { User } from '../../business/model/user';
import { UserModel } from '../../util/database/sequelize/models/user';
import { RegisterDatabaseInterface } from '../interfaces/register';

/**
 * @author Youri Janssen
 * Represents a Sequelize-based database implementation for user registration.
 */
export class RegisterSequelizeDatabase implements RegisterDatabaseInterface {
    /**
     * @author Youri Janssen
     * Creates a new user with the provided email and password in the SQL database.
     * @param {User} userData - The user data to create the user with.
     * @returns {Promise<boolean>} A Promise that resolves to `true` if the user was created successfully, or `false` on failure.
     */
    public async createUser(userData: User): Promise<boolean> {
        try {
            await UserModel.create({
                email: userData.getEmail,
                password: userData.getPassword,
                type: userData.getType,
                active: userData.getActive,
            } as UserModel);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * @author Youri Janssen
     * Find a user by email address.
     * @param {string} email - The email address to search for.
     * @returns {Promise<User | null>} A Promise that resolves with the user if found, or `null` if not found.
     */
    public async getUserByMail(email: string): Promise<User | null> {
        const user = await UserModel.findOne({
            where: {
                email: email,
            },
        });
        if (user === null) {
            return null;
        }
        return User.createUser(
            user.email,
            user.password,
            user.type,
            user.active
        );
    }
}
