import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setSessionUser } from '@/features/auth/slice';
import { identityApi } from '@/features/identity/api';
import { useNotifications } from '@/features/notifications/hooks';
import type { VerificationProfile } from '@/features/identity/types';
import { notificationFromApiError } from '@/shared/api/errors';
import { AccountMenu } from '@/shared/components/AccountMenu';
import { NotificationCard } from '@/shared/components/NotificationCard';
import { TanzaniaLocationSelector } from '@/shared/components/TanzaniaLocationSelector';
import {
  PlatformAppsButton,
  PlatformAppsDrawer,
  resolvePlatformAppRoute,
  type PlatformAppPageKey
} from '@/shared/components/procurex/PlatformAppsDrawer';
import { useBodyPageMetadata } from '@/shared/hooks/useBodyPageMetadata';
import type { CreateNotificationInput } from '@/shared/types/notifications';
import { getTanzaniaRegions, isValidTanzaniaLocation, type TanzaniaLocationSelection } from '@procurex/shared';

type ProfileTab = 'overview' | 'account' | 'entity' | 'classification' | 'documents' | 'settings' | 'system';

type ProfileForm = {
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  country: string;
  location: Partial<TanzaniaLocationSelection>;
  preferredLanguage: string;
  displayName: string;
  professionalTitle: string;
  companyName: string;
  tradingName: string;
  tinNumber: string;
  registrationNumber: string;
  businessCategory: string;
  procurementRole: string;
  preferredTenderCategories: string[];
  regionsOfOperation: string[];
  bankName: string;
  accountName: string;
  accountNumber: string;
  canCreateTender: boolean;
  canSubmitBid: boolean;
  notificationsEnabled: boolean;
  autoMatchTenders: boolean;
};

type DocumentForm = {
  businessRegistration: string;
  taxCertificate: string;
  identityDocument: string;
  bankDocument: string;
};

const tabs: Array<{ key: ProfileTab; label: string }> = [
  { key: 'overview', label: 'Overview' },
  { key: 'account', label: 'Account' },
  { key: 'entity', label: 'Entity' },
  { key: 'classification', label: 'Classification' },
  { key: 'documents', label: 'Documents' },
  { key: 'settings', label: 'Settings' },
  { key: 'system', label: 'System' }
];

const tenderCategories = ['Goods', 'Works', 'Non Consultancy', 'Consultancy', 'Medical Supplies', 'ICT Equipment', 'Construction Works', 'Office Supplies'];
const regionsOfOperation = ['Nationwide', ...getTanzaniaRegions()];

const defaultProfile: ProfileForm = {
  fullName: '',
  emailAddress: '',
  phoneNumber: '',
  country: 'Tanzania',
  location: {},
  preferredLanguage: 'English',
  displayName: '',
  professionalTitle: '',
  companyName: '',
  tradingName: '',
  tinNumber: '',
  registrationNumber: '',
  businessCategory: '',
  procurementRole: 'Buyer and Supplier',
  preferredTenderCategories: [],
  regionsOfOperation: ['Nationwide'],
  bankName: '',
  accountName: '',
  accountNumber: '',
  canCreateTender: true,
  canSubmitBid: true,
  notificationsEnabled: true,
  autoMatchTenders: true
};

