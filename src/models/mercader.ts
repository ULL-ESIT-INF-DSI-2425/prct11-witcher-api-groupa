import { Document, Schema, model } from 'mongoose';
/**
 * Interfaz de las características principales de un mercader en la base de datos
 */
export interface MercaderInterface extends Document {
    id: number,
    nombre: string,
    tipo: 'Herrero' | 'Alquimista' | 'Mercader general' | 'Otro',
    ubicacion: 'Novigrado' | 'Velen' | 'Kaer Trolde' | 'Skellige' | 'Otro'
}
/**
 * Schema con la disposición de los datos de un mercader en la base
 */
const MercaderSchema = new Schema<MercaderInterface>({
    id: {
        type: Number,
        unique: true,
        required: true,
        trim: true,
    },
    nombre: {
        type: String,
        unique: false,
        required: true,
        trim: true,
    },
    tipo: {
        type: String,
        unique: false,
        required: true,
        trim: true,
        default: 'Mercader general',
        enum: ['Herrero', 'Alquimista', 'Mercader general', 'Otro'],
    },
    ubicacion: {
        type: String,
        unique: false,
        required: true,
        trim: true,
        default: 'Otro',
        enum: ['Novigrado', 'Velen', 'Kaer Trolde', 'Skellige', 'Otro']
    }
});

export const Mercader = model<MercaderInterface>('Mercader', MercaderSchema);