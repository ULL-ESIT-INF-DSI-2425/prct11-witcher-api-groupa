import { Document, Schema, model } from 'mongoose';

export interface CazadorInterface extends Document {
    id: number,
    nombre: string,
    raza: 'Humano' | 'Elfo' | 'Enano' | 'Hechizero',
    ubicacion: 'Novigrado' | 'Velen' | 'Kaer Trolde' | 'Skellige' | 'Otro'
}

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