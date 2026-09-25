const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3876;
const TARGET_DIR = 'C:\\xampp\\htdocs\\webclass';
const ARTIFACT_DIR = 'C:\\Users\\Vitor Alessandro\\.gemini\\antigravity-ide\\brain\\f59da479-3866-4889-800f-a428984c4b50';
const OUTPUT_FILE = path.join(TARGET_DIR, 'webclass_apresentacao_30s.webm');
const ARTIFACT_FILE = path.join(ARTIFACT_DIR, 'webclass_apresentacao_30s.webm');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/save-video') {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      fs.writeFileSync(OUTPUT_FILE, buffer);
      
      // Salva cópia no diretório de artefatos
      try {
        fs.writeFileSync(ARTIFACT_FILE, buffer);
      } catch (err) {
        console.warn('[Aviso] Não foi possível copiar para diretório de artefatos:', err.message);
      }

      console.log(`[WebClass] Vídeo de 30s gravado com sucesso!`);
      console.log(`- Arquivo: ${OUTPUT_FILE}`);
      console.log(`- Tamanho: ${(buffer.length / 1024).toFixed(1)} KB`);

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('OK');

      setTimeout(() => {
        server.close();
        process.exit(0);
      }, 1000);
    });
    return;
  }

  // Serve presentation.html
  const htmlPath = path.join(TARGET_DIR, 'presentation.html');
  if (fs.existsSync(htmlPath)) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    fs.createReadStream(htmlPath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('presentation.html not found');
  }
});

server.listen(PORT, () => {
  console.log(`[WebClass] Servidor de gravação escutando em http://localhost:${PORT}`);
  
  // Detecta Chrome ou Edge
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browserBin = fs.existsSync(chromePath) ? chromePath : edgePath;

  console.log(`[WebClass] Iniciando navegador para renderizar e gravar os 30 segundos...`);
  const cmd = `"${browserBin}" --headless=new --autoplay-policy=no-user-gesture-required --disable-gpu --window-size=1280,800 "http://localhost:${PORT}"`;
  
  exec(cmd, (err) => {
    if (err) {
      console.error('[WebClass] Erro ao executar navegador:', err);
    }
  });
});
