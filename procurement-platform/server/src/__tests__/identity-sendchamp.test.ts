import { afterEach, describe, expect, it, vi } from 'vitest';
import { SendchampSmsProvider } from '../modules/identity/notifications.js';
import { SendchampNumberInsightProvider } from '../modules/identity/phoneValidation.js';
import { validateProductionSecurityConfig } from '../security/config.js';

const originalFetch = globalThis.fetch;
const originalEnv = { ...process.env };

function restoreEnv() {
  for (const key of Object.keys(process.env)) {
    if (!(key in originalEnv)) delete process.env[key];
  }
  Object.assign(process.env, originalEnv);
}

function mockJsonFetch(body: unknown, status = 200) {
  const fetchMock = vi.fn(async (_url: string | URL | Request, _options?: RequestInit) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } }));
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}

describe('Sendchamp identity integrations', () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
    restoreEnv();
    vi.restoreAllMocks();
  });

  it('formats Sendchamp SMS requests with bearer auth, sender, route, and no leading plus', async () => {
    const fetchMock = mockJsonFetch({ data: { reference: 'sms-reference-1' } });
    const provider = new SendchampSmsProvider({
      SENDCHAMP_BASE_URL: 'https://api.sendchamp.com/api/v1',
      SENDCHAMP_ACCESS_KEY: 'test-key',
      SENDCHAMP_SMS_SENDER: 'ProcureX',
      SENDCHAMP_SMS_ROUTE: 'international'
    } as NodeJS.ProcessEnv);

    const receipt = await provider.sendOtp({ to: '+255700000001', code: '123456', expiresInMinutes: 10 });

    expect(fetchMock).toHaveBeenCalledWith('https://api.sendchamp.com/api/v1/sms/send', expect.any(Object));
    const options = fetchMock.mock.calls[0][1] as RequestInit;
    expect(options.headers).toMatchObject({
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: 'Bearer test-key'
    });
    expect(JSON.parse(options.body as string)).toEqual({
      to: ['255700000001'],
      message: 'Your ProcureX verification code is 123456. It expires in 10 minutes.',
      sender_name: 'ProcureX',
      route: 'international'
    });
    expect(receipt).toEqual({ provider: 'sendchamp', messageId: 'sms-reference-1' });
  });

  it('formats Sendchamp Number Insight requests with the E.164 phone number', async () => {
    const fetchMock = mockJsonFetch({ data: { valid: true, reachable: true, status: 'valid' } });
    const provider = new SendchampNumberInsightProvider({
      SENDCHAMP_BASE_URL: 'https://api.sendchamp.com/api/v1',
      SENDCHAMP_ACCESS_KEY: 'test-key',
      SENDCHAMP_NUMBER_INSIGHT_ENABLED: 'true',
      SENDCHAMP_NUMBER_INSIGHT_TYPE: 'basic'
    } as NodeJS.ProcessEnv);

    const result = await provider.validate({ phone: '+255700000001' });

    expect(fetchMock).toHaveBeenCalledWith('https://api.sendchamp.com/api/v1/number-insights/check', expect.any(Object));
    const options = fetchMock.mock.calls[0][1] as RequestInit;
    expect(options.headers).toMatchObject({ authorization: 'Bearer test-key' });
    expect(JSON.parse(options.body as string)).toEqual({ phone_number: '+255700000001', type: 'basic' });
    expect(result).toMatchObject({
      provider: 'sendchamp-number-insight',
      configured: true,
      accepted: true,
      checks: { valid: true, reachable: true }
    });
  });

  it('rejects explicit invalid Number Insight results', async () => {
    mockJsonFetch({ data: { valid: false, reachable: true, status: 'invalid' } });
    const provider = new SendchampNumberInsightProvider({
      SENDCHAMP_BASE_URL: 'https://api.sendchamp.com/api/v1',
      SENDCHAMP_ACCESS_KEY: 'test-key',
      SENDCHAMP_NUMBER_INSIGHT_ENABLED: 'true',
      SENDCHAMP_NUMBER_INSIGHT_TYPE: 'basic'
    } as NodeJS.ProcessEnv);

    await expect(provider.validate({ phone: '+255700000001' })).resolves.toMatchObject({
      accepted: false,
      reasons: ['Phone number is invalid.']
    });
  });

  it('requires Sendchamp env in production when Sendchamp SMS is selected', () => {
    process.env.NODE_ENV = 'production';
    process.env.APP_ENV = 'production';
    process.env.IDENTITY_NOTIFICATION_PROVIDER = 'smtp';
    process.env.CORS_ORIGINS = 'https://app.procurex.test';
    process.env.REDIS_URL = 'redis://redis:6379';
    process.env.TURNSTILE_SECRET_KEY = 'turnstile-secret';
    process.env.APP_PUBLIC_URL = 'https://app.procurex.test';
    process.env.IDENTITY_SMS_PROVIDER = 'sendchamp';
    process.env.SENDCHAMP_ACCESS_KEY = 'test-key';
    process.env.SENDCHAMP_BASE_URL = 'https://api.sendchamp.com/api/v1';
    process.env.SENDCHAMP_SMS_SENDER = 'ProcureX';
    process.env.SENDCHAMP_SMS_ROUTE = 'international';
    process.env.SMTP_HOST = 'smtp.procurex.test';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_USER = 'smtp-user';
    process.env.SMTP_PASS = 'smtp-pass';
    process.env.SMTP_FROM = 'ProcureX <no-reply@procurex.test>';
    process.env.TRA_REGISTRY_BASE_URL = 'https://tra.procurex.test';
    process.env.TRA_REGISTRY_API_KEY = 'tra-key';
    process.env.BRELA_REGISTRY_BASE_URL = 'https://brela.procurex.test';
    process.env.BRELA_REGISTRY_API_KEY = 'brela-key';
    process.env.MAILBOXLAYER_ACCESS_KEY = 'mailboxlayer-key';
    process.env.SIGNATURE_HASH_SECRET = 'signature-secret';
    delete process.env.TWILIO_ACCOUNT_SID;
    delete process.env.TWILIO_AUTH_TOKEN;
    delete process.env.TWILIO_MESSAGING_SERVICE_SID;
    delete process.env.TWILIO_FROM_NUMBER;

    expect(() => validateProductionSecurityConfig()).not.toThrow();

    delete process.env.SENDCHAMP_ACCESS_KEY;
    expect(() => validateProductionSecurityConfig()).toThrow(/SENDCHAMP_ACCESS_KEY/);
  });
});
