import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { URL } from 'url';
import { RedisMock } from './RedisMock';
import { RateLimitError } from './errors/RateLimitError';

export class HttpLayer {
  /**
   * How many retries there will when the initial request failed.
   */
  private static readonly RETRY_COUNT = 2;

  /**
   * Time in ms to wait while destination services are cooling down.
   */
  private static readonly RATELIMIT_TTL = 10000;

  static request = async <T = any, R = AxiosResponse<T>> (config: AxiosRequestConfig): Promise<R> => {
    HttpLayer.rateLimit(config.url!);
    return HttpLayer.requestWithRetry<T, R>(config);
  };

  private static requestWithRetry = async <T = any, R = AxiosResponse<T>> (config: AxiosRequestConfig): Promise<R> => {
    let retries = HttpLayer.RETRY_COUNT;
    let lastError;
    while (retries-- > 0) {
      try {
        // eslint-disable-next-line no-await-in-loop
        return await axios.request(config);
      } catch (e) {
        lastError = e;
        if (!e.response) {
          throw e;
        }
      }
    }
    throw lastError;
  };

  private static rateLimit = (url: string) => {
    const parsedUrl = new URL(url);
    const currentRate = RedisMock.get(parsedUrl.hostname);
    if (currentRate && currentRate.value >= 5) {
      throw new RateLimitError();
    }
    RedisMock.inc(parsedUrl.hostname, HttpLayer.RATELIMIT_TTL);
  };
}
