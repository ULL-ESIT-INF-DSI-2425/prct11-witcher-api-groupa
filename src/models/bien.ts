import { Document, Schema, model } from 'mongoose';

export interface BienInterface extends Document {
    id: number,
    nombre: string,
    descripcion: string,
    material: 'Esencia mágica' | 'Acero de Mahakam' | 'cuero endurecido' | 'Mutágenos de bestias antiguas' | 'Otro',
    peso: number,
    valor: number
}

const BienSchema = new Schema<BienInterface>({
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
    descripcion: {
        type: String,
        unique: false,
        required: true,
        trim: true,
    },
    material: {
        type: String,
        unique: false,
        required: true,
        trim: true,
        default: 'Otro',
        enum: ['Esencia mágica', 'Acero de Mahakam', 'cuero endurecido', 'Mutágenos de bestias antiguas', 'Otro'],
    },
    peso: {
        type: Number,
        unique: false,
        required: true,
        trim: true,
    },
    valor: {
        type: Number,
        unique: false,
        required: true,
        trim: true,
    }
});

export const Bien = model<BienInterface>('Bien', BienSchema);