export interface Student {
    id: string;
    nome?: string;
    name?: string; // Fallback for old mock data
    email: string;
    whatsapp?: string;
    phone?: string; // Fallback for old mock data
    createdAt: any; // Firestore Timestamp
    paid?: boolean;
    amount?: number;
    instagram?: string;
    objetivo?: string;
    status?: string;
}
