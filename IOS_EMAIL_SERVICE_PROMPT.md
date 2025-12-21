# 📧 iOS Uygulaması için Email Servisleri Kurulum Prompt'u

## ✅ CURSOR MASTER PROMPT
*(EstateBali iOS App – Email Service Integration)*

```text
You are working inside the EstateBali iOS application (React Native/Expo).

GOAL: Integrate email services (Resend/SendGrid) into the iOS app by connecting to the existing backend API endpoints. The iOS app should NOT call Resend/SendGrid APIs directly - it should use the backend API routes for security.

================================================
STEP 0 — REPO & BACKEND CHECK (DO NOT SKIP)
================================================

1) Verify backend API endpoints exist:
   - POST /api/auth/forgot-password (sends password reset email)
   - POST /api/auth/reset-password (resets password with token)
   - POST /api/test-email (optional, for testing)

2) Verify backend email service configuration:
   - Backend uses Resend API (RESEND_API_KEY)
   - Backend uses SendGrid as fallback (SENDGRID_API_KEY)
   - FROM_EMAIL environment variable configured
   - Email templates exist in backend (src/lib/email.ts)

3) Check iOS app structure:
   - Identify API client/service files
   - Find authentication-related screens/components
   - Locate environment variable configuration (app.config.js, eas.json, .env)

================================================
STEP 1 — CREATE EMAIL SERVICE CLIENT
================================================

CREATE: services/emailService.ts (or similar)

```typescript
/**
 * Email service client for iOS app
 * Connects to backend API endpoints (does NOT call Resend/SendGrid directly)
 */

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://estatebali.app/api';

interface SendPasswordResetEmailParams {
  email: string;
}

interface ResetPasswordParams {
  token: string;
  password: string;
}

interface EmailResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export const emailService = {
  /**
   * Request password reset email
   * Calls: POST /api/auth/forgot-password
   */
  async sendPasswordResetEmail(params: SendPasswordResetEmailParams): Promise<EmailResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: params.email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to send password reset email',
        };
      }

      return {
        success: true,
        message: data.message || 'Password reset email sent successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error. Please check your connection.',
      };
    }
  },

  /**
   * Reset password with token
   * Calls: POST /api/auth/reset-password
   */
  async resetPassword(params: ResetPasswordParams): Promise<EmailResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: params.token,
          password: params.password,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to reset password',
        };
      }

      return {
        success: true,
        message: data.message || 'Password reset successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error. Please check your connection.',
      };
    }
  },

  /**
   * Test email service (optional, for debugging)
   * Calls: POST /api/test-email
   */
  async testEmail(email: string, type: 'welcome' | 'password-reset' | 'custom' = 'welcome'): Promise<EmailResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/test-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, type }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to send test email',
        };
      }

      return {
        success: true,
        message: data.message || 'Test email sent successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error',
      };
    }
  },
};
```

================================================
STEP 2 — UPDATE FORGOT PASSWORD SCREEN
================================================

UPDATE: screens/ForgotPasswordScreen.tsx (or similar)

- Import emailService from services/emailService
- Replace any mock/placeholder email sending logic
- Use emailService.sendPasswordResetEmail()
- Show proper loading states
- Display success/error messages
- Handle network errors gracefully

Example integration:
```typescript
import { emailService } from '@/services/emailService';

const handleForgotPassword = async (email: string) => {
  setLoading(true);
  setError('');
  
  const result = await emailService.sendPasswordResetEmail({ email });
  
  if (result.success) {
    setSuccess(result.message || 'Password reset email sent!');
    // Navigate to success screen or show message
  } else {
    setError(result.error || 'Failed to send email');
  }
  
  setLoading(false);
};
```

================================================
STEP 3 — UPDATE RESET PASSWORD SCREEN
================================================

UPDATE: screens/ResetPasswordScreen.tsx (or similar)

- Import emailService from services/emailService
- Use emailService.resetPassword() when user submits new password
- Handle token from deep link or navigation params
- Show proper loading states
- Display success/error messages
- Navigate to login screen on success

Example integration:
```typescript
import { emailService } from '@/services/emailService';

