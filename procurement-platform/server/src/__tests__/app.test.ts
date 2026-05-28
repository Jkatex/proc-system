import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../app.js';
import { registeredModules } from '../modules/index.js';

describe('ProcureX server skeleton', () => {
  it('returns health with all registered modules', async () => {
    const response = await request(createApp()).get('/health').expect(200);

    expect(response.body.status).toBe('ok');
    expect(response.body.modules).toHaveLength(registeredModules.length);
  });

  it('mounts each module status route', async () => {
    for (const module of registeredModules) {
      const response = await request(createApp()).get(module.basePath).expect(200);

      expect(response.body.key).toBe(module.key);
      expect(response.body.status).toBe('ready');
    }
  });
});

