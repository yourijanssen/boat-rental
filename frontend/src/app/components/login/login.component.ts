import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {
    FormGroup,
    FormBuilder
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SessionService } from 'src/app/services/session.service';

/**
 * A component used for logging in.
 * @author Thijs van Rixoort
 */
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    public error = '';

    loginForm: FormGroup = this.formBuilder.group({
        email: '',
        password: ''
    });

    constructor(
        private sessionService: SessionService,
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<LoginComponent>,
        private authService: AuthenticationService
    ) {}

    /**
     * Closes the login pop-up.
     * @author Thijs van Rixoort
     */
    public closeOverlay(): void {
        this.dialogRef.close();
    }

    /**
     * Sends a request to the back end to create a session.
     * When a user submitted existing accountdata they receive a session token in a cookie.
     * When the user submitted invalid or non-existent data, they receive an error.
     * @author Thijs van Rixoort
     */
    public onSubmit(): void {
        const EMAIL: string = this.loginForm.value.email;
        const PASSWORD: string = this.loginForm.value.password;

        this.sessionService.createSession(EMAIL, PASSWORD).subscribe({
            error: (response: HttpErrorResponse) => {
                this.error = response.error;
            },
            complete: () => {
                this.authService.isUserLoggedIn.next(true);
                this.closeOverlay();
            }
        });    
    }
}
