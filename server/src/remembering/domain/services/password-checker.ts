import { EncryptedPassword, RawPassword } from '../model/user/password'

export default interface PasswordChecker {
    compare(rawPassword: RawPassword, password: EncryptedPassword): Promise<boolean>
}
