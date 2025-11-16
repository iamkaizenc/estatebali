# 🚀 GitHub Repository Kurulum Rehberi

## Adım 1: GitHub'da Repository Oluştur

1. [GitHub.com](https://github.com) adresine git
2. Sağ üstteki **"+"** butonuna tıkla → **"New repository"**
3. Repository bilgilerini doldur:
   - **Repository name:** `estatebali` (veya istediğiniz isim)
   - **Description:** `Bali's Premier Real Estate Platform - Next.js 14 + Supabase`
   - **Visibility:** Public veya Private (tercihinize göre)
   - **Initialize repository:** ❌ Boş bırak (README, .gitignore, license ekleme)
4. **"Create repository"** butonuna tıkla

## Adım 2: Remote Repository Ekle ve Push

Terminal'de şu komutları çalıştır:

```bash
# GitHub'da oluşturduğunuz repository URL'ini kullanın
# Örnek: https://github.com/kullaniciadi/estatebali.git

git remote add origin https://github.com/KULLANICI_ADI/REPO_ADI.git
git branch -M main
git push -u origin main
```

**Not:** `KULLANICI_ADI` ve `REPO_ADI` kısımlarını kendi bilgilerinizle değiştirin.

## Alternatif: SSH ile Push

Eğer SSH key'iniz varsa:

```bash
git remote add origin git@github.com:KULLANICI_ADI/REPO_ADI.git
git branch -M main
git push -u origin main
```

## ✅ Kontrol

Push işlemi tamamlandıktan sonra:

```bash
git remote -v
git status
```

## 📝 Önemli Notlar

- ✅ `.env.local` dosyası `.gitignore`'da (güvenlik için)
- ✅ `.next` klasörü ignore ediliyor
- ✅ `node_modules` ignore ediliyor
- ⚠️ Environment variables'ı GitHub Secrets'a eklemeyi unutmayın (eğer CI/CD kullanacaksanız)

## 🔐 GitHub Secrets (Opsiyonel - CI/CD için)

Eğer GitHub Actions kullanacaksanız, repository'de:
1. **Settings** → **Secrets and variables** → **Actions**
2. Şu secrets'ları ekleyin:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

