import { IEmployee } from "../models/employee";

// Definimos los métodos con los cuales trabajaremos
export interface EmployeeRepository {
  // Definimos Partial para indicar que no siempre irán todos los datos definidos en el contrato
  create(employeeData: Partial<IEmployee>): Promise<IEmployee>;
  findAll(): Promise<IEmployee[]>;
  findById(id: string): Promise<IEmployee | null>;
  update(id: string, updateData: Partial<IEmployee>): Promise<IEmployee | null>;
  delete(id: string): Promise<boolean>;
}