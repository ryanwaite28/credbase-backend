import { AppEnvironment } from "../environment/app.enviornment";
import { AuthorizeJwtGuard, CreateJwtAuthGuard } from "../utils/authorize-request.utils";




export const UserAuthorizedGuard = CreateJwtAuthGuard(AuthorizeJwtGuard(AppEnvironment.JWT_SECRETS.USER.SECRET, 'user'));

export const AuthorityAuthorizedGuard = CreateJwtAuthGuard(AuthorizeJwtGuard(AppEnvironment.JWT_SECRETS.AUTHORITY.SECRET, 'authority'));