export function toCountNumber(str: string) {
    let num = 0
    for (let i=0; i<str.length; ++i) {
        let char = str.charAt(i)
        let digit = Number.parseInt(char)
        if (!Number.isNaN(digit))
        num = num*10 + digit
    }
    return num
}