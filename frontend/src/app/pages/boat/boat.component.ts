import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Boat } from 'src/app/interfaces/boat';
import { BoatService } from 'src/app/services/boat.service';
import { HeaderService } from 'src/app/services/header.service';

/**
 * @author Youri Janssen
 * Boat component for displaying and searching boats.
 */
@Component({
    selector: 'app-boat',
    templateUrl: './boat.component.html',
    styleUrls: ['./boat.component.css']
})
export class BoatComponent implements OnInit {
    /** An array of Boat objects that match the search criteria. */
    public searchResult: Boat[] = [];
    public searchTerm = '';
    public hasSearched = false;
    public previousSearchTerm = '';

    /**
     * @author Youri Janssen
     * Creates an instance of BoatComponent.
     * @param boatService - The BoatService used to search for boats.
     */
    constructor(
        private boatService: BoatService,
        private route: ActivatedRoute,
        private router: Router,
        private headerService: HeaderService
    ) {
        this.assignHeaderData();
    }

    /**
     * @function assignHeaderData is dedicated to giving data to the Header Service so it knows that to display on this webpage.
     * @param headerTitle
     * @author Marcus K.
     */
    private assignHeaderData(): void {
        this.headerService.assignHeaderData({
            title: 'boten',
            biggerBanner: false,
            search: false,
            colour: '#456ed8'
        });
    }

    /**
     * @author Youri Janssen
     * Angular lifecycle hook that is called after the component has been initialized.
     */
    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const searchTerm = params['q'];
            if (searchTerm) {
                this.searchBoats(searchTerm);
            }
        });
    }

    /**
     * @author Youri Janssen
     * Searches for boats based on the provided search term.
     * @param {string} searchTerm - The searchTerm of the boat to search for.
     */
    searchBoats(searchTerm: string): void {
        if (this.isInvalidSearchTerm(searchTerm)) {
            return;
        }

        this.performBoatSearch(searchTerm);
    }

    /**
     * @author Youri Janssen
     * Checks if the provided search term is valid.
     * @param {string} searchTerm - The searchTerm to validate.
     * @returns {boolean} A boolean value indicating whether the search term is invalid.
     */
    private isInvalidSearchTerm(searchTerm: string): boolean {
        if (searchTerm.trim() === '') {
            return true; // Do nothing if the search term is empty or contains only white spaces
        }
        if (searchTerm.length > 150) {
            alert('The boat name cannot contain more than 150 characters.');
            return true;
        }
        return false;
    }

    /**
     * @author Youri Janssen
     * Performs a search for boats based on the provided search term.
     * @param {string} searchTerm - The search term used for the boat search.
     */
    private performBoatSearch(searchTerm: string): void {
        this.boatService.searchBoats(searchTerm).subscribe({
            next: (searchResult: Boat[]) => {
                this.searchResult = searchResult;
                this.updateSearchResults(searchTerm);
            },
            error: (error: unknown) => {
                console.error('An error occurred:', error);
            }
        });
    }

    /**
     * @author Youri Janssen
     * Updates the search results based on the provided search term.
     * @param {string} searchTerm - The search term used for the update.
     */
    private updateSearchResults(searchTerm: string): void {
        this.router.navigate(['/boten'], {
            queryParams: { q: searchTerm }
        });
        this.hasSearched = true;
        this.previousSearchTerm = searchTerm;
    }

    /**
     * @author Youri Janssen
     * Checks if the Boat names are returned in alphabetical order. (only used for testing purposes)
     * @returns A boolean value indicating whether the names are in alphabetical order.
     */
    checkAlphabeticalOrder(): boolean {
        for (let i = 0; i < this.searchResult.length - 1; i++) {
            // Check if the current element is greater than the next element
            if (
                this.searchResult[i].name.localeCompare(
                    this.searchResult[i + 1].name
                ) > 0
            ) {
                // Return false if the current element is greater than the next element
                return false;
            }
        }
        return true;
    }
}
