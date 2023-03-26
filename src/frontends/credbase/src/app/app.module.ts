import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WelcomePageComponent } from './components/pages/welcome-page/welcome-page.component';
import { AboutPageComponent } from './components/pages/about-page/about-page.component';
import { FaqPageComponent } from './components/pages/faq-page/faq-page.component';
import { ContactPageComponent } from './components/pages/contact-page/contact-page.component';
import { UserSignupPageComponent } from './components/pages/user/user-signup-page/user-signup-page.component';
import { UserLoginPageComponent } from './components/pages/user/user-login-page/user-login-page.component';
import { UserBasePageComponent } from './components/pages/user/user-base-page/user-base-page.component';
import { UserHomePageComponent } from './components/pages/user/user-home-page/user-home-page.component';
import { UserSettingsPageComponent } from './components/pages/user/user-settings-page/user-settings-page.component';
import { AuthoritySignupPageComponent } from './components/pages/authority/authority-signup-page/authority-signup-page.component';
import { AuthorityLoginPageComponent } from './components/pages/authority/authority-login-page/authority-login-page.component';
import { AuthorityBasePageComponent } from './components/pages/authority/authority-base-page/authority-base-page.component';
import { AuthorityHomePageComponent } from './components/pages/authority/authority-home-page/authority-home-page.component';
import { AuthoritySettingsPageComponent } from './components/pages/authority/authority-settings-page/authority-settings-page.component';
import { NavbarComponent } from './components/fragments/navbar/navbar.component';
import { FooterComponent } from './components/fragments/footer/footer.component';
import { AuthorityNavbarComponent } from './components/fragments/authority/authority-navbar/authority-navbar.component';
import { AuthorityFooterComponent } from './components/fragments/authority/authority-footer/authority-footer.component';
import { UserNavbarComponent } from './components/fragments/user/user-navbar/user-navbar.component';
import { UserFooterComponent } from './components/fragments/user/user-footer/user-footer.component';
import { TermsAgreementsPageComponent } from './components/pages/terms-agreements-page/terms-agreements-page.component';
import { PrivacyPolicyPageComponent } from './components/pages/privacy-policy-page/privacy-policy-page.component';
import { EnvironmentProvider } from '../environments/environment.provider';




@NgModule({
  declarations: [
    AppComponent,
    WelcomePageComponent,
    AboutPageComponent,
    FaqPageComponent,
    ContactPageComponent,
    UserSignupPageComponent,
    UserLoginPageComponent,
    UserBasePageComponent,
    UserHomePageComponent,
    UserSettingsPageComponent,
    AuthoritySignupPageComponent,
    AuthorityLoginPageComponent,
    AuthorityBasePageComponent,
    AuthorityHomePageComponent,
    AuthoritySettingsPageComponent,
    NavbarComponent,
    FooterComponent,
    AuthorityNavbarComponent,
    AuthorityFooterComponent,
    UserNavbarComponent,
    UserFooterComponent,
    TermsAgreementsPageComponent,
    PrivacyPolicyPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [
    EnvironmentProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
