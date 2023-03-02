import express, { Application, Request, Response } from 'express';
import productsRoutes from './handlers/products';
import ordersRoutes from './handlers/orders';
import usersRoutes from './handlers/users';
import bodyParser from 'body-parser';
import path from 'path';

const app: Application = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('dist'));

let port = 3000;
if (process.env.NODE_ENV === 'test') {
    port = 3001;
}

app.get('/', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'index.html')) as any;
});

productsRoutes(app);
ordersRoutes(app);
usersRoutes(app);

const server = app.listen(
    port,
    () => {
        console.log(`Server Running at localhost: ${port}.`);
    }
);

if (process.env.NODE_ENV === 'test') {
    server.close();
}

export default app