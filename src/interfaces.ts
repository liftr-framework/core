import { Router, RequestHandler } from "express";
import { Schema } from "joi";

export interface SwaggerRequestBody {
    required:boolean;
    content: SwaggerContent;
    description?: string;
}
export interface SwaggerContent {
    [key:string]:SwaggerSchema;
}

export interface SwaggerSchema {
    schema: {};
}

export interface SwaggerDescriptionInfo {
    title?: string;
    version?: string;
    description?: string;
}

export interface SwaggerServers {
    url: string;
}

/**
 * AppRouter interface contains the necessary typing for the LiftrRoutingModule
 */

export interface AppRouter {
    path: string;
    module: ModuleReturnData;
    middleware: any[];
    schema?: Schema;
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
    servers: SwaggerServers[]
    openapi: string;
    paths?: any;
}

export interface ModuleData {
    route: RouteComponent;
    middleware: any[];
    schema?: Schema;
}

export interface DocumentationObject {
    moduleData: ModuleData[];
    parentRoute: string;
}

interface ModuleReturnData {
    router: Router;
    moduleData: ModuleData;
}

export interface RouteComponent {
    path: string;
    method: string;
    handlers: RequestHandler[];
}
