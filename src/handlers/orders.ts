import { Order, OrderProduct, OrderStore } from '../models/order';
import { Application, Request, Response } from 'express';
import { verifyToken } from './helpers';

const OrderStores = new OrderStore();

const index = async (_req: Request, res: Response) => {
  try {
    const orders: Order[] = await OrderStores.getOrder();
    res.json(orders);
  } catch (err) {
    res.status(400);
    res.json(err);
  };
};

const readingTheOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    if (!id) {
      res.status(400).send(`couldn't find order with id : ${id}`)
      return false;
    }
    const order: Order = await OrderStores.read(id);
    res.json(order);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const deleteTheOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    if (!id) {
      res.status(400).send(`Couldn't find id: ${id}`)
      return false;
    }
    await OrderStores.deleteTheOrder(id);
    res.status(200).send(`Order deleted`)
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const products = req.body.products as unknown as OrderProduct[];
    const status = req.body.status as unknown as boolean;
    const user_id = req.body.user_id as unknown as number;
    if (!products || !status || !user_id) {
      res.status(400).send(`Couldn't Create order ${products}`)
      return false;
    };
    const order: Order = await OrderStores.create({
      products,
      status,
      user_id,
    });
    res.json(order);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    const products = req.body.products as unknown as OrderProduct[];
    const status = req.body.status as unknown as boolean;
    const user_id = req.body.user_id as unknown as number;
    if (!products || !status || !user_id || !id) {
      res.status(400).send(`Could not update order with id ${id}`);
      return false;
    }
    const order: Order = await OrderStores.update(id, {
      products,
      status,
      user_id,
    });
    res.json(order);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const ordersRoutes = (app: Application) => {
  app.delete('/ordersroutes/:id', verifyToken, deleteTheOrder);
  app.get('/ordersroutes/:id', verifyToken, readingTheOrder);
  app.post('/ordersroutes/create', verifyToken, create);
  app.put('/ordersroutes/:id', verifyToken, update);
  app.get('/ordersroutes', index);
}

export default ordersRoutes;