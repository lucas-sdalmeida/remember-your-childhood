import { RequestModel } from "../../user/create";
import Credentials from "../../user/shared/credentials";

export default interface SignUpService {
    signup(model: RequestModel): Credentials
}
