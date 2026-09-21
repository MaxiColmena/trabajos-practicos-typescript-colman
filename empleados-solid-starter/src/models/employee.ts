import { Schema, model, Document } from 'mongoose';

export interface IEmployee extends Document {
  name: string;
  position: string;
  baseSalary: number;
  yearsOfService: number;
  finalSalary: number;
}

const employeeSchema = new Schema<IEmployee>(
  {
    name: { type: String, required: true },
    position: { type: String, required: true },
    baseSalary: { type: Number, required: true },
    yearsOfService: { type: Number, required: true },
    finalSalary: { type: Number, required: true },
  },
  { timestamps: true }
);

export const EmployeeModel = model<IEmployee>('Employee', employeeSchema);