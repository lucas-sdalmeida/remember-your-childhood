import bcrypt from 'bcrypt'
import { EncryptedPassword, PasswordChecker } from '../../../../remembering'
import { RawPassword } from '../../../../remembering/domain/model/user/password'
import BcryptedPassword from './bcrypted-password'

export default class BcryptedPasswordChecker implements PasswordChecker {
    async compare(rawPassword: RawPassword, password: BcryptedPassword): Promise<boolean> {
        return bcrypt.compare(rawPassword.toString(), password.toString())
    }
}
