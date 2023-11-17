/**
 * @author Youri Janssen
 * Encapsulates the logic for handling search queries in an object-oriented manner.
 * Represents a search query for boats.
 */
export class SearchQuery {
    private searchTerm: string;

    /**
     * @author Youri Janssen
     * Creates an instance of SearchQuery.
     * @param {string} searchTerm - The search query string.
     */
    constructor(searchTerm: string) {
        this.searchTerm = searchTerm;
    }

    /**
     * @author Youri Janssen
     * Validates the search query.
     * @returns {null|string[]} Null if the query is valid, otherwise an array of error messages.
     */
    public validateQuery(): null | string[] {
        const errors: string[] = [];
        if (this.searchTerm.trim() === '') {
            errors.push('A search query should contain at least 1 character');
        }
        if (this.searchTerm.length > 150) {
            errors.push(
                'A search query cannot contain more than 150 characters'
            );
        }
        if (errors.length > 0) {
            return errors;
        } else {
            return null;
        }
    }
}
