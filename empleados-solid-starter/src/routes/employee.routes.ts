import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller';
import { EmployeeService } from '../services/employeeService';
import { EmployeeMongoRepository } from '../repository/employee.mongo.repository';

// 1. Armamos las dependencias de afuera hacia adentro: repository -> service -> controller
const employeeRepository = new EmployeeMongoRepository();
const employeeService = new EmployeeService(employeeRepository);
const employeeController = new EmployeeController(employeeService);

// 2. Inicializamos el router de Express
export const employeeRouter = Router();

// 3. Conectamos cada método HTTP y ruta con su función del controlador
employeeRouter.post('/', employeeController.create);
employeeRouter.get('/', employeeController.getAll);
employeeRouter.get('/:id', employeeController.getById);
employeeRouter.put('/:id', employeeController.update);
employeeRouter.delete('/:id', employeeController.delete);

// No le pasamos (req, res) a las funciones del controlador en este archivo. Solo le "pasamos la referencia" de la función
