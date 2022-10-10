import { Request, Response } from "express";
import { CreateUserUseCase } from "./CreateUserUseCase";

export class CreateUserController {
    constructor(
        private createUserUseCase: CreateUserUseCase,
    ){}
    async handle(request: Request, response: Response): Promise<Response> {
        const { name, email, password, permissions } = request.body;


        const user = await this.createUserUseCase.execute({
            name,
            email,
            password,
            permissions
        }); 

        return response.status(200).send();
    }
}