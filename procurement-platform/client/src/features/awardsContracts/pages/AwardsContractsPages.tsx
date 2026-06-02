import { Button, LinearProgress, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { KpiCard, PageHeader, StatusBadge } from '@/shared/components';
import { saveAwardDraft } from '../slice';

export function AwardingContractsPage() {
  const { t } = useTranslation();
  const draftSaved = useAppSelector((state) => state.awardsContracts.draftSaved);
  return (
    <section>
      <PageHeader title={t('pages.awards.title')} subtitle={t('pages.awards.subtitle')} />
      <div className="px-kpi-grid">
        <KpiCard label="Award decisions" value="3" note="Pending approval" />
        <KpiCard label="Negotiations" value="2" note="Supplier response" />
        <KpiCard label="Contracts" value="6" note="Active or signing" />
        <KpiCard label="Draft state" value={draftSaved ? 'Saved' : 'Open'} note="Local workspace" />
      </div>
      <div className="px-grid">
        {[
          ['/awards-contracts/recommendation', t('pages.awardRecommendation.title')],
          ['/awards-contracts/negotiation', t('pages.contractNegotiation.title')],
          ['/awards-contracts/post-award', t('pages.postAward.title')]
        ].map(([to, label]) => (
          <article className="px-card" key={to}>
            <StatusBadge value="Current" />
            <h3>{label}</h3>
            <p>{t('pages.awards.subtitle')}</p>
            <Button component={Link} to={to} variant="outlined">{t('actions.open')}</Button>
          </article>
        ))}
      </div>
    </section>
  );
}

export function AwardRecommendationPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  return (
    <section>
      <PageHeader title={t('pages.awardRecommendation.title')} subtitle={t('pages.awardRecommendation.subtitle')} />
      <article className="px-card">
        <StatusBadge value="Pending approval" />
        <h3>Award decision</h3>
        <div className="px-form-grid">
          <TextField label="Selected supplier" defaultValue="Prime Facilities Tanzania" />
          <TextField label="Award amount" defaultValue="790000000" />
          <TextField label="Reason" multiline minRows={4} defaultValue="Highest evaluated responsive bid and complete compliance evidence." />
          <TextField label="Approver" defaultValue="Authorized Representative" />
        </div>
        <div className="px-actions">
          <Button variant="outlined" onClick={() => dispatch(saveAwardDraft())}>{t('actions.saveDraft')}</Button>
          <Button component={Link} to="/awards-contracts/negotiation" variant="contained">{t('actions.continue')}</Button>
        </div>
      </article>
    </section>
  );
}

export function ContractNegotiationPage() {
  const { t } = useTranslation();
  return (
    <section>
      <PageHeader title={t('pages.contractNegotiation.title')} subtitle={t('pages.contractNegotiation.subtitle')} />
      <div className="px-grid two">
        <article className="px-card">
          <StatusBadge value="Negotiation" />
          <h3>Clause review</h3>
          <LinearProgress variant="determinate" value={64} />
          <div className="px-form-grid">
            <TextField label="Locked award term" defaultValue="Tender scope and evaluated amount" />
            <TextField label="Negotiable clause" defaultValue="Service level reporting frequency" />
            <TextField label="Supplier comment" multiline minRows={4} defaultValue="Request weekly reporting during mobilization and monthly after stabilization." />
          </div>
        </article>
        <div className="px-hero-media">
          <img src="/assets/page-visuals/contract-signing.jpg" alt="" />
        </div>
      </div>
    </section>
  );
}

export function PostAwardTrackingPage() {
  const { t } = useTranslation();
  return (
    <section>
      <PageHeader title={t('pages.postAward.title')} subtitle={t('pages.postAward.subtitle')} />
      <div className="px-grid">
        {['Purchase order issued', 'Milestone inspection', 'Invoice matching', 'Payment approval', 'Performance record'].map((item, index) => (
          <article className="px-card" key={item}>
            <StatusBadge value={index < 2 ? 'Complete' : 'Pending'} />
            <h3>{item}</h3>
            <p>{t('pages.postAward.subtitle')}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
