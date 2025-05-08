import { Document, Schema, model } from 'mongoose';
/**
 * Interfaz con la estructura que puede tener un Cazador en nuestra base de datos
 */
export interface CazadorInterface extends Document {
    id: number,
    nombre: string,
    raza: 'Humano' | 'Elfo' | 'Enano' | 'Hechizero',
    ubicacion: 'Novigrado' | 'Velen' | 'Kaer Trolde' | 'Skellige' | 'Otro'
}
/**
 * Schema específico de la información de los Cazadores en la base de datos
 */
const CazadorSchema = new Schema<CazadorInterface>({
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
    raza: {
        type: String,
        unique: false,
        required: true,
        trim: true,
        default: 'Humano',
        enum: ['Humano', 'Elfo', 'Enano', 'Hechizero'],
    },
    ubicacion: {
        type: String,
        unique: false,
        required: true,
        trim: true,
        default: 'Otro',
        enum: ['Novigrado', 'Velen', 'Kaer Trolde', 'Skellige']
    }
});

export const Cazador = model<CazadorInterface>('Cazador', CazadorSchema);