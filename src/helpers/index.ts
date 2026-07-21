/* Formateamos un valor en moneda */

export function formatCurrency(amount:number) {
    return new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(amount)
}

/* Formateamos la fecha para poder que se vea bien */
export function formatDate(dateStr:string) : string {
    const dateObj  = new Date(dateStr)  /* create the date in string to convert it to Date */
    const options:Intl.DateTimeFormatOptions = { /* Create the options of Intl */
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    } 
     
    return new Intl.DateTimeFormat('en-ES', options).format(dateObj)
}