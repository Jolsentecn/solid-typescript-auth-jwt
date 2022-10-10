import express, { Request, Response } from "express";
import { BadRequestError } from "../helpers/api-errors";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createUserController } from "../useCases/CreateUser";
import { getUserController } from "../useCases/GetUser";

export const userRouter = express.Router();

userRouter.post('/', async (request, response) => {
    return createUserController.handle(request, response); 
});

userRouter.get('/', authMiddleware('admin') ,async (request, response) => {
    return getUserController.handle(request, response); 
});
