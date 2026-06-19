export type PhoneValidationRequest = {
  phone: string;
};

export type PhoneValidationResult = {
  provider: string;
  configured: boolean;
  accepted: boolean;
  reasons: string[];
  checks?: {
    valid?: boolean;
    reachable?: boolean;
  };
  providerMetadata?: Record<string, unknown>;
};

export interface PhoneValidationProvider {
  validate(input: PhoneValidationRequest): Promise<PhoneValidationResult>;
}

type JsonObject = Record<string, unknown>;

type SendchampNumberInsightResponse = JsonObject & {
  success?: boolean;
  error?: unknown;
  data?: unknown;
};

function providerError(message: string) {
  const error = new Error(message) as Error & { providerFailure?: true };
  error.providerFailure = true;
  return error;
}

function boolEnv(value: string | undefined, fallback: boolean) {
  if (value === undefined || value === '') return fallback;
  return value === 'true' || value === '1';
}

function sendchampEndpoint(baseUrl: string, path: string) {
  return `${baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

function objectValues(value: unknown): unknown[] {
  if (!value || typeof value !== 'object') return [];
  if (Array.isArray(value)) return value;
  return Object.values(value);
}

function findBooleanByKey(value: unknown, keys: Set<string>): boolean | undefined {
  if (!value || typeof value !== 'object') return undefined;
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findBooleanByKey(item, keys);
      if (found !== undefined) return found;
    }
    return undefined;
  }

  for (const [key, item] of Object.entries(value)) {
    if (keys.has(key.toLowerCase()) && typeof item === 'boolean') return item;
  }
  for (const item of objectValues(value)) {
    const found = findBooleanByKey(item, keys);
    if (found !== undefined) return found;
  }
  return undefined;
}

function findStringByKey(value: unknown, keys: Set<string>): string | undefined {
  if (!value || typeof value !== 'object') return undefined;
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findStringByKey(item, keys);
      if (found) return found;
    }
    return undefined;
  }

  for (const [key, item] of Object.entries(value)) {
    if (keys.has(key.toLowerCase()) && typeof item === 'string' && item.trim()) return item;
  }
  for (const item of objectValues(value)) {
    const found = findStringByKey(item, keys);
    if (found) return found;
  }
  return undefined;
}

function errorMessage(error: unknown) {
  if (error && typeof error === 'object' && !Array.isArray(error)) {
    const input = error as { message?: unknown; type?: unknown; info?: unknown };
    for (const value of [input.message, input.type, input.info]) {
      if (typeof value === 'string' && value.trim()) return value;
    }
  }
  return 'Sendchamp Number Insight rejected the request.';
}

export class SendchampNumberInsightProvider implements PhoneValidationProvider {
  constructor(private readonly config = process.env) {}

  async validate(input: PhoneValidationRequest): Promise<PhoneValidationResult> {
    const accessKey = this.config.SENDCHAMP_ACCESS_KEY?.trim();
    const enabled = boolEnv(this.config.SENDCHAMP_NUMBER_INSIGHT_ENABLED, Boolean(accessKey));
    if (!enabled) {
      return {
        provider: 'sendchamp-number-insight',
        configured: false,
        accepted: true,
        reasons: []
      };
    }
    if (!accessKey) {
      throw providerError('Sendchamp access key is not configured.');
    }

    const response = await fetch(sendchampEndpoint(this.config.SENDCHAMP_BASE_URL || 'https://api.sendchamp.com/api/v1', '/number-insights/check'), {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${accessKey}`
      },
      body: JSON.stringify({
        phone_number: input.phone,
        type: this.config.SENDCHAMP_NUMBER_INSIGHT_TYPE || 'basic'
      })
    }).catch((error: unknown) => {
      throw providerError(error instanceof Error ? error.message : 'Sendchamp Number Insight request failed.');
    });

    if (!response.ok) {
      throw providerError(`Sendchamp Number Insight returned ${response.status}.`);
    }

    const body = (await response.json().catch(() => {
      throw providerError('Sendchamp Number Insight returned invalid JSON.');
    })) as SendchampNumberInsightResponse;

    if (body.success === false || body.error) {
      throw providerError(errorMessage(body.error));
    }

    const valid = findBooleanByKey(body, new Set(['valid', 'is_valid', 'number_valid', 'phone_number_valid']));
    const reachable = findBooleanByKey(body, new Set(['reachable', 'is_reachable']));
    const status = findStringByKey(body, new Set(['status', 'validity', 'reachability']))?.toLowerCase();
    const reasons: string[] = [];

    if (valid === false || status === 'invalid') reasons.push('Phone number is invalid.');
    if (reachable === false || status === 'unreachable') reasons.push('Phone number is unreachable.');

    return {
      provider: 'sendchamp-number-insight',
      configured: true,
      accepted: reasons.length === 0,
      reasons,
      checks: { valid, reachable },
      providerMetadata: {
        type: this.config.SENDCHAMP_NUMBER_INSIGHT_TYPE || 'basic',
        status
      }
    };
  }
}

export function isPhoneValidationProviderFailure(error: unknown) {
  return Boolean((error as Error & { providerFailure?: true }).providerFailure);
}
