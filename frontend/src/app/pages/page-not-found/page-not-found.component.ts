import { Component } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';

@Component({
    selector: 'app-page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent {
  faArrowLeft = faArrowLeft;

  errorCode = 404;
  errorMessage = "Page Not Found"

    constructor(private location: Location) {}

    /**
     * goBack is a very simple function that just calls location.back()
     * This sends the user to the last path in their browser.
     * @author Marcus K.
     */
    public goBack(): void {
        this.location.back();
    }
}
