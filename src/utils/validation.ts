import { z } from 'zod';

export const formSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  email: z.string().email('Please enter a valid email address'),
  selectedCompetitor: z
    .enum(['google', 'walmart', 'hubspot', 'nasdaq', 'loreal', 'mastercard'])
    .nullable(),
});

export type FormSchema = z.infer<typeof formSchema>;
