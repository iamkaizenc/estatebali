# Row Level Security (RLS) Policies - Supabase

Bu dokümantasyon, projede kullanılan Supabase tabloları için gerekli RLS policy'lerini açıklar.

## Önemli Not

**Service Role Key (`SUPABASE_SERVICE_ROLE_KEY`) kullanıldığında RLS policy'ler BYPASS edilir.**

Tüm API route'larımız `supabaseAdmin` (service role) kullanıyor, bu yüzden RLS policy'ler otomatik olarak bypass edilir. Ancak eğer hala RLS hatası alıyorsanız:

1. Service role key'in doğru olduğundan emin olun
2. Supabase Dashboard'da RLS'in doğru yapılandırıldığını kontrol edin
3. Aşağıdaki policy'leri oluşturun (eğer anon client kullanılacaksa)

## Tablolar ve Gerekli Policy'ler

### 1. `users` Tablosu

**INSERT Policy:**
```sql
-- Eğer anon client kullanılacaksa (şu an kullanmıyoruz)
CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT
  WITH CHECK (true); -- Veya daha kısıtlayıcı: auth.uid() = id

-- Service role kullanıldığında gerekmez (otomatik bypass)
```

**SELECT Policy:**
```sql
-- Kullanıcılar kendi profillerini görebilir
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Admin'ler tüm kullanıcıları görebilir
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.active = true
    )
  );
```

**UPDATE Policy:**
```sql
-- Kullanıcılar kendi profillerini güncelleyebilir
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
```

### 2. `properties` Tablosu

**INSERT Policy:**
```sql
-- Kullanıcılar kendi property'lerini ekleyebilir
CREATE POLICY "Users can insert own properties" ON properties
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Service role kullanıldığında gerekmez (otomatik bypass)
```

**SELECT Policy:**
```sql
-- Herkes tüm property'leri görebilir (public listing)
CREATE POLICY "Anyone can view properties" ON properties
  FOR SELECT
  USING (true);

-- Veya sadece available olanları:
CREATE POLICY "Anyone can view available properties" ON properties
  FOR SELECT
  USING (available = true);
```

**UPDATE Policy:**
```sql
-- Kullanıcılar kendi property'lerini güncelleyebilir
CREATE POLICY "Users can update own properties" ON properties
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admin'ler tüm property'leri güncelleyebilir
CREATE POLICY "Admins can update all properties" ON properties
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.active = true
    )
  );
```

**DELETE Policy:**
```sql
-- Kullanıcılar kendi property'lerini silebilir
CREATE POLICY "Users can delete own properties" ON properties
  FOR DELETE
  USING (auth.uid() = user_id);
```

### 3. `favorites` Tablosu

**INSERT Policy:**
```sql
-- Kullanıcılar kendi favorite'lerini ekleyebilir
CREATE POLICY "Users can insert own favorites" ON favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Service role kullanıldığında gerekmez (otomatik bypass)
```

**SELECT Policy:**
```sql
-- Kullanıcılar sadece kendi favorite'lerini görebilir
CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT
  USING (auth.uid() = user_id);
```

**DELETE Policy:**
```sql
-- Kullanıcılar kendi favorite'lerini silebilir
CREATE POLICY "Users can delete own favorites" ON favorites
  FOR DELETE
  USING (auth.uid() = user_id);
```

### 4. `password_reset_tokens` Tablosu

**INSERT Policy:**
```sql
-- Service role tarafından insert edilir (RLS bypass)
-- Eğer anon client kullanılacaksa:
CREATE POLICY "Service role can insert reset tokens" ON password_reset_tokens
  FOR INSERT
  WITH CHECK (true);
```

**SELECT Policy:**
```sql
-- Token'ı bilen herkes görebilir (token kontrolü için)
CREATE POLICY "Anyone can view reset tokens" ON password_reset_tokens
  FOR SELECT
  USING (true);
```

**UPDATE Policy:**
```sql
-- Token kullanıldığında işaretlenir
CREATE POLICY "Service role can update reset tokens" ON password_reset_tokens
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
```

## Mevcut Durum

✅ **Tüm API route'lar `supabaseAdmin` (service role) kullanıyor**
- `src/app/api/auth/register/route.ts` - users tablosuna insert
- `src/app/api/auth/forgot-password/route.ts` - password_reset_tokens tablosuna insert
- `src/app/api/properties/route.ts` - properties tablosuna insert
- `src/app/api/favorites/route.ts` - favorites tablosuna insert

✅ **Service role RLS'i otomatik bypass eder**

⚠️ **Eğer hala RLS hatası alıyorsanız:**
1. `SUPABASE_SERVICE_ROLE_KEY` environment variable'ının doğru olduğundan emin olun
2. Supabase Dashboard → Settings → API → Service Role Key'i kontrol edin
3. `supabaseAdmin` client'ının doğru oluşturulduğundan emin olun (`src/lib/supabaseAdmin.ts`)

## Policy Oluşturma Komutları

Supabase SQL Editor'de çalıştırabilirsiniz:

```sql
-- Önce RLS'i etkinleştir
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Sonra yukarıdaki policy'leri oluşturun
```

## Notlar

- Service role kullanıldığında RLS policy'ler otomatik olarak bypass edilir
- Anon client kullanıldığında RLS policy'ler aktif olur
- Şu anda tüm API route'lar service role kullanıyor, bu yüzden RLS policy'ler gerekmez
- Ancak gelecekte anon client kullanılabilir, bu yüzden policy'leri hazır tutmak iyi bir pratiktir

