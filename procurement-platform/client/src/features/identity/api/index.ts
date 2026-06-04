import { apiClient } from '@/shared/api/http';
import { getDemoUser, isDemoAuthToken, storeDemoUser } from '@/features/auth/demoAuth';
import type {
  BusinessRegistrationSource,
  EntityType,
  RegistryRecord,
  VerificationMe,
  VerificationProfile,
  VerificationSubmitResult
} from '../types';

const demoVerificationKey = 'procurex.demoVerification';

function nowIso() {
  return new Date().toISOString();
}

function demoRegistrySource(entityType: EntityType, businessRegistrationSource?: BusinessRegistrationSource) {
  if (entityType === 'company') return 'BRELA';
  if (entityType === 'business' && businessRegistrationSource === 'brela') return 'BRELA';
  return 'TRA';
}

function demoRegistryName(entityType: EntityType, registryNumber: string) {
  const label = entityType === 'individual' ? 'Individual' : entityType === 'company' ? 'Company' : 'Business';
  return `Demo ${label} ${registryNumber}`;
}

function getDemoVerification(): VerificationProfile | null {
  if (typeof window === 'undefined') return null;
  const stored = window.localStorage.getItem(demoVerificationKey);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as VerificationProfile;
  } catch {
    return null;
  }
}

function storeDemoVerification(profile: VerificationProfile) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(demoVerificationKey, JSON.stringify(profile));
}

function demoProfile(input: VerificationDraftInput, status: VerificationProfile['status']): VerificationProfile {
  const existing = getDemoVerification();
  const timestamp = nowIso();
  const profile = {
    id: existing?.id ?? 'demo-verification-profile',
    status,
    registrySource: input.registrySource ?? existing?.registrySource ?? null,
    registryNumber: input.registryNumber ?? existing?.registryNumber ?? null,
    payload: {
      ...(existing?.payload ?? {}),
      ...input,
      savedAt: timestamp
    },
    createdAt: existing?.createdAt ?? timestamp,
    updatedAt: timestamp
  };

  storeDemoVerification(profile);
  return profile;
}

export type VerificationDraftInput = {
  entityType?: EntityType;
  businessRegistrationSource?: BusinessRegistrationSource;
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

export type VerificationSubmitInput = Required<
  Pick<
    VerificationDraftInput,
    'entityType' | 'registrySource' | 'registryNumber' | 'registryVerified' | 'registryRecordId' | 'signatureName' | 'signatureConsent'
  >
> &
  VerificationDraftInput;

export const identityApi = {
  async getVerificationMe() {
    if (isDemoAuthToken()) {
      return {
        user: getDemoUser(),
        verification: getDemoVerification()
      };
    }
    const response = await apiClient.get<VerificationMe>('/api/identity/verification/me');
    return response.data;
  },
  async lookupRegistry(input: {
    entityType: EntityType;
    businessRegistrationSource?: BusinessRegistrationSource;
    registryNumber: string;
  }) {
    if (isDemoAuthToken()) {
      const registryNumber = input.registryNumber.trim();
      return {
        id: `demo-registry-${registryNumber}`,
        source: demoRegistrySource(input.entityType, input.businessRegistrationSource),
        registryNumber,
        entityType: input.entityType,
        name: demoRegistryName(input.entityType, registryNumber),
        status: 'MATCHED',
        confidence: 100,
        payload: {
          country: 'Tanzania',
          registrationStatus: 'Active',
          issuedBy: 'ProcureX demo registry'
        }
      };
    }
    const response = await apiClient.post<RegistryRecord>('/api/identity/verification/registry-lookup', input);
    return response.data;
  },
  async saveVerificationDraft(input: VerificationDraftInput) {
    if (isDemoAuthToken()) {
      const currentUser = getDemoUser();
      if (currentUser.verificationStatus === 'NOT_STARTED') {
        storeDemoUser({ ...currentUser, verificationStatus: 'DRAFT' });
      }
      return demoProfile(input, 'DRAFT');
    }
    const response = await apiClient.put<VerificationProfile>('/api/identity/verification/draft', input);
    return response.data;
  },
  async submitVerification(input: VerificationSubmitInput) {
    if (isDemoAuthToken()) {
      const displayName = String(input.profile?.displayName || `Demo Verified ${input.registryNumber}`);
      const approvedUser = {
        ...getDemoUser(),
        displayName,
        organization: displayName,
        verificationStatus: 'APPROVED' as const
      };
      const verification = demoProfile(
        {
          ...input,
          profile: {
            ...(input.profile ?? {}),
            displayName
          }
        },
        'APPROVED'
      );

      storeDemoUser(approvedUser);
      return {
        user: approvedUser,
        verification,
        autoApproved: true,
        reviewReasons: []
      };
    }
    const response = await apiClient.post<VerificationSubmitResult>('/api/identity/verification/submit', input);
    return response.data;
  },
  async updateProfile(input: { profile: Record<string, unknown>; documents?: Record<string, unknown>[] }) {
    if (isDemoAuthToken()) {
      return demoProfile(input, getDemoUser().verificationStatus);
    }
    const response = await apiClient.put<VerificationProfile>('/api/identity/profile', input);
    return response.data;
  }
};

