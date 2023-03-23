import { AppEnvironment } from "../environment/app.enviornment";
import { AuthorizeJwtGuard } from "../utils/authorize-request.utils";



export const UserAuthorized = AuthorizeJwtGuard(AppEnvironment.JWT_SECRETS.USER.SECRET, 'user');
export const AuthorityAuthorized = AuthorizeJwtGuard(AppEnvironment.JWT_SECRETS.AUTHORITY.SECRET, 'authority');