import {
  AccountType,
  AdminActionType,
  AuditSeverity,
  PublicPageKey,
  VerificationStatus,
  type Prisma
} from '@prisma/client';
import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
import { ModuleRepository, type SessionWithUser, type UserWithDefaultOrg, type VerificationWithUser } from './repository.js';
import {
  moduleDefinition,
  type AdminVerificationDto,
  type AuthSessionDto,
  type ModuleStatus,
  type RegistryRecordDto,
  type SessionUserDto,
  type VerificationProfileDto
} from './types.js';

const scrypt = promisify(scryptCallback);
const phoneOtpPurpose = 'PHONE_OTP';
const emailActivationPurpose = 'EMAIL_ACTIVATION';
const passwordResetPurpose = 'PASSWORD_RESET';
const devOtpCode = '000000';
const devActivationCode = '00000000';
const sessionDays = 7;

type RegistrationStartInput = {
  email: string;
  phone: string;
};

type LegalAcceptanceInput = {
  termsAccepted: true;
  privacyAccepted: true;
  termsVersionId?: string;
  privacyVersionId?: string;
  source: string;
  ipAddress?: string;
  userAgent?: string;
};

type VerificationPayloadInput = {
  entityType?: 'individual' | 'company' | 'business';
  businessRegistrationSource?: 'tin' | 'brela';
  registrySource?: string;
  registryNumber?: string;
  registryVerified?: boolean;
  registryRecordId?: string;
  signatureName?: string;
  signatureTitle?: string;
  signatureConsent?: boolean;
  profile?: Record<string, unknown>;
  documents?: Record<string, unknown>[];
};

type RegistryLookupInput = {
  entityType: 'individual' | 'company' | 'business';
  businessRegistrationSource?: 'tin' | 'brela';
  registryNumber: string;
};

function requestError(message: string, status = 400) {
  const error = new Error(message) as Error & { status?: number };
  error.status = status;
  return error;
}

