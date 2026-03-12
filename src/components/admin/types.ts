export interface Meal {
    id: string;
    name: string;
    time: string;
    foods: string[];
}

export interface Diet {
    studentId: string;
    studentName: string;
    weight: number;
    calories: number;
    meals: Meal[];
    notes: string;
    published: boolean;
    createdAt?: any;
    updatedAt?: any;
}

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
    lesao?: string;
    weight?: string;
    status?: string;
    tamanho_camisa?: string;
    selectedPlan?: string;
    diet?: Diet;
}
