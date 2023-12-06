import { RequestModel } from "../../user/create";
import Credentials from "../shared/credentials";

export default interface SignUpService {
    signup(model: RequestModel): Promise<Credentials>
}
