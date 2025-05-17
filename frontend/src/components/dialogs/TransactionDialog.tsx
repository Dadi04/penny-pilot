import type { Dispatch, FC, SetStateAction } from "react";

const TransactionDialog: FC<{setNewTransaction: Dispatch<SetStateAction<boolean>>;}> = ({setNewTransaction}) => {
    
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/90 text-deep-charcoal z-150">
            <div className="w-[800px] relative bg-white py-6 px-5 rounded-lg shadow-lg">
                <div className="flex justify-between items-center text-xl">
                    <h1>Add a Transaction</h1>
                    <div onClick={() => setNewTransaction(prev => !prev)} className="absolute top-4 right-4 cursor-pointer rounded p-2 transition duration-200 ease-in-out hover:bg-soft-brown">
                        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd">
                            <path d="M12 11.293l10.293-10.293.707.707-10.293 10.293 10.293 10.293-.707.707-10.293-10.293-10.293 10.293-.707-.707 10.293-10.293-10.293-10.293.707-.707 10.293 10.293z" />
                        </svg>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default TransactionDialog;
