import express from 'express'
import cors from 'cors'
import queryRoutes from './routes/query.routes.js';

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


app.use(express.json())
app.use('/', queryRoutes);
export default app