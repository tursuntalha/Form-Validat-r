const http = require('http');

const OLLAMA_HOST = 'localhost';
const OLLAMA_PORT = 11434;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/generate') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      const ollamaReq = http.request(
        { hostname: OLLAMA_HOST, port: OLLAMA_PORT, path: '/api/generate', method: 'POST', headers: { 'Content-Type': 'application/json' } },
        (ollamaRes) => {
          let data = '';
          ollamaRes.on('data', (chunk) => (data += chunk));
          ollamaRes.on('end', () => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
          });
        }
      );
      ollamaReq.on('error', () => {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Ollama not reachable' }));
      });
      ollamaReq.write(body);
      ollamaReq.end();
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3001, () => console.log('FormForge proxy running on :3001'));
