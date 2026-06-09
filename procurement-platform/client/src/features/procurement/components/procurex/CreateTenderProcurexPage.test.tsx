import { ThemeProvider } from '@mui/material';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import '@/i18n';
import { store } from '@/app/store';
import { procurexTheme } from '@/styles/mui-theme';
import { resetCreateTenderDrafts } from '../../slice';
import { MarketplaceProcurexPage } from './MarketplaceProcurexPage';
import { CreateTenderProcurexPage } from './CreateTenderProcurexPage';

function renderCreateTender(route = '/procurement/create-tender') {
  return render(
    <Provider store={store}>
      <ThemeProvider theme={procurexTheme}>
        <MemoryRouter initialEntries={[route]}>
          <CreateTenderProcurexPage />
        </MemoryRouter>
      </ThemeProvider>
    </Provider>
  );
}

function renderWithRoutes() {
  return render(
    <Provider store={store}>
      <ThemeProvider theme={procurexTheme}>
        <MemoryRouter initialEntries={['/procurement/create-tender']}>
          <Routes>
            <Route path="/procurement/create-tender" element={<CreateTenderProcurexPage />} />
            <Route path="/procurement/my-tenders" element={<MarketplaceProcurexPage />} />
            <Route path="/procurement/marketplace" element={<MarketplaceProcurexPage />} />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    </Provider>
  );
}

async function fillBasicStep(user: ReturnType<typeof userEvent.setup>, title = 'Regional ICT Support Framework') {
  fireEvent.change(screen.getByLabelText('Tender title'), { target: { value: title } });
  await user.selectOptions(screen.getByLabelText('Funding source'), 'Government budget');
  fireEvent.change(screen.getByLabelText('Delivery Point'), { target: { value: 'Dodoma' } });
  fireEvent.change(screen.getByLabelText('Submission deadline'), { target: { value: '2026-08-20' } });
  fireEvent.change(screen.getByLabelText('Opening date'), { target: { value: '2026-08-21' } });
  fireEvent.change(screen.getByLabelText('Contact email'), { target: { value: 'procurement@example.go.tz' } });
}

async function addDefaultCategory(user: ReturnType<typeof userEvent.setup>, category = 'Medical equipment') {
  await user.selectOptions(screen.getByLabelText('Category'), category);
  await user.click(screen.getByRole('button', { name: 'Add Category' }));
}

beforeEach(() => {
  store.dispatch(resetCreateTenderDrafts());
  window.localStorage.clear();
});

