type AnalyticsValue = string | number | boolean | null

type AnalyticsPayload = Record<string, AnalyticsValue | undefined>

declare global {
  interface Window {
    dataLayer?: Array<Record<string, AnalyticsValue>>
  }
}

/**
 * Sends a privacy-safe event to Google Tag Manager's data layer.
 * Never include names, email addresses, messages, or other personal data.
 */
export function trackEvent(event: string, payload: AnalyticsPayload = {}) {
  if (typeof window === 'undefined') return

  window.dataLayer = window.dataLayer ?? []
  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter((entry): entry is [string, AnalyticsValue] => entry[1] !== undefined),
  )

  window.dataLayer.push({ event, ...cleanPayload })
}
