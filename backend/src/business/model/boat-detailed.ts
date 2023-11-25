import { RowDataPacket } from 'mysql2';

export class detailedBoat {
    private id: number;
    private name: string;
    private description: string;
    private price: number;
    private capacity: number;
    private licenseRequired: boolean;
    private skipperRequired: boolean;
    private modelId: number;
    private fabricationYear: number;
    private length: number;
    private active: boolean;
    private model: string;
    private brandName: string;

    private facilityArray: string[];
    private imageArray: string[];

    /**
     * Based entirely on Youri's instancing method, to keep things consistent.
     * @author Marcus K.
     */
    public constructor(
        id: number,
        name: string,
        description: string,
        price_per_day_in_cents: number,
        capacity: number,
        license_required: boolean,
        skipper_required: boolean,
        model_id: number,
        fabrication_year: number,
        length_in_meters: number,
        active: boolean,
        model: string,
        brandname: string,

        facility_array?: Array<object | RowDataPacket>,
        image_array?: Array<object | RowDataPacket>
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price_per_day_in_cents;
        this.capacity = capacity;
        this.licenseRequired = Boolean(license_required);
        this.skipperRequired = Boolean(skipper_required);
        this.modelId = model_id;
        this.fabricationYear = fabrication_year;
        this.length = length_in_meters;
        this.active = Boolean(active);
        this.model = model;
        this.brandName = brandname;

        this.facilityArray = this.flattenObjectArray(facility_array);
        this.imageArray = this.flattenObjectArray(image_array);
    }

    /**
     * A function dedicated to remove keys from an object array and just leaves strings behind, which cleans the outgoing data somewhat.
     * @param array contains an array of objects, of which the keys get removed.
     * @returns a flattened and cleaned up array like mentioned.
     * @author Marcus K.
     */
    private flattenObjectArray(
        array: Array<object | RowDataPacket> | undefined
    ): string[] {
        const newArray: string[] = [];

        if (array) {
            array.forEach((element: object | RowDataPacket) => {
                newArray.push(Object.values(element) as unknown as string); //agree that this is type assertion is bad, not done properly.
            });
        }

        return newArray.flat();
    }
}
