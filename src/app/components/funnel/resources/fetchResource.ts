export interface IEventAttributesApiResource {
    events: IEvent[]
}

interface IEvent {
    type: string,
    properties: IProperty[]   
}

interface IProperty {
    property: string,
    type: string
}

