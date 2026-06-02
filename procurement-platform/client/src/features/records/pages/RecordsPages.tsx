import { TextField } from '@mui/material';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/app/store';
import { DataTable, PageHeader, StatusBadge } from '@/shared/components';

export function RecordsHistoryPage() {
  const { t } = useTranslation();
  const rows = useAppSelector((state) => state.records.records);
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () => rows.filter((row) => `${row.reference} ${row.title} ${row.owner}`.toLowerCase().includes(query.toLowerCase())),
    [query, rows]
  );

  return (
    <section>
      <PageHeader title={t('pages.records.title')} subtitle={t('pages.records.subtitle')} />
      <article className="px-card">
        <TextField label={t('common.search')} value={query} onChange={(event) => setQuery(event.target.value)} fullWidth />
      </article>
      <DataTable
        rows={filtered}
        getRowKey={(row) => row.id}
        columns={[
          { key: 'type', label: 'Type', render: (row) => row.entityType },
          { key: 'reference', label: t('common.reference'), render: (row) => <strong>{row.reference}</strong> },
          { key: 'title', label: 'Title', render: (row) => row.title },
          { key: 'owner', label: t('common.owner'), render: (row) => row.owner },
          { key: 'status', label: t('common.status'), render: (row) => <StatusBadge value={row.status} /> }
        ]}
      />
    </section>
  );
}
