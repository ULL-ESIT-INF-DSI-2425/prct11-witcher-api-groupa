import express from 'express';
import { Cazador } from '../models/cazador.js';
import { Transaccion } from '../models/transaccion.js';

/**
 * Enrutamos las acciones de los cazadores en el servidor
 */
export const cazadorRouter = express.Router();

/**
 * Operación de GET por query para los cazadores
 */ 
cazadorRouter.get('/cazadores', async (req, res) => {
    const filter = req.query.nombre ? { nombre: req.query.nombre.toString() } : {};

    try {
        const cazadores = await Cazador.find(filter);
        if (cazadores.length !== 0) {
        res.status(200).send(cazadores);
        } else {
        res.status(404).send({error: 'No se han encontrado cazadores'});
        }
    } catch (error) {
        res.status(500).send({error: 'Error inesperado en el servidor'});
    }
});
/**
 * Operación de GET por id de mongoDB para los cazadores
 */
cazadorRouter.get('/cazadores/:id', async (req, res) => {
  try {
      const cazador = await Cazador.findById(req.params.id);
      if (cazador) {
        res.status(200).send(cazador);
      } else {
        res.status(404).send({error: 'Cazador no encontrado'});
      }
  } catch (error) {
      res.status(500).send({error: 'Error inesperado en el servidor'});
  }
});

/**
 * Operación del servidor POST, para los cazadores
 */
cazadorRouter.post('/cazadores', async (req, res) => {
  const cazador = new Cazador(req.body);
    
  try {
      await cazador.save();
      res.status(201).send(cazador);
  } catch (error) {
      res.status(400).send({error: 'Error al crear el cazador'});
  }
});

/**
 * Operación de DELETE un cazador, usando su nombre
 */
cazadorRouter.delete('/cazadores', async (req, res) => {
  const filter = req.query.nombre ? { nombre: req.query.nombre.toString() } : {};

  try {
    const cazador = await Cazador.find(filter);
    if (cazador.length > 1) {
      res.status(403).send({error: 'Más de un cazador encontrado con ese nombre, use el id de mongoDB para eliminar'});
    } else if (cazador.length === 0) {
      res.status(404).send({error: 'No se han encontrado cazadores'});
    }
    else {
      const id_cazador = cazador[0]._id;

      await Transaccion.deleteMany({
        cazadorMercader: id_cazador,
        tipoParte: 'Cazador',
      })

      const cazadorEliminado = await Cazador.findByIdAndDelete(id_cazador);

      res.status(200).send(cazadorEliminado);
    }
  } catch (error) {
      res.status(500).send({error: 'Error inesperado en el servidor'});
  }
});

/**
 * Operación de DELETE de cazadores mediante el id de estos en el mongoDB
 */
cazadorRouter.delete('/cazadores/:id', async (req, res) => {
  try {

    const id_cazador = req.params.id;

    await Transaccion.deleteMany({
      cazadorMercader: id_cazador,
      tipoParte: 'Cazador',
    })

    const cazador = await Cazador.findByIdAndDelete(id_cazador);
    if (cazador) {
      res.status(200).send(cazador);
    }
    else {
      res.status(404).send({error: 'Cazador no encontrado'});
    }
  } catch (error) {
    res.status(500).send({error: 'Error inesperado en el servidor'});
  }
});

/**
 * Operación para PATCH los datos de un cazador por otros, mediante el nombre
 */
cazadorRouter.patch('/cazadores', async (req, res) => {
  const filter = req.query.nombre ? { nombre: req.query.nombre.toString() } : {};
    
  try {
    const cazador = await Cazador.find(filter);
    if (cazador.length >= 2) {
      res.status(403).send({error: 'Más de un cazador encontrado con ese nombre, use el id de mongoDB para actualizar'});
    } else if (cazador.length === 0) {
      res.status(404).send({error: 'No se han encontrado cazadores'});
    }
    else {
      const allowedUpdates = ['nombre', 'raza', 'ubicacion'];
      const actualUpdates = Object.keys(req.body);
      const isValidOperation = actualUpdates.every((update) => allowedUpdates.includes(update));
      if (!isValidOperation) {
        res.status(401).send({ error: 'Actualizacion no permitida' });
      }
      else {
        const cazadorActualizado = await Cazador.findByIdAndUpdate(cazador[0]._id, req.body, { new: true, runValidators: true });
        if (cazadorActualizado) {
          res.status(200).send(cazadorActualizado);
        }
        else {
          res.status(404).send({error: 'Cazador no encontrado'});
        }
      }
    }
  } catch (error) {
    res.status(500).send({error: 'Error inesperado en el servidor'});
  }
});

/**
 * Operación para PATCH los datos de un cazador por otros, mediante el id de MongoDB
 */
cazadorRouter.patch('/cazadores/:id', async (req, res) => {
  try {
    const allowedUpdates = ['nombre', 'raza', 'ubicacion'];
    const actualUpdates = Object.keys(req.body);
    const isValidOperation = actualUpdates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
      res.status(401).send({error: 'Actualizacion no permitida'});
    }
    else {
      const cazadorActualizado = await Cazador.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (cazadorActualizado) {
        res.status(200).send(cazadorActualizado);
      }
      else {
        res.status(404).send({error: 'Cazador no encontrado'});
      }
    }
  } catch (error) {
    res.status(500).send({error: 'Error inesperado en el servidor'});
  }
});