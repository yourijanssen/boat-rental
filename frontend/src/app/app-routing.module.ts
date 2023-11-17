import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { BoatComponent } from './pages/boat/boat.component';

/**
 * @author Youri Janssen, Thijs van Rixoort //entire file
 * Defines the routes for the application.
 */
const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'boat', component: BoatComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'not-found', component: PageNotFoundComponent },
    { path: '**', redirectTo: '/not-found' } //Internal Note for Devs: Always keep this path on the bottom of the routes.
];

/** The AppRoutingModule configures the application's routes. */
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
