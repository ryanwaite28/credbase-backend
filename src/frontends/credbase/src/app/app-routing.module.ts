import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutPageComponent } from './components/pages/about-page/about-page.component';
import { AuthorityAssetsPageComponent } from './components/pages/authority/authority-assets-page/authority-assets-page.component';
import { AuthorityBasePageComponent } from './components/pages/authority/authority-base-page/authority-base-page.component';
import { AuthorityClientsPageComponent } from './components/pages/authority/authority-clients-page/authority-clients-page.component';
import { AuthorityHelpPageComponent } from './components/pages/authority/authority-help-page/authority-help-page.component';
import { AuthorityHomePageComponent } from './components/pages/authority/authority-home-page/authority-home-page.component';
import { AuthorityItemsPageComponent } from './components/pages/authority/authority-items-page/authority-items-page.component';
import { AuthorityLoginPageComponent } from './components/pages/authority/authority-login-page/authority-login-page.component';
import { AuthoritySettingsPageComponent } from './components/pages/authority/authority-settings-page/authority-settings-page.component';
import { AuthoritySignupPageComponent } from './components/pages/authority/authority-signup-page/authority-signup-page.component';
import { ContactPageComponent } from './components/pages/contact-page/contact-page.component';
import { PrivacyPolicyPageComponent } from './components/pages/privacy-policy-page/privacy-policy-page.component';
import { TermsAgreementsPageComponent } from './components/pages/terms-agreements-page/terms-agreements-page.component';
import { UserAuthoritiesPageComponent } from './components/pages/user/user-authorities-page/user-authorities-page.component';
import { UserBasePageComponent } from './components/pages/user/user-base-page/user-base-page.component';
import { UserHelpPageComponent } from './components/pages/user/user-help-page/user-help-page.component';
import { UserHomePageComponent } from './components/pages/user/user-home-page/user-home-page.component';
import { UserItemsPageComponent } from './components/pages/user/user-items-page/user-items-page.component';
import { UserLoginPageComponent } from './components/pages/user/user-login-page/user-login-page.component';
import { UserSettingsPageComponent } from './components/pages/user/user-settings-page/user-settings-page.component';
import { UserSignupPageComponent } from './components/pages/user/user-signup-page/user-signup-page.component';
import { WelcomePageComponent } from './components/pages/welcome-page/welcome-page.component';
import { AuthorityAuthGuard } from './guards/authority/authority-auth.guard';
import { AuthorityLoggedoutGuard } from './guards/authority/authority-loggedout.guard';
import { UserAuthGuard } from './guards/user/user-auth.guard';
import { UserLoggedoutGuard } from './guards/user/user-loggedout.guard';
import { AuthorityResolver } from './resolvers/authority.resolver';
import { UserResolver } from './resolvers/user.resolver';


const main_routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'welcome' },
  { path: 'welcome', pathMatch: 'full', component: WelcomePageComponent, canActivate: [UserLoggedoutGuard, AuthorityLoggedoutGuard] },
  { path: 'about', pathMatch: 'full', component: AboutPageComponent },
  { path: 'contact', pathMatch: 'full', component: ContactPageComponent },
  { path: 'terms-agreements', pathMatch: 'full', component: TermsAgreementsPageComponent },
  { path: 'privacy-policy', pathMatch: 'full', component: PrivacyPolicyPageComponent },
];



const user_routes: Routes = [
  { path: 'user-signup', pathMatch: 'full', component: UserSignupPageComponent, canActivate: [UserLoggedoutGuard, AuthorityLoggedoutGuard] },
  { path: 'user-login', pathMatch: 'full', component: UserLoginPageComponent, canActivate: [UserLoggedoutGuard, AuthorityLoggedoutGuard] },
  {
    path: 'users/:user_id',
    component: UserBasePageComponent,
    data: { authParamsProp: 'user_id' },
    canActivate: [AuthorityLoggedoutGuard, UserAuthGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      { path: 'home', component: UserHomePageComponent },
      { path: 'settings', component: UserSettingsPageComponent, data: { authParamsProp: 'user_id' } },
      { path: 'authorities', component: UserAuthoritiesPageComponent, data: { authParamsProp: 'user_id' } },
      { path: 'items', component: UserItemsPageComponent, data: { authParamsProp: 'user_id' } },
      { path: 'help', component: UserHelpPageComponent, data: { authParamsProp: 'user_id' } },
    ]
  },
];


const authority_routes: Routes = [
  { path: 'authority-signup', pathMatch: 'full', component: AuthoritySignupPageComponent, canActivate: [UserLoggedoutGuard, AuthorityLoggedoutGuard] },
  { path: 'authority-login', pathMatch: 'full', component: AuthorityLoginPageComponent, canActivate: [UserLoggedoutGuard, AuthorityLoggedoutGuard] },
  {
    path: 'authorities/:authority_id',
    component: AuthorityBasePageComponent,
    data: { authParamsProp: 'authority_id' },
    canActivate: [UserLoggedoutGuard, AuthorityAuthGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      { path: 'home', component: AuthorityHomePageComponent },
      { path: 'settings', component: AuthoritySettingsPageComponent, data: { authParamsProp: 'authority_id' } },
      { path: 'clients', component: AuthorityClientsPageComponent, data: { authParamsProp: 'authority_id' } },
      { path: 'assets', component: AuthorityAssetsPageComponent, data: { authParamsProp: 'authority_id' } },
      { path: 'items', component: AuthorityItemsPageComponent, data: { authParamsProp: 'authority_id' } },
      { path: 'help', component: AuthorityHelpPageComponent, data: { authParamsProp: 'authority_id' } },
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
