import { AppDataSource } from "../../data-source";
import { User } from "../../entities/User";
import { IUserRepository } from "../IUserRepository";

const userRepository = AppDataSource.getRepository(User);

export class PostgreUserRepository implements IUserRepository{
    async findByEmail(email: string): Promise<User> {
        return await userRepository.findOneBy({ email }) as unknown as User;
    }
    async create(user: User): Promise<User> {
        const newUser = await userRepository.create(user);
        await userRepository.save(newUser);
        return newUser;
    }
    async listById(id: string): Promise<User> {
        return await userRepository.findOneBy({id}) as unknown as User;
    }

}