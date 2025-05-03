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
  