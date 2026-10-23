import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'src', 'constants.ts');
let content = fs.readFileSync(file, 'utf8');

const replacements = [
  { from: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop', to: '/images/service-1.jpg' },
  { from: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop', to: '/images/service-2.jpg' },
  { from: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=800&auto=format&fit=crop', to: '/images/service-3.jpg' },
  { from: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop', to: '/images/service-4.jpg' },
  { from: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop', to: '/images/service-5.jpg' },
  { from: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800&auto=format&fit=crop', to: '/images/service-6.jpg' },
  { from: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=800&auto=format&fit=crop', to: '/images/service-7.jpg' },
  { from: 'https://images.unsplash.com/photo-1561414927-6d86591d0c4f?q=80&w=800&auto=format&fit=crop', to: '/images/service-8.jpg' },
  { from: 'https://images.unsplash.com/photo-1556742212-6b0510745619?q=80&w=800&auto=format&fit=crop', to: '/images/service-9.jpg' },
  { from: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?q=80&w=800&auto=format&fit=crop', to: '/images/service-10.jpg' },
  { from: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop', to: '/images/service-11.jpg' },
  { from: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop', to: '/images/service-12.jpg' },
  { from: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop', to: '/images/service-13.jpg' },
  { from: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=800&auto=format&fit=crop', to: '/images/service-14.jpg' },
  { from: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop', to: '/images/service-15.jpg' },
  { from: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop', to: '/images/service-16.jpg' },
  { from: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop', to: '/images/service-17.jpg' },
  { from: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=800&auto=format&fit=crop', to: '/images/service-18.jpg' },
  { from: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=800&auto=format&fit=crop', to: '/images/service-19.jpg' },
  { from: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=800&auto=format&fit=crop', to: '/images/service-20.jpg' },
  { from: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop', to: '/images/service-21.jpg' },
  { from: 'https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=800&auto=format&fit=crop', to: '/images/service-22.jpg' },
  { from: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=800&auto=format&fit=crop', to: '/images/service-23.jpg' },
  { from: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=800&auto=format&fit=crop', to: '/images/service-24.jpg' },
  { from: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=800&auto=format&fit=crop', to: '/images/service-25.jpg' },
  { from: 'https://images.unsplash.com/photo-1605898962319-19451a740781?q=80&w=800&auto=format&fit=crop', to: '/images/service-26.jpg' },
  { from: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=800&auto=format&fit=crop', to: '/images/service-27.jpg' },
  { from: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=800&auto=format&fit=crop', to: '/images/service-28.jpg' },
  { from: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=800&auto=format&fit=crop', to: '/images/service-29.jpg' },
  { from: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=800&auto=format&fit=crop', to: '/images/service-30.jpg' },
  { from: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=800&auto=format&fit=crop', to: '/images/service-31.jpg' },
  { from: 'https://images.unsplash.com/photo-1556742049-02e53f40d997?q=80&w=800&auto=format&fit=crop', to: '/images/service-32.jpg' },
  { from: 'https://images.unsplash.com/photo-1556742031-c6961e8560b0?q=80&w=800&auto=format&fit=crop', to: '/images/service-33.jpg' },
  { from: 'https://picsum.photos/seed/design/800/600', to: '/images/service-34.jpg' },
  { from: 'https://picsum.photos/seed/video/800/600', to: '/images/service-35.jpg' },
  { from: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=800&auto=format&fit=crop', to: '/images/service-36.jpg' },
  { from: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop', to: '/images/service-37.jpg' },
  { from: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=800&auto=format&fit=crop', to: '/images/service-38.jpg' },
  { from: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop', to: '/images/service-39.jpg' },
  { from: 'https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?q=80&w=800&auto=format&fit=crop', to: '/images/service-40.jpg' },
  { from: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=800&auto=format&fit=crop', to: '/images/service-41.jpg' },
  { from: 'https://images.unsplash.com/photo-1586075010633-2442dc3d6307?q=80&w=800&auto=format&fit=crop', to: '/images/service-42.jpg' },
  { from: 'https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?q=80&w=800&auto=format&fit=crop', to: '/images/service-43.jpg' },
  { from: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800&auto=format&fit=crop', to: '/images/service-44.jpg' }
];

for (const r of replacements) {
  content = content.replaceAll(r.from, r.to);
}

fs.writeFileSync(file, content);
console.log('Updated constants.ts');
