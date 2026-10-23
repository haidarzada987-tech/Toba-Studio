import fs from 'fs';
import path from 'path';

const replacements = [
  {
    file: 'src/components/Navbar.tsx',
    from: '/images/logo.png',
    to: '/images/logo.svg'
  },
  {
    file: 'src/pages/Login.tsx',
    from: '/images/logo.png',
    to: '/images/logo.svg'
  },
  {
    file: 'src/pages/Home.tsx',
    from: '/images/logo.png',
    to: '/images/logo.svg'
  }
];

for (const r of replacements) {
  const file = path.join(process.cwd(), r.file);
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replaceAll(r.from, r.to);
    fs.writeFileSync(file, content);
    console.log(`Updated ${r.file}`);
  }
}
