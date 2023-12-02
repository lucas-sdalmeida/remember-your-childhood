import { EncryptedPassword, RawPassword } from "../model/account/password";

export default interface PasswordChecker {
    compare(rawPassword: RawPassword, password: EncryptedPassword): boolean
}
