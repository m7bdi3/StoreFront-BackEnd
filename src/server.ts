import bodyParser from 'body-parser';
import path from 'path';
import express, { Application, Request, Response } from 'express';

import userRoutes from './handlers/users';
import productRoutes from './handlers/products';
import orderRoutes from './handlers/orders';
const app: Application = express();

let port = 3000;
if (process.env.ENV === 'test') {
    port = 4000
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../index.html'))
});

app.listen(port, () => {
    console.log(`Server is running on localhost:${port}`)
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});
userRoutes(app);
productRoutes(app);
orderRoutes(app);



export default app;
