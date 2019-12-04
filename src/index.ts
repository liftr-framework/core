export * from './core';
export * from './interfaces';
export * from './components/router';
import Joi, { ValidationError, ValidationOptions, ValidationResult, SchemaLike } from 'joi';

declare global {
    namespace Express {
        export interface Request  {
          validate<T>(value: T, schema: SchemaLike, options?: ValidationOptions): ValidationResult<T>;
          validate<T, R>(value: T, schema: SchemaLike, callback: (err: ValidationError, value: T) => R): R;
          validate<T, R>(value: T, schema: SchemaLike, options: ValidationOptions, callback: (err: ValidationError, value: T) => R): R;
      }
  }
}

/**
 * define joi dependency for use within api
 */
export {
  Joi,
};

