import { Application, Request, Response } from 'express';
import { verifyToken } from './helpers';
import { ProductOrder, Order, OrderDB, OrderStore } from '../models/order';

const OrderStoreInstance = new OrderStore();

const index = async (req: Request, res: Response) => {
  try {
    const orders = await OrderStoreInstance.getOrders();
    res.json(orders);
  } catch (err: unknown) {
    console.error((err as Error).message);
    res.status(400).json({ error: (err as Error).message });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const { products, status, user_id } = req.body as Order;
    if (!products || !status || !user_id) {
      return res.status(400).send('Some required parameters are missing! eg. :products, :status, :user_id');
    }
    const order = await OrderStoreInstance.createOrder({ products, status, user_id });
    res.json(order);
  } catch (err: unknown) {
    console.error((err as Error).message);
    res.status(400).json({ error: (err as Error).message });
  }
};

const read = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (!id) {
      return res.status(400).send('Missing required parameter :id.');
    }
    const order = await OrderStoreInstance.readOrder(id);
    res.json(order);
  } catch (err: unknown) {
    console.error((err as Error).message);
    res.status(400).json({ error: (err as Error).message });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { products, status, user_id } = req.body as Order;
    if (!products || !status || !user_id) {
      return res.status(400).send('Some required parameters are missing! eg. :products, :status, :user_id');
    }
    const order = await OrderStoreInstance.updateOrder(id, { products, status, user_id });
    res.json(order);
  } catch (err: unknown) {
    console.error((err as Error).message);
    res.status(400).json({ error: (err as Error).message });
  }
};

const deleteOrder = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (!id) {
      return res.status(400).send('Missing required parameter :id.');
    }
    await OrderStoreInstance.deleteOrder(id);
    res.send(`Order with id ${id} successfully deleted.`);
  } catch (err: unknown) {
    console.error((err as Error).message);
    res.status(400).json({ error: (err as Error).message });
  }
};

export default function orderRoutes(app: Application) {
  app.get('/orders', index);
  app.post('/orders/create', verifyToken, create);
  app.get('/orders/:id', verifyToken, read);
  app.put('/orders/:id', verifyToken, update);
  app.delete('/orders/:id', verifyToken, deleteOrder);
}