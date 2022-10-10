import { PostgreUserRepository } from "../../repositories/implementations/PostgreUserRepository";
import { GetUserController } from "./GetUserController";
import { GetUserUseCase } from "./GetUserUseCase";

const postgreUserRepository = new PostgreUserRepository();

const getUserUseCase = new GetUserUseCase(
    postgreUserRepository
);

const getUserController = new GetUserController(
    getUserUseCase
);

export { getUserUseCase, getUserController  }