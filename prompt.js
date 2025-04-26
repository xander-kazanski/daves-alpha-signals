export const messages = (data) => {
    return [
        {
            role: "system",
            content: 'Given polygon data at includes an array where ticker=stock ticker, v=volume, vw=volume weighted, o=open, t=time in unix msec for start of aggergate window, n=number of transactions in the aggregate window, and c=close. generate a report of where the stock or stocks price(s) could go in 2 days time.'
        },
        {
            role: "user",
            content: data
        }
    ]
}