import { Application } from "express";
import { SchemaLike, ValidationOptions } from "joi";
import { AppRouter } from "./interfaces";


declare global {
    namespace Express {
        export interface Request  {
        validate(data: any, schema: SchemaLike): Promise<any>;
      }
  }
}
/**
 * joi validation under the hood passing the data and schema
 */
export function validate(data: any, schema: SchemaLike, options?: ValidationOptions): any {
    const validation = require('joi').validate;
    return validation(data, schema, options)
}

/**
 * Applies the req.validate to the request object with joi validation function
 */
export function setValidationObject(app: Application): void {
    app.use((req, res, next) => {
        req.validate = validate;
        next();
    });
}

/**
 * The setRoutes method loops through the routes and sets them on the Application server
*/
export function setRoutes(app: Application, routes: AppRouter[]) {
    return routes.forEach((route: AppRouter) => app.use(route.path, route.middleware, route.module.router));
}