function identityDevBypassEnabled() {
  return process.env.IDENTITY_DEV_BYPASS === 'true' && process.env.NODE_ENV !== 'production';
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizePhone(phone: string) {
  return phone.trim().replace(/\s+/g, ' ');
}

function displayNameFromEmail(email: string) {
  return email
    .split('@')[0]
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

function randomCode(length = 6) {
  const max = 10 ** length;
  return String(Math.floor(Math.random() * max)).padStart(length, '0');
}

function randomToken(bytes = 32) {
  return randomBytes(bytes).toString('base64url');
}

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt:${salt}:${derived.toString('hex')}`;
}

async function verifyPassword(password: string, stored?: string | null) {
  if (!stored?.startsWith('scrypt:')) return false;

  const [, salt, hash] = stored.split(':');
  if (!salt || !hash) return false;

  const derived = (await scrypt(password, salt, 64)) as Buffer;
  const storedBuffer = Buffer.from(hash, 'hex');
  return storedBuffer.length === derived.length && timingSafeEqual(storedBuffer, derived);
}

function metadataObject(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function inputJson(value: Record<string, unknown>): Prisma.InputJsonObject {
  return value as Prisma.InputJsonObject;
}

function toSessionUser(user: UserWithDefaultOrg): SessionUserDto {
  const membership = user.memberships[0];
  const organization = membership?.organization;
  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    displayName: user.displayName,
    accountType: user.accountType,
    verificationStatus: user.verificationStatus,
    organization: organization?.name,
    organizationId: organization?.id,
    capabilities: organization?.capabilities.map((item) => item.capability) ?? []
  };
}

function toSessionUserFromSession(session: SessionWithUser): SessionUserDto {
  const organization = session.organization ?? session.user.memberships[0]?.organization;
  return {
    id: session.user.id,
    email: session.user.email,
    phone: session.user.phone,
    displayName: session.user.displayName,
    accountType: session.user.accountType,
    verificationStatus: session.user.verificationStatus,
    organization: organization?.name,
    organizationId: organization?.id,
    capabilities: organization?.capabilities.map((item) => item.capability) ?? []
  };
}

function toProfileDto(profile: {
  id: string;
  status: VerificationStatus;
  registrySource: string | null;
  registryNumber: string | null;
  payload: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
}): VerificationProfileDto {
  return {
    id: profile.id,
    status: profile.status,
    registrySource: profile.registrySource,
    registryNumber: profile.registryNumber,
    payload: metadataObject(profile.payload),
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString()
  };
}

function registrySourceFor(input: RegistryLookupInput) {
  if (input.entityType === 'company') return 'BRELA';
  if (input.entityType === 'business' && input.businessRegistrationSource === 'brela') return 'BRELA';
  return 'TRA';
}

function registryPayload(record: {
  id: string;
  source: string;
  registryNumber: string;
  entityType: string;
  name: string;
  status: string;
  confidence: number;
  payload: Prisma.JsonValue;
}): RegistryRecordDto {
  return {
    id: record.id,
    source: record.source,
    registryNumber: record.registryNumber,
    entityType: record.entityType,
    name: record.name,
    status: record.status,
    confidence: record.confidence,
    payload: metadataObject(record.payload)
  };
}

function devRegistryName(input: RegistryLookupInput, registryNumber: string) {
  const label = input.entityType === 'individual' ? 'Individual' : input.entityType === 'company' ? 'Company' : 'Business';
  return `${label} ${registryNumber}`;
}

export class ModuleService {
  constructor(private readonly repository = new ModuleRepository()) {}

  async status(): Promise<ModuleStatus> {
    await this.repository.health();

    return {
      ...moduleDefinition,
      status: 'ready'
    };
  }

  async startRegistration(input: RegistrationStartInput) {
    const email = normalizeEmail(input.email);
    const phone = normalizePhone(input.phone);
    const existing = await this.repository.findUserByEmail(email);

    if (existing?.passwordHash) {
      throw requestError('An account already exists for this email.', 409);
    }

    const user = await this.repository.upsertRegistrationUser({
      email,
      phone,
      displayName: existing?.displayName ?? displayNameFromEmail(email)
    });
    const code = randomCode();
    const challenge = await this.repository.createChallenge({
      userId: user.id,
      purpose: phoneOtpPurpose,
      target: phone,
      codeHash: sha256(code),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      metadata: { email }
    });

    return {
      user: toSessionUser(user),
      challengeId: challenge.id,
      expiresAt: challenge.expiresAt.toISOString()
    };
  }

  async verifyOtp(challengeId: string, code: string) {
    const challenge = await this.repository.findChallenge(challengeId);
    if (!challenge || challenge.purpose !== phoneOtpPurpose) {
      throw requestError('OTP challenge was not found.', 404);
    }
    if (challenge.status !== 'PENDING' || challenge.expiresAt < new Date()) {
      throw requestError('OTP challenge is no longer valid.', 410);
    }
    const usingDevBypassCode = identityDevBypassEnabled() && code === devOtpCode;
    if (!usingDevBypassCode && challenge.codeHash !== sha256(code)) {
      await this.repository.incrementChallengeAttempts(challenge.id);
      throw requestError('OTP code is incorrect.', 400);
    }
    if (!challenge.user) throw requestError('OTP challenge is not linked to a user.', 400);

    const consumed = await this.repository.consumeChallenge(challenge.id);
    const user = consumed.user;
    if (!user) throw requestError('OTP challenge is not linked to a user.', 400);

    const userMetadata = metadataObject(user.metadata);
    await this.repository.updateUser(user.id, {
      metadata: inputJson({
        ...userMetadata,
        phoneVerified: true,
        phoneVerifiedAt: new Date().toISOString()
      })
    });

    const activationCode = randomToken(8);
    const activation = await this.repository.createChallenge({
      userId: user.id,
      purpose: emailActivationPurpose,
      target: user.email,
      codeHash: sha256(activationCode),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      metadata: { phoneChallengeId: challenge.id }
    });

    return {
      activationChallengeId: activation.id,
      expiresAt: activation.expiresAt.toISOString(),
      ...(identityDevBypassEnabled() ? { devBypass: true } : {})
    };
  }

  async activateEmail(challengeId: string, code: string) {
    const challenge = await this.repository.findChallenge(challengeId);
    if (!challenge || challenge.purpose !== emailActivationPurpose) {
      throw requestError('Activation challenge was not found.', 404);
    }
    if (challenge.status !== 'PENDING' || challenge.expiresAt < new Date()) {
      throw requestError('Activation challenge is no longer valid.', 410);
    }
    const usingDevBypassCode = identityDevBypassEnabled() && code === devActivationCode;
    if (!usingDevBypassCode && challenge.codeHash !== sha256(code)) {
      await this.repository.incrementChallengeAttempts(challenge.id);
      throw requestError('Activation code is incorrect.', 400);
    }
    if (!challenge.user) throw requestError('Activation challenge is not linked to a user.', 400);

    const consumed = await this.repository.consumeChallenge(challenge.id);
    const user = consumed.user;
    if (!user) throw requestError('Activation challenge is not linked to a user.', 400);

    const userMetadata = metadataObject(user.metadata);
    const updated = await this.repository.updateUser(user.id, {
      metadata: inputJson({
        ...userMetadata,
        emailVerified: true,
        emailVerifiedAt: new Date().toISOString()
      })
    });

    return { user: toSessionUser(updated) };
  }

  async setPassword(emailInput: string, password: string, legalAcceptance?: LegalAcceptanceInput) {
    const email = normalizeEmail(emailInput);
    const user = await this.repository.findUserByEmail(email);
    if (!user) throw requestError('Account was not found.', 404);

    const metadata = metadataObject(user.metadata);
    if (!metadata.phoneVerified || !metadata.emailVerified) {
      throw requestError('Verify phone and email before setting a password.', 409);
    }

    const passwordHash = await hashPassword(password);
    const updated = await this.repository.updateUser(user.id, { passwordHash });
    await this.repository.upsertPasswordAccount(updated.id, updated.email);
    if (legalAcceptance) await this.recordLegalAcceptance(updated.id, legalAcceptance);

    return { user: toSessionUser(updated) };
  }

  private async recordLegalAcceptance(userId: string, input: LegalAcceptanceInput) {
    if (!input.termsAccepted || !input.privacyAccepted) {
      throw requestError('Terms and privacy acceptance is required.', 400);
    }

    const [termsVersion, privacyVersion] = await Promise.all([
      input.termsVersionId
        ? this.repository.findPublicPageVersionById(input.termsVersionId)
        : this.repository.findCurrentPublicPageVersion(PublicPageKey.TERMS_AND_CONDITIONS),
      input.privacyVersionId
        ? this.repository.findPublicPageVersionById(input.privacyVersionId)
        : this.repository.findCurrentPublicPageVersion(PublicPageKey.PRIVACY_POLICY)
    ]);

    if (!termsVersion || termsVersion.pageKey !== PublicPageKey.TERMS_AND_CONDITIONS) {
      throw requestError('Current Terms and Conditions version was not found.', 409);
    }
    if (!privacyVersion || privacyVersion.pageKey !== PublicPageKey.PRIVACY_POLICY) {
      throw requestError('Current Privacy Policy version was not found.', 409);
    }

    await this.repository.createUserPolicyAcceptance({
      userId,
      termsVersionId: termsVersion.id,
      privacyVersionId: privacyVersion.id,
      source: input.source,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
      payload: inputJson({
        termsVersion: termsVersion.version,
        privacyVersion: privacyVersion.version,
        acceptedAt: new Date().toISOString()
      })
    });
  }

  async signIn(emailInput: string, password: string): Promise<AuthSessionDto> {
    const email = normalizeEmail(emailInput);
    const user = await this.repository.findUserByEmail(email);
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      throw requestError('Invalid email or password.', 401);
    }

    const token = randomToken();
    const expiresAt = new Date(Date.now() + sessionDays * 24 * 60 * 60 * 1000);
    const session = await this.repository.createSession({
      userId: user.id,
      organizationId: user.memberships[0]?.organization.id,
      tokenHash: sha256(token),
      expiresAt
    });

    return {
      token,
      user: toSessionUserFromSession(session),
      expiresAt: expiresAt.toISOString()
    };
  }

  async forgotPassword(emailInput: string) {
    const email = normalizeEmail(emailInput);
    const user = await this.repository.findUserByEmail(email);

    if (!user?.passwordHash) {
      return {
        ok: true,
        message: 'If an account exists for this email, password reset instructions have been sent.'
      };
    }

    const code = randomCode();
    const challenge = await this.repository.createChallenge({
      userId: user.id,
      purpose: passwordResetPurpose,
      target: email,
      codeHash: sha256(code),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      metadata: {
        email,
        delivery: 'email'
      }
    });

    return {
      ok: true,
      message: 'If an account exists for this email, password reset instructions have been sent.',
      challengeId: challenge.id,
      expiresAt: challenge.expiresAt.toISOString()
    };
  }

  async resetPassword(challengeId: string, code: string, password: string) {
    const challenge = await this.repository.findChallenge(challengeId);
    if (!challenge || challenge.purpose !== passwordResetPurpose) {
      throw requestError('Password reset request was not found.', 404);
    }
    if (challenge.status !== 'PENDING' || challenge.expiresAt < new Date()) {
      throw requestError('Password reset request is no longer valid.', 410);
    }
    if (challenge.codeHash !== sha256(code)) {
      await this.repository.incrementChallengeAttempts(challenge.id);
      throw requestError('Password reset code is incorrect.', 400);
    }
    if (!challenge.user) throw requestError('Password reset request is not linked to a user.', 400);

    const consumed = await this.repository.consumeChallenge(challenge.id);
    const user = consumed.user;
    if (!user) throw requestError('Password reset request is not linked to a user.', 400);

    const passwordHash = await hashPassword(password);
    const updated = await this.repository.updateUser(user.id, { passwordHash });
    await this.repository.upsertPasswordAccount(updated.id, updated.email);

    return {
      ok: true,
      user: toSessionUser(updated)
    };
  }

  async sessionFromToken(token: string) {
    const session = await this.repository.findActiveSession(sha256(token));
    if (!session) throw requestError('Session is invalid or expired.', 401);
    return {
      user: toSessionUserFromSession(session),
      expiresAt: session.expiresAt.toISOString()
    };
  }

  async signOut(token: string) {
    await this.repository.revokeSession(sha256(token));
    return { ok: true };
  }

  async requireSession(token?: string) {
    if (!token) throw requestError('Authentication is required.', 401);
    return this.sessionFromToken(token);
  }

  async requireAdmin(token?: string) {
    const session = await this.requireSession(token);
    if (session.user.accountType !== AccountType.ADMIN) {
      throw requestError('Admin access is required.', 403);
    }
    return session;
  }

  async registryLookup(input: RegistryLookupInput) {
    const source = registrySourceFor(input);
    const registryNumber = input.registryNumber.trim();
    let record = await this.repository.findRegistryRecord(source, registryNumber);

    if (!record && identityDevBypassEnabled()) {
      record = await this.repository.upsertDevRegistryRecord({
        source,
        registryNumber,
        entityType: input.entityType,
        name: devRegistryName(input, registryNumber),
        payload: {}
      });
    }

    if (!record || (!identityDevBypassEnabled() && record.entityType !== input.entityType)) {
      throw requestError('No matching registry record was found.', 404);
    }

    return registryPayload(record);
  }

  async getVerificationMe(token?: string) {
    const { user } = await this.requireSession(token);
    const profile = await this.repository.latestVerificationProfile(user.id);
    return {
      user,
      verification: profile ? toProfileDto(profile) : null
    };
  }

  async saveVerificationDraft(token: string | undefined, input: VerificationPayloadInput) {
    const { user } = await this.requireSession(token);
    const existing = await this.repository.latestVerificationProfile(user.id);
    const payload = inputJson({
      ...metadataObject(existing?.payload),
      ...input,
      savedAt: new Date().toISOString()
    });

    const profile = await this.repository.upsertVerificationProfile({
      userId: user.id,
      organizationId: user.organizationId,
      status: VerificationStatus.DRAFT,
      registrySource: input.registrySource ?? existing?.registrySource,
      registryNumber: input.registryNumber ?? existing?.registryNumber,
      payload
    });

    await this.repository.updateUser(user.id, { verificationStatus: VerificationStatus.DRAFT });
    return toProfileDto(profile);
  }

  async updateProfile(token: string | undefined, input: { profile: Record<string, unknown>; documents?: Record<string, unknown>[] }) {
    const { user } = await this.requireSession(token);
    const existing = await this.repository.latestVerificationProfile(user.id);
    const payload = inputJson({
      ...metadataObject(existing?.payload),
      profile: input.profile,
      documents: input.documents ?? metadataObject(existing?.payload).documents ?? [],
      profileSavedAt: new Date().toISOString()
    });
    const profile = await this.repository.upsertVerificationProfile({
      userId: user.id,
      organizationId: user.organizationId,
      status: existing?.status ?? VerificationStatus.DRAFT,
      registrySource: existing?.registrySource,
      registryNumber: existing?.registryNumber,
      payload
    });

    return toProfileDto(profile);
  }

  async submitVerification(token: string | undefined, input: Required<Pick<VerificationPayloadInput, 'entityType' | 'registrySource' | 'registryNumber' | 'registryVerified' | 'registryRecordId' | 'signatureName' | 'signatureConsent'>> & VerificationPayloadInput) {
    const { user } = await this.requireSession(token);
    const fullUser = await this.repository.findUserById(user.id);
    if (!fullUser) throw requestError('Current user was not found.', 404);

    const registry = await this.repository.findRegistryRecord(input.registrySource, input.registryNumber);
    if (!registry || registry.id !== input.registryRecordId) {
      throw requestError('Registry record must be fetched before submitting verification.', 409);
    }

    const userMetadata = metadataObject(fullUser.metadata);
    const duplicateCount = await this.repository.countApprovedRegistryDuplicates({
      userId: fullUser.id,
      registrySource: registry.source,
      registryNumber: registry.registryNumber
    });

    const devBypass = identityDevBypassEnabled();
    const reviewReasons: string[] = [];
    if (!devBypass && !userMetadata.phoneVerified) reviewReasons.push('Phone number is not verified.');
    if (!devBypass && !userMetadata.emailVerified) reviewReasons.push('Email address is not activated.');
    if (!input.registryVerified) reviewReasons.push('Registry information was not confirmed.');
    if (!devBypass && (registry.status !== 'MATCHED' || registry.confidence < 90)) reviewReasons.push('Registry confidence requires admin review.');
    if (!input.signatureConsent) reviewReasons.push('Digital signature consent is missing.');
    if (!devBypass && duplicateCount > 0) reviewReasons.push('Another approved account already uses this registry number.');

    const autoApproved = reviewReasons.length === 0;
    const status = autoApproved ? VerificationStatus.APPROVED : VerificationStatus.PENDING;
    const organization = autoApproved
      ? await this.repository.createOrUpdateVerifiedOrganization({
          userId: fullUser.id,
          organizationName: registry.name,
          entityType: input.entityType,
          registrySource: registry.source,
          registryNumber: registry.registryNumber
        })
      : null;

    const payload = inputJson({
      ...input,
      registryRecord: registryPayload(registry),
      verifiedName: registry.name,
      reviewReasons,
      autoApproved,
      ...(devBypass ? { devBypass: true } : {}),
      submittedAt: new Date().toISOString()
    });

    const profile = await this.repository.upsertVerificationProfile({
      userId: fullUser.id,
      organizationId: organization?.id ?? user.organizationId,
      status,
      registrySource: registry.source,
      registryNumber: registry.registryNumber,
      payload
    });

    await this.repository.updateUser(fullUser.id, {
      displayName: registry.name,
      verificationStatus: status,
      metadata: inputJson({
        ...userMetadata,
        entityType: input.entityType,
        registrySource: registry.source,
        registryNumber: registry.registryNumber,
        verifiedName: registry.name
      })
    });

    await this.repository.createAuditEvent({
      actorUserId: fullUser.id,
      ownerOrgId: organization?.id ?? user.organizationId,
      event: autoApproved ? 'identity.verification.auto_approved' : 'identity.verification.submitted_for_review',
      entityType: 'verification_profile',
      entityRef: profile.id,
      severity: autoApproved ? AuditSeverity.INFO : AuditSeverity.WARNING,
      payload: { reviewReasons, autoApproved }
    });

    if (autoApproved) {
      await this.repository.createAdminAction({
        actorUserId: fullUser.id,
        ownerOrgId: organization?.id ?? user.organizationId,
        actionType: AdminActionType.APPROVE,
        entityType: 'verification_profile',
        entityRef: profile.id,
        summary: 'Verification auto-approved by deterministic approval checks.'
      });
    }

    const refreshedUser = await this.repository.findUserById(fullUser.id);
    return {
      user: refreshedUser ? toSessionUser(refreshedUser) : user,
      verification: toProfileDto(profile),
      autoApproved,
      reviewReasons
    };
  }

  async listAdminVerifications(token: string | undefined, status?: VerificationStatus) {
    await this.requireAdmin(token);
    const profiles = await this.repository.listVerificationProfiles(status);
    return profiles.map((profile) => this.adminVerificationDto(profile));
  }

  async decideAdminVerification(token: string | undefined, profileId: string, decision: 'approve' | 'reject', note?: string) {
    const admin = await this.requireAdmin(token);
    const profile = await this.repository.findVerificationProfileById(profileId);
    if (!profile) throw requestError('Verification profile was not found.', 404);

    const payload = metadataObject(profile.payload);
    const registryRecord = metadataObject(payload.registryRecord);
    const entityType = String(payload.entityType || 'business');
    let organizationId = profile.organizationId ?? undefined;
    const nextStatus = decision === 'approve' ? VerificationStatus.APPROVED : VerificationStatus.REJECTED;

    if (decision === 'approve') {
      const organization = await this.repository.createOrUpdateVerifiedOrganization({
        userId: profile.userId,
        organizationName: String(registryRecord.name || payload.verifiedName || profile.user.displayName),
        entityType,
        registrySource: profile.registrySource || String(registryRecord.source || 'TRA'),
        registryNumber: profile.registryNumber || String(registryRecord.registryNumber || '')
      });
      organizationId = organization.id;
    }

    const updatedPayload = inputJson({
      ...payload,
      adminDecision: decision,
      adminDecisionNote: note ?? '',
      adminDecisionAt: new Date().toISOString(),
      adminDecisionBy: admin.user.id
    });
    await this.repository.updateVerificationStatus(profile.id, nextStatus, updatedPayload, organizationId ?? null);

    await this.repository.updateUser(profile.userId, {
      verificationStatus: nextStatus,
      displayName: decision === 'approve' ? String(registryRecord.name || payload.verifiedName || profile.user.displayName) : profile.user.displayName
    });

    await this.repository.createAdminAction({
      actorUserId: admin.user.id,
      ownerOrgId: organizationId,
      actionType: decision === 'approve' ? AdminActionType.APPROVE : AdminActionType.RETURN,
      entityType: 'verification_profile',
      entityRef: profile.id,
      summary: note ?? `Admin ${decision} verification.`
    });

    await this.repository.createAuditEvent({
      actorUserId: admin.user.id,
      ownerOrgId: organizationId,
      event: `identity.verification.admin_${decision}`,
      entityType: 'verification_profile',
      entityRef: profile.id,
      severity: decision === 'approve' ? AuditSeverity.INFO : AuditSeverity.WARNING,
      payload: { note: note ?? '' }
    });

    const refreshedProfile = await this.repository.findVerificationProfileById(profile.id);
    if (!refreshedProfile) throw requestError('Verification profile was not found after update.', 404);
    return this.adminVerificationDto(refreshedProfile);
  }

  private adminVerificationDto(profile: VerificationWithUser): AdminVerificationDto {
    const dto = toProfileDto(profile);
    const payload = metadataObject(profile.payload);
    const reviewReasons = Array.isArray(payload.reviewReasons)
      ? payload.reviewReasons.map((reason) => String(reason))
      : [];

    return {
      ...dto,
      user: toSessionUser(profile.user),
      reviewReasons
    };
  }
}
