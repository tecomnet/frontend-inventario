import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiProxy } from '../apiClient.js';
import { API_BASE } from '../config.js';

afterEach(() => { vi.unstubAllGlobals(); });

/** Sustituye fetch y devuelve los headers con los que se llamó. */
function capturarFetch(status = 200, body = '{}') {
  const fetchMock = vi.fn<(url: string, init: RequestInit) => Promise<Response>>(async () =>
    new Response(body, { status, headers: { 'Content-Type': 'application/json' } }));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('apiProxy', () => {
  it('agrega Authorization: Bearer con el token de la sesión', async () => {
    const fetchMock = capturarFetch();

    await apiProxy('GET', '/Productos?page=1', null, undefined, 'abc.def.ghi');

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${API_BASE}/Productos?page=1`);
    expect(init.headers).toMatchObject({ Authorization: 'Bearer abc.def.ghi' });
  });

  it('sin token no manda Authorization', async () => {
    const fetchMock = capturarFetch();

    await apiProxy('POST', '/Auth/login', Buffer.from('{}'), 'application/json');

    expect(fetchMock.mock.calls[0][1].headers).not.toHaveProperty('Authorization');
  });

  it('devuelve code 0 si la API no responde', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('fetch failed')));
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(await apiProxy('GET', '/Productos', null)).toMatchObject({ code: 0 });
  });
});
