import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    DataType,
    BelongsToMany,
} from 'sequelize-typescript';
import { BoatfacilityModel } from './boatFacility';
import { FacilityModel } from './facility';

/**
 * @author Youri Janssen
 * Represents the User model in the database.
 */
@Table({
    tableName: 'Boat', // Specify the table name
    timestamps: false, // Enable timestamps (createdAt and updatedAt)
})
export class BoatModel extends Model<BoatModel> {
    @PrimaryKey
    @AutoIncrement
    @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
    id!: number;

    @Column({ type: DataType.STRING, allowNull: false })
    name!: string;

    @Column({ type: DataType.MEDIUMINT.UNSIGNED, allowNull: false })
    price_per_day_in_cents!: number;

    @Column({ type: DataType.TINYINT.UNSIGNED, allowNull: false })
    capacity!: number;

    @Column({ type: DataType.TINYINT, allowNull: false })
    license_required!: boolean;

    @Column({ type: DataType.TINYINT, allowNull: false })
    skipper_required!: boolean;

    @Column(DataType.INTEGER.UNSIGNED)
    model_id!: number;

    @Column(DataType.INTEGER.UNSIGNED)
    fabrication_year!: number;

    @Column(DataType.TINYINT.UNSIGNED)
    length_in_meters!: number;

    @Column(DataType.TINYINT)
    active!: number;

    @BelongsToMany(() => FacilityModel, () => BoatfacilityModel)
    facilities!: FacilityModel[];
}
