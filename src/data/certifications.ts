export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  verifyUrl: string;
  fileUrl: string;      // URL to the uploaded image or PDF
  fileType: "image" | "pdf"; // Whether the uploaded file is an image or PDF
  gradient: string;     // Tailwind gradient classes for the accent bar
  sortOrder: number;
}

/** Fallback data used when Supabase returns no certifications */
export const fallbackCertifications: Certification[] = [];
