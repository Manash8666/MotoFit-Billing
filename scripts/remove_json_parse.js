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

const dirs = ['app', 'components'];

dirs.forEach(dir => {
  walk(dir, (err, results) => {
    if (err) throw err;
    results.filter(f => f.endsWith('.tsx') || f.endsWith('.ts')).forEach(file => {
      let content = fs.readFileSync(file, 'utf8');
      
      // We want to replace `.then(res => res.json())` and similar with nothing, 
      // but wait: `.then(res => res.json())\n      .then(data => {`
      // If we just remove `.then(res => res.json())`, we need to change `.then(data =>` to `.then((data: any) =>` or just `.then(data =>` and make sure it chains correctly.
      
      // Let's replace:
      // \.then\([^)]+\s*=>\s*[^)]+\.json\(\)\)
      // Followed by whitespace and then `.then(` -> we can just delete the whole first `.then()` block!
      
      let modified = content;
      
      // Basic regex to remove `.then(res => res.json())` optionally with newlines and spaces before the next `.then`
      modified = modified.replace(/\.then\(\s*[a-zA-Z0-9_]+\s*=>\s*[a-zA-Z0-9_]+\.json\(\)\s*\)\s*\n?\s*(?=\.then\()/g, '');
      
      // Also for cases where `res.json()` was inside braces:
      modified = modified.replace(/\.then\(\s*[a-zA-Z0-9_]+\s*=>\s*\{\s*return\s+[a-zA-Z0-9_]+\.json\(\);\s*\}\s*\)\s*\n?\s*(?=\.then\()/g, '');
      
      if (modified !== content) {
        fs.writeFileSync(file, modified);
        console.log(`Fixed double JSON parsing in ${file}`);
      }
    });
  });
});
