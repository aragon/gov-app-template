export interface ICache {
  /**
   * Retrieves a value from the cache.
   * @param key The key associated with the value to retrieve.
   * @returns The value or null if not found.
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Sets a value in the cache.
   * @param key The key associated with the value.
   * @param value The value to store.
   * @param ttl Time to live in seconds.
   */
  set<T>(key: string, value: T, ttl: number): Promise<void>;

  /**
   * Removes a value from the cache.
   * @param key The key associated with the value to remove.
   */
  remove(key: string): Promise<number>;

  /**
   * Clears the entire cache.
   */
  clear(): Promise<void>;
}
