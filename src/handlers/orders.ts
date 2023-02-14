import { Application, Request, Response } from 'express';
import { verifyToken } from './helpers';
import { Order, productOrder, OrderStore } from '../models/order';

// Create an instance of OrderStore
const OrderStoreInstance = new OrderStore();

// Route handler for retrieving all orders
const index = async (req: Request, res: Response) => {
    try {
        // Get the list of all orders
        const orders: Order[] = await OrderStoreInstance.getOrder();

        // Return the list of orders as a response
        res.json(orders);
    } catch (err) {
        // If there was an error, return a 400 status code and the error message
        res.status(400);
        res.json(err);
    }
};

// Route handler for creating an order
const create = async (req: Request, res: Response) => {
    try {
        // Get the products, status, and user_id from the request body
        const products = req.body.products as unknown as productOrder[];
        const status = req.body.status as unknown as boolean;
        const user_id = req.body.user_id as unknown as number;

        // Validate the required parameters
        if (!products || !status || !user_id) {
            // If one of the required parameters is missing, return a 400 status code and an error message
            res.status(400);
            res.send(
                'Some required parameters are missing! eg. :products, :status, :user_id'
            );
            return false;
        }

        // Create the order using the OrderStore instance
        const order: Order = await OrderStoreInstance.create({
            products,
            status,
            user_id,
        });

        // Return the created order as a response
        res.json(order);
    } catch (e) {
        // If there was an error, return a 400 status code and the error message
        res.status(400);
        res.json(e);
    }
};

// Route handler for retrieving a single order by id
const read = async (req: Request, res: Response) => {
    try {
        // Get the id from the request parameters
        const id = req.params.id as unknown as number;

        // Validate the id parameter
        if (!id) {
            // If the id parameter is missing, return a 400 status code and an error message
            res.status(400);
            res.send('Missing required parameter :id.');
            return false;
        }

        // Get the order using the OrderStore instance
        const order: Order = await OrderStoreInstance.read(id);

        // Return the order as a response
        res.json(order);
    } catch (e) {
        // If there was an error, return a 400 status code and the error message
        res.status(400);
        res.json(e);
    }
};

const update = async (req: Request, res: Response) => {
    try {
      // Get the id from the request parameters
      const id = req.params.id as unknown as number;
  
      // Get the updated products, status, and user_id from the request body
      const products = req.body.products as unknown as productOrder[];
      const status = req.body.status as unknown as boolean;
      const user_id = req.body.user_id as unknown as number;
  
      // Check if all required parameters are present
      if (!products || !status || !user_id || !id) {
        res.status(400);
        res.send(
          'Some required parameters are missing! eg. :products, :status, :user_id, :id'
        );
        return false;
      }
  
      // Call the update method on the OrderStore instance
      const order: Order = await OrderStoreInstance.update(id, {
        products,
        status,
        user_id,
      });
  
      // Return the updated order
      res.json(order);
    } catch (e) {
      // Return a 400 status code and the error
      res.status(400);
      res.json(e);
    }
  };
  
  const deleteOrder = async (req: Request, res: Response) => {
    try {
      // Get the id from the request parameters
      const id = req.params.id as unknown as number;
  
      // Check if the id is present
      if (!id) {
        res.status(400);
        res.send('Missing required parameter :id.');
        return false;
      }
  
      // Call the deleteOrder method on the OrderStore instance
      await OrderStoreInstance.deleteOrder(id);
  
      // Return a success message
      res.send(`Order with id ${id} successfully deleted.`);
    } catch (e) {
      // Return a 400 status code and the error
      res.status(400);
      res.json(e);
    }
  };
  
  // Define the order routes
  export default function orderRoutes(app: Application) {
    app.get('/orders', index);
    app.post('/orders/create', verifyToken, create);
    app.get('/orders/:id', verifyToken, read);
    app.put('/orders/:id', verifyToken, update);
    app.delete('/orders/:id', verifyToken, deleteOrder);
  }
  