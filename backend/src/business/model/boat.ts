/**
 * @author Youri Janssen
 * Represents a boat business object.
 */
export class Boat {
    private name: string;
    private price_per_day_in_cents: number;
    private capacity: number;
    private license_required: boolean;
    private skipper_required: boolean;
    private id?: number;
    private facilities?: string;
    private fabrication_year?: number;
    private length_in_meters?: number;
    private active?: number;

    /**
     * @author Youri Janssen
     * Private constructor for Boat.
     * @param {string} name - The name of the boat.
     * @param {number} price_per_day_in_cents - The price per day in cents.
     * @param {number} capacity - The capacity of the boat.
     * @param {boolean} license_required - Flag indicating whether a license is required.
     * @param {boolean} skipper_required - Flag indicating whether a skipper is required.
     * @param {number} id - The id of the boat.
     * @param {string} facilities - The facilities of the boat.
     * @param {number} fabrication_year - The fabrication year of the boat.
     * @param {number} length_in_meters - The length in meters of the boat.
     * @param {number} active - Flag indicating whether the boat is active.
     */
    private constructor(
        name: string,
        price_per_day_in_cents: number,
        capacity: number,
        license_required: boolean,
        skipper_required: boolean,
        id?: number,
        facilities?: string[],
        fabrication_year?: number,
        length_in_meters?: number,
        active?: number
    ) {
        this.name = name;
        this.price_per_day_in_cents = price_per_day_in_cents;
        this.capacity = capacity;
        this.license_required = license_required;
        this.skipper_required = skipper_required;
        if (id) this.id = id;
        if (facilities) this.facilities = facilities.join(', ');
        if (fabrication_year) this.fabrication_year = fabrication_year;
        if (length_in_meters) this.length_in_meters = length_in_meters;
        if (active) this.active = active;
    }

    /**
     * @author Youri Janssen
     * Creates a new Boat instance used for the creation of a boat object inside the boat overview page.
     * @param {string} name - The name of the boat.
     * @param {number} price_per_day_in_cents - The price per day in cents.
     * @param {number} capacity - The capacity of the boat.
     * @param {boolean} license_required - Flag indicating whether a license is required.
     * @param {boolean} skipper_required - Flag indicating whether a skipper is required.
     * @param {string} facilities - The facilities of the boat.
     * @returns {Boat} The created Boat object.
     * @designpattern Factory Method - This method encapsulates the object creation logic. This allows for flexibility and the potential to switch to different Boat types without modifying the core function.
     */
    public static createBoat(
        name: string,
        price_per_day_in_cents: number,
        capacity: number,
        license_required: boolean,
        skipper_required: boolean,
        facilities: string[]
    ): Boat {
        return new Boat(
            name,
            price_per_day_in_cents,
            capacity,
            license_required,
            skipper_required,
            undefined,
            facilities
        );
    }

    /**
     * @author Youri Janssen
     * Sorts an array of boats alphabetically based on the boat names.
     * @param {Boat[]} names - The array of boats to be sorted.
     * @returns {Boat[]} The sorted array of boats.
     * @designpattern Strategy - This function implements the Strategy design pattern by encapsulating the sorting algorithm for an array of boats. The custom sorting logic allows for flexibility and the potential to switch to different sorting strategies without modifying the core function.
     */
    public static returnBoatsAlphabetically(names: Boat[]): Boat[] {
        return names.sort((a, b) => {
            const nameA = a.name.toUpperCase(); // ignore upper and lowercase
            const nameB = b.name.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            // names must be equal
            return 0;
        });
    }

    get testName(): string {
        return this.name;
    }
}
