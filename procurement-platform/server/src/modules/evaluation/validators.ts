import { z } from 'zod';
import { EvaluationStatus, TenderType } from '@prisma/client';

const allFilterSchema = z.literal('all');

export const moduleStatusQuerySchema = z.object({}).strict();

export const recordsQuerySchema = z
  .object({
    search: z.string().trim().max(120).optional().default(''),
    status: z.union([allFilterSchema, z.nativeEnum(EvaluationStatus)]).optional().default('all'),
    type: z.union([allFilterSchema, z.nativeEnum(TenderType)]).optional().default('all')
  })
  .strict();
