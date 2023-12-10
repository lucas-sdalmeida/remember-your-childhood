import { EncryptedPassword } from '../model/user/password'

export default interface PasswordRetriever {
    isEncryptedPassword(possiblyEncryptedPassword: string): boolean

    retrieve(password: string): EncryptedPassword
}
