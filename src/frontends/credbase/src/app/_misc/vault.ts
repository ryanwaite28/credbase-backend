import { Validators } from "@angular/forms";

export const genderOptions = [
  { label: 'Male', value: 1 },
  { label: 'Female', value: 2 },
  { label: 'Other', value: 0 },
];


export const ratingOptions = Array(5).fill(0).map((k, i) => i + 1);

export const COMMON_TEXT_FORM_LIMIT = 250;


export const JWT_USER_TOKEN_NAME: string = `rmw-credbase_user-jwt`;
export const JWT_AUTHORITY_TOKEN_NAME: string = `rmw-credbase-authority-jwt`;

export const GENERIC_TEXT_FORM_LIMIT = 250;
export const GENERIC_TEXT_VALIDATORS = [Validators.required, Validators.maxLength(GENERIC_TEXT_FORM_LIMIT)];