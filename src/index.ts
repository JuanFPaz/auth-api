import express, { Application} from "express";
import authRoutes from './routes/auth.routes';
const app: Application = express();
const port = 3000;

app.use(express.urlencoded())
app.use(express.json());
app.use('/api/auth', authRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});