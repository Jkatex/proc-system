import { AccountType, PublicPageKey, PublicPageStatus, VerificationStatus } from '@prisma/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ModuleService } from '../modules/identity/service.js';

class FakeIdentityRepository {
  users = new Map<string, any>();
  usersByEmail = new Map<string, any>();
  challenges = new Map<string, any>();
  registry = new Map<string, any>();
  sessions = new Map<string, any>();
  publicPages = new Map<string, any>();
  acceptances: any[] = [];
  profiles: any[] = [];
  id = 0;

  nextId(prefix: string) {
    this.id += 1;
    return `${prefix}-${this.id}`;
  }

  findUserByEmail(email: string) {
    return Promise.resolve(this.usersByEmail.get(email.toLowerCase()) ?? null);
  }

  findUserById(id: string) {
    return Promise.resolve(this.users.get(id) ?? null);
  }

  upsertRegistrationUser(input: { email: string; phone: string; displayName: string }) {
    const email = input.email.toLowerCase();
    const existing = this.usersByEmail.get(email);
    if (existing) {
      existing.phone = input.phone;
      existing.displayName = input.displayName;
      return Promise.resolve(existing);
    }

    const user = {
      id: this.nextId('user'),
      email,
      phone: input.phone,
      displayName: input.displayName,
      passwordHash: null,
      accountType: AccountType.USER,
      verificationStatus: VerificationStatus.NOT_STARTED,
      metadata: {},
      memberships: []
    };
    this.users.set(user.id, user);
    this.usersByEmail.set(email, user);
    return Promise.resolve(user);
  }

  updateUser(id: string, data: Record<string, unknown>) {
    const user = this.users.get(id);
    Object.assign(user, data);
    return Promise.resolve(user);
  }

  createChallenge(input: Record<string, unknown>) {
    const challenge = {
      id: this.nextId('challenge'),
      status: 'PENDING',
      attempts: 0,
      consumedAt: null,
      createdAt: new Date(),
      ...input
    };
    this.challenges.set(challenge.id, challenge);
    return Promise.resolve(challenge);
  }

  findChallenge(id: string) {
    const challenge = this.challenges.get(id);
    if (!challenge) return Promise.resolve(null);
    return Promise.resolve({
      ...challenge,
      user: challenge.userId ? this.users.get(challenge.userId) : null
    });
  }

  incrementChallengeAttempts(id: string) {
    const challenge = this.challenges.get(id);
    challenge.attempts += 1;
    return Promise.resolve(challenge);
  }

  consumeChallenge(id: string) {
    const challenge = this.challenges.get(id);
    challenge.status = 'CONSUMED';
    challenge.consumedAt = new Date();
    return Promise.resolve({
      ...challenge,
      user: challenge.userId ? this.users.get(challenge.userId) : null
    });
  }

  upsertPasswordAccount() {
    return Promise.resolve({});
  }

  findCurrentPublicPageVersion(pageKey: PublicPageKey) {
    return Promise.resolve(
      this.publicPages.get(pageKey) ?? {
        id: `${pageKey}-version`,
        pageKey,
        version: '2026.06.06',
        status: PublicPageStatus.PUBLISHED
      }
    );
  }

  findPublicPageVersionById(id: string) {
    return Promise.resolve(Array.from(this.publicPages.values()).find((page) => page.id === id) ?? null);
  }

  createUserPolicyAcceptance(input: Record<string, unknown>) {
    const acceptance = { id: this.nextId('acceptance'), ...input, acceptedAt: new Date() };
    this.acceptances.push(acceptance);
    return Promise.resolve(acceptance);
  }

  createSession(input: { userId: string; organizationId?: string; tokenHash: string; expiresAt: Date }) {
    const user = this.users.get(input.userId);
    const organization = user.memberships[0]?.organization;
    const session = {
      id: this.nextId('session'),
      ...input,
      status: 'ACTIVE',
      createdAt: new Date(),
      user,
      organization
    };
    this.sessions.set(input.tokenHash, session);
    return Promise.resolve(session);
  }

  findActiveSession(tokenHash: string) {
    return Promise.resolve(this.sessions.get(tokenHash) ?? null);
  }

  findRegistryRecord(source: string, registryNumber: string) {
    return Promise.resolve(this.registry.get(`${source}:${registryNumber}`) ?? null);
  }

  upsertDevRegistryRecord(input: { source: string; registryNumber: string; entityType: string; name: string; payload?: Record<string, unknown> }) {
    const key = `${input.source}:${input.registryNumber}`;
    const existing = this.registry.get(key);
    const record =
      existing ??
      {
        id: this.nextId('registry'),
        source: input.source,
        registryNumber: input.registryNumber,
        entityType: input.entityType,
        name: input.name,
        status: 'MATCHED',
        confidence: 100,
        payload: input.payload ?? {},
        createdAt: new Date(),
        updatedAt: new Date()
      };

    Object.assign(record, {
      entityType: input.entityType,
      name: input.name,
      status: 'MATCHED',
      confidence: 100,
      payload: input.payload ?? {}
    });
    this.registry.set(key, record);
    return Promise.resolve(record);
  }

  latestVerificationProfile(userId: string) {
    return Promise.resolve(this.profiles.find((profile) => profile.userId === userId) ?? null);
  }

  countApprovedRegistryDuplicates(input: { userId: string; registrySource: string; registryNumber: string }) {
    return Promise.resolve(
      this.profiles.filter(
        (profile) =>
          profile.userId !== input.userId &&
          profile.status === VerificationStatus.APPROVED &&
          profile.registrySource === input.registrySource &&
          profile.registryNumber === input.registryNumber
      ).length
    );
  }

