export function formatCurrency(amount: number, currency: string = 'XAF'): string {
  if (currency === 'XAF') {
    return `${amount.toLocaleString('fr-FR')} FCFA`;
  }
  return `${amount.toLocaleString()} ${currency}`;
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}