import { createHash, randomBytes, scrypt as scryptCallback } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';
import {
  AccountType,
  BidStatus,
  EnvelopeType,
  OrganizationCapabilityName,
  OrganizationKind,
  ProcurementMethod,
  RiskLevel,
  TenderStatus,
  TenderType,
  TrustTier,
  VerificationStatus,
  Visibility
} from '@prisma/client';
import { prisma } from '../src/db/prisma.js';
import { withDbContext } from '../src/db/context.js';

const scrypt = promisify(scryptCallback);

const DATASET = 'marketplace-production-demo';
const PREFIX = 'PX-MKT-DEMO';
const SUPPLIER_PASSWORD = 'Supplier123!';
const BUYER_PASSWORD = 'Market123!';

type AnyDb = Record<string, any>;
type Actor = { org: any; user: any };

const actorSpecs = [
  {
    key: 'buyer1',
    orgName: 'ProcureX Marketplace Test Buyer Authority',
    email: 'market-buyer@procurex.tz',
    displayName: 'Marketplace Buyer One',
    title: 'Head of Procurement',
    password: BUYER_PASSWORD,
    capabilities: [OrganizationCapabilityName.BUYER],
    summary: 'Public buyer authority for marketplace tender testing.',
    profile: { regions: ['Dar es Salaam', 'Dodoma'], focus: ['ICT equipment', 'consultancy'] }
  },
  {
    key: 'buyer2',
    orgName: 'ProcureX Marketplace Municipal Buyer',
    email: 'market-buyer2@procurex.tz',
    displayName: 'Marketplace Buyer Two',
    title: 'Procurement Manager',
    password: BUYER_PASSWORD,
    capabilities: [OrganizationCapabilityName.BUYER],
    summary: 'Municipal buyer for works and facilities services marketplace scenarios.',
    profile: { regions: ['Dodoma', 'Mwanza'], focus: ['works', 'services'] }
  },
  {
    key: 'ictSupplier',
    orgName: 'Taifa ICT Solutions Limited',
    email: 'ict-supplier@procurex.tz',
    displayName: 'Taifa ICT Supplier',
    title: 'Bid Manager',
    password: SUPPLIER_PASSWORD,
    capabilities: [OrganizationCapabilityName.SUPPLIER],
    summary: 'Supplier of ICT equipment, networking devices, and systems audit support.',
    supplier: {
      bidLimit: 900000000,
      categories: ['ICT', 'Equipment', 'Goods', 'Consultancy'],
      preferredTenderTypes: ['Goods', 'Consultancy'],
      operatingLocations: ['Dar es Salaam', 'Dodoma']
    }
  },
  {
    key: 'worksSupplier',
    orgName: 'Dar Works and Interiors Limited',
    email: 'works-supplier@procurex.tz',
    displayName: 'Dar Works Supplier',
    title: 'Contracts Lead',
    password: SUPPLIER_PASSWORD,
    capabilities: [OrganizationCapabilityName.SUPPLIER],
    summary: 'Renovation and office fit-out contractor serving public offices in Tanzania.',
    supplier: {
      bidLimit: 1500000000,
      categories: ['Works', 'Renovation', 'Office Fit Out'],
      preferredTenderTypes: ['Works'],
      operatingLocations: ['Dar es Salaam', 'Dodoma']
    }
  },
  {
    key: 'servicesSupplier',
    orgName: 'Jambo Facilities Services Limited',
    email: 'services-supplier@procurex.tz',
    displayName: 'Jambo Facilities Supplier',
    title: 'Tender Coordinator',
    password: SUPPLIER_PASSWORD,
    capabilities: [OrganizationCapabilityName.SUPPLIER],
    summary: 'Facilities services supplier for cleaning, guarding, and workplace support.',
    supplier: {
      bidLimit: 500000000,
      categories: ['Facilities', 'Cleaning', 'Security', 'Non Consultancy'],
      preferredTenderTypes: ['Non Consultancy'],
      operatingLocations: ['Dar es Salaam', 'Arusha', 'Mwanza']
    }
  }
] as const;

function assertSafeEnvironment() {
  const environment = process.env.NODE_ENV || 'development';
  if (!['development', 'test'].includes(environment)) {
    throw new Error(`Refusing to run marketplace demo seed when NODE_ENV=${environment}. Use development or test only.`);
  }
}

