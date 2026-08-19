/**
 * build.js — ใส่ค่า Supabase จาก Environment Variables ตอน deploy
 *
 * Vercel รันไฟล์นี้ตอน build (ตั้งไว้ใน vercel.json)
 *   อ่าน  app.html  →  แทนค่า SUPABASE_URL / SUPABASE_ANON_KEY  →  เขียน dist/index.html
 *
 * ผลคือคีย์อยู่แค่ในหน้า Environment Variables ของ Vercel ไม่ต้องเก็บใน git
 * ถ้าไม่ได้ตั้ง env var ไว้ จะคงค่าเดิมที่อยู่ในไฟล์ (ไม่ล้างทิ้ง)
 */
'use strict';
const fs = require('fs');
const path = require('path');

const SRC = 'app.html';
const OUT_DIR = 'dist';
const OUT = path.join(OUT_DIR, 'index.html');

if (!fs.existsSync(SRC)) {
  console.error('❌ ไม่พบไฟล์ ' + SRC);
  process.exit(1);
}

let html = fs.readFileSync(SRC, 'utf8');

/** แทนค่าตัวแปร const ชื่อ name ด้วย value (ข้ามถ้า value ว่าง) */
function setConst(src, name, value) {
  const re = new RegExp('(const\\s+' + name + '\\s*=\\s*)"[^"]*"');
  if (!re.test(src)) {
    console.error('❌ ไม่พบตัวแปร ' + name + ' ใน ' + SRC);
    process.exit(1);
  }
  if (!value) return src;                       // ไม่ได้ตั้ง env var → ใช้ค่าเดิมในไฟล์
  return src.replace(re, '$1' + JSON.stringify(value));
}

const url = (process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '');
const key = (process.env.SUPABASE_ANON_KEY || '').trim();

html = setConst(html, 'SUPABASE_URL', url);
html = setConst(html, 'SUPABASE_ANON_KEY', key);

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT, html, 'utf8');

/* ---- รายงานผล โดยไม่พิมพ์คีย์เต็มลง build log ---- */
const mask = v => v ? v.slice(0, 6) + '…' + v.slice(-4) + '  (' + v.length + ' ตัวอักษร)' : '(ไม่ได้ตั้ง)';
console.log('─────────────────────────────────────────────');
console.log('SUPABASE_URL       = ' + (url || '(ไม่ได้ตั้ง — ใช้ค่าเดิมในไฟล์)'));
console.log('SUPABASE_ANON_KEY  = ' + mask(key));

if (key) {
  // เตือนถ้าเผลอใส่ service_role key
  try {
    const payload = JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString());
    if (payload.role !== 'anon') {
      console.error('❌ คีย์นี้เป็น role "' + payload.role + '" ไม่ใช่ "anon" — หยุด build เพื่อความปลอดภัย');
      process.exit(1);
    }
    console.log('ตรวจคีย์            = role "anon" ✅');
  } catch (e) {
    console.error('❌ อ่าน anon key ไม่ได้ — ตรวจว่าคัดลอกมาครบหรือยัง');
    process.exit(1);
  }
} else {
  console.warn('⚠️  ยังไม่ได้ตั้ง SUPABASE_ANON_KEY — เว็บจะใช้ได้แค่โหมด "เครื่องนี้"');
}

console.log('✅ สร้าง ' + OUT + ' เรียบร้อย (' + Math.round(html.length / 1024) + ' KB)');
console.log('─────────────────────────────────────────────');
