#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

const PLUGINS_DIR = path.join(__dirname, '../plugins');

async function buildPlugin(pluginDir) {
  const pluginPath = path.join(PLUGINS_DIR, pluginDir);
  const packageJsonPath = path.join(pluginPath, 'package.json');
  const srcPath = path.join(pluginPath, 'src');
  const pluginJsonPath = path.join(pluginPath, 'plugin.json');

  console.log(`\n🔌 Building plugin: ${pluginDir}`);

  // Vérifier que plugin.json existe
  try {
    await fs.access(pluginJsonPath);
  } catch (error) {
    console.log(`❌ Skipping ${pluginDir}: no plugin.json found`);
    return false;
  }

  // Vérifier que le dossier src existe
  try {
    await fs.access(srcPath);
  } catch (error) {
    console.log(`❌ Skipping ${pluginDir}: no src/ directory found`);
    return false;
  }

  // Vérifier que package.json existe
  try {
    await fs.access(packageJsonPath);
  } catch (error) {
    console.log(`❌ Skipping ${pluginDir}: no package.json found`);
    return false;
  }

  try {
    // Installer les dépendances si node_modules n'existe pas
    const nodeModulesPath = path.join(pluginPath, 'node_modules');
    try {
      await fs.access(nodeModulesPath);
    } catch (error) {
      console.log(`📦 Installing dependencies for ${pluginDir}...`);
      execSync('npm install', { cwd: pluginPath, stdio: 'inherit' });
    }

    // Build le plugin
    console.log(`🔨 Building ${pluginDir}...`);
    execSync('npm run build', { cwd: pluginPath, stdio: 'inherit' });
    
    console.log(`✅ Successfully built ${pluginDir}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to build ${pluginDir}:`, error.message);
    return false;
  }
}

async function buildAllPlugins() {
  console.log('🚀 NED Studio Plugin Builder');
  console.log('=============================');

  try {
    // Vérifier que le dossier plugins existe
    await fs.access(PLUGINS_DIR);
  } catch (error) {
    console.error('❌ Plugins directory not found:', PLUGINS_DIR);
    process.exit(1);
  }

  // Lister tous les dossiers dans plugins/
  const entries = await fs.readdir(PLUGINS_DIR, { withFileTypes: true });
  const pluginDirs = entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);

  if (pluginDirs.length === 0) {
    console.log('📁 No plugin directories found in plugins/');
    return;
  }

  console.log(`📁 Found ${pluginDirs.length} plugin(s): ${pluginDirs.join(', ')}`);

  let successCount = 0;
  let failCount = 0;

  // Build chaque plugin
  for (const pluginDir of pluginDirs) {
    const success = await buildPlugin(pluginDir);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log('\n📊 Build Summary:');
  console.log(`✅ Successfully built: ${successCount} plugin(s)`);
  if (failCount > 0) {
    console.log(`❌ Failed to build: ${failCount} plugin(s)`);
  }
  console.log('🎉 Plugin build process completed!');
}

// Exécuter le script
if (require.main === module) {
  buildAllPlugins().catch(error => {
    console.error('💥 Build process failed:', error);
    process.exit(1);
  });
}

module.exports = { buildAllPlugins, buildPlugin };
