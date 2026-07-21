import { v4 as uuidv4 } from 'uuid'
import type { Category, DraftExpense, Expense } from "../types"

export type BudgetActions = 
    { type: 'add-budget', payload: {budget: number} } | 
    { type: 'show-modal'} | 
    { type: 'close-modal' } | 
    { type: 'add-expense', payload: {expense: DraftExpense} } | 
    { type: 'remove-expense', payload: {id: Expense['id']}} |
    { type: 'get-expense-by-id', payload: {id: Expense['id']}} | 
    { type: 'update-expense', payload: {expense: Expense}} | 
    { type: 'reset-app'} | 
    { type: 'add-filter-category', payload: {id: Category['id']}}

export type BudgetState = {
    budget: number
    modal: boolean
    expenses: Expense[]
    editingId: Expense['id']
    currentCategory: Category['id']
}

/* We verify if in the localStorage we have alredy a Budget saved */
const initialBudget = () : number => {
    const localStorageBudget = localStorage.getItem('budget')
    return localStorageBudget ? Number(localStorageBudget) : 0
}
/* We verify if already we have the expenses saved in the localStorage */
const localStorageExpenses = () : Expense[] => {
    const localStorageExpenses = localStorage.getItem('expenses')
    return localStorageExpenses ? JSON.parse(localStorageExpenses) : []
}

export const initialState:BudgetState = {
    budget: initialBudget(),
    modal: false,
    expenses: localStorageExpenses(),
    editingId: '',
    currentCategory: ''
}

const createExpense = (draftExpense:DraftExpense) : Expense => {
    return {
        ...draftExpense,
        id: uuidv4() /* we've create this new id with de uuid library */
    }
}

export const budgetReducer = (state:BudgetState = initialState, action:BudgetActions) => {
    if(action.type === 'add-budget') {
        return {
            ...state,
            budget: action.payload.budget
        }
    }

    if(action.type === 'show-modal') {
        return {
            ...state,
            modal: true
        }
    }

    if(action.type === 'close-modal') {
        return {
            ...state,
            modal: false,
            editingId: ''
        }
    }

    if(action.type === 'add-expense') {
        const expense = createExpense(action.payload.expense)

        return {
            ...state,
            expenses: [...state.expenses, expense],
            modal: false
        }
    }

    if(action.type === 'remove-expense') {
        return {
            ...state,
            expenses: state.expenses.filter(expense => expense.id !== action.payload.id)
        }
    }

    if(action.type === 'get-expense-by-id') {
        return {
            ...state,
            editingId: action.payload.id,
            modal: true
        }
    }

    if(action.type === 'update-expense') {
        return {
            ...state,
            /* We looking for the expense to update, if we find it we'll return the expense of the payload, and if not, then we return the other one */
            expenses: state.expenses.map(expense => expense.id === action.payload.expense.id ? action.payload.expense : expense),
            modal: false,
            editingId: '' 
        }
    }

    if(action.type === 'reset-app') {
        return {
            ...state,
            budget: 0,
            expenses: []
        }
    }

    if(action.type === 'add-filter-category') {
        return {
            ...state,
            currentCategory: action.payload.id
        }
    }

    return state
}