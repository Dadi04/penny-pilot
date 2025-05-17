import { useState, type FC } from "react";
import { Link, NavLink } from "react-router-dom";

import TransactionDialog from "./dialogs/TransactionDialog";

import mascotTransparent from "../assets/mascot/mascot-transparent.png"

const NavBar: FC = () => {
    const [newTransaction, setNewTransaction] = useState<boolean>(false)

    const getLinkClasses = (isActive: boolean) => 
        isActive 
            ? "text-black font-bold transition-all cursor-pointer hover:text-deep-charcoal"
            : "transition-all cursor-pointer hover:text-deep-charcoal";

    return (
        <>
            <div className="flex justify-between items-center bg-soft-brown text-deep-charcoal/70 text-xl font-semibold pr-4">
                <div className="w-[50%] flex justify-between items-center">
                    <Link to={"/"}>
                        <img src={mascotTransparent} alt="mascotTransparent" className="h-27" />
                    </Link>
                    <NavLink to={"/"} className={({isActive}) => getLinkClasses(isActive)}>Dashboard</NavLink>
                    <NavLink to={"/accounts"} className={({isActive}) => getLinkClasses(isActive)}>Accounts</NavLink>
                    <NavLink to={"/categories"} className={({isActive}) => getLinkClasses(isActive)}>Categories</NavLink>
                    <NavLink to={"/analytics"} className={({isActive}) => getLinkClasses(isActive)}>Analytics</NavLink>
                    <NavLink to={"/investments"} className={({isActive}) => getLinkClasses(isActive)}>Investments</NavLink>
                    <NavLink to={"/imports"} className={({isActive}) => getLinkClasses(isActive)}>Imports</NavLink>
                </div>
                <div>
                    <button onClick={() => setNewTransaction(prev => !prev)} className="bg-soft-brown border-deep-charcoal text-sm border rounded-3xl 
                        px-3 py-2 transition-all cursor-pointer hover:bg-penny-copper/70">
                            + Transaction
                    </button>
                </div>
            </div>
            {newTransaction && (
                <TransactionDialog setNewTransaction={setNewTransaction} />
            )}
        </>
    )
}

export default NavBar;
