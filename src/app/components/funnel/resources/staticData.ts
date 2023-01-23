export enum FieldTypes {
    number,
    string,
    range
}

export const operationData = [
    {
        id: 'string', 
        name: 'STRING',
        iconClass: 'bi d-block bi-fonts',
        conditions: [
            {
                id: 'equals',
                name: 'equals',
                fieldType: FieldTypes.string
            },
            {
                id: 'doesNotEqual',
                name: 'does not equal',
                fieldType: FieldTypes.string
            },
            {
                id: 'contains',
                name: 'contains',
                fieldType: FieldTypes.string
            },
            {
                id: 'doesNotContain',
                name: 'does not contain',
                fieldType: FieldTypes.string
            },
        ]
    },
    {
        id: 'number', 
        name: 'NUMBER',
        iconClass: 'bi d-block bi-hash',
        conditions: [
            {
                id: 'equalsTo',
                name: 'equals to',
                fieldType: FieldTypes.number
            },
            {
                id: 'inBetween',
                name: 'in between',
                fieldType: FieldTypes.range
            },
            {
                id: 'lessThan',
                name: 'less than',
                fieldType: FieldTypes.number
            },
            {
                id: 'greaterThan',
                name: 'greater than',
                fieldType: FieldTypes.number
            },
        ]
    }
]