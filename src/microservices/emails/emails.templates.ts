import { compile } from 'handlebars';
import { resolve } from 'path';

export class HandlebarsEmailTemplates {

  public static readonly USERS = {
    welcome: compile(resolve(__dirname, 'static', 'html', 'users', 'welcome.html')),
    goodbye: compile(resolve(__dirname, 'static', 'html', 'users', 'goodbye.html')),
  };

  public static readonly AUTHORITIES = {
    welcome: compile(resolve(__dirname, 'static', 'html', 'authorities', 'welcome.html')),
    goodbye: compile(resolve(__dirname, 'static', 'html', 'authorities', 'goodbye.html')),
  };

}

export class HandlebarsEmailSubjects {

  public static readonly USERS = {
    welcome: `Welcome to CredBase!`,
    goodbye: `It was nice having you here at CredBase!`,
  };

  public static readonly AUTHORITIES = {
    welcome: `Welcome to CredBase!`,
    goodbye: `It was nice having you here at CredBase!`,
  };

}