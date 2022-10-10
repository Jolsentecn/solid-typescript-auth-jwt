import { NotFoundError } from "../../helpers/api-errors";
import { IUserRepository } from "../../repositories/IUserRepository";
import { GetUserRequestDTO, GetUserResponseDTO } from "./GetUserDTO";
import jwt from 'jsonwebtoken';


export class GetUserUseCase {
    constructor(
        private userRepository: IUserRepository
    ) {}
    
    async execute(data: GetUserRequestDTO): Promise<GetUserResponseDTO> {

        const token = data.authorization.split(' ')[1];

        const { id, permissions } = jwt.verify(token, process.env.JWT_PASS ?? '') as JwtPayload; 

        const user = await this.userRepository.listById(id);

        if(!user){
            throw new NotFoundError('Não foi encontrado nenhum usuario.');
        }

        const {password: _, ...userInfo} = user;
        return userInfo;
    }
}
