import { Locale, defaultLocale } from './config';

/**
 * Comprehensive i18n messages structure for Estate Bali
 * Supports: English (en), Indonesian (id), Hebrew (he), Arabic (ar), Chinese (zh)
 */

export interface Messages {
  // Common/Global
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    view: string;
    back: string;
    next: string;
    previous: string;
    search: string;
    filter: string;
    sort: string;
    clear: string;
    apply: string;
    submit: string;
    confirm: string;
    close: string;
    yes: string;
    no: string;
    all: string;
    none: string;
    more: string;
    less: string;
  };

  // Navigation
  nav: {
    home: string;
    properties: string;
    buy: string;
    rent: string;
    featured: string;
    agents: string;
    about: string;
    contact: string;
    login: string;
    register: string;
    dashboard: string;
    logout: string;
    profile: string;
    myProperties: string;
    favorites: string;
    savedSearches: string;
    messages: string;
    notifications: string;
    settings: string;
  };

  // Hero Section
  hero: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    searchButton: string;
    aiTranslatedNotice: string;
  };

  // Property Related
  property: {
    // Types
    types: {
      villa: string;
      apartment: string;
      house: string;
      land: string;
      commercial: string;
      penthouse: string;
      studio: string;
    };
    // Listing types
    listingTypes: {
      sale: string;
      rent: string;
      both: string;
    };
    // Status
    status: {
      available: string;
      pending: string;
      sold: string;
      rented: string;
    };
    // Details
    details: {
      bedrooms: string;
      bathrooms: string;
      area: string;
      price: string;
      location: string;
      description: string;
      amenities: string;
      features: string;
      yearBuilt: string;
      parking: string;
      furnished: string;
      poolSize: string;
      landSize: string;
      buildingSize: string;
    };
    // Amenities
    amenities: {
      pool: string;
      gym: string;
      garden: string;
      parking: string;
      security: string;
      wifi: string;
      airConditioning: string;
      kitchen: string;
      balcony: string;
      terrace: string;
      elevator: string;
      storage: string;
      laundry: string;
      petFriendly: string;
      beachAccess: string;
      oceanView: string;
      mountainView: string;
      riceFieldView: string;
    };
    // Areas
    areas: {
      ubud: string;
      canggu: string;
      seminyak: string;
      sanur: string;
      uluwatu: string;
      nusaDua: string;
      jimbaran: string;
      kuta: string;
      denpasar: string;
      tabanan: string;
    };
    // Actions
    actions: {
      viewDetails: string;
      contactAgent: string;
      scheduleViewing: string;
      saveProperty: string;
      shareProperty: string;
      reportProperty: string;
      bookNow: string;
      requestInfo: string;
      compareProperties: string;
    };
    // Messages
    messages: {
      noProperties: string;
      loadingProperties: string;
      errorLoading: string;
      savedSuccess: string;
      savedError: string;
      favoriteAdded: string;
      favoriteRemoved: string;
    };
  };

  // Search & Filters
  search: {
    title: string;
    placeholder: string;
    filters: {
      priceRange: string;
      priceMin: string;
      priceMax: string;
      propertyType: string;
      listingType: string;
      location: string;
      bedrooms: string;
      bathrooms: string;
      areaSize: string;
      amenities: string;
      sortBy: string;
    };
    sorting: {
      newest: string;
      oldest: string;
      priceLowToHigh: string;
      priceHighToLow: string;
      areaLargeToSmall: string;
      areaSmallToLarge: string;
    };
    results: {
      showing: string;
      of: string;
      properties: string;
      noResults: string;
      refineSearch: string;
    };
  };

  // Authentication
  auth: {
    login: {
      title: string;
      subtitle: string;
      email: string;
      password: string;
      remember: string;
      forgotPassword: string;
      submit: string;
      noAccount: string;
      registerLink: string;
      errors: {
        invalidCredentials: string;
        emailRequired: string;
        passwordRequired: string;
        networkError: string;
      };
    };
    register: {
      title: string;
      subtitle: string;
      name: string;
      email: string;
      phone: string;
      password: string;
      confirmPassword: string;
      agreeTerms: string;
      submit: string;
      haveAccount: string;
      loginLink: string;
      errors: {
        nameRequired: string;
        emailRequired: string;
        emailInvalid: string;
        passwordRequired: string;
        passwordTooShort: string;
        passwordsNoMatch: string;
        termsRequired: string;
      };
    };
    forgotPassword: {
      title: string;
      subtitle: string;
      email: string;
      submit: string;
      backToLogin: string;
      success: string;
      error: string;
    };
    resetPassword: {
      title: string;
      subtitle: string;
      newPassword: string;
      confirmPassword: string;
      submit: string;
      success: string;
      error: string;
      invalidToken: string;
      tokenExpired: string;
    };
  };

  // User Dashboard
  dashboard: {
    title: string;
    welcome: string;
    overview: {
      title: string;
      myProperties: string;
      favorites: string;
      savedSearches: string;
      messages: string;
      bookings: string;
    };
    profile: {
      title: string;
      personalInfo: string;
      contactInfo: string;
      preferences: string;
      updateSuccess: string;
      updateError: string;
    };
    bookings: {
      title: string;
      upcoming: string;
      past: string;
      cancelled: string;
      noBookings: string;
      viewDetails: string;
      cancelBooking: string;
      cancelSuccess: string;
      cancelError: string;
    };
    favorites: {
      title: string;
      noFavorites: string;
      removeSuccess: string;
      removeError: string;
    };
    messages: {
      title: string;
      noMessages: string;
      compose: string;
      reply: string;
      delete: string;
      markRead: string;
      markUnread: string;
    };
    notifications: {
      title: string;
      noNotifications: string;
      markAllRead: string;
      clearAll: string;
    };
    settings: {
      title: string;
      language: string;
      currency: string;
      timezone: string;
      emailNotifications: string;
      pushNotifications: string;
      newsletter: string;
      changePassword: string;
      deleteAccount: string;
      saveSuccess: string;
      saveError: string;
    };
  };

  // Booking
  booking: {
    title: string;
    checkIn: string;
    checkOut: string;
    guests: string;
    adults: string;
    children: string;
    infants: string;
    specialRequests: string;
    guestDetails: {
      title: string;
      name: string;
      email: string;
      phone: string;
    };
    pricing: {
      title: string;
      nightlyRate: string;
      nights: string;
      subtotal: string;
      serviceFee: string;
      taxes: string;
      total: string;
    };
    payment: {
      title: string;
      method: string;
      cardNumber: string;
      expiryDate: string;
      cvv: string;
      billingAddress: string;
    };
    confirmation: {
      title: string;
      thankYou: string;
      bookingNumber: string;
      emailSent: string;
      viewBooking: string;
    };
    errors: {
      invalidDates: string;
      propertyUnavailable: string;
      paymentFailed: string;
      bookingFailed: string;
    };
  };

  // Contact
  contact: {
    title: string;
    subtitle: string;
    form: {
      name: string;
      email: string;
      phone: string;
      subject: string;
      message: string;
      submit: string;
      sending: string;
    };
    info: {
      address: string;
      email: string;
      phone: string;
      hours: string;
    };
    success: string;
    error: string;
  };

  // About
  about: {
    title: string;
    subtitle: string;
    mission: {
      title: string;
      content: string;
    };
    vision: {
      title: string;
      content: string;
    };
    values: {
      title: string;
      integrity: string;
      excellence: string;
      innovation: string;
      customerFirst: string;
    };
    team: {
      title: string;
      subtitle: string;
    };
    stats: {
      properties: string;
      happyClients: string;
      yearsExperience: string;
      teamMembers: string;
    };
  };

  // Investment
  investment: {
    title: string;
    subtitle: string;
    whyInvest: {
      title: string;
      reasons: string[];
    };
    form: {
      title: string;
      name: string;
      email: string;
      phone: string;
      investmentAmount: string;
      investmentType: string;
      preferredLocation: string;
      message: string;
      submit: string;
    };
    types: {
      villa: string;
      apartment: string;
      land: string;
      commercial: string;
    };
    success: string;
    error: string;
  };

  // Footer
  footer: {
    tagline: string;
    quickLinks: {
      title: string;
      about: string;
      properties: string;
      agents: string;
      blog: string;
      careers: string;
      press: string;
    };
    services: {
      title: string;
      buy: string;
      rent: string;
      sell: string;
      invest: string;
      propertyManagement: string;
      consultation: string;
    };
    legal: {
      title: string;
      privacy: string;
      terms: string;
      cookies: string;
      disclaimer: string;
    };
    contact: {
      title: string;
      address: string;
      email: string;
      phone: string;
    };
    social: {
      title: string;
      followUs: string;
    };
    newsletter: {
      title: string;
      subtitle: string;
      placeholder: string;
      submit: string;
      success: string;
      error: string;
    };
    copyright: string;
  };

  // Errors
  errors: {
    general: string;
    notFound: string;
    unauthorized: string;
    forbidden: string;
    serverError: string;
    networkError: string;
    timeout: string;
    invalidInput: string;
    requiredField: string;
    tryAgain: string;
    contactSupport: string;
  };

  // Success Messages
  success: {
    saved: string;
    updated: string;
    deleted: string;
    sent: string;
    created: string;
    uploaded: string;
  };

  // Validation
  validation: {
    required: string;
    emailInvalid: string;
    phoneInvalid: string;
    passwordTooShort: string;
    passwordsNoMatch: string;
    minLength: string;
    maxLength: string;
    minValue: string;
    maxValue: string;
    invalidFormat: string;
  };
}

