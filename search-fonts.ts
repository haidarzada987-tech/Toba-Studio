import https from 'https';

https.get('https://fonts.google.com/metadata/fonts', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data.replace(")]}'", ""));
      const fonts = parsed.familyMetadataList.map((f: any) => f.family);
      const matches = fonts.filter((f: string) => f.toLowerCase().includes('ab'));
      console.log(matches);
    } catch (e) {
      console.error(e);
    }
  });
});
