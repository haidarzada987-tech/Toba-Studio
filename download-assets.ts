import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const images = [
  { url: 'https://placehold.co/400x400/0056b3/white?text=Toba&font=playfair-display', name: 'logo.png' },
  { url: 'https://placehold.co/100x100/0ea5e9/white?text=Hesab+Pay', name: 'hesab-pay.png' },
  { url: 'https://placehold.co/100x100/fbbf24/black?text=Atoma', name: 'atoma.png' },
  { url: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png', name: 'binance.png' },
  { url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop', name: 'service-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop', name: 'service-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=800&auto=format&fit=crop', name: 'service-3.jpg' },
  { url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop', name: 'service-4.jpg' },
  { url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop', name: 'service-5.jpg' },
  { url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800&auto=format&fit=crop', name: 'service-6.jpg' },
  { url: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=800&auto=format&fit=crop', name: 'service-7.jpg' },
  { url: 'https://images.unsplash.com/photo-1561414927-6d86591d0c4f?q=80&w=800&auto=format&fit=crop', name: 'service-8.jpg' },
  { url: 'https://images.unsplash.com/photo-1556742212-6b0510745619?q=80&w=800&auto=format&fit=crop', name: 'service-9.jpg' },
  { url: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?q=80&w=800&auto=format&fit=crop', name: 'service-10.jpg' },
  { url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop', name: 'service-11.jpg' },
  { url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop', name: 'service-12.jpg' },
  { url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop', name: 'service-13.jpg' },
  { url: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=800&auto=format&fit=crop', name: 'service-14.jpg' },
  { url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop', name: 'service-15.jpg' },
  { url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop', name: 'service-16.jpg' },
  { url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop', name: 'service-17.jpg' },
  { url: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=800&auto=format&fit=crop', name: 'service-18.jpg' },
  { url: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=800&auto=format&fit=crop', name: 'service-19.jpg' },
  { url: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=800&auto=format&fit=crop', name: 'service-20.jpg' },
  { url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop', name: 'service-21.jpg' },
  { url: 'https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=800&auto=format&fit=crop', name: 'service-22.jpg' },
  { url: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=800&auto=format&fit=crop', name: 'service-23.jpg' },
  { url: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=800&auto=format&fit=crop', name: 'service-24.jpg' },
  { url: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=800&auto=format&fit=crop', name: 'service-25.jpg' },
  { url: 'https://images.unsplash.com/photo-1605898962319-19451a740781?q=80&w=800&auto=format&fit=crop', name: 'service-26.jpg' },
  { url: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=800&auto=format&fit=crop', name: 'service-27.jpg' },
  { url: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=800&auto=format&fit=crop', name: 'service-28.jpg' },
  { url: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=800&auto=format&fit=crop', name: 'service-29.jpg' },
  { url: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=800&auto=format&fit=crop', name: 'service-30.jpg' },
  { url: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=800&auto=format&fit=crop', name: 'service-31.jpg' },
  { url: 'https://images.unsplash.com/photo-1556742049-02e53f40d997?q=80&w=800&auto=format&fit=crop', name: 'service-32.jpg' },
  { url: 'https://images.unsplash.com/photo-1556742031-c6961e8560b0?q=80&w=800&auto=format&fit=crop', name: 'service-33.jpg' },
  { url: 'https://picsum.photos/seed/design/800/600', name: 'service-34.jpg' },
  { url: 'https://picsum.photos/seed/video/800/600', name: 'service-35.jpg' },
  { url: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=800&auto=format&fit=crop', name: 'service-36.jpg' },
  { url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop', name: 'service-37.jpg' },
  { url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=800&auto=format&fit=crop', name: 'service-38.jpg' },
  { url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop', name: 'service-39.jpg' },
  { url: 'https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?q=80&w=800&auto=format&fit=crop', name: 'service-40.jpg' },
  { url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=800&auto=format&fit=crop', name: 'service-41.jpg' },
  { url: 'https://images.unsplash.com/photo-1586075010633-2442dc3d6307?q=80&w=800&auto=format&fit=crop', name: 'service-42.jpg' },
  { url: 'https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?q=80&w=800&auto=format&fit=crop', name: 'service-43.jpg' },
  { url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800&auto=format&fit=crop', name: 'service-44.jpg' }
];

const dir = path.join(process.cwd(), 'public', 'images');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

async function downloadImage(url: string, filename: string) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location as string, filename).then(resolve).catch(reject);
      }
      
      const file = fs.createWriteStream(path.join(dir, filename));
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(true);
      });
    }).on('error', (err) => {
      fs.unlink(path.join(dir, filename), () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log('Downloading images...');
  for (const img of images) {
    try {
      await downloadImage(img.url, img.name);
      console.log(`Downloaded ${img.name}`);
    } catch (e) {
      console.error(`Failed to download ${img.name}:`, e);
    }
  }
  console.log('Done!');
}

main();
