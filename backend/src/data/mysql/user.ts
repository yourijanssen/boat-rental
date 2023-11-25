import { RowDataPacket } from 'mysql2';
import { MysqlDatabaseConfig } from '../../util/database/mysql/mysql';

import { UserDatabaseInterface } from '../interfaces/user';
import { User as BusinessUser } from '../../business/model/user';

/**
 * A data access object for the user table in our database.
 * @author Thijs van Rixoort
 */
export class UserMysqlDatabase implements UserDatabaseInterface {
    /**
     * Gets a user from the database by using their email address.
     * @param email The email address of the user you want to retrieve.
     * @returns the user if the email is found in the user table, else null.
     * @author Thijs van Rixoort
     */
    public async getUserByEmail(email: string): Promise<BusinessUser> {
        const results: RowDataPacket[] = (
            await MysqlDatabaseConfig.pool
                .promise()
                .execute<RowDataPacket[]>(
                    'SELECT * FROM `user` WHERE email = ?',
                    [email]
                )
        )[0];

        if (results[0] !== undefined) {
            throw new Error('Het e-mailadres of wachtwoord klopt niet.');
        }

        return this.convertRowDataPacketToBusinessUser(results[0]);
    }

    /**
     * Converts a RowDataPacket to a business model of a user.
     * @param userData The user data in a RowDataPacket.
     * @returns the BusinessUser object containing the data of the RowDataPacket.
     * @author Thijs van Rixoort
     */
    private convertRowDataPacketToBusinessUser(
        userData: RowDataPacket
    ): BusinessUser {
        return BusinessUser.createUserWithId(
            userData.id,
            userData.email,
            userData.password,
            userData.type,
            userData.active
        );
    }
}
