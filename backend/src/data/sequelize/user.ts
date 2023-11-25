import { UserDatabaseInterface } from '../interfaces/user';
import { User as BusinessUser } from '../../business/model/user';
import { UserModel } from '../../util/database/sequelize/models/user';

/**
 * A data access object for the user table in our database.
 * @author Thijs van Rixoort
 */
export class UserSequelizeDatabase implements UserDatabaseInterface {
    /**
     * Gets a user from the database by using their email address.
     * @param email The email address of the user you want to retrieve.
     * @returns the user if the email is found in the user table, else null.
     * @author Thijs van Rixoort
     */
    public async getUserByEmail(email: string): Promise<BusinessUser> {
        const userData: UserModel | null = await UserModel.findOne({
            where: { email: email },
        });

        if (userData !== null) {
            return this.convertSequelizeUserToBusinessUser(userData);
        } else {
            throw new Error('Het e-mailadres of wachtwoord klopt niet.');
        }
    }

    /**
     * Converts a Sequelize UserModel to a business model of a user.
     * @param sequelizeUser The user data in a UserModel object.
     * @returns the BusinessUser object containing the data of the Sequelize UserModel object.
     * @author Thijs van Rixoort
     */
    private convertSequelizeUserToBusinessUser(
        sequelizeUser: UserModel
    ): BusinessUser {
        return BusinessUser.createUserWithId(
            sequelizeUser.id,
            sequelizeUser.email,
            sequelizeUser.password,
            sequelizeUser.type,
            sequelizeUser.active
        );
    }
}
