const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src/pages');

const pages = [
  { file: 'HomePage.jsx', title: 'Lumina Gems and Jewellery | Home', desc: 'Welcome to Lumina Gems and Jewellery. Discover our exclusive collection of luxury gems and fine jewelry.' },
  { file: 'AboutPage.jsx', title: 'About Us | Lumina Gems and Jewellery', desc: 'Learn about the heritage, craftsmanship, and ethical sourcing behind Lumina Gems and Jewellery.' },
  { file: 'ContactPage.jsx', title: 'Contact Us | Lumina Gems and Jewellery', desc: 'Get in touch with Lumina Gems and Jewellery for inquiries, custom designs, and support.' },
  { file: 'GemsPage.jsx', title: 'Shop Gems | Lumina Gems and Jewellery', desc: 'Browse our collection of ethically sourced, brilliant loose gemstones. Find the perfect sapphire, ruby, or emerald.' },
  { file: 'JewelryPage.jsx', title: 'Shop Jewelry | Lumina Gems and Jewellery', desc: 'Explore handcrafted fine jewelry from Lumina. Elegant necklaces, rings, and earrings designed for brilliance.' },
  { file: 'CollectionsPage.jsx', title: 'Collections | Lumina Gems and Jewellery', desc: 'Discover curated luxury jewelry collections by Lumina Gems and Jewellery.' },
  { file: 'CartPage.jsx', title: 'Your Cart | Lumina Gems and Jewellery', desc: 'Review your selected gems and jewelry items before secure checkout.' },
  { file: 'GemstoneGuidePage.jsx', title: 'Gemstone Guide | Lumina Gems and Jewellery', desc: 'Learn about gemstone properties, meanings, and origins with our comprehensive Gemstone Guide.' }
];

pages.forEach(p => {
  const filePath = path.join(pagesDir, p.file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${p.file}, not found`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // If already has updateSEO, skip to avoid double inject
  if (content.includes('updateSEO')) {
    console.log(`Skipping ${p.file}, already has updateSEO`);
    return;
  }

  // 1. Add import updateSEO
  if (!content.includes('../utils/seo')) {
    // Add it after the last import
    const lastImportIndex = content.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
      const endOfLastImport = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, endOfLastImport) + `\nimport { updateSEO } from '../utils/seo';` + content.slice(endOfLastImport);
    } else {
      content = `import { updateSEO } from '../utils/seo';\n` + content;
    }
  }

  // 2. Add useEffect if not present
  if (!content.includes('useEffect(')) {
    const reactImportIndex = content.indexOf(`import React`);
    if (reactImportIndex !== -1) {
      content = content.replace(/import React(.*?)(from 'react';)/, "import React, { useEffect }$1$2");
    } else if (content.includes(`import {`) && content.includes(`'react'`)) {
      content = content.replace(/import {(.*?)} from 'react';/, "import { useEffect, $1 } from 'react';");
    } else {
      content = `import { useEffect } from 'react';\n` + content;
    }
  }

  // 3. Inject useEffect for updateSEO inside the component
  const componentMatch = content.match(/const [A-Za-z0-9_]+ = \((.*?)\) => {/);
  if (componentMatch) {
    const componentStart = componentMatch.index + componentMatch[0].length;
    
    const seoCall = `\n  useEffect(() => {
    updateSEO({
      title: '${p.title}',
      description: '${p.desc}'
    });
  }, []);\n`;

    content = content.slice(0, componentStart) + seoCall + content.slice(componentStart);
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${p.file}`);
  } else {
    console.log(`Could not find component signature in ${p.file}`);
  }
});
