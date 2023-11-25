import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    DataType,
    HasOne,
} from 'sequelize-typescript';
import { Roles } from '../../../../business/model/user';
import { Session } from './session';

/**
 * @author Youri Janssen
 * Represents the User model in the database.
 */
@Table({
    tableName: 'User', // Specify the table name
    timestamps: false, // Enable timestamps (createdAt and updatedAt)
})
export class UserModel extends Model<UserModel> {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    public id!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    public email!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    public password!: string;

    @Column({ type: DataType.ENUM('user', 'admin'), allowNull: false })
    public type!: Roles;

    @Column({ type: DataType.TINYINT, allowNull: false })
    public active!: number;

    @HasOne(() => Session)
    public login?: Session;
}
