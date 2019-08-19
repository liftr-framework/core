import { Router , Application } from 'express';
import { LiftrDocs } from '@liftr/docs';
import { SwaggerRequestBody, SwaggerDescriptionInfo, SwaggerServers } from './interfaces';
import * as Joi from 'joi';
import { Server } from 'http';

declare global {
    namespace Express {
     export interface Request  {
        validate(data: any, schema: Joi.Schema): Promise<any>;
      }
  }
}

/**
 * The setRoutes method loops through the routes and sets them on the Application server
*/
function setRoutes(app: Application, routes: AppRouter[]) {
    routes.forEach((route: AppRouter) => console.log(route.handler.stack[0].route.stack[0]));
    return routes.forEach((route: AppRouter) => app.use(route.path, route.middleware, route.handler));
}

/**
 * The useDocs runs LiftrDocs under the hood.
 * Refer to the documentation for more details https://github.com/farisT/liftr-docs
 * @param {Application} app  An express Application is passed here to start the server
 * @param {AppRouter[]} routes The routes setup in the LiftrRoutingModule are passed here
 * @param  {SwaggerDescriptions} swaggerDescriptions
 * @param {SwaggerResponses} swaggerResponses
 */
export function useDocs(
    app: Application, 
    routes: AppRouter[],
    swaggerDescriptions: SwaggerDescriptions,
    swaggerResponses: SwaggerResponses
    ) : Application
{
    return app.use('/docs', LiftrDocs(routes, swaggerDescriptions, swaggerResponses));
}

/**
 * joi validation under the hood passing the data and schema
 */
function validate(data: any, schema: Joi.SchemaLike, options?: Joi.ValidationOptions): any {
    return Joi.validate(data, schema, options)
}

/**
 * Applies the req.validate to the request object with joi validation function
 */
function setValidationObject(app: Application): void {
    app.use((req, res, next) => {
        req.validate = validate;
        next();
    });
}

/**
 * The server method runs the Application that is passed based on the port and configuration already set
 */
export function server(app: Application, routes: AppRouter[]) : Server {
    setValidationObject(app);
    setRoutes(app, routes);
    return app.listen(app.get('port'), () => {
        console.log(
            'App is running on http://localhost:%d in %s mode',
            app.get('port'),
            app.get('env'),
        );
    });
}

/**
 * define joi dependency for use within api
 */
export const joi = Joi;

/**
 * AppRouter interface contains the necessary typing for the LiftrRoutingModule
 */
export interface AppRouter {
    path: string;
    middleware: any[];
    handler: Router;
}

/**
 * The SwaggerResponses interface is used to categorize the necessary swagger fields for liftr-docs
 * For more info check https://github.com/farisT/liftr-docs
 */
export interface SwaggerResponses {
    responses?: any;
    requestBody: SwaggerRequestBody
}

/**
 * The SwaggerDescriptions interface is used to categorize the necessary swagger fields for liftr-docs
 * For more info check https://github.com/farisT/liftr-docs
 */
export interface SwaggerDescriptions {
    info: SwaggerDescriptionInfo;
    servers: [SwaggerServers]
    openapi: string;
    paths?: any;
}
