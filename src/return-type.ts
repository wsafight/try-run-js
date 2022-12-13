export type ReturnType = 'tuple' | 'record'

let returnType: ReturnType | '' = ''

export const setReturnType = (type: ReturnType) => {
    console.log(type);
    if (type === 'tuple' || type === 'record') {
        returnType = type
    }
    returnType = ''
}

export const getReturnType = (): ReturnType | '' => returnType