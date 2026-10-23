import https from 'https';

const options = {
  hostname: 'api.github.com',
  path: '/search/repositories?q=abar+font',
  headers: { 'User-Agent': 'Node.js' }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(JSON.parse(data).items?.map((i: any) => i.full_name));
  });
});
