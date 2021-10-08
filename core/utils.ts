export function debounce<T extends (...args: any[]) => any>(
  handler: T,
  delay = 300,
) {
  let timeout: number | undefined;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => handler(...args), delay);
  };
}
