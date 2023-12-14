import EncryptedToken from './encrypted-token'
import Token from './token'

export default interface TokenEncrypter {
    encrypt(token: Token): Promise<EncryptedToken>

    decrypt(token: EncryptedToken): Promise<Token>
}
