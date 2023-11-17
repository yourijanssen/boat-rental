import { Component } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    Validators
} from '@angular/forms';
import { RegisterService } from 'src/app/services/register.service';

/**
 * @author Youri Janssen
 * Component for user registration.
 */
@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    /** Indicates if the form contains invalid data. */
    invalidForm = false;
    /** Indicates if the form contains valid data. */
    validForm = false;
    /** Indicates if a form submit message should be displayed. */
    formSubmitMessage = false;
    /** Indicates if an error message should be displayed. */
    errorOccuredMessage = false;
    userExistsError = false;

    constructor(
        private registerService: RegisterService,
        private formBuilder: FormBuilder
    ) {}

    /** Form group for user details. */
    registerForm: FormGroup = this.formBuilder.group({
        email: [
            '',
            [
                Validators.required,
                Validators.email,
                Validators.pattern(
                    /^(?=.{1,320}$)^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                )
            ]
        ],
        password: [
            '',
            [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(32),
                Validators.pattern(
                    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,32}$/
                )
            ]
        ]
    });

    /**
     * @author Youri Janssen
     * Checks if a specific form control is invalid based on certain conditions.
     * @param {string} controlName - The name of the form control to check.
     * @returns {boolean} True if the form control is invalid and meets the specified conditions, otherwise false.
     */
    isFormControlInvalid(controlName: string): boolean {
        const control: AbstractControl | null =
            this.registerForm.get(controlName);
        /* If the control doesn't exist, it's not invalid */
        if (!control) {
            return false;
        }
        const isInvalid: boolean = control.invalid;
        const formSubmitted: boolean = this.invalidForm;
        return isInvalid && formSubmitted;
    }

    /**
     * @author Youri Janssen
     * Submits the registration form.
     */
    onSubmit(): void {
        this.resetFormStatus();

        if (!this.registerForm.valid) {
            this.handleInvalidForm();
            return;
        }

        this.showFormSubmittedMessage();

        this.registerService.postNewUser(this.registerForm).subscribe({
            next: () => {
                this.handleValidForm();
            },
            error: (error: unknown) => {
                this.handleError(error);
            }
        });
    }

    /**
     * @author Youri Janssen
     * Resets the form status.
     */
    private resetFormStatus(): void {
        this.invalidForm = false;
        this.errorOccuredMessage = false;
        this.validForm = false;
        this.userExistsError = false;
    }

    /**
     * @author Youri Janssen
     * Handles an invalid form.
     */
    private handleInvalidForm(): void {
        this.userExistsError = false;
        this.invalidForm = true;
    }

    /**
     * @author Youri Janssen
     * Displays a form submit message.
     */
    private showFormSubmittedMessage(): void {
        this.formSubmitMessage = true;
    }

    /**
     * @author Youri Janssen
     * Handles a valid form submission.
     */
    private handleValidForm(): void {
        this.validForm = true;
        this.formSubmitMessage = false;
        this.userExistsError = false;
        setTimeout(() => {
            this.registerForm.reset();
        }, 2000);
    }

    /**
     * @author Youri Janssen
     * Handles an error during form submission.
     * @param {any} error - The error object.
     */
    private handleError(error: any): void {
        if (error.status === 409) {
            this.userExistsError = true;
        } else {
            console.error('Error submitting while signing up:', error);
        }
        this.formSubmitMessage = false;
        this.errorOccuredMessage = true;
    }
}
