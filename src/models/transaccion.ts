import mongoose, { Document, Schema, model, HydratedDocument } from 'mongoose';
import { Cazador, CazadorInterface } from './cazador.js';
import { Mercader, MercaderInterface } from './mercader.js';
import { Bien, BienInterface } from './bien.js';
/**
 * Interfaz principal de las partes que componen una Transacción
 */
interface TransaccionInterface extends Document {
    tipoParte: 'Cazador' | 'Mercader';
    cazadorMercader: CazadorInterface | MercaderInterface; // Referencia al cazador o mercader
    bienes: { bien: BienInterface; cantidad: number }[]; // Referencia par de datos que contiene el bien y la cantidad del mismo
    fechaHora: Date; // Fecha y hora de la transacción
    importe: number; // Importe asociado, calculado automáticamente
}
/**
 * Schema de la disposición de datos, dentro de la base de datos, de una Transacción
 */
const TransaccionSchema = new Schema<TransaccionInterface>({
    tipoParte: {
        type: String,
        required: true,
        enum: ['Cazador', 'Mercader'],
    },
    cazadorMercader: {
        type: Schema.Types.ObjectId,
        refPath: 'tipoParte', 
        required: true,
    },
    bienes: [
        {
            bien: { type: Schema.Types.ObjectId, ref: 'Bien', required: true },
            cantidad: { type: Number, required: true, min: 1 },
        },
    ],
    fechaHora: {
        type: Date,
        default: Date.now,
        required: true,
    },
    importe: {
        type: Number,
        required: true,
    },
});

/**
 * Middleware diseñado para el cálculo del importe de una transacción de forma dinámica
 */
TransaccionSchema.pre('save', async function (next) {
  try {
    const transaccion = this as HydratedDocument<TransaccionInterface>; // especifica a mongoose que el documento Mongoose sigue la interfaz
  
    let total = 0;
  
    for (const item of transaccion.bienes) {
      const bienDoc = await mongoose.model('Bien').findById(item.bien);
      if (!bienDoc) {
        return next(new Error(`Bien con id ${item.bien} no encontrado`));
      }
      const precio = (bienDoc as any).precio; 
      total += precio * item.cantidad;
    }
    transaccion.importe = total;
    next();
  } catch (err) {
    next(err as Error);
  }
});

export const Transaccion = model<TransaccionInterface>('Transaccion', TransaccionSchema);