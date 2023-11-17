import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { BoatModel } from './boat';
import { FacilityModel } from './facility';

/**
 * @author Youri Janssen
 * Represents the Boatfacility model in the database.
 */
@Table({
    tableName: 'Boatfacility', // Specify the table name
    timestamps: false, // Enable timestamps (createdAt and updatedAt)
})
export class BoatfacilityModel extends Model<BoatfacilityModel> {
    @ForeignKey(() => BoatModel)
    @Column
    boat_id!: number;

    @ForeignKey(() => FacilityModel)
    @Column
    facility_id!: number;
}
