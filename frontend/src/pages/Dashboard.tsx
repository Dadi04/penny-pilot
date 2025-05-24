import { useEffect, useState, type FC } from "react"

import type { Transaction } from "../interfaces/Transaction";
// import type { Account } from "../interfaces/Account";
// import type { Category } from "../interfaces/Category";

const Dashboard: FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/get-all-transactions")
        .then(res => {
            if (!res.ok) throw new Error(res.statusText);
            return res.json();
        })
        .then((data: Transaction[]) => {
            setTransactions(data);
        })
        .catch(err => {
            console.error("Failed to load transactions", err);
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);

    if (loading) return <div>Loading…</div>;

    return (
        <div>
            <div className="w-1/2">
                {transactions.map((transaction, i) => (
                    <div key={i} className="border-b py-2">
                        <div>
                            {transaction.categoryId}  {/* icon of the category */}
                        </div>
                        <div>
                            <p>{transaction.name} - {transaction.categoryId}</p> {/* name of the category */}
                            <p>{transaction.accountId} {transaction.accountId}</p> {/* color and name of account */}
                        </div>
                        <div>
                            <div className={`flex ${transaction.transactionType === "Expense" ? "text-red-500" : transaction.transactionType === "Income" ? "text-green-500" : "text-blue-500"}`}>
                                <p>{transaction.transactionType === "Expense" ? "-" : transaction.transactionType === "Income" ? "+" : ""}</p>
                                <p>{transaction.currency} {transaction.amount}</p>
                            </div>
                            <p>{transaction.date}</p>
                            <p>{transaction.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


export default Dashboard
