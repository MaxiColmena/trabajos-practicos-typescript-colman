import { IEmployee } from '../models/employee';
import { EmployeeRepository } from '../repository/employee.repository';
import { NotFoundError } from '../errorHandler/httpError';

export class EmployeeService {
  private readonly employeeRepository: EmployeeRepository;

  // Aplicamos DIP (Inversión de Dependencias): el servicio depende de la abstracción, no de MongoDB
  constructor(employeeRepository: EmployeeRepository) {
    this.employeeRepository = employeeRepository;
  }

  // Regla de negocio en un solo lugar: salario base + 2% por cada año de antigüedad
  public calculateFinalSalary(baseSalary: number, yearsOfService: number): number {
    return baseSalary + baseSalary * 0.02 * yearsOfService;
  }

  // 1. Crear empleado
  public async createEmployee(data: Partial<IEmployee>): Promise<IEmployee> {
    const finalSalary = this.calculateFinalSalary(data.baseSalary!, data.yearsOfService!);
    const employee = await this.employeeRepository.create({ ...data, finalSalary });

    console.log(`Empleado creado: ${employee.name} - salario final: ${employee.finalSalary}`);
    return employee;
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
    const currentEmployee = await this.getEmployeeById(id);

    if (!currentEmployee) {
      throw new NotFoundError(`El empleado con el id ${id} no existe`);
    }

    // Si envían salario o antigüedad, recalculamos el salario final
    if (updateData.baseSalary !== undefined || updateData.yearsOfService !== undefined) {
      updateData.finalSalary = this.calculateFinalSalary(
        updateData.baseSalary ?? currentEmployee.baseSalary,
        updateData.yearsOfService ?? currentEmployee.yearsOfService
      );
    }

    const updatedEmployee = await this.employeeRepository.update(id, updateData);

    if (!updatedEmployee) {
      throw new NotFoundError(`El empleado con el id ${id} no existe`);
    }

    return updatedEmployee;
  }

  // 5. Eliminar empleado
  public async deleteEmployee(id: string): Promise<boolean> {
    const isDeleted = await this.employeeRepository.delete(id);

    if (!isDeleted) {
      throw new NotFoundError(`No existe un empleado con el id: ${id}`);
    }

    return isDeleted;
  }
}
