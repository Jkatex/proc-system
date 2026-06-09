import { mockApi } from '@/shared/api/mockApi';
import { demoUsers } from '@/shared/data/fixtures';
import type { Bid, Tender } from '@/shared/types/domain';
import { toTenderType } from '../createTenderConfig';
import type { CreateTenderDraft, MarketplacePayload, MarketplaceTenderRow, MyBidRow, MyTenderRow } from '../types';

export const procurementApi = {
  listTenders: mockApi.getTenders,
  async getMarketplace(): Promise<MarketplacePayload> {
    const [tenders, bids, workItems] = await Promise.all([mockApi.getTenders(), mockApi.getBids(), mockApi.getWorkItems()]);
    return buildMarketplacePayload(tenders, bids, workItems);
  }
};

type WorkItemFixture = Awaited<ReturnType<typeof mockApi.getWorkItems>>[number];

function buildMarketplacePayload(tenders: Tender[], bids: Bid[], workItems: WorkItemFixture[]): MarketplacePayload {
  const myTenderRows = buildMyTenderRows(tenders, workItems);
  const myBidRows = buildMyBidRows(tenders, bids, workItems);

  return {
    tenders: tenders.map((tender) => ({
      ...tender,
      hasDraftBid: myBidRows.some((bid) => bid.tenderReference === tender.reference && bid.section === 'draft'),
      hasSubmittedBid: myBidRows.some((bid) => bid.tenderReference === tender.reference && bid.section === 'submitted')
    })),
    myTenders: myTenderRows,
    myBids: myBidRows
  };
}

export function mergeSessionMarketplaceData(
  payload: MarketplacePayload,
  drafts: CreateTenderDraft[],
  publishedTenders: CreateTenderDraft[],
  organization = demoUsers.user.organization
): MarketplacePayload {
  const sessionTenderRows = publishedTenders.map((draft): MarketplaceTenderRow => createMarketplaceTenderFromDraft(draft, organization));
  const sessionMyTenderRows = drafts.map((draft): MyTenderRow => ({
    id: `my-tender-${draft.status.toLowerCase()}-${draft.id}`,
    title: draft.title || 'Untitled tender draft',
    section: draft.status === 'DRAFT' ? 'draft' : 'posted',
    status: draft.status === 'DRAFT' ? 'Draft' : 'Posted',
    type: toTenderType(draft.procurementTypeId),
    tender: draft.status === 'PUBLISHED' ? createMarketplaceTenderFromDraft(draft, organization) : undefined,
    lastActivity: draft.publishedAt?.slice(0, 10) || draft.updatedAt.slice(0, 10),
    actionLabel: draft.status === 'DRAFT' ? 'Continue Draft' : 'View My Tender',
    nav: draft.status === 'DRAFT' ? '/procurement/create-tender' : '/procurement/tender-details'
  }));

  const existingTenderIds = new Set(sessionTenderRows.map((row) => row.id));
  const existingMyTenderIds = new Set(sessionMyTenderRows.map((row) => row.id));

  return {
    ...payload,
    tenders: [...sessionTenderRows, ...payload.tenders.filter((row) => !existingTenderIds.has(row.id))],
    myTenders: [...sessionMyTenderRows, ...payload.myTenders.filter((row) => !existingMyTenderIds.has(row.id))]
  };
}

function createMarketplaceTenderFromDraft(draft: CreateTenderDraft, organization: string): MarketplaceTenderRow {
  return {
    id: `session-${draft.id}`,
    reference: draft.reference,
    title: draft.title || 'Untitled tender',
    organization: draft.procuringEntity || organization,
    type: toTenderType(draft.procurementTypeId),
    status: 'OPEN',
    budget: Number(draft.estimatedBudget || draft.requirements.estimated_budget || draft.commercialItems.length * 5000000 || 100000000),
    currency: draft.currency || 'TZS',
    closingDate: draft.submissionDate || new Date().toISOString().slice(0, 10),
    location: draft.location || 'Tanzania',
    description: summarizeDraft(draft),
    createdByCurrentUser: true,
    categories: draft.categories.length ? draft.categories : [draft.procurementTypeId]
  };
}

