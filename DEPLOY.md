# เอาขึ้นออนไลน์ — Supabase + Vercel

> ผลลัพธ์: ได้ลิงก์เว็บ เช่น `https://pk-money.vercel.app` ส่งให้เพื่อนเปิดในมือถือ
> ทุกคนเห็นกองกลางและยอดเงินตรงกันแบบเรียลไทม์ · ฟรีทั้งหมด · ไม่มี server ต้องดูแล

**รวมเวลาประมาณ 10 นาที ทำครั้งเดียว**

---

## ขั้นที่ 1 · สร้างฐานข้อมูล Supabase (5 นาที)

1. เข้า **[supabase.com](https://supabase.com)** → Sign in ด้วย GitHub → **New project**
   - Name: อะไรก็ได้ · Database Password: ตั้งแล้วเก็บไว้ · Region: **Southeast Asia (Singapore)** จะเร็วสุด
   - กด Create แล้วรอ ~2 นาที
2. เมนูซ้าย → **SQL Editor** → **New query**
3. เปิดไฟล์ [`supabase-schema.sql`](supabase-schema.sql) คัดลอก**ทั้งไฟล์** มาวาง → กด **Run**
   - ต้องขึ้น `Success. No rows returned`
4. เมนูซ้าย → **Project Settings** (⚙️) → **API** → คัดลอก 2 ค่านี้เก็บไว้

| ค่า | หน้าตา |
|---|---|
| **Project URL** | `https://abcdefghijkl.supabase.co` |
| **anon public** key | `eyJhbGciOiJIUzI1NiIsInR5cCI6...` (ยาวมาก) |

> ⚠️ ใช้ **anon public** เท่านั้น · **ห้ามใช้ `service_role`** เด็ดขาด (มันข้ามสิทธิ์ทั้งหมด)

---

## ขั้นที่ 2 · ใส่คีย์ใน Vercel (ไม่ต้องแก้ไฟล์)

**วิธีที่แนะนำ** — คีย์อยู่แค่ใน Vercel ไม่เข้า git ทำให้ repo เปิดสาธารณะได้อย่างสบายใจ

1. เข้า Vercel → เลือกโปรเจกต์ → **Settings** → **Environment Variables**
2. เพิ่ม 2 ตัวนี้ (เลือก environment ให้ครบทั้ง **Production / Preview / Development**)

| Key | Value |
|---|---|
| `SUPABASE_URL` | `https://xxxxxxxx.supabase.co` (ไม่ต้องมี `/rest/v1/` ต่อท้าย) |
| `SUPABASE_ANON_KEY` | คีย์ `anon` `public` ที่คัดลอกมาจากขั้นที่ 1 |

3. กด **Save**
4. ไปแท็บ **Deployments** → กด `⋯` ที่ deployment ล่าสุด → **Redeploy**

ตอน build ไฟล์ [`build.js`](build.js) จะอ่านค่าทั้งสองมาใส่ใน `dist/index.html` ให้เอง
พร้อมตรวจให้ด้วยว่าเป็นคีย์ role `anon` จริง — **ถ้าเผลอใส่ `service_role` มันจะหยุด build ทันที**

ดู build log ได้ที่หน้า Deployment จะเห็นแบบนี้

```
SUPABASE_URL       = https://xxxxxxxx.supabase.co
SUPABASE_ANON_KEY  = eyJhbG…QaDA  (208 ตัวอักษร)
ตรวจคีย์            = role "anon" ✅
✅ สร้าง dist/index.html เรียบร้อย (116 KB)
```

> **หมายเหตุตามตรง:** วิธีนี้ทำให้คีย์ไม่อยู่ใน git ก็จริง แต่**ในหน้าเว็บที่ deploy แล้วยังเห็นคีย์ได้อยู่**
> (กด View Source ก็เจอ) — เลี่ยงไม่ได้ เพราะเบราว์เซอร์ต้องใช้คีย์นั้นต่อ Supabase
> ตัว anon key ออกแบบมาให้เป็นแบบนั้นอยู่แล้ว ด่านป้องกันจริงคือ RLS policy ไม่ใช่การซ่อนคีย์

### ทางเลือกอื่น

| วิธี | เหมาะกับ |
|---|---|
| ไม่ตั้งอะไรเลย | แต่ละคนกดปุ่ม "ตั้งค่าการเชื่อมต่อข้ามเครื่อง" ในหน้าแรกแล้วกรอกเอง (เก็บในเครื่องใครเครื่องมัน) |
| แก้ `app.html` บรรทัด 180–182 ตรงๆ | เร็วสุด แต่คีย์จะเข้า git → ควรตั้ง repo เป็น **Private** |

---

## ขั้นที่ 3 · Deploy ขึ้น Vercel (3 นาที)

### วิธี A — ลากวาง ง่ายสุด ไม่ต้องใช้ git

1. เข้า **[vercel.com/new](https://vercel.com/new)** → Sign in
2. เลื่อนลงหา **Deploy a template** → มองหาลิงก์เล็กๆ **"or deploy a folder"**
   (ถ้าหาไม่เจอ ใช้วิธี B แทน)
3. ลากโฟลเดอร์ `PK` ทั้งโฟลเดอร์เข้าไป → Deploy

### วิธี B — ผ่าน CLI (แนะนำ อัปเดตซ้ำง่าย)

ติดตั้ง Node.js ก่อน แล้วเปิด PowerShell ที่โฟลเดอร์นี้

```bash
npx vercel --prod
```

ครั้งแรกมันจะถาม — ตอบตามนี้

| คำถาม | ตอบ |
|---|---|
| Set up and deploy? | **Y** |
| Which scope? | เลือกบัญชีตัวเอง |
| Link to existing project? | **N** |
| Project name? | `pk-money` (หรืออะไรก็ได้) |
| In which directory is your code? | **`./`** (กด Enter) |
| Want to modify settings? | **N** |

เสร็จแล้วมันจะพิมพ์ลิงก์ออกมา — นั่นคือเว็บของคุณ

### วิธี C — ผ่าน GitHub (อัปเดตอัตโนมัติทุกครั้งที่ push)

1. push โฟลเดอร์นี้ขึ้น GitHub repo
2. [vercel.com/new](https://vercel.com/new) → Import repo นั้น → Framework Preset เลือก **Other** → Deploy

### อัปเดตเว็บทีหลัง

```bash
npx vercel --prod
```

---

## ไฟล์ที่เกี่ยวกับการ deploy

| ไฟล์ | ทำอะไร |
|---|---|
| [`build.js`](build.js) | ตอน deploy อ่าน env var มาใส่ใน `app.html` → เขียนออกเป็น `dist/index.html` + ตรวจว่าคีย์เป็น role `anon` |
| [`vercel.json`](vercel.json) | สั่งให้ Vercel รัน `node build.js` แล้วเสิร์ฟโฟลเดอร์ `dist` + ปิด cache กันเห็นเวอร์ชันเก่า |
| `.vercelignore` | กันไม่ให้เอกสารออกแบบ (`*.md`, `*.sql`, ม็อกอัพ) ขึ้นเว็บสาธารณะ |
| [`supabase-schema.sql`](supabase-schema.sql) | สคริปต์สร้างตาราง + สิทธิ์ + เปิด Realtime |

> `dist/` ถูกใส่ใน `.gitignore` แล้ว — สร้างใหม่ทุกครั้งตอน deploy ไม่ต้อง commit
> ทดสอบ build ในเครื่องได้ด้วย `node build.js` แล้วเปิด `dist/index.html`

---

## ตรวจว่าใช้ได้จริง

1. เปิดลิงก์ในมือถือเครื่องแรก → ใส่ชื่อ → **สร้างห้องใหม่** → จดรหัสห้อง 6 หลัก
2. เปิดลิงก์เดียวกันในมือถืออีกเครื่อง → ใส่ชื่อ → **เข้าห้องด้วยรหัส**
3. เครื่องที่ 2 กด **ขอเข้าเล่น** → เครื่องแรก (Admin) ต้องเด้งคำขอขึ้นมาภายใน 1-2 วินาที
4. หน้าตั้งค่าต้องขึ้นป้าย **☁️ ข้ามเครื่อง**

ถ้าไม่ขึ้น ลองดูตารางแก้ปัญหาข้างล่าง

---

## แก้ปัญหา

| อาการ | สาเหตุ / วิธีแก้ |
|---|---|
| ขึ้น "ยังไม่ได้ตั้งค่า Supabase" | ยังไม่ได้ใส่ค่าในขั้นที่ 2 หรือใส่แล้วแต่ยังเปิดไฟล์เก่าอยู่ (กด Ctrl+Shift+R) |
| ขึ้น `relation "pk_events" does not exist` | ยังไม่ได้รัน `supabase-schema.sql` หรือรันผิด project |
| เข้าห้องได้แต่**ไม่อัปเดตสด** ต้องรีเฟรชเอง | Realtime ยังไม่เปิด — รันบล็อกท้ายของ `supabase-schema.sql` ซ้ำ หรือไปที่ Database → Replication แล้วเปิด `pk_events` |
| "ไม่พบห้องนี้" ทั้งที่รหัสถูก | อีกเครื่องยังอยู่โหมด 💻 เครื่องนี้ · หรือคนละ Supabase project กัน |
| ส่งข้อมูลไม่สำเร็จ / RLS error | policy ไม่ถูกสร้าง — รัน `supabase-schema.sql` ใหม่ทั้งไฟล์ |
| ทุกอย่างหายหลังปิดเว็บ | ยังอยู่โหมด 💻 เครื่องนี้ (เก็บใน localStorage) — ต้องเปลี่ยนเป็นโหมดข้ามเครื่อง |

---

## ข้อควรรู้เรื่องความปลอดภัย

- ใครก็ตามที่มี **ลิงก์เว็บ** จะอ่าน/เขียนตาราง `pk_events` ได้ (ไม่มีระบบล็อกอิน)
  → เดาห้องคนอื่นได้ถ้ารู้รหัส 6 หลัก · เหมาะกับเล่นกับเพื่อน **ไม่ควรใช้กับเงินจริงจำนวนมาก**
- แต่ **แก้/ลบ event ไม่ได้** เพราะไม่มี policy สำหรับ update/delete
  → ประวัติธุรกรรมย้อนหลังเชื่อถือได้ ใครโกงจะเห็นใน ledger
- ถ้าอยากปลอดภัยขึ้น: เปิด Supabase Auth (anonymous sign-in) แล้วเปลี่ยน policy เป็น
  `using (auth.uid() is not null)` — ต้องแก้โค้ดฝั่งแอปเพิ่ม
- โควตาฟรีของ Supabase (500MB + 200 concurrent realtime) เกินพอสำหรับวงเพื่อนหลายสิบวง
