import { PostgreUserRepository } from "../../repositories/implementations/PostgreUserRepository";
import { AuthUserController } from "./AuthUserController";
import { AuthUserUseCase } from "./AuthUserUseCase";

const postgreUserRepository = new PostgreUserRepository();

const authUserUseCase = new AuthUserUseCase(
    postgreUserRepository
);

const authUserController = new AuthUserController(
    authUserUseCase
);

export { authUserUseCase, authUserController  }