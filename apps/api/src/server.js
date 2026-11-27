import http from 'node:http';
import { config } from './config.js';
import { sendError } from './http.js';
import { corsHeaders, handleAnimaisRoutes } from './modules/animais/routes.js';

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
    const handled = await handleAnimaisRoutes(req, res, url.pathname);

    if (!handled) {
      sendError(res, 404, 'Not Found', 'Endpoint não encontrado.', undefined, corsHeaders());
    }
  } catch (error) {
    console.error('Erro não tratado na API:', error);
    if (!res.headersSent) {
      sendError(res, 500, 'Internal Server Error', 'Erro interno do servidor.', undefined, corsHeaders());
    } else {
      res.end();
    }
  }
});

server.listen(config.apiPort, '127.0.0.1', () => {
  console.log(`API MIAU (UC-01.S1) na porta ${config.apiPort}`);
});
