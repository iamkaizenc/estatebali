# Admin User Setup

## Sorun

RLS policy'leri `users.role = 'admin'` kontrolü yapıyor, ama:
- `admin_users` tablosunda admin var
- `users` tablosunda `role='admin'` olan yok

## Çözüm

Admin kullanıcını `users` tablosunda `role='admin'` yap:

```sql
-- Admin email'ini bul
SELECT email FROM admin_users WHERE active = true LIMIT 1;

-- Users tablosunda bu email'i bul ve admin yap
UPDATE users 
SET role = 'admin' 
WHERE email = 'admin@estatebali.app';

-- Doğrula
SELECT id, email, role 
FROM users 
WHERE role = 'admin';
```

## Önemli Not

- RLS policy'leri `users.role = 'admin'` kontrol ediyor
- Service role key kullanıldığında RLS bypass edilir (şu anki durum)
- Ama gelecekte normal client kullanmak istersen admin user'ın `role='admin'` olması lazım

