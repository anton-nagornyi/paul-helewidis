type Value = {
  value: any,
  timeout: NodeJS.Timeout
};

/**
 * An incomplete mock of the Redis db. The only reason for having this is just to keep things simple. There should real
 * Redis client when we go to prod.
 */
export class RedisMock {
  private static map = new Map<string, Value>();

  static set = (key: string, value: any, ttl: number) => {
    const val = RedisMock.map.get(key);
    if (!val) {
      RedisMock.map.set(key, {
        value,
        timeout: setTimeout(() => RedisMock.map.delete(key), ttl),
      });
    } else {
      clearTimeout(val.timeout);
      val.timeout = setTimeout(() => RedisMock.map.delete(key), ttl);
      val.value = value;
    }
  };

  static get = (key: string) => RedisMock.map.get(key);

  static inc = (key: string, ttl: number) => {
    const val = RedisMock.get(key);
    if (!val) {
      RedisMock.set(key, 0, ttl);
    } else {
      RedisMock.set(key, val.value + 1, ttl);
    }
  };
}
