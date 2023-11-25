import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { BoatComponent } from './pages/boat/boat.component';
import { BoatDetailsComponent } from './pages/boat-details/boat-details.component';

/**
 * @author Youri Janssen, Thijs van Rixoort //entire file
 * Defines the routes for the application.
 */
const routes: Routes = [
    { path: '', redirectTo: '/start', pathMatch: 'full' },
    { path: 'start', component: HomeComponent },
    { path: 'registreren', component: RegisterComponent },
    { path: 'boten', component: BoatComponent },
    { path: 'boten/:bootId', component: BoatDetailsComponent },
    { path: 'niet-gevonden', component: PageNotFoundComponent },
    { path: '**', redirectTo: '/niet-gevonden' } //Internal Note for Devs: Always keep this path on the bottom of the routes.
];

/** The AppRoutingModule configures the application's routes. */
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
