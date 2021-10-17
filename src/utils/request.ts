import fetch from 'cross-fetch';

export type Result<T> =
    | {
          ok: false;
          status: number;
          error?: string;
      }
    | {
          ok: true;
          status: number;
          data: T;
      };

// Incapsulate data getting
export const request = <T>(url: string, options?: RequestInit): Promise<Result<T>> => {
    return fetch(url, options)
        .then(async res => {
            const {ok, status} = res;
            const data = await res.json();

            if (ok) {
                return {ok, status, data: data as T};
            } else {
                return {ok, status, error: data.error};
            }
        })
        .catch(err => ({ok: false, status: 500, error: err}));
};
