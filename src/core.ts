import { Application } from 'express';
import { SwaggerDescriptions, AppRouter, SwaggerResponses, ModuleData, DocumentationObject } from './interfaces';
import Joi from 'joi';
import { Server } from 'http';
import { setValidationObject, setRoutes } from './util';
import { docs } from './components/docs';

/**
 * The useDocs runs LiftrDocs under the hood.
 * Refer to the documentation for more details https://github.com/farisT/liftr-docs
 * @param {} app  An express Application is passed here to start the server
 * @param {any[]} routes The routes setup in the LiftrRoutingModule are passed here
 * @param  {SwaggerDescriptions} swaggerDescriptions
 * @param {SwaggerResponses} swaggerResponses
 */
export function useDocs(
    app: Application, 
    routes: any[],
    swaggerDescriptions: SwaggerDescriptions,
    swaggerResponses: SwaggerResponses
    )
{   
    const combinedData: DocumentationObject[] = routes.map((route) => {
        return {
            moduleData: route.module.moduleData.map((data: ModuleData) =>  data),
            parentRoute: route.path
        }
    });
    return app.use('/docs', docs(combinedData, swaggerDescriptions, swaggerResponses));
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
