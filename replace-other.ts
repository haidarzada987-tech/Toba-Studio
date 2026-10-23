import fs from 'fs';
import path from 'path';

const replacements = [
  {
    file: 'src/components/Navbar.tsx',
    from: 'https://placehold.co/400x400/0056b3/white?text=Toba&font=playfair-display',
    to: '/images/logo.png'
  },
  {
    file: 'src/pages/Login.tsx',
    from: 'https://placehold.co/400x400/0056b3/white?text=Toba&font=playfair-display',
    to: '/images/logo.png'
  },
  {
    file: 'src/pages/Home.tsx',
    from: 'https://placehold.co/400x400/0056b3/white?text=Toba&font=playfair-display',
    to: '/images/logo.png'
  },
  {
    file: 'src/pages/CheckoutPage.tsx',
    from: 'https://placehold.co/100x100/0ea5e9/white?text=Hesab+Pay',
    to: '/images/hesab-pay.png'
  },
  {
    file: 'src/pages/CheckoutPage.tsx',
    from: 'https://placehold.co/100x100/fbbf24/black?text=Atoma',
    to: '/images/atoma.png'
  },
  {
    file: 'src/pages/CheckoutPage.tsx',
    from: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png',
    to: '/images/binance.png'
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
