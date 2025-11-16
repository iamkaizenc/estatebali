# 🚀 GitHub'a Push Etme Rehberi

## Durum
✅ Git commit tamamlandı
✅ GitHub CLI yüklü
⏳ GitHub authentication gerekli

## Seçenek 1: GitHub CLI ile (Otomatik)

### Adım 1: Authentication
```bash
gh auth login
```
- GitHub.com seçin
- Web browser ile giriş yapın
- Authentication tamamlandıktan sonra devam edin

### Adım 2: Repository Oluştur ve Push
```bash
cd /Users/kaizen/estatebali
gh repo create estatebali --public --source=. --remote=origin --push
```

Bu komut:
- GitHub'da `estatebali` adında public repository oluşturur
- Mevcut local repository'yi remote olarak ekler
- Tüm commit'leri push eder

## Seçenek 2: Manuel (GitHub Web UI)

### Adım 1: GitHub'da Repository Oluştur
1. https://github.com/new adresine git
2. Repository name: `estatebali`
3. Description: `Bali's Premier Real Estate Platform - Next.js 14 + Supabase`
4. Public veya Private seçin
5. **Initialize repository:** ❌ Boş bırak (README, .gitignore, license ekleme)
6. **Create repository** butonuna tıkla

### Adım 2: Remote Ekle ve Push
```bash
cd /Users/kaizen/estatebali

# Repository URL'inizi kullanın (örnek):
git remote add origin https://github.com/KULLANICI_ADI/estatebali.git

# Veya SSH ile:
git remote add origin git@github.com:KULLANICI_ADI/estatebali.git

# Push et:
git branch -M main
git push -u origin main
```

## ✅ Kontrol
```bash
git remote -v
git status
```

## 📝 Notlar
- `.env.local` dosyası `.gitignore`'da (güvenlik için commit edilmeyecek)
- `.next` ve `node_modules` ignore ediliyor
- Environment variables GitHub'a push edilmeyecek (güvenlik)
