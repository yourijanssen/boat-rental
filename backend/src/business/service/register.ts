import { RegisterDatabaseInterface } from '../../data/interfaces/register';
import { User } from '../model/user';

/**
 * @author Youri Janssen
 * Service class for managing registration-related operations.
 */
export class RegisterService {
    /**
     * @author Youri Janssen
     * Creates an instance of RegisterService.
     * @param {RegisterDatabaseInterface} registerDatabase - The database interface for registration-related database operations.
     * @designpattern Dependency Injection (DI)
     */
    public constructor(private registerDatabase: RegisterDatabaseInterface) {}

    /**
     * @author Youri Janssen
     * Creates a new user based on the provided user data.
     * @param {User} userData - The user data to be used for creating the user.
     * @returns {Promise<boolean | string[] | 'user_exists'>} A Promise indicating the user creation result.
     */
    public async createUser(
        userData: User
    ): Promise<boolean | string[] | 'user_exists'> {
        const userExists = await this.checkIfUserExists(userData.getEmail);
        if (userExists) {
            return 'user_exists';
        }
        const userValidation = await this.validateUser(userData);
        if (userValidation) {
            return userValidation;
        }
        return await this.registerUser(userData);
    }

    /**
     * @author Youri Janssen
     * Checks if a user with the given email already exists.
     * @param {string} email - The email address of the user to check.
     * @returns {Promise<User | null>} A Promise containing the user if it exists, or null if it doesn't.
     */
    private async checkIfUserExists(email: string): Promise<User | null> {
        return this.registerDatabase.getUserByMail(email);
    }

    /**
     * @author Youri Janssen
     * Validates the user data.
     * @param {User} userData - The user data to be validated.
     * @returns {Promise<string[] | null>} A Promise containing an array of validation errors or null if the data is valid.
     */
    private async validateUser(userData: User): Promise<string[] | null> {
        return userData.validateUser();
    }

    /**
     * @author Youri Janssen
     * Registers the user in the database with the hashed password.
     * @param {User} userData - The user data to be used for registration.
     * @returns {Promise<boolean>} A Promise indicating whether the user was successfully registered.
     */
    private async registerUser(userData: User): Promise<boolean> {
        const plainPassword = userData.getPassword;
        const hashedPassword = await userData.hashPassword(plainPassword);
        userData.setPassword = hashedPassword;
        return await this.registerDatabase.createUser(userData);
    }
}
