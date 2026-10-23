import https from 'https';
import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'public', 'fonts');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const url = 'https://cdn.jsdelivr.net/gh/welaika/word-to-markdown@master/test/fixtures/fonts/B-Nazanin.ttf';

https.get(url, (res) => {
  if (res.statusCode === 200) {
    const file = fs.createWriteStream(path.join(dir, 'BNazanin.ttf'));
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Downloaded BNazanin.ttf');
    });
  } else if (res.statusCode === 301 || res.statusCode === 302) {
    https.get(res.headers.location as string, (res2) => {
      const file = fs.createWriteStream(path.join(dir, 'BNazanin.ttf'));
      res2.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Downloaded BNazanin.ttf from redirect');
      });
    });
  } else {
    console.log('Failed:', res.statusCode);
  }
});
