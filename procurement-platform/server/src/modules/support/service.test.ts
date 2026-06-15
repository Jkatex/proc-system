import { AccountType, SupportTicketPriority, SupportTicketStatus } from '@prisma/client';
import { describe, expect, it } from 'vitest';
import { ModuleService } from './service.js';
import { createTicketSchema, updateTicketStatusSchema } from './validators.js';

class FakeSupportRepository {
  tickets = new Map<string, any>();
  auditEvents: any[] = [];
  id = 0;

  nextId(prefix: string) {
    this.id += 1;
    return `${prefix}-${this.id}`;
  }

  health() {
    return Promise.resolve({ ready: true });
  }

  listTickets(where: any) {
    const tickets = Array.from(this.tickets.values()).filter((ticket) => {
      const statusMatches = !where.status || ticket.status === where.status;
      if (!statusMatches) return false;
      if (where.ownerOrgId) return ticket.ownerOrgId === where.ownerOrgId;
      if (!where.OR) return true;
      return where.OR.some((scope: any) => {
        if (scope.ownerUserId) return ticket.ownerUserId === scope.ownerUserId;
        if (scope.ownerOrgId) return ticket.ownerOrgId === scope.ownerOrgId;
        return false;
      });
    });
    return Promise.resolve(tickets);
  }

  findTicket(id: string) {
    return Promise.resolve(this.tickets.get(id) ?? null);
  }

  createTicket(input: any) {
    const now = new Date();
    const ticket = {
      id: this.nextId('ticket'),
      ownerUserId: input.ownerUserId,
      ownerOrgId: input.ownerOrgId,
      ownerUser: { displayName: 'Owner User' },
      ownerOrg: input.ownerOrgId ? { name: 'Owner Org' } : null,
      subject: input.subject,
      category: input.category,
      priority: input.priority,
      status: SupportTicketStatus.OPEN,
      description: input.description,
      payload: input.payload ?? {},
      comments: [],
      createdAt: now,
      updatedAt: now,
      resolvedAt: null,
      closedAt: null
    };
    this.tickets.set(ticket.id, ticket);
    return Promise.resolve(ticket);
  }

  addComment(ticketId: string, input: any) {
    const comment = {
      id: this.nextId('comment'),
      ticketId,
      actorUserId: input.actorUserId,
      actorUser: { displayName: 'Owner User' },
      body: input.body,
      visibility: input.visibility ?? 'PUBLIC',
      payload: input.payload ?? {},
      createdAt: new Date()
    };
    this.tickets.get(ticketId).comments.push(comment);
    return Promise.resolve(comment);
  }

  touchTicket(id: string, status?: SupportTicketStatus) {
    const ticket = this.tickets.get(id);
    if (status) ticket.status = status;
    ticket.updatedAt = new Date();
    if (status === SupportTicketStatus.RESOLVED) ticket.resolvedAt = new Date();
    return Promise.resolve(ticket);
  }

  createAuditEvent(input: any) {
    this.auditEvents.push({ id: this.nextId('audit'), ...input });
    return Promise.resolve(this.auditEvents.at(-1));
  }
}

class FakeIdentityService {
  constructor(private readonly sessions: Record<string, any>) {}

  requireSession(token?: string) {
    const session = token ? this.sessions[token] : null;
    if (!session) {
      const error = new Error('Authentication is required.') as Error & { status?: number };
      error.status = 401;
      return Promise.reject(error);
    }
    return Promise.resolve(session);
  }
}

function makeService() {
  const repository = new FakeSupportRepository();
  const identity = new FakeIdentityService({
    buyer: {
      user: {
        id: 'user-1',
        accountType: AccountType.USER,
        organizationId: 'org-1'
      }
    },
    outsider: {
      user: {
        id: 'user-2',
        accountType: AccountType.USER,
        organizationId: 'org-2'
      }
    },
    admin: {
      user: {
        id: 'admin-1',
        accountType: AccountType.ADMIN
      }
    }
  });
  return { repository, service: new ModuleService(repository as any, identity as any) };
}

describe('support module', () => {
  it('validates ticket payloads', () => {
    expect(createTicketSchema.parse({ subject: 'Help', description: 'I need account support.' })).toMatchObject({
      subject: 'Help',
      category: 'General',
      priority: SupportTicketPriority.NORMAL
    });
    expect(updateTicketStatusSchema.parse({ status: SupportTicketStatus.RESOLVED })).toEqual({ status: SupportTicketStatus.RESOLVED });
    expect(() => createTicketSchema.parse({ subject: 'No', description: 'short' })).toThrow();
  });

  it('creates, comments, scopes, and audits support tickets', async () => {
    const { repository, service } = makeService();
    const ticket = await service.createTicket('buyer', {
      subject: 'Tender access',
      category: 'Technical',
      priority: SupportTicketPriority.HIGH,
      description: 'I cannot open the tender workspace.'
    });

    await service.addComment('buyer', ticket.id, { body: 'Please check my workspace.' });
    const updated = await service.updateStatus('buyer', ticket.id, SupportTicketStatus.RESOLVED);
    const list = await service.listTickets('buyer', {});

    expect(list.tickets).toHaveLength(1);
    expect(updated.status).toBe(SupportTicketStatus.RESOLVED);
    expect(repository.auditEvents.map((event) => event.event)).toEqual(
      expect.arrayContaining(['support.ticket.created', 'support.ticket.commented', 'support.ticket.status_changed'])
    );
    await expect(service.getTicket('outsider', ticket.id)).rejects.toMatchObject({ status: 403 });
    await expect(service.getTicket('admin', ticket.id)).resolves.toMatchObject({ id: ticket.id });
  });
});
