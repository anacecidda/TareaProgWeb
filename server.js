import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const PORT = 3000;

const CONTENT_TYPES = new Map([
    ['.css', 'text/css'],
    ['.avif', 'image/avif'],
    ['.jpg', 'image/jpeg'],
    ['.jpeg', 'image/jpeg'],
    ['.png', 'image/png'],
    ['.js', 'text/javascript']
]);

export const server = createServer(async (request, response) => {
    const route = request.url;
    console.log(route);

    if (route === '/') {
        try {
            const document = await readFile('./index.html');
            response.writeHead(200, 'ok', { 'content-type': 'text/html' });
            return response.end(document);
        } 
        catch (error) {
            console.error("Detalle del fallo:", error);
            response.writeHead(500);
            return response.end('Error loading index.html');
    }
}

    const extension = extname(route).toLowerCase();
    const contentType = CONTENT_TYPES.get(extension);

    if (!contentType) {
        response.statusCode = 404;
        return response.end('not found');
    }

    try {
        const targetPath = join('.', route);
        const fileBuffer = await readFile(targetPath);
        
        response.writeHead(200, 'ok', { 'content-type': contentType });
        response.end(fileBuffer);
    } catch {
        response.statusCode = 404;
        response.end('not found');
    }
});

server.listen(PORT, () => {
    console.log(`server running on port: ${PORT}`);
});