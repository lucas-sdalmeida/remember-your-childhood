import EncryptedToken from "../encrypted-token";
import Token from "../token";
import TokenEncrypter from "../token-encrypter";
import { JwtPayload, VerifyErrors, sign, verify } from "jsonwebtoken";
import { getPrivateKey, getPublicKey } from "../utils";

export default class JwtEncrypter implements TokenEncrypter {
    async encrypt(token: Token): Promise<EncryptedToken> {
        return new Promise(async (resolve) => {
            const privateKey = await getPrivateKey()
            this.signToken(token, privateKey, resolve)
        })
    }
    
    private signToken(token: Token, privateKey: string, resolve: (value: string | PromiseLike<string>) => void) {
        sign(token, privateKey, { algorithm: 'RS256' }, (error: Error | null, token?: string) => {
            if (error) throw error
            if (!token) throw new Error('Could not encrypt the token!')
            resolve(token as EncryptedToken)
        })
    }

    async decrypt(token: EncryptedToken): Promise<Token> {
        return new Promise(async (resolve) => {
            const publicKey = await getPublicKey()
            this.verifyToken(token, publicKey, resolve)
        })
    }

    private verifyToken(token: EncryptedToken, publicKey: string, resolve: (value: Token | PromiseLike<Token>) => void) {
        verify(token, publicKey, { algorithms: [ 'RS256' ] }, (error: VerifyErrors | null, decoded?: string | JwtPayload) => {
            if (error) throw error
            if (!decoded) throw new Error(`Could not decrypt the token!`)
            
            const decodedToken = typeof decoded == 'string' ? JSON.parse(decoded) : decoded
            if (!(decodedToken instanceof Token)) throw new Error(`Invalid token ${token}`)

            resolve(new Token(
                decodedToken.sub,
                decodedToken.iat,
                decodedToken.exp,
            ))
        })
    }
}
