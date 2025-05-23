export function setWithExpiry<T>(key: string, value: T, ttl: number): void {
  const now = new Date();

  const item = {
    value,
    expiry: now.getTime() + ttl,
  };

  localStorage.setItem(key, JSON.stringify(item));
}

export function getWithExpiry<T>(key: string): T | null {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }

  try {
    const item = JSON.parse(itemStr) as { value: T; expiry: number };
    const now = new Date();

    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  } catch {
    return null;
  }
}
