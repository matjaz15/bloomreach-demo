export interface IFilterResource {
    steps: IStep[]
}

export interface IStep {
    type: string,
    attributes: IAttribute[]
}

export interface IAttribute {
    name: string,
    type: string,
    fieldType: string,
    condition: string,
    operator: string | undefined,
    value: any | number | string
}