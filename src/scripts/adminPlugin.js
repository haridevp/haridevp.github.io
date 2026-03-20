import path from 'path';
import fs from 'fs';

/**
 * Vite dev-only plugin that exposes APIs for admin post management:
 * - POST /api/save-post    — Save a new .md writeup to src/posts/
 * - GET  /api/list-posts   — List all .md files in src/posts/
 * - POST /api/delete-post  — Delete a .md file from src/posts/
 */
export default function adminPlugin() {
  return {
    name: 'admin-save-post',
    configureServer(server) {
      const getPostsDir = () => path.resolve(process.cwd(), 'src', 'posts');

      // Save a post
      server.middlewares.use('/api/save-post', async (req, res, next) => {
        if (req.method !== 'POST') return next();

        let body = '';
        req.on('data', (chunk) => { body += chunk; });
        req.on('end', () => {
          try {
            const { filename, content } = JSON.parse(body);

            if (!filename || !content) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Missing filename or content' }));
              return;
            }

            const safeName = filename.replace(/[^a-zA-Z0-9\s\-_.]/g, '').trim();
            if (!safeName.endsWith('.md')) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Filename must end with .md' }));
              return;
            }

            const postsDir = getPostsDir();
            if (!fs.existsSync(postsDir)) {
              fs.mkdirSync(postsDir, { recursive: true });
            }

            const filePath = path.join(postsDir, safeName);
            fs.writeFileSync(filePath, content, 'utf-8');

            console.log(`\n✅ [admin-plugin] Saved writeup: ${filePath}\n`);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, path: filePath }));
          } catch (err) {
            console.error('[admin-plugin] Error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      });

      // List existing posts
      server.middlewares.use('/api/list-posts', (req, res, next) => {
        if (req.method !== 'GET') return next();

        try {
          const postsDir = getPostsDir();
          const files = fs.existsSync(postsDir)
            ? fs.readdirSync(postsDir).filter(f => f.endsWith('.md'))
            : [];

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ files }));
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        }
      });

      // Delete a post
      server.middlewares.use('/api/delete-post', async (req, res, next) => {
        if (req.method !== 'POST') return next();

        let body = '';
        req.on('data', (chunk) => { body += chunk; });
        req.on('end', () => {
          try {
            const { filename } = JSON.parse(body);

            if (!filename) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Missing filename' }));
              return;
            }

            const safeName = filename.replace(/[^a-zA-Z0-9\s\-_.]/g, '').trim();
            const postsDir = getPostsDir();
            const filePath = path.join(postsDir, safeName);

            if (!fs.existsSync(filePath)) {
              res.writeHead(404, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'File not found' }));
              return;
            }

            fs.unlinkSync(filePath);
            console.log(`\n🗑️  [admin-plugin] Deleted writeup: ${filePath}\n`);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
          } catch (err) {
            console.error('[admin-plugin] Delete error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      });
    }
  };
}
