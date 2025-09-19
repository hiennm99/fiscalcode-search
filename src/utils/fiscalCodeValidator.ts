// utils/fiscalCodeValidator.ts

export interface FiscalCodeValidationResult {
    isValid: boolean
    error?: string
    formatted?: string
}

export class FiscalCodeValidator {
    private static readonly FISCAL_CODE_REGEX = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/

    /**
     * Validates Italian fiscal code format
     */
    static validate(fiscalCode: string): FiscalCodeValidationResult {
        if (!fiscalCode) {
            return { isValid: false, error: 'Codice fiscale richiesto' }
        }

        const cleaned = fiscalCode.replace(/\s/g, '').toUpperCase()

        if (cleaned.length !== 16) {
            return {
                isValid: false,
                error: 'Il codice fiscale deve essere di 16 caratteri'
            }
        }

        if (!this.FISCAL_CODE_REGEX.test(cleaned)) {
            return {
                isValid: false,
                error: 'Formato codice fiscale non valido'
            }
        }

        return {
            isValid: true,
            formatted: cleaned
        }
    }

    /**
     * Quick format check for search (less strict)
     */
    static isSearchable(fiscalCode: string): boolean {
        if (!fiscalCode) return false
        const cleaned = fiscalCode.replace(/\s/g, '').toUpperCase()
        return cleaned.length >= 3 && /^[A-Z0-9]+$/.test(cleaned)
    }

    /**
     * Format fiscal code for display
     */
    static format(fiscalCode: string): string {
        if (!fiscalCode) return ''
        const cleaned = fiscalCode.replace(/\s/g, '').toUpperCase()

        if (cleaned.length === 16) {
            return `${cleaned.slice(0, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 9)} ${cleaned.slice(9, 11)} ${cleaned.slice(11, 12)} ${cleaned.slice(12, 15)} ${cleaned.slice(15, 16)}`
        }

        return cleaned
    }
}

// utils/dateUtils.ts
export class DateUtils {
    /**
     * Format date for Italian locale
     */
    static formatItalianDate(dateString: string | null | undefined): string {
        if (!dateString) return 'N/A'

        try {
            const date = new Date(dateString)
            return date.toLocaleDateString('it-IT', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            })
        } catch {
            return 'Data non valida'
        }
    }

    /**
     * Calculate age from birth date
     */
    static calculateAge(birthDate: string | null | undefined): number | null {
        if (!birthDate) return null

        try {
            const birth = new Date(birthDate)
            const today = new Date()
            let age = today.getFullYear() - birth.getFullYear()
            const monthDiff = today.getMonth() - birth.getMonth()

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                age--
            }

            return age
        } catch {
            return null
        }
    }

    /**
     * Check if date is recent (within specified days)
     */
    static isRecent(dateString: string, days: number = 30): boolean {
        if (!dateString) return false

        try {
            const date = new Date(dateString)
            const now = new Date()
            const diffTime = now.getTime() - date.getTime()
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

            return diffDays <= days
        } catch {
            return false
        }
    }
}

// utils/formatters.ts
export class Formatters {
    /**
     * Format currency in EUR
     */
    static currency(amount: number | null | undefined): string {
        if (amount === null || amount === undefined) return 'N/A'

        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount)
    }

    /**
     * Format number with Italian locale
     */
    static number(num: number | null | undefined): string {
        if (num === null || num === undefined) return 'N/A'

        return new Intl.NumberFormat('it-IT').format(num)
    }

    /**
     * Format phone number
     */
    static phone(phone: string | null | undefined): string {
        if (!phone) return 'N/A'

        // Simple Italian phone formatting
        const cleaned = phone.replace(/\D/g, '')
        if (cleaned.length === 10) {
            return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
        }

        return phone
    }

    /**
     * Truncate text with ellipsis
     */
    static truncate(text: string | null | undefined, maxLength: number = 50): string {
        if (!text) return 'N/A'
        if (text.length <= maxLength) return text

        return text.slice(0, maxLength - 3) + '...'
    }

    /**
     * Format address
     */
    static address(entity: { street?: string; city?: string; province?: string; postcode?: string }): string {
        const parts = []

        if (entity.street) parts.push(entity.street)
        if (entity.city) parts.push(entity.city)
        if (entity.province) parts.push(`(${entity.province})`)
        if (entity.postcode) parts.push(entity.postcode)

        return parts.length > 0 ? parts.join(', ') : 'N/A'
    }
}

// utils/searchUtils.ts
export class SearchUtils {
    /**
     * Highlight search term in text
     */
    static highlightTerm(text: string, searchTerm: string): string {
        if (!text || !searchTerm) return text

        const regex = new RegExp(`(${searchTerm})`, 'gi')
        return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>')
    }

    /**
     * Check if entity matches search criteria
     */
    static matchesSearch(entity: any, searchTerm: string): boolean {
        if (!searchTerm) return true

        const term = searchTerm.toLowerCase()
        const searchFields = [
            entity.fiscal_code,
            entity.name,
            entity.city,
            entity.province
        ]

        return searchFields.some(field =>
            field?.toLowerCase().includes(term)
        )
    }

    /**
     * Sort results by relevance
     */
    static sortByRelevance<T extends { fiscal_code: string; name: string }>(
        results: T[],
        searchTerm: string
    ): T[] {
        if (!searchTerm) return results

        return [...results].sort((a, b) => {
            const term = searchTerm.toLowerCase()

            // Exact matches first
            if (a.fiscal_code.toLowerCase() === term) return -1
            if (b.fiscal_code.toLowerCase() === term) return 1

            // Starts with search term
            const aStarts = a.fiscal_code.toLowerCase().startsWith(term) ||
                a.name.toLowerCase().startsWith(term)
            const bStarts = b.fiscal_code.toLowerCase().startsWith(term) ||
                b.name.toLowerCase().startsWith(term)

            if (aStarts && !bStarts) return -1
            if (!aStarts && bStarts) return 1

            // Alphabetical as fallback
            return a.name.localeCompare(b.name, 'it-IT')
        })
    }
}

// utils/exportUtils.ts
export class ExportUtils {
    /**
     * Export search results to CSV
     */
    static exportToCSV(data: any[], filename: string = 'search_results.csv'): void {
        if (!data.length) return

        const headers = Object.keys(data[0])
        const csvContent = [
            headers.join(','),
            ...data.map(row =>
                headers.map(header => {
                    const value = row[header]
                    // Escape commas and quotes
                    if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                        return `"${value.replace(/"/g, '""')}"`
                    }
                    return value ?? ''
                }).join(',')
            )
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)

        link.setAttribute('href', url)
        link.setAttribute('download', filename)
        link.style.visibility = 'hidden'

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    /**
     * Export to JSON
     */
    static exportToJSON(data: any[], filename: string = 'search_results.json'): void {
        const jsonContent = JSON.stringify(data, null, 2)
        const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)

        link.setAttribute('href', url)
        link.setAttribute('download', filename)
        link.style.visibility = 'hidden'

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
}