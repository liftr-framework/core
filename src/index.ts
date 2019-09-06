export * from './core';
export * from './interfaces';
export * from './components/router';
import { ValidationOptions, Schema } from "joi";

declare global {
    namespace Express {
        export interface Request  {
        validate(data: any, schema: Schema, options?: ValidationOptions): Promise<any>;
      }
  }
}
