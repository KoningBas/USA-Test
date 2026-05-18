import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename)); // project root

const PORT = 3000;

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);

  const ext = path.extname(filePath).toLowerCase();
  const binaryExts = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico']);
  const encoding = binaryExts.has(ext) ? null : 'utf8';

  fs.readFile(filePath, encoding, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    let contentType = 'text/html';
    if (ext === '.css') contentType = 'text/css';
    if (ext === '.js' || ext === '.mjs') contentType = 'text/javascript';
    if (ext === '.json') contentType = 'application/json';
    if (ext === '.png') contentType = 'image/png';
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    if (ext === '.gif') contentType = 'image/gif';
    if (ext === '.webp') contentType = 'image/webp';
    if (ext === '.svg') contentType = 'image/svg+xml';
    if (ext === '.ico') contentType = 'image/x-icon';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
