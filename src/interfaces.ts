export interface SwaggerRequestBody {
    required:boolean;
    content?: SwaggerContent;
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
