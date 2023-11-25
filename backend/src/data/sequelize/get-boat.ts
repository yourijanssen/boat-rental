import { Op } from 'sequelize';
import { Boat } from '../../business/model/boats';
import { BoatDatabaseInterface } from '../interfaces/boat';
import { detailedBoat } from '../../business/model/boat-detailed';
import { BoatModel } from '../../util/database/sequelize/models/boat';
import BoatImageModel from '../../util/database/sequelize/models/boatimage';
import { FacilityModel } from '../../util/database/sequelize/models/facility';
import BoatTypeModel from '../../util/database/sequelize/models/boatmodel';

/**
 * A very simple type just to make the @function arraySanitiser a bit more readable
 * @author Marcus K.
 */
type sanitiserModels = Array<FacilityModel | BoatImageModel>;

/**
 * @author Youri Janssen && Marcus K.
 * A class handling database operations related to the Boat model using Sequelize.
 * @designpattern Repository Pattern - A design pattern that separates the data access logic from the business logic. It helps to achieve a separation of concerns and enables the application to have a more flexible architecture.
 */
export class BoatSequelizeDatabase implements BoatDatabaseInterface {
    /**
     * @author Youri Janssen
     * Searches for boats based on the name.
     * @param {string} name - The name to search for.
     * @returns {Promise<Boat[] | 'server_error'>} A promise containing an array of boats, an empty array if no boats are found, or 'server_error' in case of an error.
     */
    public async searchBoats(name: string): Promise<Boat[] | 'server_error'> {
        try {
            const boats = await this.findBoatsByName(name);
            if (boats.length === 0) {
                return [];
            }
            const mappedBoats = this.mapBoatsData(boats);
            const sortedBoats = this.sortBoatsAlphabetically(await mappedBoats);
            return sortedBoats;
        } catch (error) {
            return 'server_error';
        }
    }

    /**
     * @author Youri Janssen
     * Finds boats by name.
     * @param {string} name - The name to search for.
     * @returns {Promise<BoatModel[]>} A promise containing an array of BoatModel instances.
     */
    private async findBoatsByName(name: string): Promise<BoatModel[]> {
        return await BoatModel.findAll({
            where: {
                name: {
                    [Op.like]: `%${name}%`,
                },
            },
        });
    }

    /**
     * @author Youri Janssen
     * Maps the data of boats.
     * @param {BoatModel[]} boats - An array of BoatModel instances.
     * @returns {Promise<Boat[]>} A promise containing an array of Boat business model instances.
     * The $get method is used to retrieve associated data or related instances from an associated model.
     */
    private async mapBoatsData(boats: BoatModel[]): Promise<Boat[]> {
        const mappedBoats: Boat[] = [];
        for (const boat of boats) {
            const facilities: FacilityModel[] = await boat.$get('facilities');
            const facilityNames: string[] = facilities.map(
                facility => facility.facility
            );
            const mappedBoat = Boat.createBoat(
                boat.name,
                boat.price_per_day_in_cents,
                boat.capacity,
                boat.license_required,
                boat.skipper_required,
                facilityNames
            );
            mappedBoats.push(mappedBoat);
        }
        return mappedBoats;
    }

    /**
     * @author Youri Janssen
     * Sorts boats alphabetically.
     * @param {Boat[]} mappedBoats - An array of Boat instances.
     * @returns {Boat[]} An array of Boat instances sorted alphabetically.
     */
    private sortBoatsAlphabetically(mappedBoats: Boat[]): Boat[] {
        return Boat.returnBoatsAlphabetically(mappedBoats);
    }

    /**
     * The following chunk is dedicated to requesting a singular boat with all their details.
     * @author Marcus K.
     */

    /**
     * A query that grabs a boat that matches the given ID, with the brand as well.
     * @param id is the id of a given boat.
     * @returns a Promise of a boat's data, or nothing at all if it can't find it.
     * @author Marcus K.
     */
    public async getMainData(id: number): Promise<BoatModel | null> {
        return await BoatModel.findOne({
            where: { id: id },
            include: {
                attributes: ['model', 'brandname'],
                model: BoatTypeModel,
            },
        });
    }

    /**
     * A query that grabs all the Facilities that a boat with this ID has.
     * @param id is the id of a given boat.
     * @returns an array of facilities which match the id of a boat given.
     * @author Marcus K.
     */
    public async getFacilityData(id: number): Promise<BoatModel[] | null> {
        return await BoatModel.findAll({
            where: { id: id },
            include: {
                attributes: ['facility'],
                model: FacilityModel,
                through: { attributes: [] },
            },
        });
    }

    /**
     * A query that grabs all the Images that a boat with this ID has.
     * @param id is the id of a given boat.
     * @returns an array of images which match the id of a boat given.
     * @author Marcus K.
     */
    public async getImageData(id: number): Promise<BoatImageModel[] | null> {
        return await BoatImageModel.findAll({
            attributes: ['image_path'],
            where: {
                boat_id: id,
            },
        });
    }

    /**
     * @function findOneBoat is technically not an accurate name, as it assembles all the data found for a boat. Still, it uses all found data to compile a boat instance.
     * @param returnedBoat are all the details about a boat.
     * @param returnedFacilities are all the facilities related to a boat.
     * @param returnedImages are all the images related to a boat.
     * @returns all those datapoints as one instanced boat.
     * @author Marcus K.
     */
    public async findOneBoat(
        returnedBoat: BoatModel,
        returnedFacilities: BoatModel[],
        returnedImages: BoatImageModel[]
    ): Promise<detailedBoat | null> {
        let facilities: Promise<object[]> | undefined = undefined;
        if (returnedFacilities[0]) {
            facilities = this.arraySanitiser(returnedFacilities[0].facilities);
        }
        const images = this.arraySanitiser(returnedImages);

        /**
         * A modified instancer for boats, checking if core data returns at all and if the boat is active. If it goes well, it should get send back to the front.
         * Essentially converts it to a Business model, from what I've heard. But it somehow feels... off?
         * @author Marcus K.
         */
        if (returnedBoat && returnedBoat.active) {
            return new detailedBoat(
                returnedBoat.id,
                returnedBoat.name,
                returnedBoat.description,
                returnedBoat.price_per_day_in_cents,
                returnedBoat.capacity,
                returnedBoat.license_required,
                returnedBoat.skipper_required,
                returnedBoat.model_id,
                returnedBoat.fabrication_year,
                returnedBoat.length_in_meters,
                returnedBoat.active,
                returnedBoat.BoatTypeModel.dataValues.model,
                returnedBoat.BoatTypeModel.dataValues.brandname,

                await facilities,
                await images
            );
        } else {
            return null;
        }
    }

    /**
     * @function arraySanitiser simply extracts all datavalues and pushes it into a new array
     * @param array is either the boatfacilities or images obtained here.
     * @returns an array with the datavalues extracted
     * @author Marcus K.
     */
    private async arraySanitiser(array: sanitiserModels): Promise<object[]> {
        const newArray: object[] = [];

        array.forEach(element => {
            newArray.push(element.dataValues);
        });

        return newArray.flat();
    }
}
