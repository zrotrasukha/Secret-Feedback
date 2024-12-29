import { z } from "zod";

export const accepMessageScheme = z.object({
  accepMessages: z.boolean(),
})
