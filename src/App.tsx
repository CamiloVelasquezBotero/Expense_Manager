import { useEffect, useMemo } from "react"
import BudgetForm from "./components/BudgetForm"
import { useBudget } from "./hooks/useBudget"
import BudgetTraker from "./components/BudgetTraker"
import ExpenseModal from "./components/ExpenseModal"
import ExpenseList from "./components/ExpenseList"
import FilterByCategory from "./components/FilterByCategory"

function App() {

  const { state } = useBudget()
  const isValidBudget = useMemo(() => state.budget > 0, [state.budget]) /* We check if the budget is greater than 0 */

  useEffect(() => {
    localStorage.setItem('budget', JSON.stringify(state.budget)) /* We pass the budget as string */
    localStorage.setItem('expenses', JSON.stringify(state.expenses))  /* we pass the expenses too */
  }, [state])

  return (
    <>
      <header className="bg-blue-600 py-8 max-h-72">
        <h1 className="uppercase text-center font-black text-4xl texdt-white">
          Planificador de Gastos
        </h1>
      </header>

      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg mt-10 p-10">
        {/* Renderizamo dependiendo al budget */}
        {isValidBudget ? <BudgetTraker /> : <BudgetForm /> }
      </div>

      {/* If we have budget, then we render the modal */}
      {isValidBudget && (
        <main className="max-w-3xl mx-auto py-10">
          <FilterByCategory />
          <ExpenseList />
          <ExpenseModal />
        </main>
      )}
      
    </>
  )
}

export default App
