import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';

import orderRoutes from './handlers/orders';
import productRoutes from './handlers/products';
import userRoutes from './handlers/users';

const app = express();

// configure body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure morgan
app.use(morgan('dev'));

// configure cors
app.use(cors());

// configure routes
orderRoutes(app);
productRoutes(app);
userRoutes(app);

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

// start the server
const PORT = 30001;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

export default app;
