/**
 * @author Youri Janssen
 * @interface Boat - Represents a Boat object with its properties.
 */
export interface Boat {
    name: string;
    price_per_day_in_cents: number;
    capacity: number;
    license_required: boolean;
    skipper_required: boolean;
    facilities: string;
}
