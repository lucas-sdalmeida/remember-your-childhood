import { EncryptedPassword } from "../model/user/password";

export default interface PasswordRetriever {
    isEncryptedPassword(possiblyEncryptedPassword: string): EncryptedPassword

    retrieve(password: string): EncryptedPassword
}