function summarizeDraft(draft: CreateTenderDraft) {
  const firstRequirement = Object.values(draft.requirements).find(Boolean);
  return draft.description || firstRequirement || draft.deliverables[0] || `Published ${draft.procurementTypeId} tender created in the React workflow.`;
}

function buildMyTenderRows(tenders: Tender[], workItems: WorkItemFixture[]): MyTenderRow[] {
  const ownedTenders = tenders.filter((tender) => tender.createdByCurrentUser);
  const draftWorkItems = workItems.filter((item) => /tender draft|publish tender/i.test(`${item.title} ${item.subtitle}`));

  const draftRows = draftWorkItems.map((item, index): MyTenderRow => {
    const tender = ownedTenders[index] ?? ownedTenders[0];
    return {
      id: `my-tender-draft-${item.id}`,
      title: item.subtitle || item.title,
      section: 'draft',
      status: item.status || 'Draft',
      type: tender?.type ?? 'SERVICE',
      tender,
      lastActivity: '2026-06-09',
      actionLabel: 'Continue Draft',
      nav: '/procurement/create-tender'
    };
  });

  const postedRows = ownedTenders.map((tender): MyTenderRow => ({
    id: `my-tender-posted-${tender.id}`,
    title: tender.title,
    section: 'posted',
    status: tender.status === 'PUBLISHED' ? 'Posted' : tender.status,
    type: tender.type,
    tender,
    lastActivity: tender.closingDate,
    actionLabel: 'View My Tender',
    nav: '/procurement/tender-details'
  }));

  return [...draftRows, ...postedRows];
}

function buildMyBidRows(tenders: Tender[], bids: Bid[], workItems: WorkItemFixture[]): MyBidRow[] {
  const tenderByReference = new Map(tenders.map((tender) => [tender.reference, tender]));
  const draftBidWorkItems = workItems.filter((item) => /bid package|continue bid/i.test(`${item.title} ${item.subtitle}`));

  const draftRows = draftBidWorkItems.flatMap((item): MyBidRow[] => {
    const tender = findTenderForWorkItem(tenders, item);
    if (!tender) return [];
    return [
      {
        id: `my-bid-draft-${item.id}`,
        title: item.subtitle || tender.title,
        section: 'draft',
        status: item.status || 'Draft',
        tender,
        tenderReference: tender.reference,
        lastActivity: '2026-06-09',
        actionLabel: 'Continue Bid',
        nav: '/bidding'
      }
    ];
  });

  const submittedRows = bids.flatMap((bid): MyBidRow[] => {
    const tender = tenderByReference.get(bid.tenderReference);
    if (!tender || bid.status === 'DRAFT' || bid.supplier !== demoUsers.user.organization) return [];
    return [
      {
        id: `my-bid-submitted-${bid.id}`,
        title: tender.title,
        section: 'submitted',
        status: bid.status === 'SUBMITTED' ? 'Submitted' : bid.status,
        tender,
        tenderReference: tender.reference,
        amount: `${tender.currency} ${bid.amount.toLocaleString()}`,
        receiptHash: `BID-${bid.id.toUpperCase()}`,
        lastActivity: '2026-06-09',
        actionLabel: 'Open Bid',
        nav: '/bidding'
      }
    ];
  });

  return [...draftRows, ...submittedRows];
}

function findTenderForWorkItem(tenders: Tender[], item: WorkItemFixture) {
  const haystack = `${item.title} ${item.subtitle}`.toLowerCase();
  return tenders.find((tender) => haystack.includes(tender.title.toLowerCase()) || tender.title.toLowerCase().includes(item.subtitle.toLowerCase()));
}
