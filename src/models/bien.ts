import { Document, Schema, model } from 'mongoose';
/**
 * Interfaz con los componentes que definen a un Bien
 */
export interface BienInterface extends Document {
    id: number,
    nombre: string,
    descripcion: string,
    material: 'Esencia mágica' | 'Acero de Mahakam' | 'cuero endurecido' | 'Mutágenos de bestias antiguas' | 'Otro',
    peso: number,
    valor: number
}
/**
 * Schema de como se dispondrá la información del bien en la base de datos
 */
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
        validate: {
            validator: (value: number) => {
                return value > 0;
            }
        }
    },
});

export const Bien = model<BienInterface>('Bien', BienSchema);