import {
    AutoIncrement,
    BelongsToMany,
    Column,
    DataType,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';
import { BoatModel } from './boat';
import { BoatfacilityModel } from './boatFacility';

/**
 * @author Youri Janssen
 * Represents the Facility model in the database.
 */
@Table({
    tableName: 'Facility', // Specify the table name
    timestamps: false, // Enable timestamps (createdAt and updatedAt)
})
export class FacilityModel extends Model<FacilityModel> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column(DataType.STRING)
    facility!: string;

    @BelongsToMany(() => BoatModel, () => BoatfacilityModel)
    boats!: BoatModel[];
}