export type LocalizedMessages = Record<Locale, Messages>;

// Helper to get translation key
export function t(messages: Messages, key: string): string {
  const keys = key.split('.');
  let value: any = messages;

  for (const k of keys) {
    value = value?.[k];
  }

  return typeof value === 'string' ? value : key;
}

// English (default) messages
const en: Messages = {
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    clear: 'Clear',
    apply: 'Apply',
    submit: 'Submit',
    confirm: 'Confirm',
    close: 'Close',
    yes: 'Yes',
    no: 'No',
    all: 'All',
    none: 'None',
    more: 'More',
    less: 'Less',
  },

  nav: {
    home: 'Home',
    properties: 'Properties',
    buy: 'Buy',
    rent: 'Rent',
    featured: 'Featured',
    agents: 'Agents',
    about: 'About',
    contact: 'Contact',
    login: 'Login',
    register: 'Register',
    dashboard: 'Dashboard',
    logout: 'Logout',
    profile: 'Profile',
    myProperties: 'My Properties',
    favorites: 'Favorites',
    savedSearches: 'Saved Searches',
    messages: 'Messages',
    notifications: 'Notifications',
    settings: 'Settings',
  },

  hero: {
    title: 'Find Your Dream Property\\nin Bali',
    subtitle: 'Discover luxury villas, modern apartments, and prime land in paradise.\\nYour perfect property awaits.',
    searchPlaceholder: 'Search by location, property type, or keywords...',
    searchButton: 'Search Properties',
    aiTranslatedNotice: 'This section was translated by AI.',
  },

  property: {
    types: {
      villa: 'Villa',
      apartment: 'Apartment',
      house: 'House',
      land: 'Land',
      commercial: 'Commercial',
      penthouse: 'Penthouse',
      studio: 'Studio',
    },
    listingTypes: {
      sale: 'For Sale',
      rent: 'For Rent',
      both: 'Sale & Rent',
    },
    status: {
      available: 'Available',
      pending: 'Pending',
      sold: 'Sold',
      rented: 'Rented',
    },
    details: {
      bedrooms: 'Bedrooms',
      bathrooms: 'Bathrooms',
      area: 'Area',
      price: 'Price',
      location: 'Location',
      description: 'Description',
      amenities: 'Amenities',
      features: 'Features',
      yearBuilt: 'Year Built',
      parking: 'Parking',
      furnished: 'Furnished',
      poolSize: 'Pool Size',
      landSize: 'Land Size',
      buildingSize: 'Building Size',
    },
    amenities: {
      pool: 'Swimming Pool',
      gym: 'Gym',
      garden: 'Garden',
      parking: 'Parking',
      security: '24/7 Security',
      wifi: 'WiFi',
      airConditioning: 'Air Conditioning',
      kitchen: 'Fully Equipped Kitchen',
      balcony: 'Balcony',
      terrace: 'Terrace',
      elevator: 'Elevator',
      storage: 'Storage',
      laundry: 'Laundry',
      petFriendly: 'Pet Friendly',
      beachAccess: 'Beach Access',
      oceanView: 'Ocean View',
      mountainView: 'Mountain View',
      riceFieldView: 'Rice Field View',
    },
    areas: {
      ubud: 'Ubud',
      canggu: 'Canggu',
      seminyak: 'Seminyak',
      sanur: 'Sanur',
      uluwatu: 'Uluwatu',
      nusaDua: 'Nusa Dua',
      jimbaran: 'Jimbaran',
      kuta: 'Kuta',
      denpasar: 'Denpasar',
      tabanan: 'Tabanan',
    },
    actions: {
      viewDetails: 'View Details',
      contactAgent: 'Contact Agent',
      scheduleViewing: 'Schedule Viewing',
      saveProperty: 'Save Property',
      shareProperty: 'Share',
      reportProperty: 'Report',
      bookNow: 'Book Now',
      requestInfo: 'Request Info',
      compareProperties: 'Compare',
    },
    messages: {
      noProperties: 'No properties found',
      loadingProperties: 'Loading properties...',
      errorLoading: 'Error loading properties',
      savedSuccess: 'Property saved successfully',
      savedError: 'Failed to save property',
      favoriteAdded: 'Added to favorites',
      favoriteRemoved: 'Removed from favorites',
    },
  },

  search: {
    title: 'Search Properties',
    placeholder: 'Enter location, property type, or keywords',
    filters: {
      priceRange: 'Price Range',
      priceMin: 'Min Price',
      priceMax: 'Max Price',
      propertyType: 'Property Type',
      listingType: 'Listing Type',
      location: 'Location',
      bedrooms: 'Bedrooms',
      bathrooms: 'Bathrooms',
      areaSize: 'Area Size',
      amenities: 'Amenities',
      sortBy: 'Sort By',
    },
    sorting: {
      newest: 'Newest First',
      oldest: 'Oldest First',
      priceLowToHigh: 'Price: Low to High',
      priceHighToLow: 'Price: High to Low',
      areaLargeToSmall: 'Area: Large to Small',
      areaSmallToLarge: 'Area: Small to Large',
    },
    results: {
      showing: 'Showing',
      of: 'of',
      properties: 'properties',
      noResults: 'No properties found',
      refineSearch: 'Try refining your search',
    },
  },

  auth: {
    login: {
      title: 'Welcome Back',
      subtitle: 'Login to your account',
      email: 'Email Address',
      password: 'Password',
      remember: 'Remember me',
      forgotPassword: 'Forgot password?',
      submit: 'Login',
      noAccount: "Don't have an account?",
      registerLink: 'Register here',
      errors: {
        invalidCredentials: 'Invalid email or password',
        emailRequired: 'Email is required',
        passwordRequired: 'Password is required',
        networkError: 'Network error. Please try again.',
      },
    },
    register: {
      title: 'Create Account',
      subtitle: 'Join Estate Bali today',
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      agreeTerms: 'I agree to the Terms of Service and Privacy Policy',
      submit: 'Register',
      haveAccount: 'Already have an account?',
      loginLink: 'Login here',
      errors: {
        nameRequired: 'Name is required',
        emailRequired: 'Email is required',
        emailInvalid: 'Invalid email address',
        passwordRequired: 'Password is required',
        passwordTooShort: 'Password must be at least 8 characters',
        passwordsNoMatch: 'Passwords do not match',
        termsRequired: 'You must agree to the terms',
      },
    },
    forgotPassword: {
      title: 'Forgot Password',
      subtitle: "Enter your email and we'll send you a reset link",
      email: 'Email Address',
      submit: 'Send Reset Link',
      backToLogin: 'Back to login',
      success: 'Password reset email sent successfully',
      error: 'Failed to send reset email',
    },
    resetPassword: {
      title: 'Reset Password',
      subtitle: 'Enter your new password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      submit: 'Reset Password',
      success: 'Password reset successfully',
      error: 'Failed to reset password',
      invalidToken: 'Invalid or expired reset token',
      tokenExpired: 'Reset link has expired',
    },
  },

  dashboard: {
    title: 'Dashboard',
    welcome: 'Welcome back',
    overview: {
      title: 'Overview',
      myProperties: 'My Properties',
      favorites: 'Favorites',
      savedSearches: 'Saved Searches',
      messages: 'Messages',
      bookings: 'Bookings',
    },
    profile: {
      title: 'Profile',
      personalInfo: 'Personal Information',
      contactInfo: 'Contact Information',
      preferences: 'Preferences',
      updateSuccess: 'Profile updated successfully',
      updateError: 'Failed to update profile',
    },
    bookings: {
      title: 'My Bookings',
      upcoming: 'Upcoming',
      past: 'Past',
      cancelled: 'Cancelled',
      noBookings: 'You have no bookings yet',
      viewDetails: 'View Details',
      cancelBooking: 'Cancel Booking',
      cancelSuccess: 'Booking cancelled successfully',
      cancelError: 'Failed to cancel booking',
    },
    favorites: {
      title: 'Favorite Properties',
      noFavorites: 'No favorite properties yet',
      removeSuccess: 'Removed from favorites',
      removeError: 'Failed to remove from favorites',
    },
    messages: {
      title: 'Messages',
      noMessages: 'No messages',
      compose: 'Compose',
      reply: 'Reply',
      delete: 'Delete',
      markRead: 'Mark as read',
      markUnread: 'Mark as unread',
    },
    notifications: {
      title: 'Notifications',
      noNotifications: 'No notifications',
      markAllRead: 'Mark all as read',
      clearAll: 'Clear all',
    },
    settings: {
      title: 'Settings',
      language: 'Language',
      currency: 'Currency',
      timezone: 'Timezone',
      emailNotifications: 'Email Notifications',
      pushNotifications: 'Push Notifications',
      newsletter: 'Newsletter',
      changePassword: 'Change Password',
      deleteAccount: 'Delete Account',
      saveSuccess: 'Settings saved successfully',
      saveError: 'Failed to save settings',
    },
  },

  booking: {
    title: 'Book Property',
    checkIn: 'Check-in Date',
    checkOut: 'Check-out Date',
    guests: 'Guests',
    adults: 'Adults',
    children: 'Children',
    infants: 'Infants',
    specialRequests: 'Special Requests',
    guestDetails: {
      title: 'Guest Details',
      name: 'Full Name',
      email: 'Email',
      phone: 'Phone',
    },
    pricing: {
      title: 'Price Breakdown',
      nightlyRate: 'Nightly Rate',
      nights: 'nights',
      subtotal: 'Subtotal',
      serviceFee: 'Service Fee',
      taxes: 'Taxes',
      total: 'Total',
    },
    payment: {
      title: 'Payment',
      method: 'Payment Method',
      cardNumber: 'Card Number',
      expiryDate: 'Expiry Date',
      cvv: 'CVV',
      billingAddress: 'Billing Address',
    },
    confirmation: {
      title: 'Booking Confirmed',
      thankYou: 'Thank you for your booking!',
      bookingNumber: 'Booking Number',
      emailSent: 'Confirmation email sent',
      viewBooking: 'View Booking',
    },
    errors: {
      invalidDates: 'Invalid dates selected',
      propertyUnavailable: 'Property not available for selected dates',
      paymentFailed: 'Payment failed',
      bookingFailed: 'Booking failed',
    },
  },

  contact: {
    title: 'Contact Us',
    subtitle: 'Get in touch with our team',
    form: {
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      subject: 'Subject',
      message: 'Message',
      submit: 'Send Message',
      sending: 'Sending...',
    },
    info: {
      address: 'Address',
      email: 'Email',
      phone: 'Phone',
      hours: 'Business Hours',
    },
    success: 'Message sent successfully',
    error: 'Failed to send message',
  },

  about: {
    title: 'About Estate Bali',
    subtitle: 'Your trusted partner in Bali real estate',
    mission: {
      title: 'Our Mission',
      content: 'To provide exceptional real estate services and help clients find their perfect property in Bali.',
    },
    vision: {
      title: 'Our Vision',
      content: 'To be the leading real estate platform in Bali, known for excellence and integrity.',
    },
    values: {
      title: 'Our Values',
      integrity: 'Integrity',
      excellence: 'Excellence',
      innovation: 'Innovation',
      customerFirst: 'Customer First',
    },
    team: {
      title: 'Our Team',
      subtitle: 'Meet our experienced professionals',
    },
    stats: {
      properties: 'Properties',
      happyClients: 'Happy Clients',
      yearsExperience: 'Years Experience',
      teamMembers: 'Team Members',
    },
  },

  investment: {
    title: 'Investment Opportunities',
    subtitle: 'Invest in Bali real estate',
    whyInvest: {
      title: 'Why Invest in Bali?',
      reasons: [
        'Growing tourism industry',
        'Stable property market',
        'High rental yields',
        'Beautiful tropical paradise',
        'Favorable investment climate',
      ],
    },
    form: {
      title: 'Investment Inquiry',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      investmentAmount: 'Investment Amount',
      investmentType: 'Investment Type',
      preferredLocation: 'Preferred Location',
      message: 'Message',
      submit: 'Submit Inquiry',
    },
    types: {
      villa: 'Villa Development',
      apartment: 'Apartment Complex',
      land: 'Land Purchase',
      commercial: 'Commercial Property',
    },
    success: 'Investment inquiry submitted successfully',
    error: 'Failed to submit inquiry',
  },

  footer: {
    tagline: 'Your trusted partner in Bali real estate',
    quickLinks: {
      title: 'Quick Links',
      about: 'About Us',
      properties: 'Properties',
      agents: 'Our Agents',
      blog: 'Blog',
      careers: 'Careers',
      press: 'Press',
    },
    services: {
      title: 'Services',
      buy: 'Buy Property',
      rent: 'Rent Property',
      sell: 'Sell Property',
      invest: 'Investment',
      propertyManagement: 'Property Management',
      consultation: 'Consultation',
    },
    legal: {
      title: 'Legal',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      cookies: 'Cookie Policy',
      disclaimer: 'Disclaimer',
    },
    contact: {
      title: 'Contact',
      address: 'Bali, Indonesia',
      email: 'info@estatebali.com',
      phone: '+62 XXX XXX XXXX',
    },
    social: {
      title: 'Follow Us',
      followUs: 'Stay connected',
    },
    newsletter: {
      title: 'Newsletter',
      subtitle: 'Subscribe for property updates',
      placeholder: 'Enter your email',
      submit: 'Subscribe',
      success: 'Subscribed successfully',
      error: 'Subscription failed',
    },
    copyright: '© 2024 Estate Bali. All rights reserved.',
  },

  errors: {
    general: 'Something went wrong',
    notFound: 'Page not found',
    unauthorized: 'Unauthorized access',
    forbidden: 'Access forbidden',
    serverError: 'Server error',
    networkError: 'Network error',
    timeout: 'Request timeout',
    invalidInput: 'Invalid input',
    requiredField: 'This field is required',
    tryAgain: 'Please try again',
    contactSupport: 'Contact support if the problem persists',
  },

  success: {
    saved: 'Saved successfully',
    updated: 'Updated successfully',
    deleted: 'Deleted successfully',
    sent: 'Sent successfully',
    created: 'Created successfully',
    uploaded: 'Uploaded successfully',
  },

  validation: {
    required: 'This field is required',
    emailInvalid: 'Invalid email address',
    phoneInvalid: 'Invalid phone number',
    passwordTooShort: 'Password is too short',
    passwordsNoMatch: 'Passwords do not match',
    minLength: 'Minimum {min} characters required',
    maxLength: 'Maximum {max} characters allowed',
    minValue: 'Minimum value is {min}',
    maxValue: 'Maximum value is {max}',
    invalidFormat: 'Invalid format',
  },
};

