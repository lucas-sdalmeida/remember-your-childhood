import { EncryptedPassword } from "../model/user/password";

export default interface PasswordRetriever {
    isEncryptedPassword(possiblyEncryptedPassword: string): Promise<boolean>

    retrieve(password: string): Promise<EncryptedPassword>
}
