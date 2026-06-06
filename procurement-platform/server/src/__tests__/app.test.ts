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

  it('returns the public welcome contract without authentication', async () => {
    const response = await request(createApp()).get('/api/procurement/public/welcome').expect(200);

    expect(response.body.stats).toEqual(
      expect.objectContaining({
        participantCount: expect.any(Number),
        participantLabel: expect.any(String),
        openTenderCount: expect.any(Number),
        verifiedProfileCompletionRate: expect.any(Number),
        activeWorkspaceLabel: expect.any(String)
      })
    );
    expect(response.body.featuredTenders[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        reference: expect.any(String),
        title: expect.any(String),
        buyerName: expect.any(String),
        type: expect.any(String),
        status: expect.any(String),
        currency: expect.any(String),
        categories: expect.any(Array)
      })
    );
  });

  it('returns public page and current legal version contracts without authentication', async () => {
    const pageResponse = await request(createApp()).get('/api/public/pages/privacy-policy').expect(200);
    expect(pageResponse.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        pageKey: 'privacy-policy',
        version: expect.any(String),
        status: 'PUBLISHED',
        title: 'Privacy Policy',
        content: expect.any(Object),
        effectiveAt: expect.any(String),
        lastUpdated: expect.any(String)
      })
    );

    const legalResponse = await request(createApp()).get('/api/public/legal/current').expect(200);
    expect(legalResponse.body.terms.pageKey).toBe('terms-and-conditions');
    expect(legalResponse.body.privacy.pageKey).toBe('privacy-policy');
  });
});
