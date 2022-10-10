import { NextFunction, Request, Response } from 'express'
import { UnauthorizedError } from '../helpers/api-errors'
import { IUserRepository } from '../repositories/IUserRepository';
import jwt from 'jsonwebtoken'
import { PostgreUserRepository } from '../repositories/implementations/PostgreUserRepository';


export const authMiddleware = (permissions: string) => { return async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const { authorization } = req.headers

        if (!authorization) {
            throw new UnauthorizedError('Não autorizado');
        }

        const token = authorization.split(' ')[1];

        const { id } = jwt.verify(token, process.env.JWT_PASS ?? '') as JwtPayload; 

        const postgreUserRepository = new PostgreUserRepository();

        const user = await postgreUserRepository.listById(id);

        if (!user) {
            throw new UnauthorizedError('Não autorizado');
        }

        if(permissions != user.permissions){
            throw new UnauthorizedError('Não autorizado');
        }

        next()
    }
}