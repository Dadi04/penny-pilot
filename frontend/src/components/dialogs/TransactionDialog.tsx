import { useState, useRef, useEffect, type Dispatch, type FC, type SetStateAction } from "react";
import AddAccountDialog from "./AddAccountDialog";

interface Transaction {
    accountId: number;
    categoryId: number;
    amount: number;
    currency: string;
    name: string;
    date: any;
    time: any;
    type: string;
    description?: string;
    tags?: string[];
    location?: string;
}

interface Account {
    id: number;
    name: string;
    type: string;
    balance: number;
    currency: string;
    color: string;
    description?: string;
}

interface Category {
    id: number;
    emoji: string;
    name: string;
    subcategory?: Category[];
    description?: string;
}

const PAYMENT_TYPES = ["Cash", "Credit Card", "Debit Card", "Transfer", "Voucher", "Mobile Payment"];

const CATEGORIES: Category[] = [
    {
        id: 1,
        emoji: "🍔", 
        name: "Food & Dining", 
        description: "Restaurants, cafes, groceries",
        subcategory: [
            { id: 11, emoji: "🍽️", name: "Restaurants", description: "Sit-down restaurants" },
            { id: 12, emoji: "🍟", name: "Fast Food", description: "Quick service restaurants" },
            { id: 13, emoji: "🛒", name: "Groceries", description: "Food shopping" },
            { id: 14, emoji: "☕", name: "Coffee & Tea", description: "Cafes and coffee shops" }
        ]
    },
    { 
        id: 2, 
        emoji: "🏠", 
        name: "Housing", 
        description: "Rent, utilities, maintenance",
        subcategory: [
            { id: 21, emoji: "🏢", name: "Rent", description: "Monthly rent" },
            { id: 22, emoji: "💡", name: "Utilities", description: "Electricity, water, gas" },
            { id: 23, emoji: "🔧", name: "Maintenance", description: "Repairs and upkeep" }
        ]
    },
    { 
        id: 3, 
        emoji: "🚗", 
        name: "Transportation", 
        description: "Gas, public transit, car maintenance",
        subcategory: [
            { id: 31, emoji: "⛽", name: "Gas", description: "Fuel for vehicles" },
            { id: 32, emoji: "🚇", name: "Public Transit", description: "Bus, train, subway" },
            { id: 33, emoji: "🔧", name: "Car Maintenance", description: "Repairs, servicing" },
            { id: 34, emoji: "🅿️", name: "Parking", description: "Parking fees" }
        ]
    }
];

const ACCOUNTS: Account[] = [
    { id: 1, name: "Checking", type: "Bank", balance: 1200, currency: "RSD", color: "#FF5733", description: "Monthly checking" },
    { id: 2, name: "Savings", type: "Bank", balance: 5000, currency: "RSD", color: "#33C3FF", description: "Rainy-day savings" },
    { id: 3, name: "Cash", type: "Wallet", balance: 200, currency: "RSD", color: "#75FF33", description: "Pocket cash" }
];

const CURRENCIES: string[] = ["RSD", "USD", "EUR", "GBP", "CHF", "CAD", "AUD"];

