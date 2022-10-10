# Modelo de REST SOLID API para autenticação JWT com TypeScript e PostgreSQL 
Seguem referencias para criação do modelo:
- Login | Autenticação JWT com Node.js e TypeScript (https://www.youtube.com/watch?v=r4gjCn2r-iw)
- API REST com Node.js e TypeScript | TypeORM [Atualizado] (https://www.youtube.com/watch?v=j8cm2C5-xn8)
- TypeORM Doc (https://typeorm.io)
- Tratamento de erros no Express.js com TypeScript (https://www.youtube.com/watch?v=SnxAq9ktyuo)

## Iniciando o projeto

1. Para iniciar seu ambiente use os seguintes comandos:

``yarn init -y `` (Para iniciar o projeto com a package.json)

``yarn add -D nodemon ts-node @types/express @types/node typescript``  (Para instalar todas as dependencias de desenvolvimento)

``yarn add express pg typeorm dotenv reflect-metadata`` (Para instalas as dependencias de produção)

``yarn add express-async-errors`` (Para inserir o sistema de middleware de erros do express)

``npx tsc --init`` (Para iniciar o typescript no projeto)

``yarn add bcrypt`` (Para adicionar a biblioteca de hash de senhas)

``yarn add @types/bcrypt -D`` (Para adicionar a tipagem da biblioteca de hash de senhas)

``yarn add jsonwebtoken`` (Para adicionar a biblioteca que autentica os usuarios)

``yarn add @types/jsonwebtoken -D`` (Para adicionar a tipagem da biblioteca jsonwebtoken)

2. Para rodar seu projeto e builda-lo no futuro crie os seguintes scripts nas sua ``package.json``:
```
	"scripts": {
		"dev": "nodemon --exec ts-node ./src/index.ts",
		"migration:generate": "typeorm-ts-node-commonjs -d ./src/data-source.ts migration:generate ./src/migrations/default",
		"migration:run": "typeorm-ts-node-commonjs -d ./src/data-source.ts migration:run",
		"build": "rm -rf ./dist && tsc",
		"start": "node ./dist/index.js"
	},
```

3. Monte seu arquivo ``tsconfig.json``:
```
{
	"compilerOptions": {
		"target": "es2018",
		"lib": ["es5", "es6", "ES2018"],
		"experimentalDecorators": true,
		"emitDecoratorMetadata": true,
		"module": "commonjs",
		"moduleResolution": "node",
		"resolveJsonModule": true,
		"allowJs": true,
		"outDir": "./dist",
		"esModuleInterop": true,
		"forceConsistentCasingInFileNames": true,
		"strict": true,
		"noImplicitAny": true,
		"strictPropertyInitialization": false
	},
	"include": ["src/**/*"],
	"exclude": ["node_modules", "dist"],
	"ts-node": {
		"files": true
	}
}
```

4. Configure o TyopeORM conforme a documentação do projeto, para isso crie um arquivo chamado ``data-source.ts`` com o seguinte codigo:
```
import { DataSource } from "typeorm";
import 'dotenv/config';

const port = process.env.DB_PORT as number | undefined

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: process.env.DB_HOST,
	port: port,
	username: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	entities: [`${__dirname}/**/entities/*.{ts,js}`],
	migrations: [`${__dirname}/**/migrations/*.{ts,js}`],
})
```

5. Agora você deve configurar seu arquivo ``.env``, segue um modelo abaixo:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=root
DB_NAME=api_rest_typescript

JWT_PASS=ea1ff93e653e24e04063b527537c373f
JWT_TTL=8h

PORT=3000

```

6. Aqui você deve criar uma sequencia de pastas para seu projeto, segue modelo:
```
- entities/
- providers/
- repositories/
- middlewares/
- types/
- migrations
- helpers/
- services/
- useCases/
- routes/

```

7. Dentro da pasta routes, crie um arquivo chamado ``test.routes.ts`` com o seguinte código:
```
import express, { Request, Response } from "express";

export const testRouter = express.Router();

testRouter.get('/', async (request, response) => {
    response.send('The service is working.');
});

```

8. O proximo passo é criar o seu sistema de gerenciamento de erros, para isso comece criando dentro da pasta ``helpers`` um arquivo chamado ``api-errors.ts``, siga o modelo abaixo ao cria-lo:
```
export class ApiError extends Error {
	public readonly statusCode: number

	constructor(message: string, statusCode: number) {
		super(message)
		this.statusCode = statusCode
	}
}

export class BadRequestError extends ApiError {
	constructor(message: string) {
		super(message, 400)
	}
}

export class NotFoundError extends ApiError {
	constructor(message: string) {
		super(message, 404)
	}
}

export class UnauthorizedError extends ApiError {
	constructor(message: string) {
		super(message, 401)
	}
}
```

9. Agora você deve criar seus middlewares para gerenciamento de erros no projeto, dentro da pasta ``middlewares`` crie o arquivo ``error.ts``, segue o exemplo:
```
import { NextFunction, Request, Response } from 'express'
import { ApiError } from '../helpers/api-errors'

export const errorMiddleware = (
	error: Error & Partial<ApiError>,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const statusCode = error.statusCode ?? 500
	const message = error.statusCode ? error.message : 'Internal Server Error'
	return res.status(statusCode).json({ message })
}

```
10. Agora configure seu ``app.ts`` da seguinte forma:

```
import express from 'express';

const app = express();

app.use(express.json());

export { app }

```

11. Para adicionar isso ao projeto, dentro do seu arquivo ``server.ts`` você deve adicionar o middleware de erro do seu projeto sempre antes do return, segue o modelo abaixo que pode ser utilizado como base:
```
import 'express-async-errors'
import express, { NextFunction, Request, Response } from 'express';
import { AppDataSource  } from './services/data-source';
import { errorMiddleware } from './middlewares/error';
import { testRouter } from './routes/test.routes';
import { app } from './app';

AppDataSource.initialize().then(() => {
	app.use(testRouter);

    console.log("API is running.");

    app.use(errorMiddleware);
    
	return app.listen(process.env.PORT)
});  

```

12. Na pasta entities, você deve criar sua entidade ``User.ts``, sempre comece pelas entidades, já que vamos utilizar migrations para gerar os modelos do banco, segue o modelo abaixo:
```
import { randomUUID } from "crypto";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column({ type: 'text' })
	name: string

	@Column({ type: 'text', unique: true })
	email: string

	@Column({ type: 'text' })
	permissions: string

	@Column({ type: 'text' })
	password: string

    constructor(props: Omit<User, 'id'>){
        Object.assign(this, props);
    }
}
```

13. Agora você deve executar os seguintes scripts para gerar as ``migrations`` e criar as entidades no banco:

``npm run migration:generate`` (Gera o um arquivo com as funções que irão criar sua entidade no banco)

``npm run migration:run`` (Executa o método run da migration criada anteriormente)

14. Dentro da pasta ``repositories/`` você deve criar o arquivo ``IUserRepository.ts``, segue o modelo abaixo:
```
import { User } from "../entities/User";

export interface IUserRepository {
    create(user: User): Promise<User>
    listById(id: string): Promise<User>
    findByEmail(email: string): Promise<User>
}
```

15. Dentro da pasta ``repositories/implementations/`` crie o arquivo de implementação da sua interface `PostgreUserRepository.ts`:
```
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
```

15. Dentro da pasta ``useCases`` você deve criar as pastas com as funções da sua aplicação, nesse caso vamos criar as pastas:

- CreateUser/
- AuthUser/
- GetUser/

16. Dentro de cada uma das suas useCases você deve criar os arquivos base para executar os métodos, seguem modelos:

CreateUserController.ts
```
import { Request, Response } from "express";
import { CreateUserUseCase } from "./CreateUserUseCase";

export class GetByUserIdStatusController {
    constructor(
        private createUserUseCase: CreateUserUseCase,
    ){}
    async handle(request: Request, response: Response): Promise<Response> {
        const { name, email, password } = request.body;

        const user = await this.createUserUseCase.execute({
            name,
            email,
            password
        }); 

        return response.status(200).send(user);
    }
}
```

CreateUserUseCase.ts
```
import { IUserRepository } from "../../repositories/IUserRepository";
import { CreateUserRequestDTO, CreateUserResponseDTO } from "./CreateUserDTO";


export class CreateUserUseCase {
    constructor(
        private userRepository: IUserRepository
    ) {}
    
    async execute(data: CreateUserRequestDTO): Promise<CreateUserResponseDTO> {
        return data;
    }
}

```

CreateUserDTO.ts
```
export interface CreateUserRequestDTO {
    id: string,
    name: string,
    email: string,
    password: string
}

export interface CreateUserResponseDTO {
    id: string,
    name: string,
    email: string
}
```

CreateUser/index.ts
```
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

```

17. Agora você deve criar o modelo para autenticação:

AuthUserController.ts
```
import { Request, Response } from "express";
import { AuthUserUseCase } from "./AuthUserUseCase";

export class AuthUserController {
    constructor(
        private authUserUseCase: AuthUserUseCase,
    ){}
    async handle(request: Request, response: Response): Promise<Response> {
        const { email, password } = request.body;

        const user = await this.authUserUseCase.execute({
            email,
            password
        }); 

        return response.status(200).send(user);
    }
}
```

AuthUserDTO.ts
```
export interface AuthUserRequestDTO {
    email: string,
    password: string
}

export interface AuthUserResponseDTO {
    token: string
}
```

AuthUserUseCase.ts
```
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

        const token = jwt.sign({ id: user.id, permissions: user.permissions }, process.env.JWT_PASS ?? '', { 
            expiresIn: '8h'
        });

        return { token: token };
    }
}

```

AuthUser/index.ts
```
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
```

18. Agora você deve criar seu useCase ``GetUser`` para retornar os dados do usuário atráves do token de autenticação JWT, seguem modelos:


GetUserDTO.ts
```
export interface GetUserRequestDTO {
    token: string
}

export interface GetUserResponseDTO {
    id: string,
    name: string,
    email: string,
    permissions: string
}
```

GetUserUseCase.ts
```
import { NotFoundError } from "../../helpers/api-errors";
import { IUserRepository } from "../../repositories/IUserRepository";
import { GetUserRequestDTO, GetUserResponseDTO, JwtPayload } from "./GetUserDTO";
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


```

GetUserController.ts
```
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
            throw new UnauthorizedError('Não autorizado');
        }

        const user = await this.GetUserUseCase.execute({
            authorization
        }); 

        return response.status(200).send(user);
    }
}
```

GetUser/index.ts
```
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
```

19. Crie tambem seus arquivos do tipo type dentro da pasta ``types/``, vamos criar aqui o ``JwtPayload.ts``, segue modelo:
```
type JwtPayload = {
	id: string,
    permissions: string
}
```

20. Por fim você deve criar seu middleware para validação de token's, para isso crie o arquivo ``authMiddleware.ts`` na pasta ``middlewares/``, segue o exemplo abaixo:
```
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
```