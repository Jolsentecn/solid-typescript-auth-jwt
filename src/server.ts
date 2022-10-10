import 'express-async-errors';
import 'dotenv/config';
import { AppDataSource  } from './data-source';
import { errorMiddleware } from './middlewares/error';
import { testRouter } from './routes/test.routes';
import { app } from './app';
import { userRouter } from './routes/user.routes';
import { authRouter } from './routes/auth.routes';

AppDataSource.initialize().then(() => {

	app.use("/", testRouter);

	app.use("/user", userRouter);

	app.use("/login", authRouter);

    console.log("API is running.");

    app.use(errorMiddleware);
    
	return app.listen(process.env.PORT)
});  