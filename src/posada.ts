import { app } from "./app.js"

// /**
//  * Establecemos el puerto de conexión, pilla el de la variable de entorno
//  * Si no existe, pone el 3000 por defecto
//  */
const port = process.env.PORT || 3000;

/**
 * Detección de error en la url a la conectarse
 */
app.all('/{*splat}', (_, res) => {
  res.status(502).send({error: 'Dirección no válida'});
});
/**
 * Establecer el puerto por el que escuchará el servidor
 */
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});