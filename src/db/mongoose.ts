import { connect } from 'mongoose';


const uri = process.env.MONGODB_URI;


if (!uri) {
  console.error("❌ La variable de entorno MONGODB_URI no está definida");
  process.exit(1); // Termina el proceso si no está configurada
}

connect(uri)
  .then(() => {
    console.log("✅ Conexión a MongoDB establecida");
  })
  .catch((error) => {
    console.error("❌ No se pudo conectar a MongoDB:", error);
    process.exit(1); // Termina el proceso en caso de error
  });


// import { connect } from 'mongoose';

// connect('mongodb://127.0.0.1:27017/posada-api').then(() => {
//   console.log('Connection to MongoDB server established');
// }).catch(() => {
//   console.log('Unable to connect to MongoDB server');
// });

