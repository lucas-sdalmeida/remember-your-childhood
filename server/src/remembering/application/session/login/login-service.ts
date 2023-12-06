import Credentials from "../shared/credentials"

export default interface LoginService {
    login(model: RequestModel): Promise<Credentials>
}

export type RequestModel = {
    username?: string,
    email?: string,
    password: string,
}
