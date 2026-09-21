import { Request, Response } from 'express';
import { EmployeeService } from '../services/employeeService';
import { EmployeeMongoRepository } from '../repository/employee.mongo.repository';

export class EmployeeController {
  private employeeService: EmployeeService;

  constructor() {
    // 1. Instanciamos el repositorio específico de MongoDB
    const mongoRepository = new EmployeeMongoRepository();
    
    // 2. Se lo inyectamos al servicio pasándolo como argumento
    this.employeeService = new EmployeeService(mongoRepository);
  }

  // Usamos arrow functions para no perder el contexto de 'this' en Express
  public create = async (req: Request, res: Response) => {
    try {
      const { name, position, baseSalary, yearsOfService } = req.body;

      // 1. Validaciones HTTP: Nos aseguramos de que el cliente mandó lo que necesitamos
      if (!name || !position) {
        return res.status(400).json({ message: 'Nombre y puesto son obligatorios' });
      }

      if (typeof baseSalary !== 'number' || baseSalary <= 0) {
        return res.status(400).json({ message: 'El salario base debe ser mayor a 0' });
      }

      if (typeof yearsOfService !== 'number' || yearsOfService < 0 || !Number.isInteger(yearsOfService)) {
        return res.status(400).json({ message: 'La antigüedad debe ser un entero mayor o igual a 0' });
      }

      // 2. Le pasamos los datos limpios al Servicio para que haga la magia
      const employee = await this.employeeService.createEmployee(req.body);
      
      // 3. Devolvemos el resultado al cliente
      return res.status(201).json(employee);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Error interno del servidor' });
    }
  };

  public getAll = async (req: Request, res: Response) => {
    try {
      const employees = await this.employeeService.getAllEmployees();
      return res.json(employees);
    } catch (error) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  public getById = async (req: Request, res: Response) => {
    try {
      const employee = await this.employeeService.getEmployeeById(req.params.id as string);
      
      if (!employee) {
        return res.status(404).json({ message: 'Empleado no encontrado' });
      }
      
      return res.json(employee);
    } catch (error) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  public update = async (req: Request, res: Response) => {
    try {
      const updatedEmployee = await this.employeeService.updateEmployee(req.params.id as string, req.body);
      return res.json(updatedEmployee);
    } catch (error: any) {
      // Capturamos el error que lanzamos en el servicio 
      return res.status(404).json({ message: error.message });
    }
  };

  public delete = async (req: Request, res: Response) => {
    try {
      await this.employeeService.deleteEmployee(req.params.id as string);
      return res.json({ message: 'Empleado eliminado con éxito' });
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  };
}