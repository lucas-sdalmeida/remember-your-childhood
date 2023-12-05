import { EncryptedPassword } from "../model/user/password";

export default interface PasswordRetriver {
    isEncryptedPassword(possiblyEncryptedPassword: string): EncryptedPassword

    retrieve(password: string): EncryptedPassword
}
