import express, { Request, Response } from "express";
import { BadRequestError } from "../helpers/api-errors";
import { authUserController } from "../useCases/AuthUser";

export const authRouter = express.Router();

authRouter.post('/', async (request, response) => {
    return authUserController.handle(request, response); 
});
