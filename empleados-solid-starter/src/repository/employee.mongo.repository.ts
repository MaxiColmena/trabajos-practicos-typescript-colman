import { EmployeeRepository } from "./employee.repository";
import { EmployeeModel, IEmployee } from "../models/employee";

// Implementamos los métodos de la interfaz EmployeeRepository
export class EmployeeMongoRepository implements EmployeeRepository {
  
  async create(employeeData: Partial<IEmployee>): Promise<IEmployee> {
    // Usamos el método de Mongoose para crear y guardar directamente
    return await EmployeeModel.create(employeeData);
  }

  async findAll(): Promise<IEmployee[]> {
    // Le agregamos el sort para que los traiga ordenados por el más nuevo, como tenías al principio
    return await EmployeeModel.find().sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<IEmployee | null> {
    return await EmployeeModel.findById(id);
  }

  async update(id: string, updateData: Partial<IEmployee>): Promise<IEmployee | null> {
    return await EmployeeModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await EmployeeModel.findByIdAndDelete(id);
    
    // Retorna true si lo borró, false (o null convertido a booleano) si no encontró el empleado
    return result !== null;
  }
}