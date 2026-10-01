const fs = require('fs');
const path = require('path');

const walk = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let i = 0;
    (function next() {
      let file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          walk(file, (err, res) => {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};

walk('app', (err, results) => {
  if (err) throw err;
  
  results.filter(f => f.endsWith('.tsx') || f.endsWith('.ts')).forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Skip auth route and the wrapper itself
    if (file.includes('api-client.ts') || file.includes('login\\page.tsx') || file.includes('route.ts')) return;

    // Find fetch('/api/...
    if (content.includes("fetch('/api/") || content.includes('fetch("/api/')) {
      content = content.replace(/fetch\(['"`]\/api\//g, "apiClient.fetch('/api/");
      
      if (content !== original) {
        // Find a place to insert import
        if (!content.includes("import { apiClient }")) {
          const importStatement = `import { apiClient } from '@/lib/api-client';\n`;
          const useClientMatch = content.match(/^['"]use client['"];?\n/);
          if (useClientMatch) {
            content = content.replace(useClientMatch[0], useClientMatch[0] + importStatement);
          } else {
            content = importStatement + content;
          }
        }
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
      }
    }
  });

  // Also components dir
  walk('components', (err, results2) => {
    if (err) throw err;
    results2.filter(f => f.endsWith('.tsx') || f.endsWith('.ts')).forEach(file => {
      let content = fs.readFileSync(file, 'utf8');
      let original = content;
      if (content.includes("fetch('/api/") || content.includes('fetch("/api/')) {
        content = content.replace(/fetch\(['"`]\/api\//g, "apiClient.fetch('/api/");
        if (content !== original) {
          if (!content.includes("import { apiClient }")) {
            const importStatement = `import { apiClient } from '@/lib/api-client';\n`;
            const useClientMatch = content.match(/^['"]use client['"];?\n/);
            if (useClientMatch) {
              content = content.replace(useClientMatch[0], useClientMatch[0] + importStatement);
            } else {
              content = importStatement + content;
            }
          }
          fs.writeFileSync(file, content);
          console.log(`Updated ${file}`);
        }
      }
    });
  });
});
