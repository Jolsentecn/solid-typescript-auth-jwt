import { User } from "../entities/User";

export interface IUserRepository {
    create(user: User): Promise<User>
    update(user: User): Promise<User>
    delete(id: string): Promise<void>
    list(): Promise<User[]>
    listById(id: string): Promise<User>
    findByEmail(email: string): Promise<User>
}