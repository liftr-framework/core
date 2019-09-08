export * from './core';
export * from './interfaces';
export * from './components/router';
import Joi from 'joi';

declare global {
    namespace Express {
        export interface Request  {
        validate(data: any, schema: Joi.Schema, options?: Joi.ValidationOptions): Promise<any>;
      }
  }
}

/**
 * define joi dependency for use within api
 */
export {
  Joi
};

