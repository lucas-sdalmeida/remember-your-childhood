import { join } from 'path'
import { promises as fs } from 'fs'

import keysConfigs from '../../../../configs/keys-configs.json'
import { Request } from 'express'
import EncryptedToken from './encrypted-token'
import TokenEncrypter from './token-encrypter'
import { Credentials } from '../../../../remembering'
import UUIDV4 from '../../uuid-impl'

export const getPrivateKey = async () => {
    const srcFolder = getSrcFolder()
    return fs.readFile(join(srcFolder, keysConfigs.directoryFromSrc, keysConfigs.privateKeyFileName), 'utf-8')
}

const getSrcFolder = () => {
    return join(__dirname, '../../../../')
}

export const getPublicKey = async () => {
    const srcFolder = getSrcFolder()
    return fs.readFile(join(srcFolder, keysConfigs.directoryFromSrc, keysConfigs.publicKeyFileName), 'utf-8')
}

export const getCredentials = async (request: Request, tokenEncrypter: TokenEncrypter): Promise<Credentials | undefined> => {
    const token = request.headers['x-access-token']
    if (!token) return
    
    const decryptedToken = await tokenEncrypter.decrypt(token as EncryptedToken)
    return {
        userId: UUIDV4.ofString(decryptedToken.sub),
        loginDateTime: new Date(decryptedToken.iat * 1000),
        expirationDateTime: new Date(decryptedToken.exp * 1000),
        logoutDateTime: decryptedToken.logout ? new Date(decryptedToken.logout * 1000) : undefined,
    }
}
