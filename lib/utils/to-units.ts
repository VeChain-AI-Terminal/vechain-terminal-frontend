export function toUnits(balanceStr: string, decimals: number): number {
  try {
    const b = BigInt(balanceStr);
    const base = 10n ** BigInt(decimals);
    const whole = b / base;
    const frac = b % base;
    return Number(whole) + Number(frac) / Number(base);
  } catch {
    return parseFloat(balanceStr) / Math.pow(10, decimals);
  }
}
