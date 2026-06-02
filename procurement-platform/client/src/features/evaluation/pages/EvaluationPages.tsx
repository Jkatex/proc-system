import { Button, LinearProgress, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { DataTable, PageHeader, StatusBadge } from '@/shared/components';
import { lockEvaluation } from '../slice';

export function BidEvaluationPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { bids, currentStage, progress } = useAppSelector((state) => state.evaluation);

  return (
    <section>
      <PageHeader title={t('pages.evaluation.title')} subtitle={t('pages.evaluation.subtitle')} />
      <div className="px-grid two">
        <article className="px-card">
          <StatusBadge value={currentStage} />
          <h3>Evaluation workspace</h3>
          <LinearProgress variant="determinate" value={progress} />
          <div className="px-form-grid">
            <TextField label="Eligibility decision" defaultValue="Responsive" />
            <TextField label="Technical score" defaultValue="86" />
            <TextField label="Financial ranking" defaultValue="1" />
            <TextField label="Recommendation" defaultValue="Proceed to award" />
          </div>
          <div className="px-actions">
            <Button variant="outlined">{t('actions.saveDraft')}</Button>
            <Button variant="contained" onClick={() => dispatch(lockEvaluation())}>{t('actions.submit')}</Button>
          </div>
        </article>
        <DataTable
          rows={bids}
          getRowKey={(bid) => bid.id}
          columns={[
            { key: 'supplier', label: 'Supplier', render: (bid) => bid.supplier },
            { key: 'amount', label: t('common.amount'), render: (bid) => bid.amount.toLocaleString() },
            { key: 'score', label: 'Score', render: (bid) => bid.score },
            { key: 'status', label: t('common.status'), render: (bid) => <StatusBadge value={bid.status} /> }
          ]}
        />
      </div>
    </section>
  );
}
