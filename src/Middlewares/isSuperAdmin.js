export const IsSuperAdmin = (request, response, next) => {
    const {role} = request.body;

    if (role === "admin") {
        return response.status(401).json({ msg: "superAdmin required to continue" });
    }

    if (role === "superAdmin") {
        next()
    }
}