import { Router } from 'express';

import * as swaggerUi from 'swagger-ui-express';
import { ModuleData, SwaggerDescriptions, SwaggerResponses, DocumentationObject } from '../interfaces';
import joiToSwagger from 'joi-to-swagger';
import { flatten } from '../util';

/**
 * Provides functionality to document all the routes passed in swagger
 * @param documentationObject[]  A documentation object array is created in useDocs before its passed through this parameter.
 * @param swaggerDescriptions  An object which defines the standard swagger info (e.g. url, version, title).
 * @param swaggerResponses  An object which defines the responses for each end point, add the structure related to Swagger here  (e.g. requestBody, responses, description).
 */

export function docs (documentationObject: DocumentationObject[], swaggerDescriptions: SwaggerDescriptions, swaggerResponses: SwaggerResponses)  {

    const endpointDefinitions = documentationObject.map((docData: DocumentationObject) => {
        const parentRoute = docData.parentRoute;
        const preparedObject = docData.moduleData.map((moduleData: ModuleData) => {
            const swaggerResponse: SwaggerResponses = JSON.parse(JSON.stringify(swaggerResponses));
            const { route, schema } = moduleData;
            if(schema !== undefined) {
                const { swagger } = joiToSwagger(schema);
                swaggerResponse.requestBody.content['application/json'].schema = swagger;
            }
            return  prepareObject(route, parentRoute, swaggerResponse);
        })
        return preparedObject;
    });

    const flattened = flatten(endpointDefinitions);
    const merge = mergeLogic(flattened);

  swaggerDescriptions.paths = merge.reduce((acc, cur) => Object.assign(acc, cur));

  const router = Router();
  router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDescriptions));

  return router;
};

/**
 * Setup the swagger object strucuture
 */
function prepareObject (routeData: any, parentRoute: string, swaggerResponses: SwaggerResponses) {
    const obj: any = {};
    const{ path, method } = routeData;
    let fullPath = parentRoute + path;

    if (parentRoute === '/' && path === '/') fullPath = parentRoute;
    else if (parentRoute === '/' && path !== '/') fullPath = path;

    const swaggerGroups = {
        [fullPath]: {[method]:swaggerResponses},
    }

   return Object.assign(obj, swaggerGroups);
};

/**
 * Merge all the objects together in one object
 * Runs checkIfExist to filter out existing paths or multiple methods on the same path
 */
const mergeLogic = (preparedData: any) => {
    const mergedData: any = [];
    preparedData.map((routeObject: any, i: number) => {
        const key = Object.keys(routeObject);
        // asigning the first value to the finished array
        if(i === 0) {
            mergedData.push(routeObject)
        };
        const routeDirection = key[0];
        checkIfExist(mergedData,routeObject, routeDirection);
        return mergedData;
    })
    return mergedData;
}

/**
 * Check if the path already exists
 * if it does push the existing data to the same path as another method
 */
const checkIfExist = (routeArray: any[], adderRoute: any, routeDirection: string) => {
    // loop through completing object and match any already known routes
    const actualLength = routeArray.length - 1;

    for (let index = 0; index < routeArray.length; index ++) {

        // if the object key from that index matches the adding route assign to the same 
        const method = Object.values(adderRoute)[0];
        const adderDirection = Object.keys(adderRoute)[0];

        // if match add it to the corresponding route
        if(Object.keys(routeArray[index])[0] === adderDirection) {
            Object.assign(routeArray[index][routeDirection], method);
            return;
        }
        // if we reach the end of the array and still no matches, add it as a seperate route
        if(actualLength === index && Object.keys(routeArray[index])[0] !== adderDirection) {
            routeArray.push(adderRoute);
        }
    }
    return routeArray;
}
