import { Action, ActionPayload, BulkVerb } from '../types';
import { HttpLayer } from '../utils/HttpLayer';

export class BulkService {
  executeBulkAction = async (action: Action) => {
    const res = action.payload ? await Promise.all(
      action.payload.map(async (p) => this.executeAction(action.url, action.verb, p)),
    ) : [(await this.executeAction(action.url, action.verb))];

    const summary = { success: 0, fail: 0, total: '0%' };
    res.reduce((prev, current) => {
      if (current.error) {
        // eslint-disable-next-line no-param-reassign
        prev.fail++;
      } else {
        // eslint-disable-next-line no-param-reassign
        prev.success++;
      }
      return prev;
    }, summary);

    summary.total = `${(100 * summary.success / (summary.success + summary.fail)).toFixed(2)}%`;

    return {
      invocations: res,
      summary,
    };
  };

  private executeAction = async (url: string, verb: BulkVerb, payload?: ActionPayload, body?: Action['body']) => {
    const data = payload ? body : undefined;
    try {
      const res = await HttpLayer.request({
        url: payload && payload.variables ? this.prepareUrl(url, payload.variables) : url,
        method: verb,
        data,
      });
      return { status: res.status };
    } catch (e) {
      if (e.response) {
        return { status: e.response.status, error: e.response.statusText };
      }
      return { error: e.message };
    }
  };

  private prepareUrl = (url: string, params: { [key: string]: any }): string => {
    const replacements = [...url.matchAll(/{.*?}/g)].map(([m]) => m);
    let res = url;
    for (const r of replacements) {
      const varName = r.substr(1, r.length - 2);
      const val = params[varName];
      if (val) {
        res = res.replace(new RegExp(r, 'g'), val);
      }
    }
    return res;
  };
}
