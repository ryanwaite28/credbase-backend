import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ISendEmail } from "./emails.interface";



export class SendEmailDto implements ISendEmail {
  @IsNotEmpty()
  @IsEmail()
  to_email: string;
  
  @IsNotEmpty()
  @IsString()
  subject: string;
  
  @IsOptional()
  @IsString()
  text?: string;
  
  @IsOptional()
  @IsString()
  html?: string;
}