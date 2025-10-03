import { SearchClient as TypesenseSearchClient } from "typesense";

export const typesenseClient = new TypesenseSearchClient({
    nodes: [{
        host: 'localhost',
        port: 8108,
        protocol: 'http'
    }],
    apiKey: 'jV3QnOsEd34sS4tNgVQIkA4RAm7HkIQS',
    connectionTimeoutSeconds: 2
});