function demoPayload(extra: Record<string, unknown> = {}) {
  return {
    demoDataset: DATASET,
    ...extra
  };
}

function ref(suffix: string) {
  return `${PREFIX}-${suffix}`;
}

function daysFromNow(days: number, hour = 9) {
  const date = new Date();
  date.setUTCHours(hour, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + days);
  return date;
}

async function hashSeedPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt:${salt}:${derived.toString('hex')}`;
}

function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

async function deleteIfIds(db: AnyDb, model: string, field: string, ids: string[]) {
  if (ids.length === 0) return;
  await db[model].deleteMany({ where: { [field]: { in: ids } } });
}

async function resetMarketplaceRecords(db: AnyDb) {
  const tenders = await db.tender.findMany({
    where: { reference: { startsWith: PREFIX } },
    select: { id: true }
  });
  const tenderIds = tenders.map((item: { id: string }) => item.id);
  const bids = await db.bid.findMany({
    where: {
      OR: [{ reference: { startsWith: PREFIX } }, ...(tenderIds.length ? [{ tenderId: { in: tenderIds } }] : [])]
    },
    select: { id: true }
  });
  const bidIds = bids.map((item: { id: string }) => item.id);

  await deleteIfIds(db, 'savedTender', 'tenderId', tenderIds);
  await deleteIfIds(db, 'bidReceipt', 'bidId', bidIds);
  await deleteIfIds(db, 'bidResponse', 'bidId', bidIds);
  await deleteIfIds(db, 'bidVersion', 'bidId', bidIds);
  await deleteIfIds(db, 'bid', 'id', bidIds);
  await deleteIfIds(db, 'tenderCategory', 'tenderId', tenderIds);
  await deleteIfIds(db, 'tender', 'id', tenderIds);
}

async function cleanupMarketplaceDemo() {
  assertSafeEnvironment();
  await withDbContext({ accountType: AccountType.ADMIN }, async (tx) => {
    const db = tx as AnyDb;
    await resetMarketplaceRecords(db);

    const users = await db.user.findMany({
      where: { email: { in: actorSpecs.map((actor) => actor.email) } },
      select: { id: true }
    });
    const organizations = await db.organization.findMany({
      where: { name: { in: actorSpecs.map((actor) => actor.orgName) } },
      select: { id: true }
    });
    const userIds = users.map((item: { id: string }) => item.id);
    const organizationIds = organizations.map((item: { id: string }) => item.id);

    await deleteIfIds(db, 'savedTender', 'organizationId', organizationIds);
    await deleteIfIds(db, 'account', 'userId', userIds);
    await deleteIfIds(db, 'organizationMember', 'userId', userIds);
    await deleteIfIds(db, 'organizationMember', 'organizationId', organizationIds);
    await deleteIfIds(db, 'organizationCapability', 'organizationId', organizationIds);
    await deleteIfIds(db, 'buyerProfile', 'organizationId', organizationIds);
    await deleteIfIds(db, 'supplierProfile', 'organizationId', organizationIds);
    await deleteIfIds(db, 'organizationProfile', 'organizationId', organizationIds);
    await deleteIfIds(db, 'user', 'id', userIds);
    await deleteIfIds(db, 'organization', 'id', organizationIds);
  }, prisma);
}

async function upsertActor(db: AnyDb, spec: (typeof actorSpecs)[number]): Promise<Actor> {
  const org = await db.organization.upsert({
    where: { name: spec.orgName },
    update: {
      kind: OrganizationKind.COMPANY,
      country: 'TZ',
      metadata: demoPayload({ seededActor: true })
    },
    create: {
      name: spec.orgName,
      kind: OrganizationKind.COMPANY,
      country: 'TZ',
      metadata: demoPayload({ seededActor: true })
    }
  });

  for (const capability of spec.capabilities) {
    await db.organizationCapability.upsert({
      where: { organizationId_capability: { organizationId: org.id, capability } },
      update: { enabled: true },
      create: { organizationId: org.id, capability, enabled: true }
    });
  }

  await db.organizationProfile.upsert({
    where: { organizationId: org.id },
    update: {
      summary: spec.summary,
      payload: demoPayload('supplier' in spec ? spec.supplier : spec.profile)
    },
    create: {
      organizationId: org.id,
      summary: spec.summary,
      payload: demoPayload('supplier' in spec ? spec.supplier : spec.profile)
    }
  });

  if (spec.capabilities.some((capability) => capability === OrganizationCapabilityName.BUYER)) {
    await db.buyerProfile.upsert({
      where: { organizationId: org.id },
      update: {
        procuringType: 'Development marketplace procuring entity',
        budgetCode: ref('BUDGET-MARKETPLACE'),
        payload: demoPayload('profile' in spec ? spec.profile : {})
      },
      create: {
        organizationId: org.id,
        procuringType: 'Development marketplace procuring entity',
        budgetCode: ref('BUDGET-MARKETPLACE'),
        payload: demoPayload('profile' in spec ? spec.profile : {})
      }
    });
  }

  if ('supplier' in spec) {
    await db.supplierProfile.upsert({
      where: { organizationId: org.id },
      update: {
        trustTier: TrustTier.GOLD,
        riskLevel: RiskLevel.LOW,
        bidLimit: spec.supplier.bidLimit,
        categories: spec.supplier.categories
      },
      create: {
        organizationId: org.id,
        trustTier: TrustTier.GOLD,
        riskLevel: RiskLevel.LOW,
        bidLimit: spec.supplier.bidLimit,
        categories: spec.supplier.categories
      }
    });
  }

  const user = await db.user.upsert({
    where: { email: spec.email },
    update: {
      displayName: spec.displayName,
      accountType: AccountType.USER,
      verificationStatus: VerificationStatus.APPROVED,
      passwordHash: await hashSeedPassword(spec.password),
      metadata: demoPayload({ phoneVerified: true, emailVerified: true })
    },
    create: {
      email: spec.email,
      phone: `+2557${String(10000000 + actorSpecs.findIndex((actor) => actor.email === spec.email)).padStart(8, '0')}`,
      displayName: spec.displayName,
      accountType: AccountType.USER,
      verificationStatus: VerificationStatus.APPROVED,
      passwordHash: await hashSeedPassword(spec.password),
      metadata: demoPayload({ phoneVerified: true, emailVerified: true })
    }
  });

  await db.account.upsert({
    where: { provider_providerUserId: { provider: 'password', providerUserId: spec.email } },
    update: { accountType: AccountType.USER, metadata: demoPayload() },
    create: { userId: user.id, provider: 'password', providerUserId: spec.email, accountType: AccountType.USER, metadata: demoPayload() }
  });

  await db.organizationMember.upsert({
    where: { organizationId_userId: { organizationId: org.id, userId: user.id } },
    update: { status: 'ACTIVE', isDefault: true, title: spec.title },
    create: { organizationId: org.id, userId: user.id, status: 'ACTIVE', isDefault: true, title: spec.title }
  });

  return { org, user };
}

async function upsertTender(
  db: AnyDb,
  input: {
    reference: string;
    buyer: Actor;
    title: string;
    description: string;
    type: TenderType;
    status: TenderStatus;
    visibility: Visibility;
    budget: number;
    location: string;
    closingDate: Date;
    publishedAt: Date | null;
    categories: string[];
    requirements: Record<string, unknown>;
  }
) {
  const data = {
    buyerOrgId: input.buyer.org.id,
    ownerUserId: input.buyer.user.id,
    title: input.title,
    description: input.description,
    type: input.type,
    status: input.status,
    method: ProcurementMethod.OPEN_TENDER,
    visibility: input.visibility,
    budget: input.budget,
    currency: 'TZS',
    location: input.location,
    closingDate: input.closingDate,
    publishedAt: input.publishedAt,
    requirements: input.requirements,
    metadata: demoPayload({ reference: input.reference })
  };
  const tender = await db.tender.upsert({
    where: { reference: input.reference },
    update: data,
    create: { reference: input.reference, ...data }
  });
  await db.tenderCategory.deleteMany({ where: { tenderId: tender.id } });
  await db.tenderCategory.createMany({
    data: input.categories.map((name) => ({ tenderId: tender.id, name })),
    skipDuplicates: true
  });
  return tender;
}

async function upsertBid(
  db: AnyDb,
  input: {
    reference: string;
    tender: any;
    supplier: Actor;
    status: BidStatus;
    totalAmount: number;
    submittedAt?: Date | null;
    responses: Record<string, unknown>[];
  }
) {
  const bid = await db.bid.upsert({
    where: { reference: input.reference },
    update: {
      tenderId: input.tender.id,
      buyerOrgId: input.tender.buyerOrgId,
      supplierOrgId: input.supplier.org.id,
      submittedByUserId: input.status === BidStatus.SUBMITTED ? input.supplier.user.id : null,
      status: input.status,
      submittedAt: input.submittedAt ?? null,
      totalAmount: input.totalAmount,
      currency: 'TZS',
      payload: demoPayload({
        administrative: { tinSubmitted: true, businessLicenseSubmitted: true },
        technical: { methodology: 'Seeded marketplace testing response' },
        financial: { totalAmount: input.totalAmount },
        declarations: { confirmAccuracy: true, acceptTerms: true }
      })
    },
    create: {
      tenderId: input.tender.id,
      buyerOrgId: input.tender.buyerOrgId,
      supplierOrgId: input.supplier.org.id,
      submittedByUserId: input.status === BidStatus.SUBMITTED ? input.supplier.user.id : null,
      reference: input.reference,
      status: input.status,
      submittedAt: input.submittedAt ?? null,
      totalAmount: input.totalAmount,
      currency: 'TZS',
      payload: demoPayload({
        administrative: { tinSubmitted: true, businessLicenseSubmitted: true },
        technical: { methodology: 'Seeded marketplace testing response' },
        financial: { totalAmount: input.totalAmount },
        declarations: { confirmAccuracy: true, acceptTerms: true }
      })
    }
  });

  await db.bidResponse.deleteMany({ where: { bidId: bid.id } });
  await db.bidResponse.createMany({
    data: input.responses.map((response, index) => ({
      bidId: bid.id,
      requirementKey: `REQ-${index + 1}`,
      response
    }))
  });

  if (input.status === BidStatus.SUBMITTED) {
    const sealedHash = sha256(`${input.reference}:${input.totalAmount}:${input.submittedAt?.toISOString() ?? ''}`);
    await db.bidVersion.upsert({
      where: { bidId_versionNo_envelope: { bidId: bid.id, versionNo: 1, envelope: EnvelopeType.COMBINED } },
      update: { sealedHash, payload: demoPayload({ snapshot: 'Submitted marketplace demo bid' }) },
      create: { bidId: bid.id, versionNo: 1, envelope: EnvelopeType.COMBINED, sealedHash, payload: demoPayload({ snapshot: 'Submitted marketplace demo bid' }) }
    });
    await db.bidReceipt.upsert({
      where: { bidId: bid.id },
      update: {
        receiptRef: `${input.reference}-RCPT`,
        receiptHash: sha256(`${input.reference}:receipt:${sealedHash}`)
      },
      create: {
        bidId: bid.id,
        receiptRef: `${input.reference}-RCPT`,
        receiptHash: sha256(`${input.reference}:receipt:${sealedHash}`)
      }
    });
  }

  return bid;
}

async function seedMarketplaceDemo() {
  assertSafeEnvironment();
  await withDbContext({ accountType: AccountType.ADMIN }, async (tx) => {
    const db = tx as AnyDb;
    await resetMarketplaceRecords(db);

    const actors: Record<string, Actor> = {};
    for (const spec of actorSpecs) {
      actors[spec.key] = await upsertActor(db, spec);
    }

    const tenders = {
      ict: await upsertTender(db, {
        reference: ref('OPEN-GOODS-ICT'),
        buyer: actors.buyer1,
        title: 'Supply and installation of ICT equipment for regional offices',
        description: 'Laptops, network switches, printers, and installation services for public service delivery offices.',
        type: TenderType.GOODS,
        status: TenderStatus.OPEN,
        visibility: Visibility.PUBLIC_MARKETPLACE,
        budget: 420000000,
        location: 'Dar es Salaam',
        closingDate: daysFromNow(30),
        publishedAt: daysFromNow(-10),
        categories: ['ICT', 'Equipment', 'Goods'],
        requirements: { technical: ['Authorized reseller letter', 'Warranty support in Tanzania'], delivery: 'Within 60 days' }
      }),
      renovation: await upsertTender(db, {
        reference: ref('OPEN-WORKS-RENOVATION'),
        buyer: actors.buyer2,
        title: 'Office renovation and partitioning works for municipal headquarters',
        description: 'Renovation of public offices including partitions, painting, electrical works, and minor civil repairs.',
        type: TenderType.WORKS,
        status: TenderStatus.OPEN,
        visibility: Visibility.PUBLIC_MARKETPLACE,
        budget: 850000000,
        location: 'Dodoma',
        closingDate: daysFromNow(45),
        publishedAt: daysFromNow(-8),
        categories: ['Works', 'Renovation', 'Office Fit Out'],
        requirements: { technical: ['Registered local contractor', 'Similar assignments in the last three years'], siteVisit: true }
      }),
      cleaning: await upsertTender(db, {
        reference: ref('OPEN-SERVICE-CLEANING'),
        buyer: actors.buyer1,
        title: 'Provision of cleaning services for government office blocks',
        description: 'Daily cleaning, waste handling, sanitation supplies, and supervisor reporting for three office blocks.',
        type: TenderType.SERVICE,
        status: TenderStatus.OPEN,
        visibility: Visibility.PUBLIC_MARKETPLACE,
        budget: 180000000,
        location: 'Arusha',
        closingDate: daysFromNow(20),
        publishedAt: daysFromNow(-7),
        categories: ['Facilities', 'Cleaning', 'Non Consultancy'],
        requirements: { staffing: 'Minimum 30 trained cleaners', equipment: ['Floor polishers', 'Protective gear'] }
      }),
      security: await upsertTender(db, {
        reference: ref('OPEN-SERVICE-SECURITY'),
        buyer: actors.buyer2,
        title: 'Security guarding services for public facilities',
        description: 'Uniformed guarding, access control, patrol reporting, and incident escalation for public facilities.',
        type: TenderType.SERVICE,
        status: TenderStatus.PUBLISHED,
        visibility: Visibility.PUBLIC_MARKETPLACE,
        budget: 260000000,
        location: 'Mwanza',
        closingDate: daysFromNow(25),
        publishedAt: daysFromNow(-6),
        categories: ['Facilities', 'Security', 'Non Consultancy'],
        requirements: { licensing: 'Licensed private security company', staffing: '24/7 guard coverage' }
      }),
      audit: await upsertTender(db, {
        reference: ref('OPEN-CONSULTANCY-AUDIT'),
        buyer: actors.buyer1,
        title: 'Information systems audit and procurement training consultancy',
        description: 'Independent systems audit and user training for procurement workflows and reporting controls.',
        type: TenderType.CONSULTANCY,
        status: TenderStatus.OPEN,
        visibility: Visibility.PUBLIC_MARKETPLACE,
        budget: 150000000,
        location: 'Dar es Salaam',
        closingDate: daysFromNow(35),
        publishedAt: daysFromNow(-5),
        categories: ['Consultancy', 'System Audit', 'Training'],
        requirements: { experts: ['CISA certified lead consultant', 'Training facilitator'], deliverables: ['Audit report', 'Training materials'] }
      }),
      draftIct: await upsertTender(db, {
        reference: ref('DRAFT-GOODS-NETWORK'),
        buyer: actors.buyer1,
        title: 'Draft network upgrade equipment tender',
        description: 'Draft tender for structured cabling, routers, and wireless access points.',
        type: TenderType.GOODS,
        status: TenderStatus.DRAFT,
        visibility: Visibility.PRIVATE,
        budget: 300000000,
        location: 'Dar es Salaam',
        closingDate: daysFromNow(60),
        publishedAt: null,
        categories: ['ICT', 'Network Equipment'],
        requirements: {}
      }),
      draftWorks: await upsertTender(db, {
        reference: ref('DRAFT-WORKS-OFFICE'),
        buyer: actors.buyer1,
        title: 'Draft office repainting and partitions tender',
        description: 'Draft tender for repainting, partitions, and small office repairs.',
        type: TenderType.WORKS,
        status: TenderStatus.DRAFT,
        visibility: Visibility.PRIVATE,
        budget: 220000000,
        location: 'Dodoma',
        closingDate: daysFromNow(70),
        publishedAt: null,
        categories: ['Works', 'Renovation'],
        requirements: {}
      }),
      closedGoods: await upsertTender(db, {
        reference: ref('CLOSED-GOODS-PRINTERS'),
        buyer: actors.buyer2,
        title: 'Closed framework for supply of office printers',
        description: 'Closed procurement record for multifunction printers and consumables framework.',
        type: TenderType.GOODS,
        status: TenderStatus.CLOSED,
        visibility: Visibility.PUBLIC_MARKETPLACE,
        budget: 320000000,
        location: 'Tanga',
        closingDate: daysFromNow(-15),
        publishedAt: daysFromNow(-90),
        categories: ['ICT', 'Printers', 'Goods'],
        requirements: { warranty: 'One year onsite support' }
      }),
      closedCleaning: await upsertTender(db, {
        reference: ref('CLOSED-SERVICE-CLEANING'),
        buyer: actors.buyer1,
        title: 'Closed regional cleaning services framework',
        description: 'Closed procurement record for cleaning and sanitation services across regional offices.',
        type: TenderType.SERVICE,
        status: TenderStatus.CLOSED,
        visibility: Visibility.PUBLIC_MARKETPLACE,
        budget: 120000000,
        location: 'Morogoro',
        closingDate: daysFromNow(-20),
        publishedAt: daysFromNow(-100),
        categories: ['Facilities', 'Cleaning', 'Non Consultancy'],
        requirements: { staffing: 'Regional cleaning teams' }
      })
    };

    await upsertBid(db, {
      reference: ref('BID-DRAFT-WORKS'),
      tender: tenders.renovation,
      supplier: actors.worksSupplier,
      status: BidStatus.DRAFT,
      totalAmount: 790000000,
      responses: [{ experience: 'Three public office renovation projects completed.' }, { approach: 'Phased works with weekend shifts.' }]
    });
    await upsertBid(db, {
      reference: ref('BID-DRAFT-AUDIT'),
      tender: tenders.audit,
      supplier: actors.ictSupplier,
      status: BidStatus.DRAFT,
      totalAmount: 140000000,
      responses: [{ experts: 'CISA lead auditor and procurement trainer proposed.' }]
    });
    await upsertBid(db, {
      reference: ref('BID-SUBMITTED-ICT'),
      tender: tenders.ict,
      supplier: actors.ictSupplier,
      status: BidStatus.SUBMITTED,
      totalAmount: 405000000,
      submittedAt: daysFromNow(-2, 11),
      responses: [{ warranty: 'Three-year manufacturer warranty included.' }, { delivery: 'Forty-five day delivery schedule.' }]
    });
    await upsertBid(db, {
      reference: ref('BID-SUBMITTED-CLEANING'),
      tender: tenders.cleaning,
      supplier: actors.servicesSupplier,
      status: BidStatus.SUBMITTED,
      totalAmount: 170000000,
      submittedAt: daysFromNow(-1, 10),
      responses: [{ staffing: 'Forty trained cleaners and three supervisors.' }, { equipment: 'Dedicated cleaning equipment and PPE included.' }]
    });

    for (const saved of [
      { tender: tenders.renovation, actor: actors.ictSupplier },
      { tender: tenders.audit, actor: actors.servicesSupplier },
      { tender: tenders.security, actor: actors.worksSupplier }
    ]) {
      await db.savedTender.upsert({
        where: { tenderId_organizationId: { tenderId: saved.tender.id, organizationId: saved.actor.org.id } },
        update: { userId: saved.actor.user.id },
        create: { tenderId: saved.tender.id, organizationId: saved.actor.org.id, userId: saved.actor.user.id }
      });
    }
  }, prisma);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const command = process.argv[2];
  const action = command === 'cleanup' ? cleanupMarketplaceDemo : seedMarketplaceDemo;
  action()
    .then(async () => {
      console.log(command === 'cleanup' ? `Removed ${DATASET} demo records.` : `Seeded ${DATASET} demo records.`);
      await prisma.$disconnect();
    })
    .catch(async (error) => {
      console.error(error);
      await prisma.$disconnect();
      process.exit(1);
    });
}

export { cleanupMarketplaceDemo, seedMarketplaceDemo };
