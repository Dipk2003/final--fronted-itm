#!/usr/bin/env node

/**
 * 🔍 Build Verification Script
 * Validates that the frontend build was successful and ready for deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 ITM Frontend Build Verification');
console.log('=' .repeat(50));

const buildDir = '.next';
const requiredFiles = [
  '.next/BUILD_ID',
  '.next/build-manifest.json', 
  '.next/routes-manifest.json',
  '.next/prerender-manifest.json',
  '.next/app-build-manifest.json'
];

const requiredDirs = [
  '.next/static',
  '.next/server',
  '.next/static/chunks',
  '.next/static/css'
];

let allChecksPass = true;

// Check if build directory exists
console.log('\n📁 Checking build directory...');
if (!fs.existsSync(buildDir)) {
  console.log('❌ Build directory not found. Run: npm run build');
  process.exit(1);
}
console.log('✅ Build directory exists');

// Check required files
console.log('\n📄 Checking required build files...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allChecksPass = false;
  }
});

// Check required directories
console.log('\n📁 Checking required directories...');
requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}`);
  } else {
    console.log(`❌ ${dir} - MISSING`);
    allChecksPass = false;
  }
});

// Read build ID
console.log('\n🔖 Build Information...');
try {
  const buildId = fs.readFileSync('.next/BUILD_ID', 'utf8').trim();
  console.log(`✅ Build ID: ${buildId}`);
} catch (error) {
  console.log('❌ Could not read build ID');
  allChecksPass = false;
}

// Check routes manifest
console.log('\n🛣️  Checking routes...');
try {
  const routesManifest = JSON.parse(fs.readFileSync('.next/routes-manifest.json', 'utf8'));
  const routeCount = Object.keys(routesManifest.staticRoutes || {}).length;
  console.log(`✅ Static routes: ${routeCount}`);
  
  const dynamicRoutes = Object.keys(routesManifest.dynamicRoutes || {}).length;
  console.log(`✅ Dynamic routes: ${dynamicRoutes}`);
} catch (error) {
  console.log('❌ Could not read routes manifest');
  allChecksPass = false;
}

// Check prerender manifest
console.log('\n🏗️  Checking pre-rendered pages...');
try {
  const prerenderManifest = JSON.parse(fs.readFileSync('.next/prerender-manifest.json', 'utf8'));
  const staticPages = Object.keys(prerenderManifest.routes || {}).length;
  console.log(`✅ Pre-rendered pages: ${staticPages}`);
} catch (error) {
  console.log('❌ Could not read prerender manifest');
  allChecksPass = false;
}

// Check static assets
console.log('\n📦 Checking static assets...');
const staticDir = '.next/static';
try {
  const staticContents = fs.readdirSync(staticDir);
  
  if (staticContents.includes('chunks')) {
    const chunks = fs.readdirSync(path.join(staticDir, 'chunks'));
    console.log(`✅ JavaScript chunks: ${chunks.length} files`);
  }
  
  if (staticContents.includes('css')) {
    const cssFiles = fs.readdirSync(path.join(staticDir, 'css'));
    console.log(`✅ CSS files: ${cssFiles.length} files`);
  }
  
  if (staticContents.includes('media')) {
    const mediaFiles = fs.readdirSync(path.join(staticDir, 'media'));
    console.log(`✅ Media files: ${mediaFiles.length} files`);
  }
} catch (error) {
  console.log('❌ Could not check static assets');
  allChecksPass = false;
}

// Final verification
console.log('\n' + '='.repeat(50));
if (allChecksPass) {
  console.log('🎉 BUILD VERIFICATION SUCCESSFUL!');
  console.log('✅ Your frontend is ready for production deployment');
  console.log('\n📋 Next Steps:');
  console.log('   1. Deploy to Vercel: npx vercel --prod');
  console.log('   2. Or upload .next/ directory to your hosting platform');
  console.log('   3. Configure environment variables');
  console.log('   4. Test production deployment');
} else {
  console.log('❌ BUILD VERIFICATION FAILED!');
  console.log('🔧 Please run: npm run build');
  process.exit(1);
}

console.log('\n📊 Build Statistics:');
console.log(`   Build Directory: ${buildDir}`);
console.log(`   Next.js Version: 15.3.5`);
console.log(`   Node.js Version: ${process.version}`);
console.log(`   Build Date: ${new Date().toLocaleString()}`);
