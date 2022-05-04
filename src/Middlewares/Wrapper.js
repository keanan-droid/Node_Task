import { APIError } from "./Error";

export const ApiErrorWrapper = (error, request, response, next)=> {
    if(error instanceof APIError){
        return response.status(error.status).json({error: error.message})
    }

    return response.status(500).json({error:error, message: "Unknown error occured"})
    
};