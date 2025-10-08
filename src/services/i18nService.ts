import { api } from '@/shared/services/api';

// Language and Locale Types
export type SupportedLanguage = 
  | 'en' | 'hi' | 'bn' | 'te' | 'mr' | 'ta' | 'gu' | 'kn' | 'ml' | 'or' | 'pa' | 'as';

export type SupportedCurrency = 
  | 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'SGD' | 'CAD' | 'AUD';

export type SupportedRegion = 
  | 'IN' | 'US' | 'EU' | 'GB' | 'AE' | 'SG' | 'CA' | 'AU';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  region: string[];
  enabled: boolean;
}

export interface CurrencyInfo {
  code: SupportedCurrency;
  name: string;
  symbol: string;
  decimals: number;
  rate: number; // Exchange rate relative to base currency (INR)
  lastUpdated: string;
  enabled: boolean;
}

export interface RegionInfo {
  code: SupportedRegion;
  name: string;
  languages: SupportedLanguage[];
  defaultLanguage: SupportedLanguage;
  defaultCurrency: SupportedCurrency;
  dateFormat: string;
  timeFormat: string;
  numberFormat: string;
  timezone: string;
  enabled: boolean;
}

export interface TranslationKey {
  key: string;
  context?: string;
  defaultValue?: string;
  interpolation?: Record<string, any>;
}

export interface Translation {
  key: string;
  language: SupportedLanguage;
  value: string;
  context?: string;
  status: 'active' | 'pending' | 'deprecated';
  lastModified: string;
}

export interface LocalizationContext {
  language: SupportedLanguage;
  currency: SupportedCurrency;
  region: SupportedRegion;
  timezone: string;
  dateFormat: string;
  numberFormat: string;
  direction: 'ltr' | 'rtl';
}

export interface CurrencyConversion {
  from: SupportedCurrency;
  to: SupportedCurrency;
  amount: number;
  convertedAmount: number;
  rate: number;
  lastUpdated: string;
}

export interface RegionalSettings {
  showLocalVendors?: boolean;
  localShippingOnly?: boolean;
  regionSpecificCategories?: string[];
  customPaymentMethods?: string[];
  localHolidays?: string[];
  businessHours?: {
    timezone: string;
    workingDays: number[];
    startTime: string;
    endTime: string;
  };
}

