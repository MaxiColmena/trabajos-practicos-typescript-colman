import { IEmployee } from '../models/employee';
import { EmployeeRepository } from '../repository/employee.repository';

export class EmployeeService {
  
  // Aplicamos DIP (Inversión de Dependencias): el servicio depende de la abstracción, no de MongoDB
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  // 1. Crear empleado
  public async createEmployee(data: Partial<IEmployee>): Promise<IEmployee> {
    const baseSalary = data.baseSalary!;
    const yearsOfService = data.yearsOfService!;
    
    // Regla de negocio
    const bonus = baseSalary * 0.02 * yearsOfService;
    const finalSalary = baseSalary + bonus;

    const newEmployeeData = {
      ...data,
      finalSalary
    };

    // Delegamos la persistencia al repositorio
    return await this.employeeRepository.create(newEmployeeData);
  }

  // 2. Obtener todos los empleados
  public async getAllEmployees(): Promise<IEmployee[]> {
    return await this.employeeRepository.findAll();
  }

  // 3. Obtener empleado por ID
  public async getEmployeeById(id: string): Promise<IEmployee | null> {
    return await this.employeeRepository.findById(id);
  }

  // 4. Actualizar empleado
  public async updateEmployee(id: string, updateData: Partial<IEmployee>): Promise<IEmployee> {
    // Buscamos el estado actual usando el método de esta misma clase
    const currentEmployee = await this.getEmployeeById(id);

    if (!currentEmployee) {
      throw new Error(`El empleado con el id ${id} no existe`);
    }

    // Si envían salario o antigüedad, recalculamos el salario final
    if (updateData.baseSalary !== undefined || updateData.yearsOfService !== undefined) {
      const newBaseSalary = updateData.baseSalary ?? currentEmployee.baseSalary;
      const newYears = updateData.yearsOfService ?? currentEmployee.yearsOfService;

      const bonus = newBaseSalary * 0.02 * newYears;
      updateData.finalSalary = newBaseSalary + bonus;
    }

    const updatedEmployee = await this.employeeRepository.update(id, updateData);

    if (!updatedEmployee) {
      throw new Error(`Error al actualizar el empleado con id: ${id}`);
    }

    return updatedEmployee;
  }

  // 5. Eliminar empleado
  public async deleteEmployee(id: string): Promise<boolean> {
    const isDeleted = await this.employeeRepository.delete(id);
    
    if (!isDeleted) {
      throw new Error(`No existe un empleado con el id: ${id}`);
    }
    
    return isDeleted;
  }
}