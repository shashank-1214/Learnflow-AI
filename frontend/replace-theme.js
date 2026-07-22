import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirs = [
  path.join(__dirname, 'src/pages/admin'),
  path.join(__dirname, 'src/pages/dashboard'),
  path.join(__dirname, 'src/pages/notes'),
  path.join(__dirname, 'src/pages/auth'),
];

const replacements = [
  { regex: /bg-white\/\[0\.02\]/g, replacement: 'bg-card' },
  { regex: /bg-white\/\[0\.03\]/g, replacement: 'bg-muted/30' },
  { regex: /bg-white\/\[0\.04\]/g, replacement: 'bg-muted/50' },
  { regex: /bg-white\/\[0\.05\]/g, replacement: 'bg-muted' },
  { regex: /bg-white\/\[0\.06\]/g, replacement: 'bg-muted/80' },
  { regex: /bg-white\/\[0\.1\]/g, replacement: 'bg-muted' },
  { regex: /bg-\[\#0a0a0f\]/g, replacement: 'bg-background' },
  { regex: /border-white\/\[0\.05\]/g, replacement: 'border-border' },
  { regex: /border-white\/\[0\.06\]/g, replacement: 'border-border' },
  { regex: /border-white\/\[0\.04\]/g, replacement: 'border-border' },
  { regex: /border-white\/\[0\.1\]/g, replacement: 'border-border' },
  { regex: /divide-white\/\[0\.02\]/g, replacement: 'divide-border' },
  { regex: /text-white\/40/g, replacement: 'text-muted-foreground' },
  { regex: /text-white\/30/g, replacement: 'text-muted-foreground' },
  { regex: /text-white\/50/g, replacement: 'text-muted-foreground' },
  { regex: /text-white\/70/g, replacement: 'text-foreground/70' },
  { regex: /text-white\/80/g, replacement: 'text-foreground/80' },
  { regex: /text-white/g, replacement: 'text-foreground' },
];

dirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
    files.forEach(file => {
      const filePath = path.join(dir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      let originalContent = content;
      
      replacements.forEach(({ regex, replacement }) => {
        content = content.replace(regex, replacement);
      });
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
      }
    });
  }
});
