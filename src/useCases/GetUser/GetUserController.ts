import { Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "../../helpers/api-errors";
import { GetUserUseCase } from "./GetUserUseCase";

export class GetUserController {
    constructor(
        private GetUserUseCase: GetUserUseCase,
    ){}
    async handle(request: Request, response: Response): Promise<Response> {
        const { authorization } = request.headers;

        if(!authorization){
            throw new UnauthorizedError('Não autorizado...');
        }

        const user = await this.GetUserUseCase.execute({
            authorization
        }); 

        return response.status(200).send(user);
    }
}