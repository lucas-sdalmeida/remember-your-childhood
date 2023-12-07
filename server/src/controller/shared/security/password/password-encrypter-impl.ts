import bcrypt from 'bcrypt'
import { EncryptedPassword, PasswordEncrypter } from "../../../../remembering";
import { RawPassword } from "../../../../remembering/domain/model/user/password";
import BcryptedPassword from "./bcrypted-password";

export default class BcryptedPasswordEncrypter implements PasswordEncrypter {
    async encrypt(rawPassword: RawPassword): Promise<EncryptedPassword> {
        return BcryptedPassword.of(await bcrypt.hash(rawPassword.toString(), 16))
    }
}
