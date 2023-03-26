import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutPageComponent } from './components/pages/about-page/about-page.component';
import { AuthorityBasePageComponent } from './components/pages/authority/authority-base-page/authority-base-page.component';
import { AuthorityHomePageComponent } from './components/pages/authority/authority-home-page/authority-home-page.component';
import { AuthorityLoginPageComponent } from './components/pages/authority/authority-login-page/authority-login-page.component';
import { AuthoritySettingsPageComponent } from './components/pages/authority/authority-settings-page/authority-settings-page.component';
import { AuthoritySignupPageComponent } from './components/pages/authority/authority-signup-page/authority-signup-page.component';
import { ContactPageComponent } from './components/pages/contact-page/contact-page.component';
import { PrivacyPolicyPageComponent } from './components/pages/privacy-policy-page/privacy-policy-page.component';
import { TermsAgreementsPageComponent } from './components/pages/terms-agreements-page/terms-agreements-page.component';
import { UserBasePageComponent } from './components/pages/user/user-base-page/user-base-page.component';
import { UserHomePageComponent } from './components/pages/user/user-home-page/user-home-page.component';
import { UserLoginPageComponent } from './components/pages/user/user-login-page/user-login-page.component';
import { UserSettingsPageComponent } from './components/pages/user/user-settings-page/user-settings-page.component';
import { UserSignupPageComponent } from './components/pages/user/user-signup-page/user-signup-page.component';
import { WelcomePageComponent } from './components/pages/welcome-page/welcome-page.component';
import { AuthorityAuthGuard } from './guards/authority/authority-auth.guard';
import { UserAuthGuard } from './guards/user/user-auth.guard';
import { AuthorityResolver } from './resolvers/authority.resolver';
import { UserResolver } from './resolvers/user.resolver';


const main_routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'welcome' },
  { path: 'welcome', pathMatch: 'full', component: WelcomePageComponent },
  { path: 'about', pathMatch: 'full', component: AboutPageComponent },
  { path: 'contact', pathMatch: 'full', component: ContactPageComponent },
  { path: 'terms-agreements', pathMatch: 'full', component: TermsAgreementsPageComponent },
  { path: 'privacy-policy', pathMatch: 'full', component: PrivacyPolicyPageComponent },
];



const user_routes: Routes = [
  { path: 'user-signup', pathMatch: 'full', component: UserSignupPageComponent, canActivate: [] },
  { path: 'user-login', pathMatch: 'full', component: UserLoginPageComponent, canActivate: [] },
  {
    path: 'users/:user_id',
    component: UserBasePageComponent,
    resolve: {
      user: UserResolver,
    },
    data: { authParamsProp: 'user_id' },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      { path: 'home', component: UserHomePageComponent },
      { path: 'settings', component: UserSettingsPageComponent, canActivate: [UserAuthGuard], data: { authParamsProp: 'user_id' } },
    ]
  },
];


const authority_routes: Routes = [
  { path: 'authority-signup', pathMatch: 'full', component: AuthoritySignupPageComponent, canActivate: [] },
  { path: 'authority-login', pathMatch: 'full', component: AuthorityLoginPageComponent, canActivate: [] },
  {
    path: 'authoritys/:authority_id',
    component: AuthorityBasePageComponent,
    resolve: {
      authority: AuthorityResolver,
    },
    data: { authParamsProp: 'authority_id' },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      { path: 'home', component: AuthorityHomePageComponent },
      { path: 'settings', component: AuthoritySettingsPageComponent, canActivate: [AuthorityAuthGuard], data: { authParamsProp: 'authority_id' } },
    ]
  },
];





const useRoutes = [
  ...main_routes,
  ...user_routes,
  ...authority_routes,
];

@NgModule({
  imports: [RouterModule.forRoot(useRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
