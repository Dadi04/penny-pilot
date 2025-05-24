
export interface Category {
    id: number;
    emoji: string;
    name: string;
    subcategory?: Category[];
    description?: string;
}