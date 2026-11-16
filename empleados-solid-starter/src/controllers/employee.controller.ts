import { NextFunction, Request, Response } from 'express';
import { EmployeeService } from '../services/employeeService';
import { NotFoundError } from '../errorHandler/httpError';

export class EmployeeController {
  private readonly employeeService: EmployeeService;

  // DIP: el controller recibe el servicio ya armado, no lo crea por dentro
  constructor(employeeService: EmployeeService) {
    this.employeeService = employeeService;
  }

  // Usamos arrow functions para no perder el contexto de 'this' en Express
  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, position, baseSalary, yearsOfService } = req.body;

      // Validaciones HTTP: nos aseguramos de que el cliente mandó lo que necesitamos
      if (!name || !position) {
        return res.status(400).json({ message: 'Nombre y puesto son obligatorios' });
      }

      if (typeof baseSalary !== 'number' || baseSalary <= 0) {
        return res.status(400).json({ message: 'El salario base debe ser mayor a 0' });
      }

      if (typeof yearsOfService !== 'number' || yearsOfService < 0 || !Number.isInteger(yearsOfService)) {
        return res.status(400).json({ message: 'La antigüedad debe ser un entero mayor o igual a 0' });
      }

      // Solo pasamos los campos permitidos (no aceptamos finalSalary desde el cliente)
      const employee = await this.employeeService.createEmployee({ name, position, baseSalary, yearsOfService });
      return res.status(201).json(employee);
    } catch (error) {
      next(error);
    }
  };

  public getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const employees = await this.employeeService.getAllEmployees();
      return res.json(employees);
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employee = await this.employeeService.getEmployeeById(String(req.params.id));

      if (!employee) {
        throw new NotFoundError();
      }

      return res.json(employee);
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedEmployee = await this.employeeService.updateEmployee(String(req.params.id), req.body);
      return res.json(updatedEmployee);
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.employeeService.deleteEmployee(String(req.params.id));
      return res.json({ message: 'Empleado eliminado con éxito' });
    } catch (error) {
      next(error);
    }
  };
}
