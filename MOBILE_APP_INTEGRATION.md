# 📱 Mobil Uygulama Entegrasyon Rehberi

## ✅ Aynı Supabase Projesini Kullanın

**Önemli:** Web ve mobil uygulama **aynı Supabase projesini** kullanmalıdır.

### Neden Aynı Proje?

1. **Tek Kullanıcı Sistemi**
   - Web'de kayıt olan kullanıcı mobilde de giriş yapabilir
   - Mobilde kayıt olan kullanıcı web'de de giriş yapabilir
   - Tek authentication sistemi

2. **Tek Veritabanı**
   - Properties, users, favorites, messages aynı
   - Web'de eklenen property mobilde görünür
   - Mobilde eklenen favorite web'de görünür

3. **Tek Storage**
   - Property images aynı bucket'tan servis edilir
   - Avatar upload'ları her iki platformda görünür

4. **Kolay Yönetim**
   - Tek yerden database yönetimi
   - Tek yerden user yönetimi
   - Tek yerden storage yönetimi

---

## 🔧 Mobil Uygulama Kurulumu

### 1. Environment Variables

Mobil uygulamada aynı Supabase credentials'ları kullanın:

```env
# React Native / Expo
SUPABASE_URL=https://hfsdvopvsttqcildsyvi.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

### 2. Supabase Client Kurulumu

```bash
# React Native
npm install @supabase/supabase-js

# Expo
npx expo install @supabase/supabase-js
```

### 3. Supabase Client Oluşturma

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## 📊 Paylaşılan Database Schema

### Tables
- ✅ `properties` - Tüm property'ler
- ✅ `users` - Kullanıcılar (web + mobil)
- ✅ `admin_users` - Admin kullanıcılar
- ✅ `favorites` - Kullanıcı favorileri
- ✅ `messages` - Mesajlar
- ✅ `password_reset_tokens` - Password reset token'ları

### Storage Buckets
- ✅ `property-images` - Property fotoğrafları

---

## 🔐 Authentication

### Web ve Mobil Aynı Authentication

1. **Login**
   - Web: `/api/auth/login` veya Supabase Auth
   - Mobil: Supabase Auth veya custom API

2. **Register**
   - Web: `/api/auth/register`
   - Mobil: Aynı endpoint veya Supabase Auth

3. **Password Reset**
   - Web: `/forgot-password` → `/reset-password`
   - Mobil: Aynı flow

---

## 📱 Mobil Uygulama Özellikleri

### Önerilen Özellikler

1. **Property Listing**
   - Properties listesi
   - Filter ve search
   - Map view

2. **Property Details**
   - Detay sayfası
   - Image gallery
   - Contact form

3. **User Dashboard**
   - My properties
   - Favorites
   - Messages
   - Profile

4. **Authentication**
   - Login/Register
   - Password reset
   - Profile management

---

## 🚀 API Endpoints

Mobil uygulama aynı API endpoints'leri kullanabilir:

- `GET /api/properties` - Property listesi
- `GET /api/properties/[id]` - Property detayı
- `POST /api/favorites` - Favorite ekle
- `GET /api/favorites` - Favorileri getir
- `POST /api/auth/register` - Kayıt
- `POST /api/auth/login` - Giriş

**Not:** API routes Next.js'de olduğu için mobil uygulama direkt Supabase client kullanmalı veya API'yi public endpoint olarak expose etmelisiniz.

---

## ⚠️ Önemli Notlar

1. **RLS Policies**
   - Supabase Row Level Security policies her iki platform için geçerli
   - Mobil uygulama için de aynı policies kullanılır

2. **Storage Policies**
   - Storage bucket policies her iki platform için geçerli
   - Public read, authenticated write

3. **Rate Limiting**
   - API rate limiting her iki platform için geçerli
   - IP-based veya user-based

4. **Environment Variables**
   - Web: `.env.local`
   - Mobil: `.env` veya config file
   - **Aynı credentials kullanılmalı**

---

## 📝 Checklist

- [ ] Aynı Supabase projesi kullanılıyor
- [ ] Aynı environment variables
- [ ] Aynı database schema
- [ ] Aynı storage buckets
- [ ] Aynı authentication flow
- [ ] RLS policies test edildi
- [ ] Storage policies test edildi

---

## 🎯 Sonuç

**Tek Supabase projesi kullanın!** Bu sayede:
- ✅ Kullanıcılar her iki platformda aynı
- ✅ Data senkronize
- ✅ Kolay yönetim
- ✅ Daha az maliyet

