import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader, Timeline } from '@/shared/components';
import { procurementTimeline } from '@/shared/data/fixtures';
import { useAppSelector } from '@/app/store';
import {
  MarketplaceCategoryGrid,
  MarketplaceFilters,
  MarketplaceHero,
  MarketplaceSummary,
  TenderListPanel
} from '../components/MarketplaceComponents';
import { CreateTenderWizardShell, TenderDocumentView } from '../components/TenderWorkspaceComponents';
import { getBudgetBand } from '../utils/marketplace';

export function ProcurementGuidePage() {
  const { t } = useTranslation();
  return (
    <section>
      <PageHeader title={t('pages.procurementGuide.title')} subtitle={t('pages.procurementGuide.subtitle')} />
      <Timeline items={procurementTimeline} />
    </section>
  );
}

export function MarketplacePage() {
  const tenders = useAppSelector((state) => state.procurement.tenders);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [budget, setBudget] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('deadline');

  const filtered = useMemo(() => {
    const next = tenders.filter((tender) => {
      const text = `${tender.title} ${tender.reference} ${tender.organization} ${tender.location} ${tender.description}`.toLowerCase();
      return (
        (!query || text.includes(query.toLowerCase())) &&
        (!type || tender.type === type) &&
        (!budget || getBudgetBand(tender) === budget) &&
        (!status || tender.status === status)
      );
    });

    return [...next].sort((a, b) => {
      if (sort === 'budget-desc') return b.budget - a.budget;
      if (sort === 'budget-asc') return a.budget - b.budget;
      if (sort === 'newest') return b.reference.localeCompare(a.reference);
      return Date.parse(a.closingDate) - Date.parse(b.closingDate);
    });
  }, [budget, query, sort, status, tenders, type]);

  return (
    <div className="procurement-app-page" data-marketplace-root>
      <main className="procurement-market-shell">
        <MarketplaceHero />
        <MarketplaceFilters
          query={query}
          type={type}
          budget={budget}
          status={status}
          sort={sort}
          onQueryChange={setQuery}
          onTypeChange={setType}
          onBudgetChange={setBudget}
          onStatusChange={setStatus}
          onSortChange={setSort}
        />
        <MarketplaceCategoryGrid tenders={tenders} onSelectType={setType} />
        <MarketplaceSummary tenders={tenders} />
        <TenderListPanel tenders={filtered} />
      </main>
    </div>
  );
}

export function CreateTenderPage() {
  return <CreateTenderWizardShell />;
}

export function TenderPublicationPage() {
  const { t } = useTranslation();
  return <SelectedTenderDocument title={t('pages.tenderPublication.title')} subtitle={t('pages.tenderPublication.subtitle')} actionLabel={t('actions.publish')} />;
}

export function TenderDetailsPage() {
  const { t } = useTranslation();
  return <SelectedTenderDocument title={t('pages.tenderDetails.title')} subtitle={t('pages.tenderDetails.subtitle')} actionLabel={t('pages.evaluation.title')} />;
}

export function TenderDocumentPage() {
  const { t } = useTranslation();
  return <SelectedTenderDocument title={t('pages.tenderDocument.title')} subtitle={t('pages.tenderDocument.subtitle')} actionLabel={t('actions.review')} />;
}

export function SupplierTenderDetailPage() {
  const { t } = useTranslation();
  return <SelectedTenderDocument title={t('pages.supplierTenderDetail.title')} subtitle={t('pages.supplierTenderDetail.subtitle')} actionLabel={t('pages.bidding.title')} />;
}

function SelectedTenderDocument({ title, subtitle, actionLabel }: { title: string; subtitle: string; actionLabel: string }) {
  const tender = useAppSelector((state) => state.procurement.tenders[0]);
  return <TenderDocumentView tender={tender} title={title} subtitle={subtitle} actionLabel={actionLabel} />;
}
