import 'dotenv/config';
import { authMiddleware } from "../middlewares/authMiddleware";
import express from "express";

export const testRouter = express.Router();


testRouter.get('/', authMiddleware('admin'), async (request, response) => {
    response.send('The service is working.');
});
