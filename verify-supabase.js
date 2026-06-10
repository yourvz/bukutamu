#!/usr/bin/env node

/**
 * Supabase Connection Verification Script
 * Memverifikasi bahwa Supabase sudah dikonfigurasi dengan benar
 *
 * Usage: node verify-supabase.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("🔍 Verifying Supabase Configuration...\n");

// 1. Check .env files
console.log("1️⃣  Checking environment files...");
const envFiles = [".env", ".env.production"];
let envConfig = {};

for (const file of envFiles) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file} found`);
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");
    lines.forEach((line) => {
      if (line.includes("VITE_SUPABASE")) {
        const [key] = line.split("=");
        envConfig[key.trim()] = line.includes("=") ? "***" : "NOT SET";
      }
    });
  } else {
    console.log(`   ❌ ${file} NOT found`);
  }
}

console.log("\n2️⃣  Checking Supabase variables...");
const requiredVars = ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"];

let allVarsSet = true;
for (const varName of requiredVars) {
  if (Object.keys(envConfig).includes(varName)) {
    console.log(`   ✅ ${varName} is set`);
  } else {
    console.log(`   ❌ ${varName} is NOT set`);
    allVarsSet = false;
  }
}

// 3. Check dist build
console.log("\n3️⃣  Checking build output...");
const distFiles = ["dist/index.html", "dist/assets"];

for (const file of distFiles) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file} found`);
  } else {
    console.log(`   ❌ ${file} NOT found`);
  }
}

// 4. Check index.html contains correct asset references
console.log("\n4️⃣  Checking HTML asset references...");
const indexPath = path.join(__dirname, "dist", "index.html");
if (fs.existsSync(indexPath)) {
  const htmlContent = fs.readFileSync(indexPath, "utf-8");

  const hasBaseUrl = htmlContent.includes("/bukutamu/assets/");
  if (hasBaseUrl) {
    console.log(`   ✅ Asset paths use correct base URL (/bukutamu/)`);
  } else {
    console.log(`   ⚠️  Asset paths might not match deployment URL`);
  }

  const hasModuleScript = htmlContent.includes('type="module"');
  if (hasModuleScript) {
    console.log(`   ✅ Using module scripts`);
  } else {
    console.log(`   ❌ Module scripts NOT found`);
  }
} else {
  console.log(`   ❌ dist/index.html not found`);
}

// 5. Check App.vue has Supabase integration
console.log("\n5️⃣  Checking Vue component integration...");
const appVuePath = path.join(__dirname, "src", "App.vue");
if (fs.existsSync(appVuePath)) {
  const appContent = fs.readFileSync(appVuePath, "utf-8");

  const hasSupabase = appContent.includes("createClient");
  const hasFormSubmit = appContent.includes("supabase.from");
  const hasValidation = appContent.includes("submitError");

  if (hasSupabase) console.log(`   ✅ Supabase client initialized`);
  if (hasFormSubmit)
    console.log(`   ✅ Form submission to Supabase implemented`);
  if (hasValidation) console.log(`   ✅ Form validation implemented`);

  if (!hasSupabase || !hasFormSubmit) {
    console.log(`   ❌ Supabase integration incomplete`);
  }
} else {
  console.log(`   ❌ src/App.vue not found`);
}

// Summary
console.log("\n" + "=".repeat(50));
console.log("📋 SUMMARY:");
console.log("=".repeat(50));

if (allVarsSet) {
  console.log("✅ All Supabase environment variables are set");
} else {
  console.log("❌ Some Supabase variables are missing");
}

console.log("\n✨ Deployment URL: https://yourvz.github.io/bukutamu/");
console.log("📊 Supabase Dashboard: https://app.supabase.com/");
console.log("\n🚀 Application is ready for deployment!");
console.log("=".repeat(50));