const TransactionDialog: FC<{setNewTransaction: Dispatch<SetStateAction<boolean>>;}> = ({setNewTransaction}) => {
    const [accountDialog, openAccountDialog] = useState<boolean>(false);
    const [fromAccount, setFromAccount] = useState<Account | null>(null);
    const [toAccount, setToAccount] = useState<Account | null>(null);
    const [accountDropdown, setAccountDropdown] = useState<boolean>(false);
    const [fromAccountDropdown, setFromAccountDropdown] = useState<boolean>(false);
    const [toAccountDropdown, setToAccountDropdown] = useState<boolean>(false);
    const [paymentTypeDropdown, setPaymentTypeDropdown] = useState<boolean>(false);
    const [categoryDropdown, setCategoryDropdown] = useState<boolean>(false);
    const [currencyDropdown, setCurrencyDropdown] = useState<boolean>(false);
    const [fromCurrencyDropdown, setFromCurrencyDropdown] = useState<boolean>(false);
    const [toCurrencyDropdown, setToCurrencyDropdown] = useState<boolean>(false);

    const [transactionMode, setTransactionMode] = useState<string>("Expense");
    const [account, setAccount] = useState<Account | null>(null);
    const [amount, setAmount] = useState<number>();
    const [currency, setCurrency] = useState<string>("RSD");
    const [category, setCategory] = useState<Category | null>(null);
    // const [tags, setTags] = useState<string>("");
    const [date, setDate] = useState<any>();
    const [time, setTime] = useState<any>();
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [paymentType, setPaymentType] = useState<string>("");
    const [location, setLocation] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<{[key: string]: string}>({});

    const accountDropdownRef = useRef<HTMLDivElement>(null);
    const fromAccountDropdownRef = useRef<HTMLDivElement>(null);
    const toAccountDropdownRef = useRef<HTMLDivElement>(null);
    const paymentTypeDropdownRef = useRef<HTMLDivElement>(null);
    const categoryDropdownRef = useRef<HTMLDivElement>(null);
    const currencyDropdownRef = useRef<HTMLDivElement>(null);
    const fromCurrencyDropdownRef = useRef<HTMLDivElement>(null);
    const toCurrencyDropdownRef = useRef<HTMLDivElement>(null);

    const closeAllDropdowns = () => {
        setAccountDropdown(false);
        setFromAccountDropdown(false);
        setToAccountDropdown(false);
        setPaymentTypeDropdown(false);
        setCategoryDropdown(false);
        setCurrencyDropdown(false);
        setFromCurrencyDropdown(false);
        setToCurrencyDropdown(false);
    };

    const toggleDropdown = (dropdownState: boolean, setDropdownState: Dispatch<SetStateAction<boolean>>) => {
        closeAllDropdowns();
        if (!dropdownState) {
            setDropdownState(true);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: {[key: string]: string} = {};

        if (transactionMode === "Transfer") {
            if (!fromAccount) newErrors.fromAccount = "From account is required";
            if (!toAccount) newErrors.toAccount = "To account is required";
            if (!amount || amount <= 0) newErrors.amount = "Amount must be greater than 0";
        } else {
            if (!account) newErrors.account = "Account is required";
            if (!amount || amount <= 0) newErrors.amount = "Amount must be greater than 0";
            if (!category) newErrors.category = "Category is required";
        }

        if (!currency) newErrors.currency = "Currency is required";
        if (!date) newErrors.date = "Date is required";
        if (!time) newErrors.time = "Time is required";
        if (!name.trim()) newErrors.name = "Payment name is required";
        if (!paymentType) newErrors.paymentType = "Payment type is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateNewTransaction = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            let newTransaction: Transaction = {
                accountId: account!.id,
                categoryId: category!.id,
                amount: amount!,
                currency: currency,
                date: date,
                time: time,
                name: name,
                description: description ?? "",
                type: paymentType,
                location: location  ?? "",
            }

            const response = await fetch("/api/create-transaction", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newTransaction),
            });

            const data = await response.json();
            if (data.success) {
                setNewTransaction(false);

            } else {
                console.error(data);
            }
        } catch (error) {
            console.error(`Error while fetching /api/create-transaction: ${error}`)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                accountDropdownRef.current && 
                !accountDropdownRef.current.contains(event.target as Node) &&
                fromAccountDropdownRef.current && 
                !fromAccountDropdownRef.current.contains(event.target as Node) &&
                toAccountDropdownRef.current && 
                !toAccountDropdownRef.current.contains(event.target as Node) &&
                paymentTypeDropdownRef.current && 
                !paymentTypeDropdownRef.current.contains(event.target as Node) &&
                categoryDropdownRef.current && 
                !categoryDropdownRef.current.contains(event.target as Node) &&
                currencyDropdownRef.current && 
                !currencyDropdownRef.current.contains(event.target as Node) &&
                fromCurrencyDropdownRef.current && 
                !fromCurrencyDropdownRef.current.contains(event.target as Node) &&
                toCurrencyDropdownRef.current && 
                !toCurrencyDropdownRef.current.contains(event.target as Node)
            ) {
                closeAllDropdowns();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/90 text-deep-charcoal z-150">
            {loading ? (
                <div className="w-[1200px] h-[600px] relative bg-white pt-6 rounded-lg shadow-lg flex items-center justify-center">
                    <div className="spinner" />
                </div>
            ) : (
                <div className="w-[1200px] relative bg-white pt-6 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center">
                        <h1 className="uppercase mb-4 ml-6 text-2xl">Add a Transaction</h1>
                        <div onClick={() => setNewTransaction(prev => !prev)} className="absolute top-4 right-4 cursor-pointer rounded p-1 transition duration-200 ease-in-out hover:bg-cherry-pink">
                            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd">
                                <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /> 
                                <line x1="20" y1="4" x2="4" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                    </div>
                    <form onSubmit={handleCreateNewTransaction}>
                        <div className="flex">
                            <div className="w-[70%] flex flex-col gap-3">
                                <div className="bg-cherry-pink text-white py-6">
                                    <div className="w-[40%] flex justify-center mx-auto text-xl mb-4">
                                        <h1 onClick={() => {setAccountDropdown(false); setFromAccountDropdown(false); setToAccountDropdown(false); setAccount(null); setTransactionMode("Expense"); setErrors({})}} className={`cursor-pointer border rounded-l-lg px-6 py-1 ${transactionMode === "Expense" ? "bg-white border-white text-deep-charcoal" : "hover:bg-bright-cherry-pink"}`}>Expense</h1>
                                        <h1 onClick={() => {setAccountDropdown(false); setFromAccountDropdown(false); setToAccountDropdown(false); setAccount(null); setTransactionMode("Income"); setErrors({})}} className={`cursor-pointer border px-6 py-1 ${transactionMode === "Income" ? "bg-white border-white text-deep-charcoal" : "hover:bg-bright-cherry-pink"}`}>Income</h1>
                                        <h1 onClick={() => {setAccountDropdown(false); setFromAccountDropdown(false); setToAccountDropdown(false); setFromAccount(null); setToAccount(null); setTransactionMode("Transfer"); setErrors({})}} className={`cursor-pointer border rounded-r-lg px-6 py-1 ${transactionMode === "Transfer" ? "bg-white border-white text-deep-charcoal" : "hover:bg-bright-cherry-pink"}`}>Transfer</h1>
                                    </div>
                                    <div className="w-[70%] mx-auto">
                                        {(transactionMode === "Income" || transactionMode === "Expense") ? (
                                            <>
                                                <div>
                                                    <p>Account <span className="text-red-500">*</span></p>
                                                    <div className="relative" ref={accountDropdownRef}>
                                                        <div onClick={() => toggleDropdown(accountDropdown, setAccountDropdown)} className={`flex items-center justify-between bg-white p-2 border rounded cursor-pointer ${errors.account ? 'border-red-500' : ''}`}>
                                                            {account ? (
                                                                <div className="flex items-center gap-4 text-deep-charcoal">
                                                                    <p style={{backgroundColor: account.color}}>{account.type}</p>
                                                                    <p>{account.name}</p>
                                                                </div>
                                                            ) : (
                                                                <span className="text-deep-charcoal">Choose account</span>
                                                            )}
                                                            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                                                                <polygon points="2,6 12,18 22,6" />
                                                            </svg>
                                                        </div>
                                                        {accountDropdown && (
                                                            <div className="absolute mt-1 w-full bg-neutral-50 rounded shadow-lg z-10">
                                                                {ACCOUNTS.map(account => (
                                                                    <div onClick={() => {setAccount(account); setAccountDropdown(false)}} className="flex items-center bg-neutral-50 text-deep-charcoal text-lg p-2 gap-4 cursor-pointer hover:bg-neutral-100">
                                                                        <p style={{backgroundColor: account.color}}>{account.type}</p>
                                                                        <p>{account.name}</p>
                                                                    </div>
                                                                ))}
                                                                <div onClick={() => {openAccountDialog(true)}} className="flex items-center bg-neutral-50 text-deep-charcoal text-lg p-2 gap-4 cursor-pointer hover:bg-neutral-100">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                                        <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /> 
                                                                        <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                                    </svg>
                                                                    <p>Add Account</p>
                                                                </div>
                                                                {accountDialog && (
                                                                    <AddAccountDialog openAccountDialog={openAccountDialog} />
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {errors.account && <p className="text-red-500 text-sm mt-1">{errors.account}</p>}
                                                </div>
                                                <div className="flex justify-between gap-2">
                                                    <div className="flex-2/3">
                                                        <p>Amount <span className="text-red-500">*</span></p>
                                                        <div className={`flex justify-between items-center bg-white text-deep-charcoal p-2 ${errors.amount ? 'border border-red-500' : ''}`}>
                                                            {transactionMode === "Income" && (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                                    <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /> 
                                                                    <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                                </svg>
                                                            )}
                                                            {transactionMode === "Expense" && (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                                    <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                                </svg>
                                                            )}
                                                            <input type="number" onChange={(e) => setAmount(parseFloat(e.target.value))} placeholder="0" className="w-full text-right outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                                        </div>
                                                        {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                                                    </div>
                                                    <div className="flex-1/3">
                                                        <p>Currency <span className="text-red-500">*</span></p>
                                                        <div className="relative" ref={currencyDropdownRef}>
                                                            <div onClick={() => toggleDropdown(currencyDropdown, setCurrencyDropdown)} className={`flex justify-between items-center bg-white text-deep-charcoal p-2 border border-gray-100 cursor-pointer ${errors.currency ? 'border-red-500' : ''}`}>
                                                                <p>{currency}</p>
                                                            </div>
                                                            {currencyDropdown && (
                                                                <div className="absolute mt-1 w-full bg-neutral-50 rounded shadow-lg z-10 max-h-40 overflow-y-auto">
                                                                    {CURRENCIES.map(currency => (
                                                                        <div 
                                                                            key={currency}
                                                                            onClick={() => {setCurrency(currency); setCurrencyDropdown(false)}} 
                                                                            className="bg-neutral-50 text-deep-charcoal text-lg p-2 cursor-pointer hover:bg-neutral-100"
                                                                        >
                                                                            <p>{currency}</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {errors.currency && <p className="text-red-500 text-sm mt-1">{errors.currency}</p>}
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex justify-between items-center">
                                                    <div className="w-[45%]">
                                                        <p>From account <span className="text-red-500">*</span></p>
                                                        <div className="relative" ref={fromAccountDropdownRef}>
                                                            <div onClick={() => toggleDropdown(fromAccountDropdown, setFromAccountDropdown)} className={`flex items-center justify-between bg-white p-2 border rounded cursor-pointer ${errors.fromAccount ? 'border-red-500' : ''}`}>
                                                                {fromAccount ? (
                                                                    <div className="flex items-center gap-4 text-deep-charcoal">
                                                                        <p style={{backgroundColor: fromAccount.color}}>{fromAccount.type}</p>
                                                                        <p>{fromAccount.name}</p>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-deep-charcoal">Choose account</span>
                                                                )}
                                                                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                                                                    <polygon points="2,6 12,18 22,6" />
                                                                </svg>
                                                            </div>
                                                            {fromAccountDropdown && (
                                                                <div className="absolute mt-1 w-full bg-neutral-50 rounded shadow-lg z-10">
                                                                    {ACCOUNTS.map(account => (
                                                                        <div onClick={() => {setFromAccount(account); setFromAccountDropdown(false)}} className="flex items-center bg-neutral-50 text-deep-charcoal text-lg p-2 gap-4 cursor-pointer hover:bg-neutral-100">
                                                                            <p style={{backgroundColor: account.color}}>{account.type}</p>
                                                                            <p>{account.name}</p>
                                                                        </div>
                                                                    ))}
                                                                    <div onClick={() => {openAccountDialog(true)}} className="flex items-center bg-neutral-50 text-deep-charcoal text-lg p-2 gap-4 cursor-pointer hover:bg-neutral-100">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                                            <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /> 
                                                                            <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                                        </svg>
                                                                        <p>Add Account</p>
                                                                    </div>
                                                                    {accountDialog && (
                                                                        <AddAccountDialog openAccountDialog={openAccountDialog} />
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {errors.fromAccount && <p className="text-red-500 text-sm mt-1">{errors.fromAccount}</p>}
                                                        <div className="flex justify-between gap-2">
                                                            <div className="w-2/3">
                                                                <p>Amount <span className="text-red-500">*</span></p>
                                                                <div className="flex justify-between items-center bg-white text-deep-charcoal p-2">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                                        <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                                    </svg>
                                                                    <input type="number" placeholder="0" className="w-full text-right outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                                                </div>
                                                            </div>
                                                            <div className="w-1/3">
                                                                <p>Currency <span className="text-red-500">*</span></p>
                                                                <div className="relative" ref={fromCurrencyDropdownRef}>
                                                                    <div onClick={() => toggleDropdown(fromCurrencyDropdown, setFromCurrencyDropdown)} className={`flex justify-between items-center bg-white text-deep-charcoal p-2 border border-gray-100 cursor-pointer ${errors.currency ? 'border-red-500' : ''}`}>
                                                                        <p>{currency}</p>
                                                                        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                                                                            <polygon points="2,6 12,18 22,6" />
                                                                        </svg>
                                                                    </div>
                                                                    {fromCurrencyDropdown && (
                                                                        <div className="absolute mt-1 w-full bg-neutral-50 rounded shadow-lg z-10 max-h-40 overflow-y-auto">
                                                                            {CURRENCIES.map(currency => (
                                                                                <div 
                                                                                    key={currency}
                                                                                    onClick={() => {setCurrency(currency); setFromCurrencyDropdown(false)}} 
                                                                                    className="bg-neutral-50 text-deep-charcoal text-lg p-2 cursor-pointer hover:bg-neutral-100"
                                                                                >
                                                                                    <p>{currency}</p>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                                                        <line x1="4" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                        <polyline points="12,6 18,12 12,18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <div className="w-[45%]">
                                                        <p>To account <span className="text-red-500">*</span></p>
                                                        <div className="relative" ref={toAccountDropdownRef}>
                                                            <div onClick={() => toggleDropdown(toAccountDropdown, setToAccountDropdown)} className={`flex items-center justify-between bg-white p-2 border rounded cursor-pointer ${errors.toAccount ? 'border-red-500' : ''}`}>
                                                                {toAccount ? (
                                                                    <div className="flex items-center gap-4 text-deep-charcoal">
                                                                        <p style={{backgroundColor: toAccount.color}}>{toAccount.type}</p>
                                                                        <p>{toAccount.name}</p>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-deep-charcoal">Choose account</span>
                                                                )}
                                                                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                                                                    <polygon points="2,6 12,18 22,6" />
                                                                </svg>
                                                            </div>
                                                            {toAccountDropdown && (
                                                                <div className="absolute mt-1 w-full bg-neutral-50 rounded shadow-lg z-10">
                                                                    {ACCOUNTS.map(account => (
                                                                        <div onClick={() => {setToAccount(account); setToAccountDropdown(false)}} className="flex items-center bg-neutral-50 text-deep-charcoal text-lg p-2 gap-4 cursor-pointer hover:bg-neutral-100">
                                                                            <p style={{backgroundColor: account.color}}>{account.type}</p>
                                                                            <p>{account.name}</p>
                                                                        </div>
                                                                    ))}
                                                                    <div onClick={() => {openAccountDialog(true)}} className="flex items-center bg-neutral-50 text-deep-charcoal text-lg p-2 gap-4 cursor-pointer hover:bg-neutral-100">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                                            <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /> 
                                                                            <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                                        </svg>
                                                                        <p>Add Account</p>
                                                                    </div>
                                                                    {accountDialog && (
                                                                        <AddAccountDialog openAccountDialog={openAccountDialog} />
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {errors.toAccount && <p className="text-red-500 text-sm mt-1">{errors.toAccount}</p>}
                                                        <div className="flex justify-between gap-2">
                                                            <div className="w-2/3">
                                                                <p>Amount <span className="text-red-500">*</span></p>
                                                                <div className="flex justify-between items-center bg-white text-deep-charcoal p-2">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                                        <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /> 
                                                                        <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                                    </svg>
                                                                    <input type="number" placeholder="0" className="w-full text-right outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                                                </div>
                                                            </div>
                                                            <div className="w-1/3">
                                                                <p>Currency <span className="text-red-500">*</span></p>
                                                                <div className="relative" ref={toCurrencyDropdownRef}>
                                                                    <div onClick={() => toggleDropdown(toCurrencyDropdown, setToCurrencyDropdown)} className={`flex justify-between items-center bg-white text-deep-charcoal p-2 border border-gray-100 cursor-pointer ${errors.currency ? 'border-red-500' : ''}`}>
                                                                        <p>{currency}</p>
                                                                        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                                                                            <polygon points="2,6 12,18 22,6" />
                                                                        </svg>
                                                                    </div>
                                                                    {toCurrencyDropdown && (
                                                                        <div className="absolute mt-1 w-full bg-neutral-50 rounded shadow-lg z-10 max-h-40 overflow-y-auto">
                                                                            {CURRENCIES.map(currency => (
                                                                                <div 
                                                                                    key={currency}
                                                                                    onClick={() => {setCurrency(currency); setToCurrencyDropdown(false)}} 
                                                                                    className="bg-neutral-50 text-deep-charcoal text-lg p-2 cursor-pointer hover:bg-neutral-100"
                                                                                >
                                                                                    <p>{currency}</p>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 px-6 py-2 gap-4">
                                    <div>
                                        <p>Category {transactionMode !== "Transfer" && <span className="text-red-500">*</span>}</p>
                                        <div className="relative" ref={categoryDropdownRef}>
                                            <div onClick={() => toggleDropdown(categoryDropdown, setCategoryDropdown)} className={`flex items-center justify-between p-2 border border-gray-100 cursor-pointer ${errors.category ? 'border-red-500' : ''}`}>
                                                {category ? (
                                                    <div className="flex items-center gap-2 text-deep-charcoal">
                                                        <span>{category.emoji}</span>
                                                        <span>{category.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-deep-charcoal">Choose category</span>
                                                )}
                                            </div>
                                            {categoryDropdown && (
                                                <div className="absolute mt-1 w-full bg-neutral-50 rounded shadow-lg z-10 max-h-60 overflow-y-auto">
                                                    {CATEGORIES.map(category => (
                                                        <div>
                                                            <div 
                                                                onClick={() => {setCategory(category); setCategoryDropdown(false)}} 
                                                                className="flex items-center bg-neutral-50 text-deep-charcoal text-lg p-2 gap-2 cursor-pointer hover:bg-neutral-100"
                                                            >
                                                                <span>{category.emoji}</span>
                                                                <span>{category.name}</span>
                                                            </div>
                                                            {category.subcategory && category.subcategory.map(sub => (
                                                                <div 
                                                                    onClick={() => {setCategory(sub); setCategoryDropdown(false)}} 
                                                                    className="flex items-center bg-neutral-50 text-deep-charcoal text-lg p-2 pl-8 gap-2 cursor-pointer hover:bg-neutral-100"
                                                                >
                                                                    <span>{sub.emoji}</span>
                                                                    <span>{sub.name}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                                    </div>
                                    <div>
                                        <p>Tags</p>
                                        <input type="text" placeholder="Choose" className="w-full p-2 border border-gray-100 outline-none" />
                                    </div>
                                    <div>
                                        <p>Date <span className="text-red-500">*</span></p>
                                        <input type="date" onChange={(e) => setDate(e.target.value)} className={`w-full p-2 border border-gray-100 outline-none ${errors.date ? 'border-red-500' : ''}`} />
                                        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                                    </div>
                                    <div>
                                        <p>Time <span className="text-red-500">*</span></p>
                                        <input type="time" onChange={(e) => setTime(e.target.value)} className={`w-full p-2 border border-gray-100 outline-none ${errors.time ? 'border-red-500' : ''}`} />
                                        {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                                    </div>
                                </div>
                                <div className="w-[60%] flex flex-col justify-center mx-auto gap-4 py-4">
                                    <button type="submit" className="bg-cherry-pink p-2 rounded-2xl cursor-pointer">Add transaction</button>
                                    <p className="text-blue-500 text-center underline cursor-pointer">Add and create another</p>
                                </div>
                            </div>
                                        <div className="w-[30%] flex flex-col bg-neutral-200 p-6 gap-7 rounded-br-lg">
                <div>
                    <p>Payment name <span className="text-red-500">*</span></p>
                    <input type="text" onChange={(e) => setName(e.target.value)} className={`w-full p-2 border border-gray-100 bg-white outline-none ${errors.name ? 'border-red-500' : ''}`} />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                    <p>Description</p>
                    <textarea onChange={(e) => setDescription(e.target.value)} cols={40} rows={5} className="w-full p-2 border border-gray-100 bg-white outline-none max-h-40 overflow-y-auto resize-none"></textarea>
                </div>
                <div>
                    <p>Payment type <span className="text-red-500">*</span></p>
                    <div className="relative" ref={paymentTypeDropdownRef}>
                        <div onClick={() => toggleDropdown(paymentTypeDropdown, setPaymentTypeDropdown)} className={`flex items-center justify-between bg-white p-2 border border-gray-100 cursor-pointer ${errors.paymentType ? 'border-red-500' : ''}`}>
                                            {paymentType ? (
                                                <span className="text-deep-charcoal">{paymentType}</span>
                                            ) : (
                                                <span className="text-deep-charcoal">Choose payment type</span>
                                            )}
                                        </div>
                                        {paymentTypeDropdown && (
                                            <div className="absolute mt-1 w-full bg-neutral-50 rounded shadow-lg z-50 max-h-45 overflow-y-auto">
                                                {PAYMENT_TYPES.map(type => (
                                                    <div 
                                                        key={type}
                                                        onClick={() => {setPaymentType(type); setPaymentTypeDropdown(false)}} 
                                                        className="flex items-center bg-neutral-50 text-deep-charcoal text-lg p-2 cursor-pointer hover:bg-neutral-100"
                                                    >
                                                        <p>{type}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {errors.paymentType && <p className="text-red-500 text-sm mt-1">{errors.paymentType}</p>}
                                </div>
                                <div>
                                    <p>Location</p>
                                    <input type="text" onChange={(e) => setLocation(e.target.value)} placeholder="Name or address" className="w-full p-2 border border-gray-100 bg-white outline-none" />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

export default TransactionDialog;
