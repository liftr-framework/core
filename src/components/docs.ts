import { Router } from 'express';

import * as swaggerUi from 'swagger-ui-express';
import { ModuleData, SwaggerDescriptions, SwaggerResponses, DocumentationObject } from '../interfaces';
import joiToSwagger from 'joi-to-swagger';
import { flatten } from '../util';
import { Schema } from 'joi';

/**
 * Provides functionality to document all the routes passed in swagger
 * @param routes  The LiftrRoutingModule routes should be passed to here.
 * @param swaggerDescriptions  An object which defines the standard swagger info (e.g. url, version, title).
 * @param swaggerResponses  An object which defines the responses for each end point, add the structure related to Swagger here  (e.g. requestBody, responses, description).
 */

export function docs (documentationObject: DocumentationObject[], swaggerDescriptions: SwaggerDescriptions, swaggerResponses: SwaggerResponses)  {

    const endpointDefinitions = documentationObject.map((docData: DocumentationObject) => {
        const parentRoute = docData.parentRoute;
        const preparedObject = docData.moduleData.map((moduleData: ModuleData) => {
            const swaggerResponse = JSON.parse(JSON.stringify(swaggerResponses));
            const routeData = moduleData.route;
            const validationSchema = moduleData.schema;
            if(validationSchema !== undefined) {
                const { swagger } = joiToSwagger(validationSchema);
                swaggerResponse.requestBody.content['application/json'].schema = swagger;
            }
            return  prepareObject(routeData, parentRoute, swaggerResponse);
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

function prepareObject (routeData: any, parentRoute: string, swaggerResponses: SwaggerResponses) {
    const obj :any = {};
    const paths = routeData.path;
    const methods = routeData.method;
    let fullPath = parentRoute + paths;
    if (parentRoute === '/' && paths === '/') {
        fullPath = parentRoute;
    }
    else if (parentRoute === '/' && paths !== '/') {
        fullPath = paths;
    }
    const swaggerGroups = {
        [fullPath]: {[methods]:swaggerResponses}
    }

    const newObj = Object.assign(obj, swaggerGroups);
    return newObj;
};


const mergeLogic = (preparedData: any) => {
    const mergedData: any = [];
    preparedData.map( (routeObject:any, i: number) => {
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
            return
        }
        // if we reach the end of the array and still no matches, add it as a seperate route
        if(actualLength === index && Object.keys(routeArray[index])[0] !== adderDirection) {
            routeArray.push(adderRoute);
        }
    }
    return routeArray;
}
