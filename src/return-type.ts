export type ReturnType = 'tuple' | 'record'

let returnType: ReturnType | '' = ''

export const setReturnType = (type: ReturnType) => {
    if (type === 'tuple' || type === 'record') {
        returnType = type
        return
    }
    returnType = ''
}

export const getReturnType = (): ReturnType | '' => returnType