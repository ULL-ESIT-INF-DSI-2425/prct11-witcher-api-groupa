import { Document, Schema, model } from 'mongoose';
import { Cazador, CazadorInterface } from './cazador.js';
import { Mercader, MercaderInterface } from './mercader.js';
import { Bien, BienInterface } from './bien.js';

interface TransaccionInterface extends Document {
    cazadorMercader: CazadorInterface | MercaderInterface; // Referencia al cazador o mercader
    bienes: { bien: BienInterface; cantidad: number }[]; // Referencia par de datos que contiene el bien y la cantidad del mismo
    fechaHora: Date; // Fecha y hora de la transacción
    importe: number; // Importe asociado, calculado automáticamente
}

const TransaccionSchema = new Schema<TransaccionInterface>({
    cazadorMercader: {
        type: Schema.Types.ObjectId,
        ref: 'Cazador', // No se como referenciar a cazador o mercader de forma dinámica
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
        validate: {
            // No se como calcular el importe automáticamente
        },
    },
});

export const Transaccion = model<TransaccionInterface>('Transaccion', TransaccionSchema);