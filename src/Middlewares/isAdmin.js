import { verify } from "jsonwebtoken"

export const IsAdmin = (request, response, next) => {
    const token = request.headers["x-auth-token"];

    if (!token) {
        console.log(request.headers);
        return response.status(401).json({ msg: "Login or signup to continue" });
    }

    verify(token, "privateKey", (error, decodedToken)=> {
        if (error) {
            return response.status(401).json({ msg: "Unauthorised" })
        }
        request.token = decodedToken;
        next();
    });
}

