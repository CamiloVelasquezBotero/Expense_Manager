import { useMemo } from "react"
import { categories } from "../data/categories"
import { formatDate } from "../helpers"
import type { Expense } from "../types"
import AmountDisplay from "./AmountDisplay"
import SwipeableItem from "./SwipeableItem"
import { useBudget } from "../hooks/useBudget"

type ExpenseDeatailProps = {
    expense: Expense
}

export default function ExpenseDeatail({ expense }: ExpenseDeatailProps) {
    const { dispatch } = useBudget()

    const categoryInfo = useMemo(() => categories.filter(category => category.id === expense.category)[0], [expense])

    return (
        <SwipeableItem
            leadingActionContent="Actualizar"
            trailingActionContent="Eliminar"
            onLeadingSwipeFunction={() => dispatch({type: 'get-expense-by-id', payload: {id: expense.id}})}
            onTrailingSwipeFunction={() => dispatch({type: 'remove-expense', payload: {id: expense.id}})}
        >
            {/* Cover the div that we want to animate, especify the "div" */}
            <div className="bg-white shadow-lg px-5 w-full border-b border-gray-200 flex gap-5 items-center">
                <div>
                    <img
                        src={`/icono_${categoryInfo.icon}.svg`}
                        alt="Icono Gasto"
                        className="w-20"
                    />
                </div>
                <div className="flex-1 space-y-2">
                    <p className="text-sm font-bold uppercase text-slate-500">{categoryInfo.name}</p>
                    <p>{expense.expenseName}</p>
                    <p className="text-slate-600 text-sm">{formatDate(expense.date!.toString())}</p>
                </div>
                <AmountDisplay
                    amount={expense.amount}
                />
            </div>
        </SwipeableItem>
    )
}
