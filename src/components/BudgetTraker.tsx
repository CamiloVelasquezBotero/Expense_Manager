import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useBudget } from "../hooks/useBudget";
import AmountDisplay from "./AmountDisplay";
import 'react-circular-progressbar/dist/styles.css'

export default function BudgetTraker() {
    const { dispatch, state, totalExpenses, remainingBudget } = useBudget()

    const percentage = Number(((totalExpenses / state.budget) * 100).toFixed(2)) /* Max 2 decimals */

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex justify-center">
                {/* <img src="/grafico.jpg" alt="Grafica de gastos" />  //image to preview */}
                <CircularProgressbar 
                    value={percentage}
                    styles={buildStyles({
                        pathColor: percentage === 100 ? '#DC2626' : '#3b82f6',
                        trailColor: '#F5F5F5',
                        textSize: 10,
                        textColor: '#3b82f6'
                    })}
                    text={`${percentage}% Gastado`}
                />
            </div>

            <div className="flex flex-col justify-center items-center gap-8">
                <button
                    type="button"
                    className="bg-pink-600 w-full text-white p-2 uppercase font-bold rounded-lg cursor-pointer"
                    onClick={() => dispatch({type: 'reset-app'})}
                >Resetear App</button>

                <AmountDisplay
                    label="Presupuesto"
                    amount={state.budget}
                />

                <AmountDisplay
                    label="Disponible"
                    amount={remainingBudget}
                />

                <AmountDisplay
                    label="Gastado"
                    amount={totalExpenses}
                />
            </div>
        </div>
    )
}
