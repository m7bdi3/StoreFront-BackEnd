import { Product, ProductStore } from '../models/product';
import { Application, Request, Response } from 'express';
import { verifyToken } from './helpers';

const productStores = new ProductStore();

const gettingTheProducts = async (_req: Request, res: Response) => {
  try {
    const products: Product[] = await productStores.getAll();
    res.json(products);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const deleteTheProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    if (!id) {
      res.status(400).send(`Couldn't delete product with id: ${id}`);
      return false;
    }
    await productStores.deleteById(id);
    res.status(200).send(`Updated product with id: ${id}`);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const name = req.body.name as unknown as string;
    const price = req.body.price as unknown as number;
    if (!name || !price) {
      res.status(400).send(`Couldn't create product with name: ${name}`);
      return false;
    }
    const product: Product = await productStores.create({ name, price });
    res.json({
      product,
    });
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    const name = req.body.name as unknown as string;
    const price = req.body.price as unknown as number;
    if (!name || !price || !id) {
      res.status(400).send(`Couldn't Update product with id: ${id}`);
      return false;
    }
    const product: Product = await productStores.updateById(id, {
      name,
      price,
    });
    res.json(product);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const readingTheProcuts = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    if (!id) {
      res.status(400).send(`Couldn't find product with id: ${id}`);
      return false;
    }
    const product: Product = await productStores.getById(id);
    res.json(product);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const productsRoutes = (app: Application) => {
  app.delete('/productsroutes/:id', verifyToken, deleteTheProduct);
  app.post('/productsroutes/create', verifyToken, create);
  app.put('/productsroutes/:id', verifyToken, update);
  app.get('/productsroutes/:id', readingTheProcuts);
  app.get('/productsroutes', gettingTheProducts);
};

export default productsRoutes;