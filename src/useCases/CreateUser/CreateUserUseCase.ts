import { BadRequestError } from "../../helpers/api-errors";
import { IUserRepository } from "../../repositories/IUserRepository";
import { CreateUserRequestDTO, CreateUserResponseDTO } from "./CreateUserDTO";
import bcrypt from 'bcrypt'
import { User } from "../../entities/User";


export class CreateUserUseCase {
    constructor(
        private userRepository: IUserRepository
    ) {}
    
    async execute(data: CreateUserRequestDTO): Promise<CreateUserResponseDTO> {

        const userExists = await this.userRepository.findByEmail(data.email);

        if(userExists){
            throw new BadRequestError('E-mail já existe');
        }

        const hashPassword = await bcrypt.hash(data.password, 10);
        
        const email = data.email;
        const name = data.name;
        const password = data.password;
        const permissions = data.permissions;

        const newUser = new User({
            email,
            name,
            password: hashPassword,
            permissions
        });

        const createdUser =  await this.userRepository.create(newUser); 

        const {password: _, ...user} = createdUser;

        return user;
    }
}
