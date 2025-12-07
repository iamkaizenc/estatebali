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
    services: string;
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

  services: {
    title: string;
    subtitle: string;
    comingSoon: string;
    comingSoonDesc: string;
    ctaButton: string;
    readyTitle: string;
    readyDesc: string;
    whatsappButton: string;
    emailButton: string;
    howItWorks: string;
    howItWorksDesc: string;
    visa: {
      title: string;
      description: string;
      askButton: string;
    };
    residency: {
      title: string;
      description: string;
      askButton: string;
    };
    company: {
      title: string;
      description: string;
      askButton: string;
    };
    legal: {
      title: string;
      description: string;
      askButton: string;
    };
    relocation: {
      title: string;
      description: string;
      askButton: string;
    };
    steps: {
      contact: {
        title: string;
        description: string;
      };
      consultation: {
        title: string;
        description: string;
      };
      documentation: {
        title: string;
        description: string;
      };
      completion: {
        title: string;
        description: string;
      };
    };
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
      addFavorites: string;
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
    savedSearches: {
      title: string;
      noSearches: string;
      enableAlerts: string;
      disableAlerts: string;
      deleteSearch: string;
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
    services: 'Services',
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

  services: {
    title: 'Your Gateway to Living in Bali',
    subtitle: 'Comprehensive visa, residency, and business setup services to make your Bali transition seamless.',
    comingSoon: 'Coming Soon',
    comingSoonDesc: 'Full service launching soon!',
    ctaButton: 'Get Info on WhatsApp',
    readyTitle: 'Ready to Get Started?',
    readyDesc: 'Contact us today to discuss your needs and get a personalized quote',
    whatsappButton: 'Chat on WhatsApp',
    emailButton: 'Send Email',
    howItWorks: 'How It Works',
    howItWorksDesc: 'Simple 4-step process to get started',
    visa: {
      title: 'Visa Services',
      description: 'Complete visa application assistance for your Bali stay',
      askButton: 'Ask About This',
    },
    residency: {
      title: 'Residency Permits',
      description: 'Long-term residency solutions for expats and investors',
      askButton: 'Ask About This',
    },
    company: {
      title: 'Company Setup',
      description: 'Establish your business presence in Indonesia',
      askButton: 'Ask About This',
    },
    legal: {
      title: 'Legal Documentation',
      description: 'Comprehensive legal services for property and business',
      askButton: 'Ask About This',
    },
    relocation: {
      title: 'Relocation Support',
      description: 'Smooth transition to your new life in Bali',
      askButton: 'Ask About This',
    },
    steps: {
      contact: {
        title: 'Contact Us',
        description: 'Reach out via WhatsApp or email',
      },
      consultation: {
        title: 'Consultation',
        description: 'Free initial consultation to understand your needs',
      },
      documentation: {
        title: 'Documentation',
        description: 'We handle all paperwork and requirements',
      },
      completion: {
        title: 'Completion',
        description: 'Your service is processed and completed',
      },
    },
  },

  hero: {
    title: 'Find Your Dream Property\nin Bali',
    subtitle: 'Discover luxury villas, modern apartments, and prime land in paradise.\nYour perfect property awaits.',
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
      addFavorites: 'Start saving your favorite properties',
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
    savedSearches: {
      title: 'Saved Searches',
      noSearches: 'No saved searches yet',
      enableAlerts: 'Enable alerts for this search',
      disableAlerts: 'Disable alerts',
      deleteSearch: 'Delete search',
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
    services: 'Layanan',
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

  services: {
    title: 'Gerbang Anda untuk Hidup di Bali',
    subtitle: 'Layanan visa, izin tinggal, dan pendirian perusahaan yang komprehensif untuk membuat transisi Bali Anda menjadi lancar.',
    comingSoon: 'Segera Hadir',
    comingSoonDesc: 'Layanan lengkap akan segera diluncurkan!',
    ctaButton: 'Dapatkan Info di WhatsApp',
    readyTitle: 'Siap Memulai?',
    readyDesc: 'Hubungi kami hari ini untuk mendiskusikan kebutuhan Anda dan mendapatkan penawaran yang dipersonalisasi',
    whatsappButton: 'Chat di WhatsApp',
    emailButton: 'Kirim Email',
    howItWorks: 'Cara Kerja',
    howItWorksDesc: 'Proses 4 langkah sederhana untuk memulai',
    visa: {
      title: 'Layanan Visa',
      description: 'Bantuan lengkap aplikasi visa untuk tinggal di Bali',
      askButton: 'Tanya Tentang Ini',
    },
    residency: {
      title: 'Izin Tinggal',
      description: 'Solusi izin tinggal jangka panjang untuk ekspatriat dan investor',
      askButton: 'Tanya Tentang Ini',
    },
    company: {
      title: 'Pendirian Perusahaan',
      description: 'Membangun kehadiran bisnis Anda di Indonesia',
      askButton: 'Tanya Tentang Ini',
    },
    legal: {
      title: 'Dokumentasi Hukum',
      description: 'Layanan hukum komprehensif untuk properti dan bisnis',
      askButton: 'Tanya Tentang Ini',
    },
    relocation: {
      title: 'Dukungan Relokasi',
      description: 'Transisi yang mulus ke kehidupan baru Anda di Bali',
      askButton: 'Tanya Tentang Ini',
    },
    steps: {
      contact: {
        title: 'Hubungi Kami',
        description: 'Hubungi melalui WhatsApp atau email',
      },
      consultation: {
        title: 'Konsultasi',
        description: 'Konsultasi awal gratis untuk memahami kebutuhan Anda',
      },
      documentation: {
        title: 'Dokumentasi',
        description: 'Kami menangani semua dokumen dan persyaratan',
      },
      completion: {
        title: 'Selesai',
        description: 'Layanan Anda diproses dan diselesaikan',
      },
    },
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
      description: 'Deskripsi',
      amenities: 'Fasilitas',
      features: 'Fitur',
      yearBuilt: 'Tahun Dibangun',
      parking: 'Parkir',
      furnished: 'Furnished',
      poolSize: 'Ukuran Kolam',
      landSize: 'Luas Tanah',
      buildingSize: 'Luas Bangunan',
    },
    amenities: {
      pool: 'Kolam Renang',
      gym: 'Gym',
      garden: 'Taman',
      parking: 'Parkir',
      security: 'Keamanan 24 Jam',
      wifi: 'WiFi',
      airConditioning: 'AC',
      kitchen: 'Dapur',
      balcony: 'Balkon',
      terrace: 'Teras',
      elevator: 'Lift',
      storage: 'Ruang Penyimpanan',
      laundry: 'Laundry',
      petFriendly: 'Ramah Hewan Peliharaan',
      beachAccess: 'Akses Pantai',
      oceanView: 'Pemandangan Laut',
      mountainView: 'Pemandangan Gunung',
      riceFieldView: 'Pemandangan Sawah',
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
      viewDetails: 'Lihat Detail',
      contactAgent: 'Hubungi Agen',
      scheduleViewing: 'Jadwalkan Kunjungan',
      saveProperty: 'Simpan Properti',
      shareProperty: 'Bagikan Properti',
      reportProperty: 'Laporkan',
      bookNow: 'Pesan Sekarang',
      requestInfo: 'Minta Informasi',
      compareProperties: 'Bandingkan',
    },
    messages: {
      noProperties: 'Tidak ada properti ditemukan',
      loadingProperties: 'Memuat properti...',
      errorLoading: 'Gagal memuat properti',
      savedSuccess: 'Properti berhasil disimpan',
      savedError: 'Gagal menyimpan properti',
      favoriteAdded: 'Ditambahkan ke favorit',
      favoriteRemoved: 'Dihapus dari favorit',
    },
  },

  search: {
    title: 'Cari Properti',
    placeholder: 'Masukkan lokasi, tipe properti, atau kata kunci',
    filters: {
      priceRange: 'Rentang Harga',
      priceMin: 'Harga Minimum',
      priceMax: 'Harga Maksimum',
      propertyType: 'Tipe Properti',
      listingType: 'Tipe Listing',
      location: 'Lokasi',
      bedrooms: 'Kamar Tidur',
      bathrooms: 'Kamar Mandi',
      areaSize: 'Ukuran Area',
      amenities: 'Fasilitas',
      sortBy: 'Urutkan Berdasarkan',
    },
    sorting: {
      newest: 'Terbaru',
      oldest: 'Terlama',
      priceLowToHigh: 'Harga: Rendah ke Tinggi',
      priceHighToLow: 'Harga: Tinggi ke Rendah',
      areaLargeToSmall: 'Luas: Besar ke Kecil',
      areaSmallToLarge: 'Luas: Kecil ke Besar',
    },
    results: {
      showing: 'Menampilkan',
      of: 'dari',
      properties: 'properti',
      noResults: 'Tidak ada properti ditemukan',
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
      removeSuccess: 'Dihapus dari favorit',
      removeError: 'Gagal menghapus dari favorit',
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
      compose: 'Tulis Pesan',
      reply: 'Balas',
      delete: 'Hapus',
      markRead: 'Tandai sudah dibaca',
      markUnread: 'Tandai belum dibaca',
    },
    notifications: {
      title: 'Notifikasi',
      noNotifications: 'Tidak ada notifikasi',
      markAllRead: 'Tandai semua sudah dibaca',
      clearAll: 'Hapus semua',
    },
    settings: {
      title: 'Pengaturan',
      language: 'Bahasa',
      currency: 'Mata Uang',
      timezone: 'Zona Waktu',
      emailNotifications: 'Notifikasi Email',
      pushNotifications: 'Notifikasi Push',
      newsletter: 'Newsletter',
      changePassword: 'Ubah Kata Sandi',
      deleteAccount: 'Hapus Akun',
      saveSuccess: 'Pengaturan berhasil disimpan',
      saveError: 'Gagal menyimpan pengaturan',
    },
  },

  booking: {
    title: 'Pesan Properti',
    checkIn: 'Tanggal Check-in',
    checkOut: 'Tanggal Check-out',
    guests: 'Jumlah Tamu',
    adults: 'Dewasa',
    children: 'Anak-anak',
    infants: 'Bayi',
    specialRequests: 'Permintaan Khusus',
    guestDetails: {
      title: 'Detail Tamu',
      name: 'Nama Lengkap',
      email: 'Email',
      phone: 'Nomor Telepon',
    },
    pricing: {
      title: 'Rincian Harga',
      nightlyRate: 'Harga Per Malam',
      nights: 'malam',
      subtotal: 'Subtotal',
      serviceFee: 'Biaya Layanan',
      taxes: 'Pajak',
      total: 'Total',
    },
    payment: {
      title: 'Pembayaran',
      method: 'Metode Pembayaran',
      cardNumber: 'Nomor Kartu',
      expiryDate: 'Tanggal Kadaluarsa',
      cvv: 'CVV',
      billingAddress: 'Alamat Penagihan',
    },
    confirmation: {
      title: 'Pemesanan Dikonfirmasi',
      thankYou: 'Terima kasih atas pemesanan Anda!',
      bookingNumber: 'Nomor Pemesanan',
      emailSent: 'Email konfirmasi telah dikirim',
      viewBooking: 'Lihat Pemesanan',
    },
    errors: {
      invalidDates: 'Tanggal check-out harus setelah check-in',
      propertyUnavailable: 'Properti tidak tersedia untuk tanggal yang dipilih',
      paymentFailed: 'Pembayaran gagal',
      bookingFailed: 'Gagal membuat pemesanan',
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
      sending: 'Mengirim...',
    },
    info: {
      address: 'Alamat',
      email: 'Email',
      phone: 'Telepon',
      hours: 'Jam Operasional',
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
      followUs: 'Tetap terhubung',
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
