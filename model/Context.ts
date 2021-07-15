import { createContext } from "react";
import ModuleListing from "./ModuleListing";
import User from "./User";

interface IContext {
    user: User | null
    moduleListings: ModuleListing[]
}

export const Context = createContext<IContext>({ 
    user: null,
    moduleListings: []
})

export default Context