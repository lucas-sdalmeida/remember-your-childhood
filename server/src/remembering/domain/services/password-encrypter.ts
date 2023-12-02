import { EncryptedPassword, RawPassword } from "../model/user/password";

export default interface PasswordEncrypter {
    encrypt(rawPassword: RawPassword): EncryptedPassword
}
