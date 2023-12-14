import { EncryptedPassword, PasswordRetriever } from '../../../../remembering'
import BcryptedPassword from './bcrypted-password'

export default class BcryptedPasswordRetriever implements PasswordRetriever {
    isEncryptedPassword(possiblyEncryptedPassword: string): boolean {
        return BcryptedPassword.isValid(possiblyEncryptedPassword)
    }

    retrieve(password: string): EncryptedPassword {
        return BcryptedPassword.of(password)
    }
}
