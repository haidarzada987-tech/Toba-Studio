import https from 'https';

https.get('https://api.duckduckgo.com/?q=فونت+ابر+download&format=json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(data);
  });
});
