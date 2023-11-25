import * as argon2 from 'argon2';

/**
 * @author Youri Janssen
 * Represents the roles of a user.
 */
export enum Roles {
    USER = 'user',
    ADMIN = 'admin',
}

/**
 * @author Youri Janssen
 * Represents a user business object.
 */
export class User {
    private firstName?: string;
    private lastName?: string;
    private mobile_number?: string;
    private email: string;
    private password: string;
    private id_card_image_path?: string;
    private city?: string;
    private zip_code?: string;
    private street?: string;
    private house_number?: string;
    private type: Roles;
    private active: number;
    private _id?: number | undefined;
    public get id(): number | undefined {
        return this._id;
    }

    /**
     * @author Youri Janssen
     * Creates a new User instance.
     * @param {string} email - The user's email address.
     * @param {string} password - The user's password.
     * @param {Roles} type - The user's role.
     * @param {number} active - Flag indicating whether the user is active.
     * @param {number} id - The user's id.
     * @param {string} firstName - The user's first name.
     * @param {string} lastName - The user's last name.
     * @param {string} mobile_number - The user's mobile number.
     * @param {string} id_card_image_path - The user's id card image path.
     * @param {string} city - The user's city.
     * @param {string} zip_code - The user's zip code.
     * @param {string} street - The user's street.
     * @param {string} house_number - The user's house number.
     */
    private constructor(
        email: string,
        password: string,
        type: Roles,
        active: number,
        id: number | undefined = undefined,
        firstName?: string,
        lastName?: string,
        mobile_number?: string,
        id_card_image_path?: string,
        city?: string,
        zip_code?: string,
        street?: string,
        house_number?: string
    ) {
        this.email = email;
        this.password = password;
        this.type = type;
        this.active = active;
        if (firstName) this.firstName = firstName;
        if (lastName) this.lastName = lastName;
        if (mobile_number) this.mobile_number = mobile_number;
        if (id_card_image_path) this.id_card_image_path = id_card_image_path;
        if (city) this.city = city;
        if (zip_code) this.zip_code = zip_code;
        if (street) this.street = street;
        if (house_number) this.house_number = house_number;
        this._id = id;
    }

    /**
     * @author Youri Janssen
     * Method for creates a new User instance.
     * @param {string} email - The user's email address.
     * @param {string} password - The user's password.
     * @returns {User} The created User object.
     * @designpattern Factory Method - This method encapsulates the object creation logic. This allows for flexibility and the potential to switch to different User types without modifying the core function.
     */
    public static createUser(
        email: string,
        password: string,
        type: Roles,
        active: number
    ): User {
        return new User(email, password, type, active);
    }

    /**
     * Creates a User instance with an id.
     * @param id The user's id.
     * @param email The user's email.
     * @param password The user's password.
     * @param type The user type, which is 'admin' or 'user'.
     * @param active The active boolean. If the user is active it is true, else false.
     * @returns the created User instance.
     * @author Thijs van Rixoort
     */
    public static createUserWithId(
        id: number,
        email: string,
        password: string,
        type: Roles,
        active: number
    ): User {
        return new User(email, password, type, active, id);
    }

    /**
     * @author Youri Janssen
     * Validates the user's email and password.
     * @returns {null|string[]} An array of validation error messages, or null if valid.
     */
    public validateUser(): null | string[] {
        const passwordRegEx =
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,32}$/;

        const emailRegEx =
            /^(?=.{1,320}$)^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        const error: string[] = [];
        if (passwordRegEx.test(this.password) === false) {
            error.push('Invalid password');
        }
        if (emailRegEx.test(this.email) === false) {
            error.push('Invalid email');
        }
        if (error.length > 0) {
            return error;
        } else {
            return null;
        }
    }

    /**
     * @author Youri Janssen
     * Hashes a user's password using bcrypt with salt rounds.
     * @param {string} password - The password to be hashed.
     *   A higher value increases security but also computational cost.
     * @returns {Promise<string>} A promise that resolves to the hashed password.
     */
    public hashPassword(password: string): Promise<string> {
        return argon2.hash(password);
    }

    /**
     * @author Youri Janssen
     * Gets the user's email.
     * @returns {string} The user's email address.
     */
    get getEmail(): string {
        return this.email;
    }

    /**
     * @author Youri Janssen
     * Gets the user's password.
     * @returns {string} The user's password.
     */
    get getPassword(): string {
        return this.password;
    }

    /**
     * Sets the user's password.
     * @param {string} password - The user's password.
     */

    set setPassword(password: string) {
        this.password = password;
    }

    /**
     * @author Youri Janssen
     * Gets the user's role.
     * @returns {Roles} The user's role.
     */
    get getType(): Roles {
        return this.type;
    }

    /**
     * @author Youri Janssen
     * Gets the user's active status.
     * @returns {number} The user's active status.
     */
    get getActive(): number {
        return this.active;
    }

    /**
     * Checks if the password saved in this instance is the same as the password parameter.
     * @param password The password that you want to check, unhashed.
     * @returns true when the passwords are the same, else false.
     * @author Thijs van Rixoort
     */
    public async validatePassword(password: string): Promise<boolean> {
        return await argon2.verify(this.password, password);
    }
}
