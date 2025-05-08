import express from 'express';
import { Mercader } from '../models/mercader.js';
import { Transaccion } from '../models/transaccion.js';

/**
 * Enrutamos las acciones de los mercaderes en el servidor
 */
export const mercaderRouter = express.Router();

/**
 * Operación de GET por query para los mercaderes
 */ 
mercaderRouter.get('/mercaderes', async (req, res) => {
  const filter = req.query.nombre ? { nombre: req.query.nombre.toString() } : {};

  try {
      const mercaderes = await Mercader.find(filter);
      if (mercaderes.length !== 0) {
      res.status(200).send(mercaderes);
      } else {
      res.status(404).send({error: 'No se han encontrado mercaderes'});
      }
  } catch (error) {
      res.status(500).send({error: 'Error inesperado en el servidor'});
  }
});

/**
 * Operación de GET por id de mongoDB para los mercaderes
 */
mercaderRouter.get('/mercaderes/:id', async (req, res) => {
  try {
      const mercader = await Mercader.findById(req.params.id);
      if (mercader) {
        res.status(200).send(mercader);
      } else {
        res.status(404).send({error: 'Mercader no encontrado'});
      }
  } catch (error) {
      res.status(500).send({error: 'Error inesperado en el servidor'});
  }
});

/**
 * Operación del servidor POST, para los mercaderes
 */
mercaderRouter.post('/mercaderes', async (req, res) => {
  const mercader = new Mercader(req.body);
    
  try {
      await mercader.save();
      res.status(201).send(mercader);
  } catch (error) {
      res.status(400).send({error: 'Error al crear el mercader'});
  }
});

/**
 * Operación de DELETE un mercader, usando su nombre
 */
mercaderRouter.delete('/mercaderes', async (req, res) => {
  const filter = req.query.nombre ? { nombre: req.query.nombre.toString() } : {};

  try {
    const mercader = await Mercader.find(filter);
    if (mercader.length >= 2) {
      res.status(403).send({error: 'Más de un mercader encontrado con ese nombre, use el id de mongoDB para eliminar'});
    } else if (mercader.length === 0) {
      res.status(404).send({error: 'No se han encontrado mercaderes'});
    }
    else {
      const id_mercader = mercader[0]._id;

      await Transaccion.deleteMany({
        cazadorMercader: id_mercader,
        tipoParte: 'Mercader',
      })

      const mercaderEliminado = await Mercader.findByIdAndDelete(id_mercader);
      res.status(200).send(mercaderEliminado);
    }
  } catch (error) {
      res.status(500).send({error: 'Error inesperado en el servidor'});
  }
});

/**
 * Operación de DELETE de mercaderes mediante el id de estos en el mongoDB
 */
mercaderRouter.delete('/mercaderes/:id', async (req, res) => {
  try {
    const id_mercader = req.params.id;

    await Transaccion.deleteMany({
      cazadorMercader: id_mercader,
      tipoParte: 'Mercader',
    })

    const mercader = await Mercader.findByIdAndDelete(id_mercader);
    
    if (mercader) {
      res.status(200).send(mercader);
    }
    else {
      res.status(404).send({error: 'Mercader no encontrado'});
    }
  } catch (error) {
    res.status(500).send({error: 'Error inesperado en el servidor'});
  }
});

/**
 * Operación para PATCH los datos de un mercader por otros, mediante el nombre
 */
mercaderRouter.patch('/mercaderes', async (req, res) => {
  const filter = req.query.nombre ? { nombre: req.query.nombre.toString() } : {};
    
  try {
    const mercader = await Mercader.find(filter);
    if (mercader.length > 1) {
      res.status(403).send({error: 'Más de un mercader encontrado con ese nombre, use el id de mongoDB para actualizar'});
    } else if (mercader.length === 0) {
      res.status(404).send({error: 'No se han encontrado mercaderes'});
    }
    else {
      const allowedUpdates = ['nombre', 'tipo', 'ubicacion'];
      const actualUpdates = Object.keys(req.body);
      const isValidOperation = actualUpdates.every((update) => allowedUpdates.includes(update));
      if (!isValidOperation) {
        res.status(401).send({ error: 'Actualizacion no permitida' });
      }
      else {
        const mercaderActualizado = await Mercader.findByIdAndUpdate(mercader[0]._id, req.body, { new: true, runValidators: true });
        if (mercaderActualizado) {
          res.status(200).send(mercaderActualizado);
        }
        else {
          res.status(404).send({error: 'Mercader no encontrado'});
        }
      }
    }
  } catch (error) {
    res.status(500).send({error: 'Error inesperado en el servidor'});
  }
});

/**
 * Operación para PATCH los datos de un mercader por otros, mediante el id de MongoDB
 */
mercaderRouter.patch('/mercaderes/:id', async (req, res) => {
  try {
    const allowedUpdates = ['nombre', 'tipo', 'ubicacion'];
    const actualUpdates = Object.keys(req.body);
    const isValidOperation = actualUpdates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
      res.status(401).send({error: 'Actualizacion no permitida'});
    }
    else {
      const mercaderActualizado = await Mercader.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (mercaderActualizado) {
        res.status(200).send(mercaderActualizado);
      }
      else {
        res.status(404).send({error: 'Mercader no encontrado'});
      }
    }
  } catch (error) {
    res.status(500).send({error: 'Error inesperado en el servidor'});
  }
});