import { AppEnvironment } from "../environment/app.enviornment";
import { AuthorizeJwtGuard, CreateJwtAuthGuard } from "../utils/authorize-request.utils";



export const UserAuthorizer = AuthorizeJwtGuard(AppEnvironment.JWT_SECRETS.USER.SECRET, 'user');
export const UserAuthorizedGuard = CreateJwtAuthGuard(UserAuthorizer);

export const AuthorityAuthorizer = AuthorizeJwtGuard(AppEnvironment.JWT_SECRETS.AUTHORITY.SECRET, 'authority');
export const AuthorityAuthorizedGuard = CreateJwtAuthGuard(AuthorityAuthorizer);