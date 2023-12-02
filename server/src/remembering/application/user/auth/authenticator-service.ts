import Credentials from "../../../../remembering/application/user/shared/credentials";

export default interface AuthenticatorService {
    authenticate(credentials: Credentials): void
}
