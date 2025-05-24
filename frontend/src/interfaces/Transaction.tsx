
export interface Transaction {
    accountId: number;
    categoryId: number;
    amount: number;
    currency: string;
    name: string;
    date: any;
    time: any;
    transactionType: string;
    paymentType: string;
    description?: string;
    tags?: string[];
    location?: string;
}