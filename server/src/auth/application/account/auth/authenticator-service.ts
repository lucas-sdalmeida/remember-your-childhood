import Credentials from "../shared/credentials";

export default interface AuthenticatorService {
    authenticate(credentials: Credentials): void
}