// Indonesian (Bahasa Indonesia) Translation
const id: Messages = {
  common: {
    loading: 'Memuat...',
    error: 'Kesalahan',
    success: 'Berhasil',
    cancel: 'Batal',
    save: 'Simpan',
    delete: 'Hapus',
    edit: 'Edit',
    view: 'Lihat',
    back: 'Kembali',
    next: 'Berikutnya',
    previous: 'Sebelumnya',
    search: 'Cari',
    filter: 'Filter',
    sort: 'Urutkan',
    clear: 'Hapus',
    apply: 'Terapkan',
    submit: 'Kirim',
    confirm: 'Konfirmasi',
    close: 'Tutup',
    yes: 'Ya',
    no: 'Tidak',
    all: 'Semua',
    none: 'Tidak ada',
    more: 'Lebih banyak',
    less: 'Lebih sedikit',
  },

  nav: {
    home: 'Beranda',
    properties: 'Properti',
    buy: 'Beli',
    rent: 'Sewa',
    featured: 'Unggulan',
    agents: 'Agen',
    about: 'Tentang',
    contact: 'Kontak',
    login: 'Masuk',
    register: 'Daftar',
    dashboard: 'Dasbor',
    logout: 'Keluar',
    profile: 'Profil',
    myProperties: 'Properti Saya',
    favorites: 'Favorit',
    savedSearches: 'Pencarian Tersimpan',
    messages: 'Pesan',
    notifications: 'Notifikasi',
    settings: 'Pengaturan',
  },

  hero: {
    title: 'Temukan Properti Impian Anda di Bali',
    subtitle: 'Jelajahi villa, apartemen, dan properti mewah terbaik di pulau surgawi',
    searchPlaceholder: 'Cari berdasarkan lokasi, tipe properti, atau kata kunci...',
    searchButton: 'Cari Properti',
    aiTranslatedNotice: 'Konten ini diterjemahkan menggunakan AI. Untuk informasi resmi, silakan hubungi agen kami.',
  },

  property: {
    types: {
      villa: 'Villa',
      apartment: 'Apartemen',
      house: 'Rumah',
      land: 'Tanah',
      commercial: 'Komersial',
      penthouse: 'Penthouse',
      studio: 'Studio',
    },
    listingTypes: {
      sale: 'Dijual',
      rent: 'Disewakan',
      both: 'Dijual & Disewakan',
    },
    status: {
      available: 'Tersedia',
      pending: 'Tertunda',
      sold: 'Terjual',
      rented: 'Disewakan',
    },
    details: {
      bedrooms: 'Kamar Tidur',
      bathrooms: 'Kamar Mandi',
      area: 'Luas',
      price: 'Harga',
      location: 'Lokasi',
      type: 'Tipe',
      status: 'Status',
      furnished: 'Furnished',
      yearBuilt: 'Tahun Dibangun',
      parking: 'Parkir',
      lotSize: 'Luas Tanah',
      buildingSize: 'Luas Bangunan',
      pricePerSqm: 'Harga per m²',
    },
    amenities: {
      pool: 'Kolam Renang',
      gym: 'Gym',
      garden: 'Taman',
      garage: 'Garasi',
      security: 'Keamanan 24 Jam',
      airConditioning: 'AC',
      balcony: 'Balkon',
      terrace: 'Teras',
      oceanView: 'Pemandangan Laut',
      riceFieldView: 'Pemandangan Sawah',
      mountainView: 'Pemandangan Gunung',
      beachAccess: 'Akses Pantai',
      elevator: 'Lift',
      storage: 'Ruang Penyimpanan',
      laundry: 'Laundry',
      kitchen: 'Dapur',
      internet: 'Internet/WiFi',
      parking: 'Parkir',
    },
    areas: {
      ubud: 'Ubud',
      canggu: 'Canggu',
      seminyak: 'Seminyak',
      sanur: 'Sanur',
      nusaDua: 'Nusa Dua',
      jimbaran: 'Jimbaran',
      uluwatu: 'Uluwatu',
      denpasar: 'Denpasar',
      kuta: 'Kuta',
      legian: 'Legian',
    },
    actions: {
      viewDetails: 'Lihat Detail',
      contactAgent: 'Hubungi Agen',
      scheduleViewing: 'Jadwalkan Kunjungan',
      saveProperty: 'Simpan Properti',
      shareProperty: 'Bagikan Properti',
      reportListing: 'Laporkan Listing',
      calculateMortgage: 'Hitung KPR',
      requestInfo: 'Minta Informasi',
      bookViewing: 'Pesan Kunjungan',
    },
    messages: {
      noProperties: 'Tidak ada properti ditemukan',
      loadingProperties: 'Memuat properti...',
      errorLoading: 'Gagal memuat properti',
      savedSuccessfully: 'Properti berhasil disimpan',
      removedFromFavorites: 'Dihapus dari favorit',
      contactSent: 'Pesan Anda telah dikirim',
      viewingScheduled: 'Kunjungan Anda telah dijadwalkan',
    },
  },

  search: {
    filters: {
      title: 'Filter',
      priceRange: 'Rentang Harga',
      minPrice: 'Harga Minimum',
      maxPrice: 'Harga Maksimum',
      bedrooms: 'Kamar Tidur',
      bathrooms: 'Kamar Mandi',
      propertyType: 'Tipe Properti',
      listingType: 'Tipe Listing',
      area: 'Area/Lokasi',
      amenities: 'Fasilitas',
      furnished: 'Status Furnished',
      keywords: 'Kata Kunci',
    },
    sorting: {
      title: 'Urutkan berdasarkan',
      newest: 'Terbaru',
      oldest: 'Terlama',
      priceLowToHigh: 'Harga: Rendah ke Tinggi',
      priceHighToLow: 'Harga: Tinggi ke Rendah',
      areaLargeToSmall: 'Luas: Besar ke Kecil',
      areaSmallToLarge: 'Luas: Kecil ke Besar',
    },
    results: {
      title: 'Hasil Pencarian',
      showing: 'Menampilkan {count} properti',
      noResults: 'Tidak ada hasil ditemukan',
      refineSearch: 'Coba perbaiki pencarian Anda',
    },
  },

  auth: {
    login: {
      title: 'Masuk ke Akun Anda',
      subtitle: 'Selamat datang kembali! Silakan masuk untuk melanjutkan',
      email: 'Email',
      password: 'Kata Sandi',
      remember: 'Ingat saya',
      forgotPassword: 'Lupa kata sandi?',
      submit: 'Masuk',
      noAccount: 'Belum punya akun?',
      registerLink: 'Daftar sekarang',
      errors: {
        invalidCredentials: 'Email atau kata sandi salah',
        emailRequired: 'Email wajib diisi',
        passwordRequired: 'Kata sandi wajib diisi',
        networkError: 'Kesalahan jaringan. Silakan coba lagi.',
      },
    },
    register: {
      title: 'Buat Akun Baru',
      subtitle: 'Bergabunglah dengan kami dan temukan properti impian Anda',
      name: 'Nama Lengkap',
      email: 'Email',
      phone: 'Nomor Telepon',
      password: 'Kata Sandi',
      confirmPassword: 'Konfirmasi Kata Sandi',
      agreeTerms: 'Saya setuju dengan Syarat dan Ketentuan',
      submit: 'Daftar',
      haveAccount: 'Sudah punya akun?',
      loginLink: 'Masuk sekarang',
      errors: {
        nameRequired: 'Nama wajib diisi',
        emailRequired: 'Email wajib diisi',
        emailInvalid: 'Format email tidak valid',
        passwordRequired: 'Kata sandi wajib diisi',
        passwordTooShort: 'Kata sandi minimal 8 karakter',
        passwordsNoMatch: 'Kata sandi tidak cocok',
        termsRequired: 'Anda harus menyetujui syarat dan ketentuan',
      },
    },
    forgotPassword: {
      title: 'Lupa Kata Sandi',
      subtitle: 'Masukkan email Anda dan kami akan mengirimkan link reset',
      email: 'Email',
      submit: 'Kirim Link Reset',
      backToLogin: 'Kembali ke halaman login',
      success: 'Link reset telah dikirim ke email Anda',
      error: 'Gagal mengirim link reset',
    },
    resetPassword: {
      title: 'Reset Kata Sandi',
      subtitle: 'Masukkan kata sandi baru Anda',
      newPassword: 'Kata Sandi Baru',
      confirmPassword: 'Konfirmasi Kata Sandi',
      submit: 'Reset Kata Sandi',
      success: 'Kata sandi berhasil direset',
      error: 'Gagal mereset kata sandi',
      invalidToken: 'Link reset tidak valid',
      tokenExpired: 'Link reset telah kadaluarsa',
    },
  },

  dashboard: {
    title: 'Dasbor',
    welcome: 'Selamat datang kembali, {name}!',
    overview: {
      title: 'Ringkasan',
      myProperties: 'Properti Saya',
      favorites: 'Favorit',
      savedSearches: 'Pencarian Tersimpan',
      messages: 'Pesan',
      bookings: 'Pemesanan',
    },
    profile: {
      title: 'Profil Saya',
      personalInfo: 'Informasi Pribadi',
      contactInfo: 'Informasi Kontak',
      preferences: 'Preferensi',
      updateSuccess: 'Profil berhasil diperbarui',
      updateError: 'Gagal memperbarui profil',
    },
    bookings: {
      title: 'Pemesanan Saya',
      upcoming: 'Akan Datang',
      past: 'Sebelumnya',
      cancelled: 'Dibatalkan',
      noBookings: 'Tidak ada pemesanan',
      viewDetails: 'Lihat Detail',
      cancelBooking: 'Batalkan Pemesanan',
      cancelSuccess: 'Pemesanan berhasil dibatalkan',
      cancelError: 'Gagal membatalkan pemesanan',
    },
    favorites: {
      title: 'Properti Favorit',
      noFavorites: 'Belum ada properti favorit',
      addFavorites: 'Mulai simpan properti favorit Anda',
    },
    savedSearches: {
      title: 'Pencarian Tersimpan',
      noSearches: 'Belum ada pencarian tersimpan',
      enableAlerts: 'Aktifkan notifikasi untuk pencarian ini',
      disableAlerts: 'Nonaktifkan notifikasi',
      deleteSearch: 'Hapus pencarian',
    },
    messages: {
      title: 'Pesan',
      noMessages: 'Tidak ada pesan',
      newMessage: 'Pesan Baru',
      reply: 'Balas',
      markAsRead: 'Tandai sudah dibaca',
    },
  },

  booking: {
    title: 'Pesan Properti',
    form: {
      checkIn: 'Tanggal Check-in',
      checkOut: 'Tanggal Check-out',
      guests: 'Jumlah Tamu',
      specialRequests: 'Permintaan Khusus',
      guestName: 'Nama Tamu',
      guestEmail: 'Email Tamu',
      guestPhone: 'Telepon Tamu',
      submit: 'Konfirmasi Pemesanan',
    },
    summary: {
      title: 'Ringkasan Pemesanan',
      property: 'Properti',
      dates: 'Tanggal',
      nights: '{count} malam',
      guests: '{count} tamu',
      totalPrice: 'Total Harga',
    },
    confirmation: {
      title: 'Pemesanan Dikonfirmasi',
      message: 'Pemesanan Anda telah berhasil dikonfirmasi',
      bookingId: 'ID Pemesanan: {id}',
      checkEmail: 'Silakan cek email Anda untuk detail pemesanan',
    },
    errors: {
      invalidDates: 'Tanggal check-out harus setelah check-in',
      propertyUnavailable: 'Properti tidak tersedia untuk tanggal yang dipilih',
      bookingFailed: 'Gagal membuat pemesanan',
    },
    status: {
      pending: 'Tertunda',
      confirmed: 'Dikonfirmasi',
      cancelled: 'Dibatalkan',
      completed: 'Selesai',
    },
  },

  contact: {
    title: 'Hubungi Kami',
    subtitle: 'Kami siap membantu Anda menemukan properti impian',
    form: {
      name: 'Nama',
      email: 'Email',
      phone: 'Telepon',
      subject: 'Subjek',
      message: 'Pesan',
      submit: 'Kirim Pesan',
    },
    info: {
      address: 'Alamat',
      email: 'Email',
      phone: 'Telepon',
      hours: 'Jam Operasional',
      hoursValue: 'Senin - Sabtu: 9:00 - 18:00',
    },
    success: 'Pesan Anda telah dikirim. Kami akan segera menghubungi Anda.',
    error: 'Gagal mengirim pesan. Silakan coba lagi.',
  },

  about: {
    title: 'Tentang Estate Bali',
    subtitle: 'Ahli properti terpercaya Anda di Bali',
    mission: {
      title: 'Misi Kami',
      content: 'Menghubungkan orang dengan properti impian mereka di Bali melalui layanan yang profesional, transparan, dan personal.',
    },
    vision: {
      title: 'Visi Kami',
      content: 'Menjadi platform properti terkemuka di Bali, dikenal karena keunggulan, integritas, dan dedikasi kepada klien.',
    },
    values: {
      title: 'Nilai-Nilai Kami',
      integrity: 'Integritas: Kami beroperasi dengan transparansi dan kejujuran penuh',
      excellence: 'Keunggulan: Kami memberikan layanan berkualitas tinggi',
      innovation: 'Inovasi: Kami menggunakan teknologi terkini untuk pengalaman terbaik',
      customerFirst: 'Pelanggan Pertama: Kepuasan Anda adalah prioritas utama kami',
    },
    team: {
      title: 'Tim Kami',
      subtitle: 'Temui para ahli properti kami',
    },
    stats: {
      properties: 'Properti Tersedia',
      happyClients: 'Klien Puas',
      yearsExperience: 'Tahun Pengalaman',
      teamMembers: 'Anggota Tim',
    },
  },

  investment: {
    title: 'Investasi Properti',
    subtitle: 'Peluang investasi menguntungkan di pasar properti Bali',
    whyInvest: {
      title: 'Mengapa Investasi di Bali?',
      reasons: [
        'Pasar properti yang berkembang pesat',
        'Tingkat okupansi tinggi untuk properti sewa',
        'Apresiasi nilai properti yang kuat',
        'Destinasi wisata internasional',
        'Peraturan investasi asing yang mendukung',
      ],
    },
    form: {
      title: 'Formulir Minat Investasi',
      name: 'Nama',
      email: 'Email',
      phone: 'Telepon',
      investmentAmount: 'Jumlah Investasi',
      investmentType: 'Tipe Investasi',
      preferredLocation: 'Lokasi Pilihan',
      message: 'Pesan',
      submit: 'Kirim Minat',
    },
    types: {
      villa: 'Villa Mewah',
      apartment: 'Kompleks Apartemen',
      land: 'Tanah untuk Pengembangan',
      commercial: 'Properti Komersial',
    },
    success: 'Minat investasi Anda telah dikirim. Tim kami akan segera menghubungi Anda.',
    error: 'Gagal mengirim formulir. Silakan coba lagi.',
  },

  footer: {
    tagline: 'Mitra terpercaya Anda untuk properti mewah di Bali',
    quickLinks: {
      title: 'Link Cepat',
      about: 'Tentang Kami',
      properties: 'Properti',
      agents: 'Agen',
      blog: 'Blog',
      careers: 'Karir',
      press: 'Pers',
    },
    services: {
      title: 'Layanan',
      buy: 'Beli Properti',
      rent: 'Sewa Properti',
      sell: 'Jual Properti',
      invest: 'Investasi',
      propertyManagement: 'Manajemen Properti',
      consultation: 'Konsultasi',
    },
    legal: {
      title: 'Legal',
      privacy: 'Kebijakan Privasi',
      terms: 'Syarat & Ketentuan',
      cookies: 'Kebijakan Cookie',
      disclaimer: 'Disclaimer',
    },
    contact: {
      title: 'Kontak',
      address: 'Alamat',
      email: 'Email',
      phone: 'Telepon',
    },
    social: {
      title: 'Ikuti Kami',
      facebook: 'Facebook',
      instagram: 'Instagram',
      twitter: 'Twitter',
      linkedin: 'LinkedIn',
    },
    newsletter: {
      title: 'Newsletter',
      subtitle: 'Berlangganan untuk update properti',
      placeholder: 'Masukkan email Anda',
      submit: 'Berlangganan',
      success: 'Berlangganan berhasil',
      error: 'Berlangganan gagal',
    },
    copyright: '© 2024 Estate Bali. Hak cipta dilindungi.',
  },

  errors: {
    general: 'Terjadi kesalahan',
    notFound: 'Halaman tidak ditemukan',
    unauthorized: 'Akses tidak diizinkan',
    forbidden: 'Akses dilarang',
    serverError: 'Kesalahan server',
    networkError: 'Kesalahan jaringan',
    timeout: 'Waktu permintaan habis',
    invalidInput: 'Input tidak valid',
    requiredField: 'Field ini wajib diisi',
    tryAgain: 'Silakan coba lagi',
    contactSupport: 'Hubungi dukungan jika masalah berlanjut',
  },

  success: {
    saved: 'Berhasil disimpan',
    updated: 'Berhasil diperbarui',
    deleted: 'Berhasil dihapus',
    sent: 'Berhasil dikirim',
    created: 'Berhasil dibuat',
    uploaded: 'Berhasil diunggah',
  },

  validation: {
    required: 'Field ini wajib diisi',
    emailInvalid: 'Alamat email tidak valid',
    phoneInvalid: 'Nomor telepon tidak valid',
    passwordTooShort: 'Kata sandi terlalu pendek',
    passwordsNoMatch: 'Kata sandi tidak cocok',
    minLength: 'Minimal {min} karakter diperlukan',
    maxLength: 'Maksimal {max} karakter diizinkan',
    minValue: 'Nilai minimum adalah {min}',
    maxValue: 'Nilai maksimum adalah {max}',
    invalidFormat: 'Format tidak valid',
  },
};

// Export the default messages
export const messages: LocalizedMessages = {
  en,
  id, // Indonesian - Complete translation
  // Other languages will be added
  he: en, // Placeholder - will be translated
  ar: en, // Placeholder - will be translated
  zh: en, // Placeholder - will be translated
};

// Helper to get messages for a locale
export function getMessages(locale: Locale): Messages {
  return messages[locale] || messages[defaultLocale];
}

// Helper to check if a section is AI translated
export function isAITranslated(locale: Locale): boolean {
  return locale !== 'en';
}
