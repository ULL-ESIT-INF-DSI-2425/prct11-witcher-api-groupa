import express from 'express';
import './db/mongoose.js'
import { cazadorRouter } from './routers/cazador.js';
import { mercaderRouter } from './routers/mercader.js';
import { bienRouter } from './routers/bien.js';
/**
 * Creación del servidor express
 */
export const app = express();
/**
 * Especificación al servidor de que trabajará con formato JSON
 */
app.use(express.json());
/**
 * Especificamos al servidor el uso de los router de cada cosa
 */
app.use(cazadorRouter);
app.use(mercaderRouter);
app.use(bienRouter);
