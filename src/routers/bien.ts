import express from 'express';
import { Bien } from '../models/bien.js';

/**
 * Enrutamos las acciones de los bienes en el servidor
 */
export const bienRouter = express.Router();

/**
 * Operación de GET por query para los bienes
 */ 
bienRouter.get('/bienes', async (req, res) => {
  const filter = req.query.nombre ? { nombre: req.query.nombre.toString() } : {};

  try {
    const bienes = await Bien.find(filter);
    if (bienes.length !== 0) {
      res.status(200).send(bienes);
    } else {
      res.status(404).send({error: 'No se han encontrado bienes'});
    }
  } catch (error) {
    res.status(500).send({error: 'Error inesperado en el servidor'});
  }
});

/**
 * Operación de GET por id de mongoDB para los bienes
 */
bienRouter.get('/bienes/:id', async (req, res) => {
  try {
    const bien = await Bien.findById(req.params.id);
    if (bien) {
      res.status(200).send(bien);
    } else {
      res.status(404).send({error: 'Bien no encontrado'});
    }
  } catch (error) {
    res.status(500).send({error: 'Error inesperado en el servidor'});
  }
});

/**
 * Operación del servidor POST, para los bienes
 */
bienRouter.post('/bienes', async (req, res) => {
  const bien = new Bien(req.body);
  try {
      await bien.save();
      res.status(201).send(bien);
  } catch (error) {
      res.status(401).send({error: 'Error al crear el bien'});
  }
});

/**
 * Operación de DELETE un bien, usando su nombre
 */
bienRouter.delete('/bienes', async (req, res) => {
  const filter = req.query.nombre ? { nombre: req.query.nombre.toString() } : {};

  try {
    const bien = await Bien.find(filter);
    if (bien.length >= 2) {
      res.status(403).send({error: 'Más de un bien encontrado con ese nombre, use el id de mongoDB para eliminar'});
    } else if (bien.length === 0) {
      res.status(404).send({error: 'No se han encontrado bienes'});
    }
    else {
      const bienEliminado = await Bien.findByIdAndDelete(bien[0]._id);
      res.status(200).send(bienEliminado);
    }
  } catch (error) {
      res.status(500).send({error: 'Error inesperado en el servidor'});
  }
});

/**
 * Operación de DELETE de bienes mediante el id de estos en el mongoDB
 */
bienRouter.delete('/bienes/:id', async (req, res) => {
  try {
    const bien = await Bien.findByIdAndDelete(req.params.id);
    if (bien) {
      res.status(200).send(bien);
    }
    else {
      res.status(404).send({error: 'Bien no encontrado'});
    }
  } catch (error) {
    res.status(500).send({error: 'Error inesperado en el servidor'});
  }
});

/**
 * Operación para PATCH los datos de un bien por otros, mediante el nombre
 */
bienRouter.patch('/bienes', async (req, res) => {
  const filter = req.query.nombre ? { nombre: req.query.nombre.toString() } : {};
    
  try {
    const bien = await Bien.find(filter);
    if (bien.length > 1) {
      res.status(403).send({error: 'Más de un bien encontrado con ese nombre, use el id de mongoDB para actualizar'});
    } else if (bien.length === 0) {
      res.status(404).send({error: 'No se han encontrado bienes'});
    }
    else {
      const allowedUpdates = ['nombre', 'descripcion', 'material', 'peso', 'valor'];
      const actualUpdates = Object.keys(req.body);
      const isValidOperation = actualUpdates.every((update) => allowedUpdates.includes(update));
      if (!isValidOperation) {
        res.status(401).send({ error: 'Actualizacion no permitida' });
      }
      else {
        const bienActualizado = await Bien.findByIdAndUpdate(bien[0]._id, req.body, { new: true, runValidators: true });
        if (bienActualizado) {
          res.status(200).send(bienActualizado);
        }
        else {
          res.status(404).send({error: 'Bien no encontrado'});
        }
      }
    }
  } catch (error) {
    res.status(500).send({error: 'Error inesperado en el servidor'});
  }
});

/**
 * Operación para PATCH los datos de un bien por otros, mediante el id de MongoDB
 */
bienRouter.patch('/bienes/:id', async (req, res) => {
  try {
    const allowedUpdates = ['nombre', 'descripcion', 'material', 'peso', 'valor'];
    const actualUpdates = Object.keys(req.body);
    const isValidOperation = actualUpdates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
      res.status(401).send({error: 'Actualizacion no permitida'});
    }
    else {
      const bienActualizado = await Bien.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (bienActualizado) {
        res.status(200).send(bienActualizado);
      }
      else {
        res.status(404).send({error: 'Bien no encontrado'});
      }
    }
  } catch (error) {
    res.status(500).send({error: 'Error inesperado en el servidor'});
  }
});