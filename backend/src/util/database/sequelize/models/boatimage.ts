import {
    AllowNull,
    AutoIncrement,
    Column,
    DataType,
    Model,
    PrimaryKey,
    Table,
    Unique,
} from 'sequelize-typescript';

@Table({
    tableName: 'BoatImage',
    timestamps: false,
})

/**
 * A simple Sequelize model for the BoatImageModel, which is a table containing all images related to a boat.
 * @author Marcus K.
 */
export default class BoatImageModel extends Model<BoatImageModel> {
    @PrimaryKey
    @AllowNull(false)
    @AutoIncrement
    @Column(DataType.INTEGER().UNSIGNED)
    public declare boat_id: number;

    @AllowNull(false)
    @Unique
    @Column(DataType.CHAR(255))
    public declare image_path: string;
}
