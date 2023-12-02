import { EncryptedPassword, RawPassword } from "../model/account/password";

export default interface PasswordEncrypter {
    encrypt(rawPassword: RawPassword): EncryptedPassword
}
