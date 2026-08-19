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

## ขั้นที่ 2 · ใส่ค่าลงในแอป

เปิด [`app.html`](app.html) ด้วย Notepad หรือ VS Code หาบรรทัดที่ **ขึ้นต้นไฟล์ ~บรรทัด 190**

```js
const SUPABASE_URL      = "";   // เช่น "https://xxxxxxxx.supabase.co"
const SUPABASE_ANON_KEY = "";   // anon public key
```

เติมค่าจากขั้นที่ 1 ลงไประหว่างเครื่องหมายคำพูด แล้วบันทึก

```js
const SUPABASE_URL      = "https://abcdefghijkl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6...";
```

> ใส่ค่าตรงนี้แล้ว **ทุกคนที่เปิดเว็บจะอยู่โหมดข้ามเครื่องทันที** ไม่ต้องตั้งค่าอะไรอีก
> ถ้าไม่อยากแก้ไฟล์ ข้ามขั้นนี้ได้ — แล้วให้แต่ละคนกรอกเองที่ปุ่ม "ตั้งค่าการเชื่อมต่อข้ามเครื่อง" ในหน้าแรก

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
| [`vercel.json`](vercel.json) | ตั้งให้เปิดหน้าแรก `/` แล้วเจอ `app.html` เลย + ปิด cache กันเห็นเวอร์ชันเก่า |
| `.vercelignore` | กันไม่ให้เอกสารออกแบบ (`*.md`, `*.sql`, ม็อกอัพ) ขึ้นเว็บสาธารณะ |
| [`supabase-schema.sql`](supabase-schema.sql) | สคริปต์สร้างตาราง + สิทธิ์ + เปิด Realtime |

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
