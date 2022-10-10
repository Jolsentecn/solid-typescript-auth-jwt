import { PostgreUserRepository } from "../../repositories/implementations/PostgreUserRepository";
import { CreateUserController } from "./CreateUserController";
import { CreateUserUseCase } from "./CreateUserUseCase";

const postgreUserRepository = new PostgreUserRepository();

const createUserUseCase = new CreateUserUseCase(
    postgreUserRepository
);

const createUserController = new CreateUserController(
    createUserUseCase
);

export { createUserUseCase, createUserController  }