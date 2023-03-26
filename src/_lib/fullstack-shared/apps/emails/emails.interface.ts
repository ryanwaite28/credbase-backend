export interface ISendEmail {
  to_email: string,
  subject: string,
  text?: string,
  html?: string,
}

export interface IResetUserEmailsMessage {
  user_email: string,
  reset_password_url: string,
}

export interface IResetAuthorityEmailsMessage {
  authority_email: string,
  reset_password_url: string,
}