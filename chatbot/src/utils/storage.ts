export function setLocal(key: string, value: any): void {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getLocal<T>(key: string): T | null {
  const value = window.localStorage.getItem(key);
  if (value) {
    return JSON.parse(value) as T;
  }
  return null;
}

export function removeLocal(key: string): void {
  window.localStorage.removeItem(key);
}

export function clearLocal(): void {
  window.localStorage.clear();
}

export function setCookie(key: string, value: string, days: number = 7): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${key}=${value};expires=${expires.toUTCString()};path=/`;
}

export function getCookie(key: string): string | null {
  const nameEQ = key + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function removeCookie(key: string): void {
  document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
}