/**
 * Token Packages Configuration
 * For Tribute Shop API payments (EUR + RUB)
 */

import type { TributeCurrency } from '../services/tributeService.js'

export interface TokenPackage {
    id: string
    tokens: number
    amount: number      // in cents (EUR) or kopecks (RUB)
    label: string       // display label
    price: string       // formatted price
    bonus?: string      // bonus text like "+4%"
}

export interface PackagesByСurrency {
    eur: TokenPackage[]
    rub: TokenPackage[]
}

/**
 * Web payment packages (via Tribute Shop API)
 * Amount is in smallest currency units (cents/kopecks)
 */
export const WEB_PACKAGES: PackagesByСurrency = {
    // EUR packages (existing prices from fiat packages)
    eur: [
        { id: 'eur_50', tokens: 50, amount: 100, label: '50 tokens', price: '€1.00' },
        { id: 'eur_120', tokens: 120, amount: 230, label: '120 tokens', price: '€2.30', bonus: '+4%' },
        { id: 'eur_300', tokens: 300, amount: 540, label: '300 tokens', price: '€5.40', bonus: '+11%' },
        { id: 'eur_800', tokens: 800, amount: 1440, label: '800 tokens', price: '€14.40', bonus: '+11%' },
    ],
    // RUB packages (rate ~100 RUB = €1)
    rub: [
        { id: 'rub_50', tokens: 50, amount: 10000, label: '50 токенов', price: '₽100' },
        { id: 'rub_120', tokens: 120, amount: 23000, label: '120 токенов', price: '₽230', bonus: '+4%' },
        { id: 'rub_300', tokens: 300, amount: 54000, label: '300 токенов', price: '₽540', bonus: '+11%' },
        { id: 'rub_800', tokens: 800, amount: 144000, label: '800 токенов', price: '₽1,440', bonus: '+11%' },
    ],
}

/**
 * Find package by ID
 */
export function findPackage(packageId: string, currency: TributeCurrency): TokenPackage | undefined {
    return WEB_PACKAGES[currency].find(pkg => pkg.id === packageId)
}

/**
 * Get all packages for currency
 */
export function getPackages(currency: TributeCurrency): TokenPackage[] {
    return WEB_PACKAGES[currency]
}

/**
 * Get package title for Tribute order
 */
export function getPackageTitle(pkg: TokenPackage): string {
    return `${pkg.tokens} AiVerse Tokens`
}

/**
 * Get package description for Tribute order
 */
export function getPackageDescription(pkg: TokenPackage): string {
    return `Purchase ${pkg.tokens} tokens for AI image generation`
}
