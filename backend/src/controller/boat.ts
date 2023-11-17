import express from 'express';
import { Boat } from '../business/model/boat';
import { BoatService } from '../business/service/boat';

/**
 * @author Youri Janssen
 * Boat controller class handling boat-related operations.
 */
export class BoatController {
    /**
     * @author Youri Janssen
     * Constructor for BoatController.
     * @param {BoatService} boatService - An instance of the BoatService.
     * @designpattern Dependency Injection (DI)
     */
    constructor(private boatService: BoatService) {}

    /**
     * @author Youri Janssen
     * Searches for boats based on the provided searchTerm.
     * @param {express.Request} request - The request object.
     * @param {express.Response} response - The response object.
     * @returns {Promise<void>} A Promise that resolves once the operation is complete.
     */
    public async searchBoats(
        request: express.Request,
        response: express.Response
    ): Promise<void> {
        const searchTerm = request.query.q as string;
        const boatSearchResult = await this.performBoatSearch(searchTerm);
        this.handleBoatSearchResponse(response, boatSearchResult);
    }

    /**
     * @author Youri Janssen
     * Performs a boat search based on the provided searchTerm.
     * @param {string} searchTerm - The searchTerm to search for.
     * @returns {Promise<Boat[] | string[] | 'server_error'>} A Promise containing the search result.
     */
    private async performBoatSearch(
        searchTerm: string
    ): Promise<Boat[] | string[] | 'server_error'> {
        return await this.boatService.searchBoats(searchTerm);
    }

    /**
     * @author Youri Janssen
     * Handles the boat search response and sends the appropriate HTTP response.
     * @param {express.Response} response - The response object.
     * @param {Boat[] | string[] | 'server_error'} boatSearchResult - The boat search result.
     */
    private handleBoatSearchResponse(
        response: express.Response,
        boatSearchResult: Boat[] | string[] | 'server_error'
    ): void {
        if (boatSearchResult === 'server_error') {
            response.status(500).json({ error: 'A server error occurred' });
        } else if (
            Array.isArray(boatSearchResult) &&
            boatSearchResult.length === 0
        ) {
            response.status(200).json([]);
        } else if (
            Array.isArray(boatSearchResult) &&
            boatSearchResult[0] instanceof Boat
        ) {
            response.status(200).json(boatSearchResult as Boat[]);
        } else if (
            Array.isArray(boatSearchResult) &&
            typeof boatSearchResult[0] === 'string'
        ) {
            response.status(400).json(boatSearchResult as string[]);
        }
    }
}
