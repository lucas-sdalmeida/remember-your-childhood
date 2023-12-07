import { join } from "path"
import { promises as fs } from "fs"

import keysConfigs from "../../../../configs/keys-configs.json"

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
