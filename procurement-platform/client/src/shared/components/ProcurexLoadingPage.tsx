type ProcurexLoadingPageProps = {
  title?: string;
  message?: string;
};

export function ProcurexLoadingPage({ title = 'Loading ProcureX...', message = 'Preparing the procurement workspace.' }: ProcurexLoadingPageProps) {
  return (
    <div className="procurex-loading-page" role="status" aria-live="polite" aria-label={title}>
      <div className="loading-animation-shell" aria-hidden="true">
        <img className="procurex-loading-logo" src="/assets/logo.svg" alt="" />
      </div>
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  );
}
