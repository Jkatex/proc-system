import { AccountType, AuditSeverity, SupportTicketStatus, type Prisma } from '@prisma/client';
import { ModuleService as IdentityService } from '../identity/service.js';
import { auditPayload, type RequestAuditContext } from '../shared/audit.js';
import { ModuleRepository, toCommentDto, toTicketDto } from './repository.js';
import {
  moduleDefinition,
  type AddSupportTicketCommentInput,
  type CreateSupportTicketInput,
  type ModuleStatus,
  type SupportTicketListDto
} from './types.js';

function requestError(message: string, status = 400) {
  const error = new Error(message) as Error & { status?: number };
  error.status = status;
  return error;
}

export class ModuleService {
  constructor(
    private readonly repository = new ModuleRepository(),
    private readonly identity = new IdentityService()
  ) {}

  async status(): Promise<ModuleStatus> {
    await this.repository.health();
    return {
      ...moduleDefinition,
      status: 'ready'
    };
  }

  async recordAccessDenied(audit?: RequestAuditContext) {
    await this.repository.createAuditEvent({
      event: 'support.access_denied',
      entityType: 'support_ticket',
      severity: AuditSeverity.WARNING,
      payload: auditPayload(audit)
    });
  }

  async listTickets(token: string | undefined, query: { status?: SupportTicketStatus; ownerOrgId?: string }): Promise<SupportTicketListDto> {
    const { user } = await this.identity.requireSession(token);
    const where: Prisma.SupportTicketWhereInput = {
      ...(query.status ? { status: query.status } : {})
    };

    if (user.accountType === AccountType.ADMIN) {
      if (query.ownerOrgId) where.ownerOrgId = query.ownerOrgId;
    } else {
      where.OR = [{ ownerUserId: user.id }, ...(user.organizationId ? [{ ownerOrgId: user.organizationId }] : [])];
    }

    const tickets = await this.repository.listTickets(where);
    return { tickets: tickets.map(toTicketDto) };
  }

  async getTicket(token: string | undefined, ticketId: string) {
    const { user } = await this.identity.requireSession(token);
    const ticket = await this.repository.findTicket(ticketId);
    if (!ticket) throw requestError('Support ticket was not found.', 404);
    if (!canAccessTicket(user, ticket)) throw requestError('Support ticket access is not allowed.', 403);
    return toTicketDto(ticket);
  }

  async createTicket(token: string | undefined, input: CreateSupportTicketInput, audit?: RequestAuditContext) {
    const { user } = await this.identity.requireSession(token);
    const ticket = await this.repository.createTicket({
      ...input,
      ownerUserId: user.id,
      ownerOrgId: user.organizationId
    });

    await this.repository.createAuditEvent({
      actorUserId: user.id,
      ownerOrgId: user.organizationId,
      event: 'support.ticket.created',
      entityType: 'support_ticket',
      entityRef: ticket.id,
      payload: auditPayload({ ...audit, details: { category: ticket.category, priority: ticket.priority } })
    });

    return toTicketDto(ticket);
  }

  async addComment(token: string | undefined, ticketId: string, input: AddSupportTicketCommentInput, audit?: RequestAuditContext) {
    const { user } = await this.identity.requireSession(token);
    const ticket = await this.repository.findTicket(ticketId);
    if (!ticket) throw requestError('Support ticket was not found.', 404);
    if (!canAccessTicket(user, ticket)) throw requestError('Support ticket access is not allowed.', 403);

    const comment = await this.repository.addComment(ticket.id, {
      ...input,
      actorUserId: user.id
    });
    await this.repository.touchTicket(ticket.id);

    await this.repository.createAuditEvent({
      actorUserId: user.id,
      ownerOrgId: ticket.ownerOrgId,
      event: 'support.ticket.commented',
      entityType: 'support_ticket',
      entityRef: ticket.id,
      payload: auditPayload({ ...audit, details: { commentId: comment.id, visibility: comment.visibility } })
    });

    return toCommentDto(comment);
  }

  async updateStatus(token: string | undefined, ticketId: string, status: SupportTicketStatus, audit?: RequestAuditContext) {
    const { user } = await this.identity.requireSession(token);
    const ticket = await this.repository.findTicket(ticketId);
    if (!ticket) throw requestError('Support ticket was not found.', 404);
    if (!canAccessTicket(user, ticket)) throw requestError('Support ticket access is not allowed.', 403);

    const updated = await this.repository.touchTicket(ticket.id, status);
    await this.repository.createAuditEvent({
      actorUserId: user.id,
      ownerOrgId: ticket.ownerOrgId,
      event: 'support.ticket.status_changed',
      entityType: 'support_ticket',
      entityRef: ticket.id,
      payload: auditPayload({
        ...audit,
        details: {
          previousStatus: ticket.status,
          status
        }
      })
    });

    return toTicketDto(updated);
  }
}

function canAccessTicket(
  user: { id: string; accountType: AccountType; organizationId?: string },
  ticket: { ownerUserId: string; ownerOrgId: string | null }
) {
  if (user.accountType === AccountType.ADMIN) return true;
  return ticket.ownerUserId === user.id || Boolean(user.organizationId && ticket.ownerOrgId === user.organizationId);
}