  createOrUpdateVerifiedOrganization(input: { userId: string; organizationName: string; entityType: string; registrySource: string; registryNumber: string }) {
    const organization = {
      id: this.nextId('org'),
      name: input.organizationName,
      capabilities: [{ capability: 'BUYER' }, { capability: 'SUPPLIER' }]
    };
    const user = this.users.get(input.userId);
    user.memberships = [{ status: 'ACTIVE', isDefault: true, organization }];
    return Promise.resolve(organization);
  }

  upsertVerificationProfile(input: Record<string, unknown>) {
    let profile = this.profiles.find((item) => item.userId === input.userId);
    if (!profile) {
      profile = {
        id: this.nextId('profile'),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.profiles.push(profile);
    }
    Object.assign(profile, input, { updatedAt: new Date() });
    return Promise.resolve(profile);
  }

  createAuditEvent() {
    return Promise.resolve({});
  }

  createAdminAction() {
    return Promise.resolve({});
  }
}

describe('identity dev bypass', () => {
  const originalBypass = process.env.IDENTITY_DEV_BYPASS;
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    if (originalBypass === undefined) delete process.env.IDENTITY_DEV_BYPASS;
    else process.env.IDENTITY_DEV_BYPASS = originalBypass;

    if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalNodeEnv;
  });

  it('rejects the fallback OTP when the bypass is disabled', async () => {
    process.env.IDENTITY_DEV_BYPASS = 'false';
    const repository = new FakeIdentityRepository();
    const service = new ModuleService(repository as any);
    const registration = await service.startRegistration({ email: 'new-user@example.test', phone: '+255 700 000 001' });
    repository.challenges.get(registration.challengeId).codeHash = 'not-the-fallback-hash';

    await expect(service.verifyOtp(registration.challengeId, '000000')).rejects.toMatchObject({ status: 400 });
  });

  it('creates a user who can verify, activate, set a password, and sign in with dev fallback codes', async () => {
    process.env.IDENTITY_DEV_BYPASS = 'true';
    const repository = new FakeIdentityRepository();
    const service = new ModuleService(repository as any);
    const registration = await service.startRegistration({ email: 'walkthrough@example.test', phone: '+255 700 000 002' });

    const otp = await service.verifyOtp(registration.challengeId, '000000');
    await service.activateEmail(otp.activationChallengeId, '00000000');
    await service.setPassword('walkthrough@example.test', 'Strong123!');
    const session = await service.signIn('walkthrough@example.test', 'Strong123!');

    expect(session.user.email).toBe('walkthrough@example.test');
    expect(session.user.verificationStatus).toBe(VerificationStatus.NOT_STARTED);
  });

  it('records accepted terms and privacy versions when setting a password', async () => {
    process.env.IDENTITY_DEV_BYPASS = 'true';
    const repository = new FakeIdentityRepository();
    const service = new ModuleService(repository as any);
    const termsPage = {
      id: 'terms-version-2026-06-06',
      pageKey: PublicPageKey.TERMS_AND_CONDITIONS,
      version: '2026.06.06',
      status: PublicPageStatus.PUBLISHED
    };
    const privacyPage = {
      id: 'privacy-version-2026-06-06',
      pageKey: PublicPageKey.PRIVACY_POLICY,
      version: '2026.06.06',
      status: PublicPageStatus.PUBLISHED
    };
    repository.publicPages.set(PublicPageKey.TERMS_AND_CONDITIONS, termsPage);
    repository.publicPages.set(PublicPageKey.PRIVACY_POLICY, privacyPage);
    const registration = await service.startRegistration({ email: 'legal@example.test', phone: '+255 700 000 004' });

    const otp = await service.verifyOtp(registration.challengeId, '000000');
    await service.activateEmail(otp.activationChallengeId, '00000000');
    await service.setPassword('legal@example.test', 'Strong123!', {
      termsAccepted: true,
      privacyAccepted: true,
      termsVersionId: termsPage.id,
      privacyVersionId: privacyPage.id,
      source: 'registration',
      ipAddress: '127.0.0.1',
      userAgent: 'vitest'
    });

    expect(repository.acceptances).toHaveLength(1);
    expect(repository.acceptances[0]).toMatchObject({
      termsVersionId: termsPage.id,
      privacyVersionId: privacyPage.id,
      source: 'registration',
      ipAddress: '127.0.0.1',
      userAgent: 'vitest',
      payload: {
        termsVersion: termsPage.version,
        privacyVersion: privacyPage.version
      }
    });
  });

  it('creates a dev registry record and auto-approves eKYC when the user confirms the details', async () => {
    process.env.IDENTITY_DEV_BYPASS = 'true';
    const repository = new FakeIdentityRepository();
    const service = new ModuleService(repository as any);
    const registration = await service.startRegistration({ email: 'ekyc@example.test', phone: '+255 700 000 003' });
    const otp = await service.verifyOtp(registration.challengeId, '000000');
    await service.activateEmail(otp.activationChallengeId, '00000000');
    await service.setPassword('ekyc@example.test', 'Strong123!');
    const session = await service.signIn('ekyc@example.test', 'Strong123!');

    const registry = await service.registryLookup({
      entityType: 'business',
      businessRegistrationSource: 'tin',
      registryNumber: 'TIN-DEV-001'
    });
    const result = await service.submitVerification(session.token, {
      entityType: 'business',
      businessRegistrationSource: 'tin',
      registrySource: registry.source,
      registryNumber: registry.registryNumber,
      registryVerified: true,
      registryRecordId: registry.id,
      signatureName: 'Walkthrough Owner',
      signatureConsent: true
    });

    expect(registry.status).toBe('MATCHED');
    expect(result.autoApproved).toBe(true);
    expect(result.user.verificationStatus).toBe(VerificationStatus.APPROVED);
  });
});
