import express, { Application, Request, Response } from "express";
import path from 'node:path'

const app: Application = express();
const port = 3000;

app.use(express.urlencoded())
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.json('Hola!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});