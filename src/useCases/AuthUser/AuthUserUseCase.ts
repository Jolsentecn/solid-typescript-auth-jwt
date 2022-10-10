import { IUserRepository } from "../../repositories/IUserRepository";
import { AuthUserRequestDTO, AuthUserResponseDTO } from "./AuthUserDTO";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { BadRequestError, NotFoundError } from "../../helpers/api-errors";
import 'dotenv/config';



export class AuthUserUseCase {
    constructor(
        private userRepository: IUserRepository
    ) {}
    
    async execute(data: AuthUserRequestDTO): Promise<AuthUserResponseDTO> {

        const user = await this.userRepository.findByEmail(data.email);

        if(!user){
            throw new BadRequestError('E-mail ou senha invalidos');
        }
     
        const verifyPass = await bcrypt.compare(data.password, user.password);

        if(!verifyPass){
            throw new BadRequestError('E-mail ou senha invalidos');
        }

        const payload = {
            email: user.email,
            name: user.name,
            scope: user.permissions,
          };
        const options = {
            expiresIn: process.env.JWT_TTL,
          };

        const token = jwt.sign(payload, process.env.JWT_PASS ?? '', options);

        return { token: token };
    }
}
