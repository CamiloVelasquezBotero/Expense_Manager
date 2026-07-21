import { useReducer, createContext, type ReactNode, useMemo } from "react"
import { budgetReducer, initialState } from "../reducers/reducer-budget"
import type { BudgetState, BudgetActions } from "../reducers/reducer-budget"

type BudgetContextProps = {
    state: BudgetState
    dispatch: React.ActionDispatch<[action: BudgetActions]>
    totalExpenses: number
    remainingBudget: number
}

type BudgetProviderProps = {
    children: ReactNode
}

export const BudgetContext = createContext<BudgetContextProps>(null!) /* Le colocamos "null!" para poder saltar el error y que ts confie */

/* Creamos el provider que sera solo la "sintaxys de nuestro context" como primer paso, este se crea como 
si fuera un componente por que siempre retorna */
export const BudgetProvider = ({ children }: BudgetProviderProps) => {

    /* Instanciamos nuestro reducer en el provider */
    const [state, dispatch] = useReducer(budgetReducer, initialState)

    const totalExpenses = useMemo(() => state.expenses.reduce((total, expense) => expense.amount + total, 0), [state.expenses])
    const remainingBudget = state.budget - totalExpenses

    return (
        <BudgetContext.Provider
            value={{
                state,
                dispatch,
                totalExpenses,
                remainingBudget
            }}
        >
            {children}
        </BudgetContext.Provider>
    )
}