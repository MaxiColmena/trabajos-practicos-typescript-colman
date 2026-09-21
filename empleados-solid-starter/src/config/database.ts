import mongoose from "mongoose";

export class Database {
    private readonly URI: string;

    constructor() {
        this.URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/employees_db';
    }

    public async connect(): Promise<void> {
        try {
            await mongoose.connect(this.URI);
            console.log('Conectado a MongoDB con éxito');
        } catch (error) {
            console.error('Error al conectar a MongoDB:', error);
            process.exit(1);
        }
    }
}