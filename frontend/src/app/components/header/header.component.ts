import {
    Component,
    ElementRef,
    Input,
    Renderer2,
    ViewChild
} from '@angular/core';
import {
    IconDefinition,
    faCircleUser,
    faMagnifyingGlass,
    faShoppingCart
} from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HeaderService } from 'src/app/services/header.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {
    // /**
    //  * The @Input pageType is a simple object which accepts external changes and apply them directly upon the header
    //  * @var title is the string that shows as an optional title on the page
    //  * @var biggerBanner is a boolean deciding to make the colour banner taller or not.
    //  * @var search is a boolean deciding to show a searchbar or not.
    //  * @var colour is a string with the value of what colour to render.
    //  * @author Marcus K.
    //  */
    // @Input()

    /**
     * The @Input userData would change what letters to render on the webpage if an user is logged in, only the first 2 get grabbed. Never let it default.
     * @var firstName is a string representing a user's first name.
     * @var lastName is a string representing a user's first name.
     * @author Marcus K.
     */
    @Input() userData: { firstName: string; lastName: string } = {
        firstName: 'John',
        lastName: 'Doe'
    };

    @ViewChild('dropdown') dropdown!: ElementRef;
    @ViewChild('userButton') userButton!: ElementRef;

    public pageType: {
        title?: string;
        biggerBanner?: boolean;
        search?: boolean;
        colour?: string;
    } = {};

    /**
     * The constructor holds a simple function to detect if someone is clicking on the dropdown or not. Fires per click, might be a resource hog?
     * @var renderer is the Renderer on the HeaderComponent. We're not allowed to use @ViewChild iirc, but this is the recommended method.
     * @param overlay A MatDialog object that is used for the login overlay.
     * @param authService An authentication service used to check wether the user is logged in or not.
     * @author Marcus K & Thijs van Rixoort
     */
    constructor(
        private renderer: Renderer2,
        public overlay: MatDialog,
        private authService: AuthenticationService,
        private headerService: HeaderService
    ) {
        this.renderer.listen('window', 'click', (clickEvent: Event) =>
            this.dropdownOff(clickEvent)
        );
        this.logInState();

        this.headerService.headerData.subscribe(value => {
            this.pageType = value;
        });
    }

    public faMagnifyingGlass: IconDefinition = faMagnifyingGlass;
    public faCircleUser: IconDefinition = faCircleUser;
    public faShoppingCart: IconDefinition = faShoppingCart;

    public loggedIn = true;
    public dropdownVisible = false;

    /**
     * @function dropdownToggle is an extremely simple function which flips the boolean of the dropdown's visibility
     * @author Marcus K.
     */
    dropdownToggle(): void {
        this.dropdownVisible = !this.dropdownVisible;
    }

    /**
     * @function dropdownOff checks whenever the user clicks on the page, if it's not part of the dropdown, it closes the dropdown.
     * @var clickEvent is simply the event of where the user pressed.
     * @author Marcus K.
     */
    dropdownOff(clickEvent: Event): void {
        if (
            this.userButton &&
            this.dropdown &&
            clickEvent.target !== this.userButton.nativeElement &&
            clickEvent.target !== this.dropdown.nativeElement
        ) {
            this.dropdownVisible = false;
        }
    }

    /**
     * @function logInState is a simple check to see if there is a cookie for a user, if so it enables the logged in rendering.
     * @author Marcus K & Thijs van Rixoort
     */
    logInState(): void {
        this.authService.isUserLoggedIn.subscribe(value => {
            this.loggedIn = value;
        });
    }

    /**
     * @function logOut simply expires the session token to log them out and then reloads the page.
     * This is not Angular standard, and goes against what single page apps stand for, so this isn't a permanent solution.
     * @author Marcus K.
     */
    logOut(): void {
        document.cookie =
            'session_token' + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        window.location.replace('/');
    }

    /**
     * Opens a login pop-up dialog containing a simple form.
     * @author Thijs van Rixoort
     */
    public openLoginOverlay(): void {
        this.overlay.open(LoginComponent, {
            width: '50%'
        });
    }
}
