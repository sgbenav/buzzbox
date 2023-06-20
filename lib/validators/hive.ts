import { z } from 'zod'

export const HiveValidator = z.object({
  name: z.string().min(3).max(21),
})

export const HiveSubscriptionValidator = z.object({
  hiveId: z.string(),
})

export type CreateHivePayload = z.infer<typeof HiveValidator>
export type SubscribeToHivePayload = z.infer<
  typeof HiveSubscriptionValidator
>