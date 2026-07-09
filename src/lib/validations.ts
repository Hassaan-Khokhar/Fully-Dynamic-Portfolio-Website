import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";

export const sanitizeHtml = (html: string) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [], // Strip all HTML tags
    ALLOWED_ATTR: [],
  });
};

export const ContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(150),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(150),
  message: z.string().min(10, "Message must be at least 10 characters").max(3000),
});
