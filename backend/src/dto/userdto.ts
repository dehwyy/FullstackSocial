import {Request} from "express";
import {inUser} from "../typing/Interfaces";

class UserDto {
    getUserData(req: Request) {
        const {email, username, password}: inUser = req.body
        return {email, username, password}
    }
}

export default new UserDto()