const handleResetPassword = async (token: string, password: string) => {
  setLoading(true);
  setError('');
  
  const result = await emailService.resetPassword({ token, password });
  
  if (result.success) {
    setSuccess(result.message || 'Password reset successfully!');
    // Navigate to login screen after delay
    setTimeout(() => {
      navigation.navigate('Login');
    }, 2000);
  } else {
    setError(result.error || 'Failed to reset password');
  }
  
  setLoading(false);
};
```

================================================
STEP 4 — ENVIRONMENT VARIABLES
================================================

UPDATE: app.config.js or eas.json

Add environment variable:
```javascript
{
  "expo": {
    "extra": {
      "apiUrl": process.env.EXPO_PUBLIC_API_URL || "https://estatebali.app/api"
    }
  }
}
```

Or in .env file:
```
EXPO_PUBLIC_API_URL=https://estatebali.app/api
```

IMPORTANT:
- iOS app does NOT need RESEND_API_KEY or SENDGRID_API_KEY
- iOS app does NOT need FROM_EMAIL
- All email sending happens on backend
- iOS app only needs API_BASE_URL to connect to backend

================================================
STEP 5 — DEEP LINK HANDLING
================================================

If reset password link opens in iOS app:

UPDATE: App.tsx or navigation setup

Handle deep link: `estatebali://reset-password?token=xxx`

Example:
```typescript
import { Linking } from 'react-native';

useEffect(() => {
  const handleDeepLink = (url: string) => {
    if (url.includes('reset-password')) {
      const token = extractTokenFromUrl(url);
      navigation.navigate('ResetPassword', { token });
    }
  };

  Linking.addEventListener('url', ({ url }) => handleDeepLink(url));
  
  // Check if app was opened via deep link
  Linking.getInitialURL().then((url) => {
    if (url) handleDeepLink(url);
  });
}, []);
```

================================================
STEP 6 — ERROR HANDLING & UX
================================================

- Show loading spinner during email sending
- Display clear success messages
- Show user-friendly error messages
- Handle network errors (offline, timeout)
- Validate email format before sending
- Rate limiting handled by backend (no need in iOS)

================================================
STEP 7 — TESTING
================================================

Test scenarios:
1. ✅ Forgot password → Email sent successfully
2. ✅ Invalid email → Error message shown
3. ✅ Network error → Graceful error handling
4. ✅ Reset password with valid token → Success
5. ✅ Reset password with invalid token → Error message
6. ✅ Deep link opens reset password screen

================================================
OUTPUT TO ME:
============
- Confirmation each step completed
- File paths created/modified
- Environment variables needed
- Any iOS-specific considerations
- Testing checklist
```

---

## 📝 ÖNEMLİ NOTLAR

### ✅ iOS App YAPMASI GEREKENLER:
- Backend API endpoint'lerini çağırmak (`/api/auth/forgot-password`, `/api/auth/reset-password`)
- Email service client oluşturmak
- Forgot password ve reset password ekranlarını güncellemek
- Deep link handling eklemek (opsiyonel)

### ❌ iOS App YAPMAMASI GEREKENLER:
- Resend API'yi direkt çağırmak (güvenlik riski)
- SendGrid API'yi direkt çağırmak (güvenlik riski)
- API key'leri iOS app'e eklemek (güvenlik riski)
- Email template'leri iOS app'te oluşturmak (backend'de zaten var)

### 🔐 GÜVENLİK:
- Tüm email gönderimi backend üzerinden yapılmalı
- API key'ler sadece backend'de olmalı
- iOS app sadece API endpoint'lerini çağırmalı
- Token validation backend'de yapılıyor (zaten var)

### 🔗 BACKEND API ENDPOINTS:
- `POST /api/auth/forgot-password` - Şifre sıfırlama email'i gönderir
- `POST /api/auth/reset-password` - Token ile şifreyi sıfırlar
- `POST /api/test-email` - Test email gönderir (opsiyonel)

### 📱 ENVIRONMENT VARIABLES:
iOS app için sadece şu gerekli:
- `EXPO_PUBLIC_API_URL` (veya benzeri) - Backend API URL'i

iOS app için GEREKMEYEN:
- `RESEND_API_KEY` ❌
- `SENDGRID_API_KEY` ❌
- `FROM_EMAIL` ❌

---

## 🚀 HAZIR PROMPT (Copy-Paste Ready)

Yukarıdaki "CURSOR MASTER PROMPT" bölümünü direkt Cursor'a yapıştırabilirsin. Tüm adımlar ve kod örnekleri dahil.
