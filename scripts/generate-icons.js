const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const faviconPath = path.join(publicDir, 'favicon.svg');

// Read SVG content
const svgBuffer = fs.readFileSync(faviconPath);

async function generateIcons() {
  console.log('🎨 Generating PWA icons from favicon.svg...\n');

  try {
    // Generate 192x192 icon for PWA
    await sharp(svgBuffer)
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, 'icon-192.png'));
    console.log('✅ Generated icon-192.png');

    // Generate 512x512 icon for PWA
    await sharp(svgBuffer)
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'icon-512.png'));
    console.log('✅ Generated icon-512.png');

    // Generate Apple Touch Icon (180x180)
    await sharp(svgBuffer)
      .resize(180, 180)
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));
    console.log('✅ Generated apple-touch-icon.png');

    // Generate smaller favicon.ico sizes
    await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'favicon-32x32.png'));
    console.log('✅ Generated favicon-32x32.png');

    await sharp(svgBuffer)
      .resize(16, 16)
      .png()
      .toFile(path.join(publicDir, 'favicon-16x16.png'));
    console.log('✅ Generated favicon-16x16.png');

    // Generate OG Image (1200x630 for social media)
    // Create a branded image with Estate Bali branding
    const ogWidth = 1200;
    const ogHeight = 630;

    // Create background
    const background = Buffer.from(
      `<svg width="${ogWidth}" height="${ogHeight}" xmlns="http://www.w3.org/2000/svg">
        <!-- Gradient background -->
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#000000;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#0a0a0a;stop-opacity:1" />
          </linearGradient>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#111111" stroke-width="1"/>
          </pattern>
        </defs>

        <!-- Background -->
        <rect width="${ogWidth}" height="${ogHeight}" fill="url(#bg)"/>
        <rect width="${ogWidth}" height="${ogHeight}" fill="url(#grid)" opacity="0.3"/>

        <!-- Logo area (centered large icon) -->
        <g transform="translate(425, 150)">
          <g transform="scale(5.5)">
            <!-- Simplified temple from favicon -->
            <rect x="6" y="34" width="10" height="2" fill="#00ff00"/>
            <rect x="7" y="26" width="8" height="8" fill="#00ff00"/>
            <rect x="10" y="28" width="2" height="6" fill="#00ff00"/>
            <rect x="6" y="24" width="10" height="2" fill="#00ff00"/>
            <rect x="7" y="20" width="8" height="2" fill="#00ff00"/>
            <rect x="8" y="16" width="6" height="2" fill="#00ff00"/>
            <rect x="9" y="12" width="4" height="2" fill="#00ff00"/>
            <rect x="10" y="8" width="2" height="2" fill="#00ff00"/>
          </g>
        </g>

        <!-- Brand name -->
        <text x="600" y="480" font-family="Arial, sans-serif" font-size="72" font-weight="bold"
              fill="#00ff00" text-anchor="middle">ESTATE BALI</text>

        <!-- Tagline -->
        <text x="600" y="540" font-family="Arial, sans-serif" font-size="32"
              fill="#00ff66" text-anchor="middle" opacity="0.9">Bali's Premier Real Estate Platform</text>

        <!-- Accent line -->
        <rect x="400" y="560" width="400" height="3" fill="#00ff00" opacity="0.6"/>
      </svg>`
    );

    await sharp(background)
      .jpeg({ quality: 90 })
      .toFile(path.join(publicDir, 'og-image.jpg'));
    console.log('✅ Generated og-image.jpg');

    console.log('\n🎉 All icons generated successfully!');
    console.log('\nGenerated files:');
    console.log('  - icon-192.png (PWA)');
    console.log('  - icon-512.png (PWA)');
    console.log('  - apple-touch-icon.png (iOS)');
    console.log('  - favicon-32x32.png');
    console.log('  - favicon-16x16.png');
    console.log('  - og-image.jpg (Social Media)');

  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
