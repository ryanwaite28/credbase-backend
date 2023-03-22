import { AuthorizeJwtGuard } from "../utils/authorize-request.utils";



export const UserAuthorized = AuthorizeJwtGuard(process.env['JWT_USER_SECRET']!, 'user');
export const AuthorityAuthorized = AuthorizeJwtGuard(process.env['JWT_AUTHORITY_SECRET']!, 'authority');