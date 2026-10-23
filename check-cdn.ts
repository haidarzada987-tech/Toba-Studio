import http from 'http';
import https from 'https';

const checkUrl = (url: string) => {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      resolve(res.statusCode);
    }).on('error', () => resolve('error'));
  });
};

async function main() {
  console.log('cdn.fontcdn.ir:', await checkUrl('https://cdn.fontcdn.ir/Font/Persian/BNazanin/BNazanin.css'));
  console.log('cdn.jsdelivr.net/gh/rastikerdar/vazirmatn:', await checkUrl('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.0.0/fonts/webfonts/Vazirmatn-Regular.woff2'));
}
main();
