import { app } from "./app.js"

import { Cazador } from './models/cazador.js';
import { Mercader } from './models/mercader.js';
import { Bien } from './models/bien.js';
import { Transaccion } from './models/transaccion.js';

const port = process.env.PORT || 3000;


//////// CAZADORES ////////
// GET por query
app.get('/cazadores', async (req, res) => {
  const filter = req.query.nombre ? { nombre: req.query.nombre.toString() } : {};

  try {
      const cazadores = await Cazador.find(filter);
      if (cazadores.length !== 0) {
      res.status(200).send(cazadores);
      } else {
      res.status(204).send({error: 'No se han encontrado cazadores'});
      }
  } catch (error) {
      res.status(500).send({error: 'Error inesperado en el servidor'});
  }
});

// GET por id de mongoDB
app.get('/cazadores/:id', async (req, res) => {
  try {
      const cazador = await Cazador.findById(req.params.id);
      if (cazador) {
        res.status(200).send(cazador);
      } else {
        res.status(204).send({error: 'Cazador no encontrado'});
      }
  } catch (error) {
      res.status(500).send({error: 'Error inesperado en el servidor'});
  }
});

// POST 
app.post('/cazadores', async (req, res) => {
  const cazador = new Cazador(req.body);
    
  try {
      await cazador.save();
      res.status(201).send(cazador);
  } catch (error) {
      res.status(400).send({error: 'Error al crear el cazador'});
  }
});

// DELETE por query (nombre)
app.delete('/cazadores', async (req, res) => {
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

// DELETE por id de mongoDB
app.delete('/cazadores/:id', async (req, res) => {
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

// PATCH por query
app.patch('/cazadores', async (req, res) => {
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

// PATCH por id de mongoDB
app.patch('/cazadores/:id', async (req, res) => {
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

//////// MERCADERES ////////
// GET por query
app.get('/mercaderes', async (req, res) => {
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

// GET por id de mongoDB
app.get('/mercaderes/:id', async (req, res) => {
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

// POST
app.post('/mercaderes', async (req, res) => {
  const mercader = new Mercader(req.body);
    
  try {
      await mercader.save();
      res.status(201).send(mercader);
  } catch (error) {
      res.status(401).send({error: 'Error al crear el mercader'});
  }
});

// DELETE por query (nombre)
app.delete('/mercaderes', async (req, res) => {
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

// DELETE por id de mongoDB
app.delete('/mercaderes/:id', async (req, res) => {
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

// PATCH por query
app.patch('/mercaderes', async (req, res) => {
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

// PATCH por id de mongoDB
app.patch('/mercaderes/:id', async (req, res) => {
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

//////// BIENES ////////
// GET por query
app.get('/bienes', async (req, res) => {
  const filter = req.query.nombre ? { nombre: req.query.nombre.toString() } : {};

  try {
    const bienes = await Bien.find(filter);
    if (bienes.length !== 0) {
      res.status(200).send(bienes);
    } else {
      res.status(404).send({error: 'No se han encontrado mercaderes'});
    }
  } catch (error) {
    res.status(500).send({error: 'Error inesperado en el servidor'});
  }
});

// GET por id de mongoDB
app.get('/bienes/:id', async (req, res) => {
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

// POST
app.post('/bienes', async (req, res) => {
  const bien = new Bien(req.body);
  try {
      await bien.save();
      res.status(201).send(bien);
  } catch (error) {
      res.status(401).send({error: 'Error al crear el bien'});
  }
});

// DELETE por query (nombre)
app.delete('/bienes', async (req, res) => {
  const filter = req.query.nombre ? { nombre: req.query.nombre.toString() } : {};

  try {
    const bien = await Bien.find(filter);
    if (bien.length >= 2) {
      res.status(403).send({error: 'Más de un mercader encontrado con ese nombre, use el id de mongoDB para eliminar'});
    } else if (bien.length === 0) {
      res.status(404).send({error: 'No se han encontrado mercaderes'});
    }
    else {
      const mercaderEliminado = await Mercader.findByIdAndDelete(bien[0]._id);
      res.status(200).send(mercaderEliminado);
    }
  } catch (error) {
      res.status(500).send({error: 'Error inesperado en el servidor'});
  }
});

// DELETE por id de mongoDB
app.delete('/bienes/:id', async (req, res) => {
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

// PATCH por query
app.patch('/bienes', async (req, res) => {
  const filter = req.query.nombre ? { nombre: req.query.nombre.toString() } : {};
    
  try {
    const bien = await Bien.find(filter);
    if (bien.length > 1) {
      res.status(403).send({error: 'Más de un mercader encontrado con ese nombre, use el id de mongoDB para actualizar'});
    } else if (bien.length === 0) {
      res.status(404).send({error: 'No se han encontrado mercaderes'});
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

// PATCH por id de mongoDB
app.patch('/bienes/:id', async (req, res) => {
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

app.all('/{*splat}', (_, res) => {
  res.status(502).send({error: 'Dirección no válida'});
});
  
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});