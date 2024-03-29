export const convertUTCDateToLocalDate =
    (date: Date) => new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds())
    )