class I18nService {
  private currentLanguage: SupportedLanguage = 'en';
  private currentCurrency: SupportedCurrency = 'INR';
  private currentRegion: SupportedRegion = 'IN';
  private translations: Map<string, Translation> = new Map();
  private currencyRates: Map<SupportedCurrency, number> = new Map();
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api/i18n';
    this.loadFromStorage();
    this.initializeCurrencyRates();
  }

  // Language Management
  async getSupportedLanguages(): Promise<LanguageInfo[]> {
    try {
      const response = await api.get(`${this.baseUrl}/languages`);
      return response.data;
    } catch (error) {
      console.error('Error fetching supported languages:', error);
      return this.getDefaultLanguages();
    }
  }

  async setLanguage(language: SupportedLanguage): Promise<void> {
    try {
      this.currentLanguage = language;
      await api.post(`${this.baseUrl}/set-language`, { language });
      await this.loadTranslations(language);
      this.saveToStorage();
      this.dispatchLanguageChange(language);
    } catch (error) {
      console.error('Error setting language:', error);
      throw new Error('Failed to set language');
    }
  }

  getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  // Translation Management
  async loadTranslations(language: SupportedLanguage): Promise<void> {
    try {
      const response = await api.get(`${this.baseUrl}/translations/${language}`);
      const translations: Translation[] = response.data;
      
      this.translations.clear();
      translations.forEach(translation => {
        const key = translation.context 
          ? `${translation.key}:${translation.context}`
          : translation.key;
        this.translations.set(key, translation);
      });
    } catch (error) {
      console.error('Error loading translations:', error);
      // Load fallback translations
      await this.loadFallbackTranslations();
    }
  }

  translate(key: string, options?: {
    context?: string;
    defaultValue?: string;
    interpolation?: Record<string, any>;
    count?: number;
  }): string {
    const lookupKey = options?.context ? `${key}:${options.context}` : key;
    const translation = this.translations.get(lookupKey);
    
    let value = translation?.value || options?.defaultValue || key;

    // Handle pluralization
    if (options?.count !== undefined) {
      value = this.handlePluralization(value, options.count, this.currentLanguage);
    }

    // Handle interpolation
    if (options?.interpolation) {
      value = this.interpolateString(value, options.interpolation);
    }

    return value;
  }

  // Shorthand for translate
  t = this.translate.bind(this);

  // Currency Management
  async getSupportedCurrencies(): Promise<CurrencyInfo[]> {
    try {
      const response = await api.get(`${this.baseUrl}/currencies`);
      return response.data;
    } catch (error) {
      console.error('Error fetching supported currencies:', error);
      return this.getDefaultCurrencies();
    }
  }

  async setCurrency(currency: SupportedCurrency): Promise<void> {
    try {
      this.currentCurrency = currency;
      await api.post(`${this.baseUrl}/set-currency`, { currency });
      await this.updateCurrencyRates();
      this.saveToStorage();
      this.dispatchCurrencyChange(currency);
    } catch (error) {
      console.error('Error setting currency:', error);
      throw new Error('Failed to set currency');
    }
  }

  getCurrentCurrency(): SupportedCurrency {
    return this.currentCurrency;
  }

  async convertCurrency(
    amount: number,
    from: SupportedCurrency,
    to: SupportedCurrency
  ): Promise<CurrencyConversion> {
    try {
      const response = await api.post(`${this.baseUrl}/convert`, {
        amount,
        from,
        to
      });
      return response.data;
    } catch (error) {
      console.error('Error converting currency:', error);
      return this.convertCurrencyOffline(amount, from, to);
    }
  }

  formatCurrency(
    amount: number,
    currency?: SupportedCurrency,
    options?: {
      showSymbol?: boolean;
      showCode?: boolean;
      minimumFractionDigits?: number;
      maximumFractionDigits?: number;
    }
  ): string {
    const targetCurrency = currency || this.currentCurrency;
    const locale = this.getLocaleFromLanguage(this.currentLanguage);

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: targetCurrency,
      minimumFractionDigits: options?.minimumFractionDigits ?? 2,
      maximumFractionDigits: options?.maximumFractionDigits ?? 2,
      currencyDisplay: options?.showCode ? 'code' : 'symbol'
    }).format(amount);
  }

  // Region Management
  async getSupportedRegions(): Promise<RegionInfo[]> {
    try {
      const response = await api.get(`${this.baseUrl}/regions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching supported regions:', error);
      return this.getDefaultRegions();
    }
  }

  async setRegion(region: SupportedRegion): Promise<void> {
    try {
      this.currentRegion = region;
      await api.post(`${this.baseUrl}/set-region`, { region });
      
      // Auto-update language and currency based on region
      const regionInfo = await this.getRegionInfo(region);
      if (regionInfo) {
        await this.setLanguage(regionInfo.defaultLanguage);
        await this.setCurrency(regionInfo.defaultCurrency);
      }
      
      this.saveToStorage();
      this.dispatchRegionChange(region);
    } catch (error) {
      console.error('Error setting region:', error);
      throw new Error('Failed to set region');
    }
  }

  getCurrentRegion(): SupportedRegion {
    return this.currentRegion;
  }

  // Date and Number Formatting
  formatDate(date: Date | string, format?: 'short' | 'medium' | 'long' | 'full'): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const locale = this.getLocaleFromLanguage(this.currentLanguage);

    return new Intl.DateTimeFormat(locale, {
      dateStyle: format || 'medium'
    }).format(dateObj);
  }

  formatTime(date: Date | string, format?: 'short' | 'medium' | 'long'): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const locale = this.getLocaleFromLanguage(this.currentLanguage);

    return new Intl.DateTimeFormat(locale, {
      timeStyle: format || 'short'
    }).format(dateObj);
  }

  formatDateTime(date: Date | string, options?: {
    dateStyle?: 'short' | 'medium' | 'long' | 'full';
    timeStyle?: 'short' | 'medium' | 'long';
  }): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const locale = this.getLocaleFromLanguage(this.currentLanguage);

    return new Intl.DateTimeFormat(locale, {
      dateStyle: options?.dateStyle || 'medium',
      timeStyle: options?.timeStyle || 'short'
    }).format(dateObj);
  }

  formatNumber(
    number: number,
    options?: {
      style?: 'decimal' | 'percent' | 'unit';
      minimumFractionDigits?: number;
      maximumFractionDigits?: number;
      unit?: string;
    }
  ): string {
    const locale = this.getLocaleFromLanguage(this.currentLanguage);

    return new Intl.NumberFormat(locale, {
      style: options?.style || 'decimal',
      minimumFractionDigits: options?.minimumFractionDigits,
      maximumFractionDigits: options?.maximumFractionDigits,
      unit: options?.unit
    }).format(number);
  }

  // Regional Customization
  async getRegionalSettings(region?: SupportedRegion): Promise<RegionalSettings> {
    try {
      const targetRegion = region || this.currentRegion;
      const response = await api.get(`${this.baseUrl}/regional-settings/${targetRegion}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching regional settings:', error);
      return {};
    }
  }

  async updateRegionalSettings(settings: RegionalSettings): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/regional-settings/${this.currentRegion}`, settings);
    } catch (error) {
      console.error('Error updating regional settings:', error);
      throw new Error('Failed to update regional settings');
    }
  }

  // Utility Functions
  isRTL(language?: SupportedLanguage): boolean {
    const lang = language || this.currentLanguage;
    // Arabic and Hebrew would be RTL, but we're focusing on Indian languages
    return false; // None of our supported languages are RTL
  }

  getTextDirection(language?: SupportedLanguage): 'ltr' | 'rtl' {
    return this.isRTL(language) ? 'rtl' : 'ltr';
  }

  getLocalizationContext(): LocalizationContext {
    return {
      language: this.currentLanguage,
      currency: this.currentCurrency,
      region: this.currentRegion,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      dateFormat: 'dd/mm/yyyy', // Can be region-specific
      numberFormat: '1,00,000', // Indian number format
      direction: this.getTextDirection()
    };
  }

  // Admin Functions
  async addTranslation(translation: Omit<Translation, 'lastModified'>): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/translations`, translation);
      // Reload translations for current language
      await this.loadTranslations(this.currentLanguage);
    } catch (error) {
      console.error('Error adding translation:', error);
      throw new Error('Failed to add translation');
    }
  }

  async updateTranslation(key: string, language: SupportedLanguage, value: string): Promise<void> {
    try {
      await api.put(`${this.baseUrl}/translations/${language}/${key}`, { value });
      // Update local cache
      const translation = this.translations.get(key);
      if (translation) {
        translation.value = value;
        translation.lastModified = new Date().toISOString();
      }
    } catch (error) {
      console.error('Error updating translation:', error);
      throw new Error('Failed to update translation');
    }
  }

  async deleteTranslation(key: string, language: SupportedLanguage): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/translations/${language}/${key}`);
      this.translations.delete(key);
    } catch (error) {
      console.error('Error deleting translation:', error);
      throw new Error('Failed to delete translation');
    }
  }

  // Private Helper Methods
  private getLocaleFromLanguage(language: SupportedLanguage): string {
    const localeMap: Record<SupportedLanguage, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      bn: 'bn-IN',
      te: 'te-IN',
      mr: 'mr-IN',
      ta: 'ta-IN',
      gu: 'gu-IN',
      kn: 'kn-IN',
      ml: 'ml-IN',
      or: 'or-IN',
      pa: 'pa-IN',
      as: 'as-IN'
    };
    return localeMap[language] || 'en-IN';
  }

  private handlePluralization(value: string, count: number, language: SupportedLanguage): string {
    // Simple pluralization - can be enhanced based on language rules
    if (value.includes('|')) {
      const parts = value.split('|');
      return count === 1 ? parts[0] : parts[1] || parts[0];
    }
    return value;
  }

  private interpolateString(value: string, interpolation: Record<string, any>): string {
    return value.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return interpolation[key]?.toString() || match;
    });
  }

  private async loadFallbackTranslations(): Promise<void> {
    // Load basic English translations as fallback
    const fallbackTranslations = {
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.cancel': 'Cancel',
      'common.save': 'Save',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.add': 'Add',
      'common.search': 'Search',
      'common.filter': 'Filter',
      'common.sort': 'Sort'
    };

    Object.entries(fallbackTranslations).forEach(([key, value]) => {
      this.translations.set(key, {
        key,
        language: 'en',
        value,
        status: 'active',
        lastModified: new Date().toISOString()
      });
    });
  }

  private convertCurrencyOffline(
    amount: number,
    from: SupportedCurrency,
    to: SupportedCurrency
  ): CurrencyConversion {
    const fromRate = this.currencyRates.get(from) || 1;
    const toRate = this.currencyRates.get(to) || 1;
    const rate = toRate / fromRate;
    const convertedAmount = amount * rate;

    return {
      from,
      to,
      amount,
      convertedAmount: Math.round(convertedAmount * 100) / 100,
      rate,
      lastUpdated: new Date().toISOString()
    };
  }

  private async initializeCurrencyRates(): Promise<void> {
    // Default rates (should be updated from API)
    this.currencyRates.set('INR', 1);
    this.currencyRates.set('USD', 0.012);
    this.currencyRates.set('EUR', 0.011);
    this.currencyRates.set('GBP', 0.0095);
    
    await this.updateCurrencyRates();
  }

  private async updateCurrencyRates(): Promise<void> {
    try {
      const response = await api.get(`${this.baseUrl}/exchange-rates`);
      const rates = response.data;
      
      Object.entries(rates).forEach(([currency, rate]) => {
        this.currencyRates.set(currency as SupportedCurrency, rate as number);
      });
    } catch (error) {
      console.error('Error updating currency rates:', error);
    }
  }

  private async getRegionInfo(region: SupportedRegion): Promise<RegionInfo | null> {
    try {
      const response = await api.get(`${this.baseUrl}/regions/${region}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching region info:', error);
      return null;
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('i18n-settings');
      if (stored) {
        const settings = JSON.parse(stored);
        this.currentLanguage = settings.language || 'en';
        this.currentCurrency = settings.currency || 'INR';
        this.currentRegion = settings.region || 'IN';
      }
    } catch (error) {
      console.error('Error loading i18n settings:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const settings = {
        language: this.currentLanguage,
        currency: this.currentCurrency,
        region: this.currentRegion
      };
      localStorage.setItem('i18n-settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving i18n settings:', error);
    }
  }

  private dispatchLanguageChange(language: SupportedLanguage): void {
    window.dispatchEvent(new CustomEvent('languagechange', { detail: { language } }));
  }

  private dispatchCurrencyChange(currency: SupportedCurrency): void {
    window.dispatchEvent(new CustomEvent('currencychange', { detail: { currency } }));
  }

  private dispatchRegionChange(region: SupportedRegion): void {
    window.dispatchEvent(new CustomEvent('regionchange', { detail: { region } }));
  }

  private getDefaultLanguages(): LanguageInfo[] {
    return [
      { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr', region: ['IN', 'US', 'GB'], enabled: true },
      { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', direction: 'ltr', region: ['IN'], enabled: true },
      { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', direction: 'ltr', region: ['IN'], enabled: true },
      { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', direction: 'ltr', region: ['IN'], enabled: true },
      { code: 'mr', name: 'Marathi', nativeName: 'मराठी', direction: 'ltr', region: ['IN'], enabled: true }
    ];
  }

  private getDefaultCurrencies(): CurrencyInfo[] {
    return [
      { code: 'INR', name: 'Indian Rupee', symbol: '₹', decimals: 2, rate: 1, lastUpdated: new Date().toISOString(), enabled: true },
      { code: 'USD', name: 'US Dollar', symbol: '$', decimals: 2, rate: 0.012, lastUpdated: new Date().toISOString(), enabled: true },
      { code: 'EUR', name: 'Euro', symbol: '€', decimals: 2, rate: 0.011, lastUpdated: new Date().toISOString(), enabled: true }
    ];
  }

  private getDefaultRegions(): RegionInfo[] {
    return [
      {
        code: 'IN',
        name: 'India',
        languages: ['en', 'hi', 'bn', 'te', 'mr', 'ta', 'gu', 'kn', 'ml', 'or', 'pa', 'as'],
        defaultLanguage: 'en',
        defaultCurrency: 'INR',
        dateFormat: 'dd/mm/yyyy',
        timeFormat: '24h',
        numberFormat: '1,00,000',
        timezone: 'Asia/Kolkata',
        enabled: true
      }
    ];
  }
}

export const i18nService = new I18nService();
export default i18nService;