const defaultDocuments: DocumentForm = {
  businessRegistration: '',
  taxCertificate: '',
  identityDocument: '',
  bankDocument: ''
};

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function stringValue(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function booleanValue(value: unknown, fallback: boolean) {
  return typeof value === 'boolean' ? value : fallback;
}

function stringArrayValue(value: unknown, fallback: string[]) {
  return Array.isArray(value) ? value.map(String) : fallback;
}

function statusBadge(status?: string) {
  if (status === 'APPROVED') return 'badge badge-success';
  if (status === 'REJECTED' || status === 'EXPIRED') return 'badge badge-error';
  if (status === 'PENDING') return 'badge badge-warning';
  return 'badge badge-info';
}

function reviewReasons(profile: VerificationProfile | null) {
  const reasons = objectValue(profile?.payload).reviewReasons;
  return Array.isArray(reasons) ? reasons.map(String) : [];
}

export function AccountProfileProcurexPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { notifySuccess } = useNotifications();
  const user = useAppSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [verification, setVerification] = useState<VerificationProfile | null>(null);
  const [profile, setProfile] = useState<ProfileForm>(defaultProfile);
  const [documents, setDocuments] = useState<DocumentForm>(defaultDocuments);
  const [statusMessage, setStatusMessage] = useState<CreateNotificationInput | null>(null);
  const [loading, setLoading] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  useBodyPageMetadata('verification-status');

  useEffect(() => {
    function handleDocumentClick(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) setAppsOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setAppsOpen(false);
    }

    document.addEventListener('pointerdown', handleDocumentClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handleDocumentClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  function selectPlatformApp(pageKey: PlatformAppPageKey) {
    setAppsOpen(false);
    navigate(resolvePlatformAppRoute(pageKey));
  }

  const payload = useMemo(() => objectValue(verification?.payload), [verification]);
  const registryRecord = objectValue(payload.registryRecord);
  const reasons = reviewReasons(verification);
  const requiredValues = [
    profile.fullName,
    profile.emailAddress,
    profile.phoneNumber,
    profile.country,
    isValidTanzaniaLocation(profile.location) ? profile.location.ward : '',
    profile.displayName || profile.companyName,
    profile.tinNumber || verification?.registryNumber,
    profile.businessCategory,
    profile.procurementRole
  ];
  const completedRequired = requiredValues.filter((value) => String(value ?? '').trim()).length;
  const completion = Math.round((completedRequired / requiredValues.length) * 100);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);
      setStatusMessage(null);

      try {
        const response = await identityApi.getVerificationMe();
        if (!active) return;
        const savedProfile = objectValue(response.verification?.payload.profile);
        const savedDocuments = Array.isArray(response.verification?.payload.documents) ? response.verification?.payload.documents : [];
        const registry = objectValue(response.verification?.payload.registryRecord);

        dispatch(setSessionUser(response.user));
        setVerification(response.verification);
        setProfile({
          ...defaultProfile,
          fullName: stringValue(savedProfile.fullName, response.user.displayName),
          emailAddress: stringValue(savedProfile.emailAddress, response.user.email),
          phoneNumber: stringValue(savedProfile.phoneNumber, response.user.phone ?? ''),
          country: stringValue(savedProfile.country, 'Tanzania'),
          location: isValidTanzaniaLocation(savedProfile.location) ? savedProfile.location : isValidTanzaniaLocation(response.user.location) ? response.user.location : {},
          preferredLanguage: stringValue(savedProfile.preferredLanguage, 'English'),
          displayName: stringValue(savedProfile.displayName, stringValue(registry.name, response.user.displayName)),
          professionalTitle: stringValue(savedProfile.professionalTitle),
          companyName: stringValue(savedProfile.companyName, response.user.organization ?? stringValue(registry.name)),
          tradingName: stringValue(savedProfile.tradingName),
          tinNumber: stringValue(savedProfile.tinNumber, response.verification?.registrySource === 'TRA' ? response.verification.registryNumber ?? '' : ''),
          registrationNumber: stringValue(savedProfile.registrationNumber, response.verification?.registrySource === 'BRELA' ? response.verification.registryNumber ?? '' : ''),
          businessCategory: stringValue(savedProfile.businessCategory),
          procurementRole: stringValue(savedProfile.procurementRole, 'Buyer and Supplier'),
          preferredTenderCategories: stringArrayValue(savedProfile.preferredTenderCategories, defaultProfile.preferredTenderCategories),
          regionsOfOperation: stringArrayValue(savedProfile.regionsOfOperation, defaultProfile.regionsOfOperation),
          bankName: stringValue(savedProfile.bankName),
          accountName: stringValue(savedProfile.accountName),
          accountNumber: stringValue(savedProfile.accountNumber),
          canCreateTender: booleanValue(savedProfile.canCreateTender, true),
          canSubmitBid: booleanValue(savedProfile.canSubmitBid, true),
          notificationsEnabled: booleanValue(savedProfile.notificationsEnabled, true),
          autoMatchTenders: booleanValue(savedProfile.autoMatchTenders, true)
        });
        setDocuments({
          ...defaultDocuments,
          ...savedDocuments.reduce<Record<string, string>>((accumulator, document) => {
            const item = objectValue(document);
            if (typeof item.type === 'string' && typeof item.name === 'string') accumulator[item.type] = item.name;
            return accumulator;
          }, {})
        });
      } catch (error) {
        if (active) setStatusMessage(notificationFromApiError(error, { title: 'Account profile could not load', fallback: 'Could not load account profile.' }));
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadProfile();
    return () => {
      active = false;
    };
  }, [dispatch]);

  function updateProfileField<Key extends keyof ProfileForm>(field: Key, value: ProfileForm[Key]) {
    setProfile((current) => ({ ...current, [field]: value }));
  }

  function updateDocument(field: keyof DocumentForm, event: ChangeEvent<HTMLInputElement>) {
    const fileName = event.target.files?.[0]?.name ?? '';
    setDocuments((current) => ({ ...current, [field]: fileName }));
  }

  function toggleListValue(field: 'preferredTenderCategories' | 'regionsOfOperation', value: string) {
    setProfile((current) => {
      const selected = new Set(current[field]);
      if (selected.has(value)) selected.delete(value);
      else selected.add(value);
      return { ...current, [field]: Array.from(selected) };
    });
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      const { location: profileLocation, ...profileWithoutLocation } = profile;
      const saved = await identityApi.updateProfile({
        profile: {
          ...profileWithoutLocation,
          ...(isValidTanzaniaLocation(profileLocation) ? { location: profileLocation } : {})
        },
        documents: Object.entries(documents)
          .filter(([, name]) => name)
          .map(([type, name]) => ({
            type,
            name,
            status: 'captured'
          }))
      });
      setVerification(saved);
      const notification: CreateNotificationInput = {
        tone: 'success',
        title: 'Profile saved',
        message: 'Profile saved to the verification database record.',
        reason: 'ProcureX updated the profile payload used for account verification and procurement preferences.',
        dismissible: false
      };
      setStatusMessage(null);
      notifySuccess(notification.title, notification.message, { reason: notification.reason });
    } catch (error) {
      setStatusMessage(notificationFromApiError(error, { title: 'Profile could not be saved', fallback: 'Could not save profile.' }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header className="app-topbar" ref={headerRef}>
        <div className="app-topbar-left">
          <button className="app-brand-button" type="button" onClick={() => navigate('/apps')}>
            <span className="platform-logo">
              <img className="platform-logo-image" src="/assets/logo.svg" alt="ProcureX" />
            </span>
            <span>Registration and Verification</span>
          </button>
        </div>

        <div className="app-topbar-actions">
          <PlatformAppsButton expanded={appsOpen} onClick={() => setAppsOpen((open) => !open)} />
          <div className="profile-menu-wrap">
            <AccountMenu buttonClassName="profile-button" />
          </div>
        </div>

        <PlatformAppsDrawer open={appsOpen} organizationLabel={user?.organization ?? 'ProcureX account tools'} onSelect={selectPlatformApp} />
      </header>

      <div className="main-layout">
        <div className="main-content">
          <form className="iam-profile-page" onSubmit={(event) => void saveProfile(event)}>
            <section className="iam-profile-hero">
              <div>
                <span className={statusBadge(user?.verificationStatus)}>{user?.verificationStatus ?? 'NOT_STARTED'}</span>
                <h1>Account Profile Workspace</h1>
                <p>Account, registry, documents, and procurement preferences are stored against the verification profile for the current signed-in user.</p>
                <div className="iam-hero-actions">
                  <button className="btn btn-primary" type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Profile'}
                  </button>
                  <button className="btn btn-secondary" type="button" onClick={() => navigate('/identity/verification')}>
                    Update Identity Verification
                  </button>
                </div>
                {statusMessage ? (
                  <NotificationCard notification={statusMessage} compact />
                ) : (
                  <small className="iam-save-status">Changes are written to the database-backed profile payload.</small>
                )}
              </div>
              <div className="iam-profile-score">
                <div className="iam-score-copy">
                  <span>Profile completion</span>
                  <strong>{completion}%</strong>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${completion}%` }} />
                  </div>
                  <small>
                    {completedRequired} of {requiredValues.length} required profile fields complete
                  </small>
                </div>
              </div>
            </section>

            <nav className="iam-profile-tabs" aria-label="account profile sections">
              {tabs.map((tab) => (
                <button className={activeTab === tab.key ? 'active' : ''} key={tab.key} type="button" onClick={() => setActiveTab(tab.key)}>
                  {tab.label}
                </button>
              ))}
            </nav>

            <section className={`iam-profile-section ${activeTab === 'overview' ? 'active' : ''}`}>
              <div className="iam-section-heading">
                <div>
                  <span className="section-kicker">Overview</span>
                  <h2>Verification record</h2>
                </div>
                <span className={statusBadge(verification?.status)}>{verification?.status ?? 'No profile yet'}</span>
              </div>
              <div className="iam-overview-grid">
                <div className="iam-readonly-row">
                  <span>Verified name</span>
                  <strong>{stringValue(registryRecord.name, profile.displayName || user?.displayName)}</strong>
                </div>
                <div className="iam-readonly-row">
                  <span>Registry source</span>
                  <strong>{verification?.registrySource ?? stringValue(payload.registrySource, 'Pending')}</strong>
                </div>
                <div className="iam-readonly-row">
                  <span>Registry reference</span>
                  <strong>{verification?.registryNumber ?? stringValue(payload.registryNumber, 'Pending')}</strong>
                </div>
                <div className="iam-readonly-row">
                  <span>Digital signature</span>
                  <strong>{stringValue(payload.signatureName, 'Pending signature')}</strong>
                </div>
                <div className="iam-readonly-row">
                  <span>Organization</span>
                  <strong>{user?.organization ?? profile.companyName ?? 'Pending verification'}</strong>
                </div>
                <div className="iam-readonly-row">
                  <span>Last updated</span>
                  <strong>{verification?.updatedAt ? new Date(verification.updatedAt).toLocaleString() : 'Not saved yet'}</strong>
                </div>
              </div>
              {reasons.length ? <div className="auth-note">Admin review reasons: {reasons.join(' ')}</div> : null}
            </section>

            <section className={`iam-profile-section ${activeTab === 'account' ? 'active' : ''}`}>
              <div className="iam-section-heading">
                <div>
                  <span className="section-kicker">Account</span>
                  <h2>Account information</h2>
                </div>
                <span className="badge badge-info">Editable</span>
              </div>
              <div className="iam-form-grid">
                <label className="form-group iam-profile-field">
                  <span className="form-label">Full Name *</span>
                  <input className="form-input" value={profile.fullName} onChange={(event) => updateProfileField('fullName', event.target.value)} />
                </label>
                <label className="form-group iam-profile-field">
                  <span className="form-label">Email Address *</span>
                  <input className="form-input" type="email" value={profile.emailAddress} onChange={(event) => updateProfileField('emailAddress', event.target.value)} />
                </label>
                <label className="form-group iam-profile-field">
                  <span className="form-label">Phone Number *</span>
                  <input className="form-input" type="tel" value={profile.phoneNumber} onChange={(event) => updateProfileField('phoneNumber', event.target.value)} />
                </label>
                <label className="form-group iam-profile-field">
                  <span className="form-label">Country *</span>
                  <select className="form-input" value={profile.country} onChange={(event) => updateProfileField('country', event.target.value)}>
                    {['Tanzania', 'Kenya', 'Uganda', 'Rwanda', 'Burundi', 'South Africa', 'United Arab Emirates'].map((country) => (
                      <option value={country} key={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="form-group iam-profile-field wide">
                  <span className="form-label">Primary Location</span>
                  <TanzaniaLocationSelector
                    idPrefix="profile-location"
                    value={profile.location}
                    onChange={(nextLocation) => updateProfileField('location', nextLocation)}
                    groupClassName="form-group iam-profile-field"
                    labelClassName="form-label"
                    inputClassName="form-input"
                  />
                </div>
                <label className="form-group iam-profile-field">
                  <span className="form-label">Preferred Language</span>
                  <select className="form-input" value={profile.preferredLanguage} onChange={(event) => updateProfileField('preferredLanguage', event.target.value)}>
                    {['English', 'Swahili', 'French', 'Arabic'].map((language) => (
                      <option value={language} key={language}>
                        {language}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </section>

            <section className={`iam-profile-section ${activeTab === 'entity' ? 'active' : ''}`}>
              <div className="iam-section-heading">
                <div>
                  <span className="section-kicker">Legal identity</span>
                  <h2>Entity information</h2>
                </div>
                <span className="badge badge-info">{stringValue(payload.entityType, 'Account')}</span>
              </div>
              <div className="iam-form-grid">
                <label className="form-group iam-profile-field">
                  <span className="form-label">Display / Legal Name *</span>
                  <input className="form-input" value={profile.displayName} onChange={(event) => updateProfileField('displayName', event.target.value)} />
                </label>
                <label className="form-group iam-profile-field">
                  <span className="form-label">Professional Title</span>
                  <input className="form-input" value={profile.professionalTitle} onChange={(event) => updateProfileField('professionalTitle', event.target.value)} />
                </label>
                <label className="form-group iam-profile-field">
                  <span className="form-label">Company / Business Name</span>
                  <input className="form-input" value={profile.companyName} onChange={(event) => updateProfileField('companyName', event.target.value)} />
                </label>
                <label className="form-group iam-profile-field">
                  <span className="form-label">Trading Name</span>
                  <input className="form-input" value={profile.tradingName} onChange={(event) => updateProfileField('tradingName', event.target.value)} />
                </label>
                <label className="form-group iam-profile-field">
                  <span className="form-label">TIN Number *</span>
                  <input className="form-input" value={profile.tinNumber} onChange={(event) => updateProfileField('tinNumber', event.target.value)} />
                </label>
                <label className="form-group iam-profile-field">
                  <span className="form-label">Registration Number</span>
                  <input className="form-input" value={profile.registrationNumber} onChange={(event) => updateProfileField('registrationNumber', event.target.value)} />
                </label>
              </div>
            </section>

            <section className={`iam-profile-section ${activeTab === 'classification' ? 'active' : ''}`}>
              <div className="iam-section-heading">
                <div>
                  <span className="section-kicker">Classification</span>
                  <h2>Procurement profile</h2>
                </div>
                <span className="badge badge-info">Matching</span>
              </div>
              <div className="iam-form-grid">
                <label className="form-group iam-profile-field">
                  <span className="form-label">Business Category *</span>
                  <input className="form-input" value={profile.businessCategory} onChange={(event) => updateProfileField('businessCategory', event.target.value)} />
                </label>
                <label className="form-group iam-profile-field">
                  <span className="form-label">Procurement Role *</span>
                  <select className="form-input" value={profile.procurementRole} onChange={(event) => updateProfileField('procurementRole', event.target.value)}>
                    <option>Buyer and Supplier</option>
                    <option>Supplier</option>
                    <option>Buyer</option>
                  </select>
                </label>
                <div className="form-group iam-profile-field wide">
                  <span className="form-label">Preferred Tender Categories</span>
                  <div className="iam-multi-list" role="group" aria-label="Preferred Tender Categories">
                    {tenderCategories.map((category) => (
                      <label className="iam-multi-option" key={category}>
                        <input type="checkbox" checked={profile.preferredTenderCategories.includes(category)} onChange={() => toggleListValue('preferredTenderCategories', category)} />
                        <span>{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-group iam-profile-field wide">
                  <span className="form-label">Regions of Operation</span>
                  <div className="iam-multi-list" role="group" aria-label="Regions of Operation">
                    {regionsOfOperation.map((region) => (
                      <label className="iam-multi-option" key={region}>
                        <input type="checkbox" checked={profile.regionsOfOperation.includes(region)} onChange={() => toggleListValue('regionsOfOperation', region)} />
                        <span>{region}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className={`iam-profile-section ${activeTab === 'documents' ? 'active' : ''}`}>
              <div className="iam-section-heading">
                <div>
                  <span className="section-kicker">Documents</span>
                  <h2>Verification evidence</h2>
                </div>
                <span className="badge badge-info">Captured names</span>
              </div>
              <div className="iam-form-grid">
                {Object.entries(documents).map(([key, value]) => (
                  <label className="form-group iam-profile-field" key={key}>
                    <span className="form-label">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <div className="iam-upload-control">
                      <input className="form-input" type="file" onChange={(event) => updateDocument(key as keyof DocumentForm, event)} />
                      <small>{value || 'No file selected yet.'}</small>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            <section className={`iam-profile-section ${activeTab === 'settings' ? 'active' : ''}`}>
              <div className="iam-section-heading">
                <div>
                  <span className="section-kicker">Settings</span>
                  <h2>Procurement operation settings</h2>
                </div>
                <span className="badge badge-info">Preferences</span>
              </div>
              <div className="iam-form-grid">
                {[
                  ['canCreateTender', 'Can Create Tender'],
                  ['canSubmitBid', 'Can Submit Bid'],
                  ['notificationsEnabled', 'Notifications Enabled'],
                  ['autoMatchTenders', 'Auto-Match Tenders']
                ].map(([field, label]) => (
                  <label className="form-group iam-profile-field" key={field}>
                    <span className="form-label">{label}</span>
                    <span className="iam-toggle">
                      <input
                        type="checkbox"
                        checked={Boolean(profile[field as keyof ProfileForm])}
                        onChange={(event) => updateProfileField(field as keyof ProfileForm, event.target.checked as never)}
                      />
                      <span></span>
                      <em>{profile[field as keyof ProfileForm] ? 'Enabled' : 'Disabled'}</em>
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section className={`iam-profile-section ${activeTab === 'system' ? 'active' : ''}`}>
              <div className="iam-section-heading">
                <div>
                  <span className="section-kicker">System verification record</span>
                  <h2>Verification and audit information</h2>
                </div>
                <span className="badge badge-info">System generated</span>
              </div>
              <div className="iam-overview-grid">
                <div className="iam-readonly-row">
                  <span>User ID</span>
                  <strong>{user?.id ?? 'Pending'}</strong>
                </div>
                <div className="iam-readonly-row">
                  <span>Verification ID</span>
                  <strong>{verification?.id ?? 'Pending'}</strong>
                </div>
                <div className="iam-readonly-row">
                  <span>Session organization</span>
                  <strong>{user?.organization ?? 'Not assigned yet'}</strong>
                </div>
                <div className="iam-readonly-row">
                  <span>Capabilities</span>
                  <strong>{user?.capabilities.length ? user.capabilities.join(', ') : 'Pending approval'}</strong>
                </div>
                <div className="iam-readonly-row">
                  <span>Admin decision</span>
                  <strong>{stringValue(payload.adminDecision, 'No admin decision yet')}</strong>
                </div>
                <div className="iam-readonly-row">
                  <span>Admin note</span>
                  <strong>{stringValue(payload.adminDecisionNote, 'No note')}</strong>
                </div>
              </div>
            </section>
          </form>
        </div>
      </div>
    </>
  );
}
