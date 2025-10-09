import { SearchClient as TypesenseSearchClient } from "typesense";

// export const typesenseClient = new TypesenseSearchClient({
//     nodes: [{
//         host: 'localhost',
//         port: 8108,
//         protocol: 'http'
//     }],
//     apiKey: 'jV3QnOsEd34sS4tNgVQIkA4RAm7HkIQS',
//     connectionTimeoutSeconds: 2
// });

export const typesenseClient = new TypesenseSearchClient({
    nodes: [{
        host: 'conducible-belen-unvindictively.ngrok-free.dev',
        port: 443,
        protocol: 'https'
    }],
    apiKey: 'jV3QnOsEd34sS4tNgVQIkA4RAm7HkIQS',
    connectionTimeoutSeconds: 10,
    additionalHeaders: {
        'ngrok-skip-browser-warning': 'true'  // ✅ FIX
    }
});