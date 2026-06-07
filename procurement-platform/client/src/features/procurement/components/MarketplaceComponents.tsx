import { Button, MenuItem, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Tender } from '@/shared/types/domain';
import { StatusBadge } from '@/shared/components';
import { useLocaleFormat } from '@/shared/hooks/useLocaleFormat';

type MarketplaceFiltersProps = {
  query: string;
  type: string;
  budget: string;
  status: string;
  sort: string;
  onQueryChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onBudgetChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSortChange: (value: string) => void;
};

export function MarketplaceHero() {
  const { t } = useTranslation();
  return (
    <section className="procurement-market-hero">
      <div>
        <span className="section-kicker">{t('pages.marketplace.title')}</span>
        <h1>{t('nav.marketplace')}</h1>
        <p>{t('pages.marketplace.subtitle')}</p>
      </div>
      <div className="procurement-market-actions">
        <Button component={Link} to="/procurement/create-tender" variant="contained" className="btn btn-primary">
          {t('pages.createTender.title')}
        </Button>
      </div>
    </section>
  );
}

export function MarketplaceFilters({
  query,
  type,
  budget,
  status,
  sort,
  onQueryChange,
  onTypeChange,
  onBudgetChange,
  onStatusChange,
  onSortChange
}: MarketplaceFiltersProps) {
  const { t } = useTranslation();

  return (
    <section className="procurement-search-panel" aria-label={t('common.filters')}>
      <div className="market-search-field">
        <TextField
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search title, buyer, reference, sector, location"
          fullWidth
        />
      </div>
      <TextField select value={type} onChange={(event) => onTypeChange(event.target.value)} label="Type">
        <MenuItem value="">All tender types</MenuItem>
        <MenuItem value="GOODS">Goods</MenuItem>
        <MenuItem value="WORKS">Works</MenuItem>
        <MenuItem value="SERVICE">Services</MenuItem>
        <MenuItem value="CONSULTANCY">Consultancy</MenuItem>
      </TextField>
      <TextField select value={budget} onChange={(event) => onBudgetChange(event.target.value)} label={t('common.budget')}>
        <MenuItem value="">All budgets</MenuItem>
        <MenuItem value="under-hundred-million">Under TZS 100M</MenuItem>
        <MenuItem value="hundred-million-plus">TZS 100M to 1B</MenuItem>
        <MenuItem value="billion-plus">TZS 1B+</MenuItem>
      </TextField>
      <TextField select value={status} onChange={(event) => onStatusChange(event.target.value)} label={t('common.status')}>
        <MenuItem value="">All statuses</MenuItem>
        <MenuItem value="OPEN">{t('status.open')}</MenuItem>
        <MenuItem value="PUBLISHED">{t('status.published')}</MenuItem>
        <MenuItem value="EVALUATION">Evaluation</MenuItem>
        <MenuItem value="AWARDED">Awarded</MenuItem>
      </TextField>
      <TextField select value={sort} onChange={(event) => onSortChange(event.target.value)} label="Sort">
        <MenuItem value="deadline">Sort by deadline</MenuItem>
        <MenuItem value="newest">Newest</MenuItem>
        <MenuItem value="budget-desc">Budget high to low</MenuItem>
        <MenuItem value="budget-asc">Budget low to high</MenuItem>
      </TextField>
    </section>
  );
}

export function MarketplaceCategoryGrid({ tenders, onSelectType }: { tenders: Tender[]; onSelectType: (type: string) => void }) {
  const counts = tenders.reduce<Record<string, number>>((acc, tender) => {
    acc[tender.type] = (acc[tender.type] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <section className="marketplace-category-grid" aria-label="Browse categories">
      {Object.entries(counts).map(([category, count]) => (
        <button className="marketplace-category-card" type="button" key={category} onClick={() => onSelectType(category)}>
          <strong>{category}</strong>
          <span>{count} {count === 1 ? 'tender' : 'tenders'}</span>
        </button>
      ))}
    </section>
  );
}

export function MarketplaceSummary({ tenders }: { tenders: Tender[] }) {
  const draftBids = 0;
  const openCount = tenders.filter((tender) => tender.status === 'OPEN').length;
  const closingSoon = tenders.filter((tender) => getDaysRemaining(tender) <= 14).length;
  const totalBudget = tenders.reduce((sum, tender) => sum + tender.budget, 0);

  return (
    <section className="procurement-market-summary">
      <div className="kpi-card"><div className="kpi-value">{openCount}</div><div className="kpi-label">Open tenders</div></div>
      <div className="kpi-card"><div className="kpi-value">{draftBids}</div><div className="kpi-label">Draft bids</div></div>
      <div className="kpi-card"><div className="kpi-value">{closingSoon}</div><div className="kpi-label">Closing soon</div></div>
      <div className="kpi-card"><div className="kpi-value">TZS {(totalBudget / 1000000000).toFixed(1)}B</div><div className="kpi-label">Total budget value</div></div>
    </section>
  );
}

export function TenderListPanel({ tenders }: { tenders: Tender[] }) {
  return (
    <section className="procurement-list-panel">
      <div className="panel-heading">
        <div>
          <span className="section-kicker">Tender list</span>
          <h2>Available tenders</h2>
        </div>
        <span className="badge badge-success">{tenders.length} matching</span>
      </div>
      <div className="procurement-tender-list market-list">
        {tenders.length ? (
          tenders.map((tender) => <TenderRowCard key={tender.id} tender={tender} />)
        ) : (
          <div className="scope-empty">No published tenders yet. Create and publish a tender to start marketplace activity.</div>
        )}
      </div>
    </section>
  );
}

function TenderRowCard({ tender }: { tender: Tender }) {
  const { t } = useTranslation();
  const format = useLocaleFormat();
  const daysRemaining = getDaysRemaining(tender);
  const detailUrl = tender.createdByCurrentUser ? '/procurement/tender-details' : '/procurement/supplier-tender-detail';

  return (
    <article className={`procurement-tender-row market-row ${tender.createdByCurrentUser ? 'is-owned' : ''}`}>
      <div>
        <div className="tender-row-title">
          <strong>{tender.title}</strong>
          <span className="badge badge-info">{tender.reference}</span>
          <StatusBadge value={tender.status} />
          {tender.createdByCurrentUser ? <span className="badge badge-info">Posted by you</span> : null}
        </div>
        <p>{tender.organization} / {tender.type} / {t('common.budget')}: {format.money(tender.budget, tender.currency)}</p>
        <span>{tender.description}</span>
        <div className="market-row-meta">
          <em>{tender.location}</em>
          <em>{daysRemaining < 0 ? 'Closed' : `${daysRemaining} days remaining`}</em>
        </div>
      </div>
      <div className="tender-row-actions">
        <Button variant="outlined" className="btn btn-secondary">Save</Button>
        <Button component={Link} to={detailUrl} variant="outlined" className="btn btn-secondary">View Tender</Button>
        <Button component={Link} to="/bidding" variant="contained" className="btn btn-primary" disabled={tender.createdByCurrentUser || tender.status !== 'OPEN'}>
          {tender.createdByCurrentUser ? 'Your Tender' : 'Bid'}
        </Button>
      </div>
    </article>
  );
}

function getDaysRemaining(tender: Tender) {
  const closingTime = Date.parse(`${tender.closingDate}T23:59:59`);
  if (!Number.isFinite(closingTime)) return 0;
  return Math.ceil((closingTime - Date.now()) / 86400000);
}
