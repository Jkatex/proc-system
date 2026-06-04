import { clearStoredAuthToken, getStoredAuthToken, storeAuthToken } from '@/shared/api/authToken';
import { demoUsers } from '@/shared/data/fixtures';
import type { SessionUser } from '@/shared/types/domain';

export const demoAuthToken = 'procurex-demo-auth-token';

const demoUserKey = 'procurex.demoUser';
const demoVerificationKey = 'procurex.demoVerification';

export const demoOnboardingUser: SessionUser = {
  ...demoUsers.user,
  id: 'demo-onboarding-user',
  displayName: 'Demo ProcureX User',
  email: 'demo@procurex.test',
  phone: '+255 700 000 000',
  organization: 'Demo ProcureX User',
  verificationStatus: 'NOT_STARTED'
};

export const demoDashboardUser: SessionUser = {
  ...demoUsers.user,
  id: 'demo-dashboard-user',
  displayName: 'Demo Verified Company Limited',
  email: 'dashboard@procurex.test',
  phone: '+255 711 111 111',
  organization: 'Demo Verified Company Limited',
  verificationStatus: 'APPROVED'
};

function demoApprovedVerification() {
  const timestamp = new Date().toISOString();
  const registryRecord = {
    id: 'demo-registry-dashboard-001',
    source: 'BRELA',
    registryNumber: 'BRELA-DEMO-001',
    entityType: 'company',
    name: demoDashboardUser.displayName,
    status: 'MATCHED',
    confidence: 100,
    payload: {
      country: 'Tanzania',
      registrationStatus: 'Active',
      issuedBy: 'ProcureX demo registry'
    }
  };

  return {
    id: 'demo-verification-dashboard',
    status: 'APPROVED',
    registrySource: registryRecord.source,
    registryNumber: registryRecord.registryNumber,
    payload: {
      entityType: 'company',
      businessRegistrationSource: 'brela',
      registrySource: registryRecord.source,
      registryNumber: registryRecord.registryNumber,
      registryVerified: true,
      registryRecordId: registryRecord.id,
      registryRecord,
      signatureName: demoDashboardUser.displayName,
      signatureTitle: 'Managing Director',
      signatureConsent: true,
      profile: {
        displayName: demoDashboardUser.displayName,
        registrationNumber: registryRecord.registryNumber,
        country: 'Tanzania',
        preferredLanguage: 'English'
      },
      documents: [
        {
          type: 'registry',
          source: registryRecord.source,
          registryNumber: registryRecord.registryNumber,
          status: 'fetched'
        }
      ],
      autoApproved: true,
      devBypass: true,
      submittedAt: timestamp,
      savedAt: timestamp
    },
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

export function isDemoAuthToken(token = getStoredAuthToken()) {
  return token === demoAuthToken;
}

export function getDemoUser() {
  if (typeof window === 'undefined') return demoOnboardingUser;

  const stored = window.localStorage.getItem(demoUserKey);
  if (!stored) return demoOnboardingUser;

  try {
    return { ...demoOnboardingUser, ...JSON.parse(stored) } as SessionUser;
  } catch {
    return demoOnboardingUser;
  }
}

export function storeDemoUser(user: SessionUser) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(demoUserKey, JSON.stringify(user));
}

export function startDemoSession() {
  storeAuthToken(demoAuthToken);
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(demoVerificationKey);
  }
  storeDemoUser(demoOnboardingUser);
  return demoOnboardingUser;
}

export function startDashboardDemoSession() {
  storeAuthToken(demoAuthToken);
  storeDemoUser(demoDashboardUser);
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(demoVerificationKey, JSON.stringify(demoApprovedVerification()));
  }
  return demoDashboardUser;
}

export function clearDemoSession() {
  clearStoredAuthToken();
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(demoUserKey);
  window.localStorage.removeItem(demoVerificationKey);
}