describe('CreateTenderProcurexPage', () => {
  it('renders the six-step wizard and starts at Basic Information', () => {
    const { container } = renderCreateTender();

    expect(screen.getByRole('heading', { name: 'Create Tender Wizard' })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { name: 'Basic Information' }).length).toBeGreaterThan(0);
    expect(screen.getAllByText('Procurement Planning').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Tender Review and Publication').length).toBeGreaterThan(0);
    expect(container.querySelector('.wizard-shell')).toBeInTheDocument();
    expect(container.querySelector('.wizard-rail')).not.toBeInTheDocument();
    expect(container.querySelector('.journey-panel')).toBeInTheDocument();
    expect(container.querySelector('.journey-panel-content .planning-section')).toBeInTheDocument();
    expect(container.querySelector('.wizard-progress-step.active')).toHaveTextContent('Basic Information');
    expect(screen.getByRole('button', { name: 'Save Draft' })).toBeInTheDocument();
  });

  it('step navigation updates the active panel', async () => {
    const user = userEvent.setup();
    renderCreateTender();

    await user.click(screen.getAllByRole('button', { name: /Procurement Planning/ })[0]);

    expect(screen.getByRole('heading', { name: 'Procurement Planning' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Basic Information' })).not.toBeInTheDocument();
  });

  it('renders prototype Basic Information contact grid and tender details', () => {
    renderCreateTender();

    expect(screen.getByLabelText('Delivery Point')).toBeInTheDocument();
    expect(screen.getByLabelText('Contact person or department')).toBeInTheDocument();
    expect(screen.getByLabelText('Contact phone number')).toBeInTheDocument();
    expect(screen.getByLabelText('Contact email')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Tender details' })).toBeInTheDocument();
    expect(screen.getByLabelText('Tender title')).toBeInTheDocument();
    expect(screen.getByLabelText('Funding source')).toBeInTheDocument();
    expect(screen.getByLabelText('Submission deadline')).toBeInTheDocument();
    expect(screen.getByLabelText('Opening date')).toBeInTheDocument();
    expect(screen.queryByLabelText('Procuring entity')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Basic information preview')).not.toBeInTheDocument();
  });

  it('reveals a custom funding source field when Other is selected', async () => {
    const user = userEvent.setup();
    renderCreateTender();

    await user.selectOptions(screen.getByLabelText('Funding source'), 'Other');

    expect(screen.getByLabelText('Custom funding source')).toBeInTheDocument();
  });

  it('updates frontend-only contact verification badges', async () => {
    const user = userEvent.setup();
    renderCreateTender();

    await user.type(screen.getByLabelText('Contact email'), 'buyer@example.go.tz');
    await user.type(screen.getByLabelText('Contact phone number'), '+255700000001');
    await user.click(screen.getByRole('button', { name: 'Verify Email' }));
    await user.click(screen.getByRole('button', { name: 'Verify Phone' }));

    expect(screen.getByText('Email verified')).toBeInTheDocument();
    expect(screen.getByText('Phone verified')).toBeInTheDocument();
    expect(screen.getByText('Contact verified')).toBeInTheDocument();
  });

  it('blocks Continue until minimum Basic Information fields are complete', async () => {
    const user = userEvent.setup();
    renderCreateTender();

    await user.click(screen.getAllByRole('button', { name: 'Continue' })[0]);

    expect(screen.getByText('Please add the title, funding source, key dates, and one contact option before continuing.')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { name: 'Basic Information' }).length).toBeGreaterThan(0);

    await fillBasicStep(user, 'Validated Basic Information Tender');
    await user.click(screen.getAllByRole('button', { name: 'Continue' })[0]);

    expect(screen.getByRole('heading', { name: 'Procurement Planning' })).toBeInTheDocument();
  });

  it('procurement type changes swap visible requirement sections', async () => {
    const user = userEvent.setup();
    renderCreateTender();

    await user.click(screen.getAllByRole('button', { name: /Procurement Planning/ })[0]);
    await user.click(screen.getByRole('button', { name: /Services/ }));
    await user.click(screen.getAllByRole('button', { name: /Tender Requirements/ })[0]);

    expect(screen.getByRole('heading', { name: 'Service Scope and Service Levels' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Quantity Schedule and Product Specifications' })).not.toBeInTheDocument();
  });

  it('category selection supports adding and removing categories', async () => {
    const user = userEvent.setup();
    renderCreateTender();

    await user.click(screen.getAllByRole('button', { name: /Procurement Planning/ })[0]);
    await addDefaultCategory(user);

    const categoryButton = screen.getByRole('button', { name: 'Medical equipment x' });
    expect(categoryButton).toBeInTheDocument();

    await user.click(categoryButton);

    expect(screen.queryByRole('button', { name: 'Medical equipment x' })).not.toBeInTheDocument();
  });

  it('invited tender reveals invited supplier controls', async () => {
    const user = userEvent.setup();
    renderCreateTender();

    await user.click(screen.getAllByRole('button', { name: /Procurement Planning/ })[0]);
    await user.selectOptions(screen.getByLabelText('Procurement method'), 'Invited Tender');

    expect(screen.getByRole('heading', { name: 'Invited suppliers' })).toBeInTheDocument();
    expect(screen.getByLabelText('Supplier name')).toBeInTheDocument();
  });

  it('planning handoff pre-fills values and starts on the requested step', () => {
    window.localStorage.setItem(
      'procurex.planning.selectedTenderPlan',
      JSON.stringify({
        title: 'Planned Health Facility Upgrade',
        procurementType: 'works',
        category: 'Healthcare infrastructure',
        method: 'Open Tender',
        fundingSource: 'Project loan',
        openingDate: '2026-09-02',
        closingDate: '2026-09-01',
        startStep: 2
      })
    );

    renderCreateTender();

    expect(screen.getByRole('heading', { name: 'Procurement Planning' })).toBeInTheDocument();
    expect(screen.getByText('Planning-autofill notice: selected plan values pre-filled this tender draft.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Healthcare infrastructure x' })).toBeInTheDocument();
  });

  it('planning handoff pre-fills Basic Information and warns when edited', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      'procurex.planning.selectedTenderPlan',
      JSON.stringify({
        title: 'Planned Clinic Equipment',
        description: 'Initial plan objective',
        procuringEntity: 'District Health Office',
        location: 'Mwanza',
        fundingSource: 'Project loan',
        currency: 'TZS',
        estimatedBudget: 350000000,
        openingDate: '2026-09-02',
        closingDate: '2026-09-01',
        clarificationDeadline: '2026-08-25',
        publicationDate: '2026-08-01'
      })
    );

    renderCreateTender();

    expect(screen.getByLabelText('Tender title')).toHaveValue('Planned Clinic Equipment');
    expect(screen.getByLabelText('Delivery Point')).toHaveValue('Mwanza');

    await user.clear(screen.getByLabelText('Tender title'));
    await user.type(screen.getByLabelText('Tender title'), 'Edited Clinic Equipment');

    expect(screen.getByText('Planning handoff fields were edited: title.')).toBeInTheDocument();
  });

  it('evaluation criteria weights show balanced and unbalanced status', async () => {
    const user = userEvent.setup();
    renderCreateTender();

    await user.click(screen.getAllByRole('button', { name: /Evaluation Criteria and Weights/ })[0]);

    expect(screen.getByText('Balanced total: 100%')).toBeInTheDocument();

    const firstWeight = screen.getAllByLabelText('Weight')[0];
    await user.clear(firstWeight);
    await user.type(firstWeight, '10');

    expect(screen.getByText('Unbalanced total: 75%')).toBeInTheDocument();
  });

  it('review step reflects entered details and requirements', async () => {
    const user = userEvent.setup();
    renderCreateTender();

    await fillBasicStep(user, 'Supply of Solar Equipment');
    fireEvent.change(screen.getByLabelText('Contact person or department'), { target: { value: 'Procurement Officer' } });
    await user.click(screen.getAllByRole('button', { name: 'Continue' })[0]);
    await addDefaultCategory(user);
    await user.click(screen.getAllByRole('button', { name: 'Continue' })[0]);
    fireEvent.change(screen.getByLabelText('Technical specifications'), {
      target: { value: 'Solar panels, inverters, mounting kits' }
    });
    fireEvent.change(screen.getByLabelText('Deliverable'), { target: { value: 'Installed pilot system' } });
    await user.click(screen.getByRole('button', { name: 'Add Deliverable' }));
    await user.click(screen.getAllByRole('button', { name: /Review Tender/ })[0]);

    expect(screen.getByRole('heading', { name: 'Supply of Solar Equipment' })).toBeInTheDocument();
    expect(screen.getByText(/Procurement Officer/)).toBeInTheDocument();
    expect(screen.getByText('Dodoma')).toBeInTheDocument();
    expect(screen.getByText(/Solar panels, inverters, mounting kits/)).toBeInTheDocument();
    expect(screen.getByText('Installed pilot system')).toBeInTheDocument();
  }, 10000);

  it('save draft creates a My Tenders draft visible through marketplace state', async () => {
    const user = userEvent.setup();
    const { unmount } = renderWithRoutes();

    await fillBasicStep(user, 'Session Saved Generator Tender');
    await user.click(screen.getByRole('button', { name: 'Save Draft' }));

    expect(screen.getByText('Draft saved for this session.')).toBeInTheDocument();
    unmount();

    render(
      <Provider store={store}>
        <ThemeProvider theme={procurexTheme}>
          <MemoryRouter initialEntries={['/procurement/my-tenders']}>
            <MarketplaceProcurexPage />
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    );

    expect(await screen.findByText('Session Saved Generator Tender')).toBeInTheDocument();
  });

  it('submit requires confirmations, then creates posted and marketplace tender records', async () => {
    const user = userEvent.setup();
    renderWithRoutes();

    await fillBasicStep(user, 'Published React Tender');
    await user.click(screen.getAllByRole('button', { name: 'Continue' })[0]);
    await addDefaultCategory(user);
    await user.click(screen.getAllByRole('button', { name: /Tender Review and Publication/ })[0]);

    expect(screen.getByRole('button', { name: 'Submit Tender for Evaluation' })).toBeDisabled();

    for (const checkbox of screen.getAllByRole('checkbox')) {
      await user.click(checkbox);
    }

    await user.click(screen.getByRole('button', { name: 'Submit Tender for Evaluation' }));

    expect(await screen.findByText('Published React Tender')).toBeInTheDocument();
    expect(screen.getAllByText('Posted').length).toBeGreaterThan(0);

    render(
      <Provider store={store}>
        <ThemeProvider theme={procurexTheme}>
          <MemoryRouter initialEntries={['/procurement/marketplace']}>
            <MarketplaceProcurexPage />
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    );

    const marketplace = await screen.findByRole('tabpanel', { name: 'Marketplace tenders' });
    expect(within(marketplace).getByText('Published React Tender')).toBeInTheDocument();
  });
});
