import { IFilterResource, IStep, IAttribute } from './resources/responseResource'
import { FieldTypes, operationData } from './resources/staticData'

export class Funnel {
    currentStepId: number = 0
    unnamedStepLabel: string = "Unnamed step"
    eventAttributeData: any
    steps: Step[]

    constructor(_eventAttributeData: any = []) {
        this.eventAttributeData = _eventAttributeData
        this.steps = []
    }

    get transformedEventAttributeData() {
        return this.eventAttributeData.map((x: any) => {
            return {
                id: x.type,
                properties: x.properties
            }
        })
        // return this.eventAttributeData.map(x => {
        //     return 
        // })
    }

    addFunnelStep() {
        const step = new Step(this.currentStepId, this)
        this.steps.push(step)

        this.currentStepId ++
        return step
    }

    deleteAllSteps() {
        this.steps = []
    }

    applyFilters() {
        return {
            steps: this.steps
            .filter((step: Step) => step.selectedStepEvent)
            .map((step: Step) => {
                return {
                    type: (step.selectedStepEvent?.id as string),
                    attributes: step.selectedStepEvent?.eventAttributes
                    .filter((eventAttribute: EventAttribute) => eventAttribute.eventAttributeData)
                    .map((eventAttribute: EventAttribute) => {
                        return {
                            name: eventAttribute.eventAttributeData?.id,
                            type: eventAttribute.attributeOperator.operation?.id,
                            fieldType: FieldTypes[eventAttribute.attributeOperator.operation?.condition.fieldType as number],
                            condition: eventAttribute.attributeOperator.operation?.condition.id,
                            operator: (eventAttribute.eventAttributeCondition as any).id,
                            value: eventAttribute.attributeOperator.operation?.value
                        }
                    }) as IAttribute[]
                }
            }) as IStep[]
        }
    }

    deleteStep(step: Step) {
        this.steps = this.steps.filter(x => x.id !== step.id)
    }

    copyStep(step: Step) {
        // Create new funnel step
        let stepCopy = this.addFunnelStep()

        if (!step.selectedStepEvent) return

        // Copy step event data
        const stepEventData = {
            type: step.selectedStepEvent.id,
            properties: step.selectedStepEvent?.eventAttributeData.map(x => {return {property: x.id, type: x.type}})
        }
        stepCopy.setStepEvent(stepEventData)
        
        // Copy default event attribute condition 
        if (!stepCopy.selectedStepEvent) return
        stepCopy.selectedStepEvent.defaultEventAttributeCondition = step.selectedStepEvent.defaultEventAttributeCondition
        
        // Copy all attributes
        stepCopy.selectedStepEvent.eventAttributes = []
        step.selectedStepEvent.eventAttributes.forEach((eventAttribute: EventAttribute) => {
            if (!stepCopy.selectedStepEvent) return

            // Copy attribute
            const eventAttributeCopy = stepCopy.selectedStepEvent.addEventAttribute()
            if (!eventAttribute.eventAttributeData) return
            eventAttributeCopy.setEventAttribute(eventAttribute.eventAttributeData)

            // Copy condition page
            if (!eventAttribute.attributeOperator.operation || !eventAttribute.attributeOperator.operation) return
            eventAttributeCopy.attributeOperator.setOperation(eventAttribute.attributeOperator.operation.id)

            // Copy condition value
            if (!eventAttributeCopy.attributeOperator || !eventAttributeCopy.attributeOperator.operation) return
            eventAttributeCopy.attributeOperator.operation.condition.id = eventAttribute.attributeOperator.operation.condition.id
            eventAttributeCopy.attributeOperator.operation.condition.name = eventAttribute.attributeOperator.operation.condition.name
            eventAttributeCopy.attributeOperator.operation.condition.fieldType = eventAttribute.attributeOperator.operation.condition.fieldType

            // Reset value
            eventAttributeCopy.attributeOperator.operation.initializeValue()

            // Copy operation
            eventAttributeCopy.attributeOperator.operation.id = eventAttribute.attributeOperator.operation.id
            eventAttributeCopy.attributeOperator.operation.name = eventAttribute.attributeOperator.operation.name
            eventAttributeCopy.attributeOperator.operation.value = eventAttribute.attributeOperator.operation.value
        })
    }
}

export class Step {
    id: number
    funnel: Funnel
    selectedStepEvent?: StepEvent

    constructor(_id: number, _funnel: Funnel){
        this.id = _id
      this.funnel = _funnel
    }

    get stepLabel() {
        if (this.selectedStepEvent || this.selectedStepEvent !== undefined)
            return this.selectedStepEvent.id
        return this.funnel.unnamedStepLabel
    }

    get stepEventAttributeData() {
        if (this.selectedStepEvent || this.selectedStepEvent !== undefined)
            return this.selectedStepEvent.eventAttributeData
        return []
    }

    get stepEventAttributes() {
        if (this.selectedStepEvent || this.selectedStepEvent !== undefined)
            return this.selectedStepEvent.eventAttributes
        return []
    }

    setStepEvent(stepEventData: any) {
        this.selectedStepEvent = new StepEvent(stepEventData.id, this)

        if (!stepEventData.properties || stepEventData.properties === undefined)
            return

        stepEventData.properties.forEach((eventAttribute: any) => {
            this.selectedStepEvent?.addEventAttributeData(eventAttribute)
        });

        this.selectedStepEvent.addEventAttribute()
    }
}

export class StepEvent {
    internal_id: number = 0
    id: string
    step: Step
    eventAttributes: EventAttribute[]
    eventAttributeData: EventAttributeData[]
    defaultEventAttributeCondition?: EventAttributeCondition = EventAttributeCondition.getAnd

    constructor(_id: string ,_step: Step){
      this.id = _id
      this.step = _step
      this.eventAttributes = []
      this.eventAttributeData = []
    }
    
    addEventAttributeData(_rawEventAttributeData: any) {
        const eventAttributeData = new EventAttributeData(_rawEventAttributeData.property, _rawEventAttributeData.type)
        this.eventAttributeData?.push(eventAttributeData)
    }

    addEventAttribute() {
        const eventAttribute = new EventAttribute(this.internal_id, this)
        this.eventAttributes?.push(eventAttribute)
        this.internal_id++
        return eventAttribute
    }

    deleteAttribute(eventAttribute: EventAttribute) {
        this.eventAttributes = this.eventAttributes.filter(x => x.internalId !== eventAttribute.internalId)
    }
}

export class EventAttributeData {
    id: string
    type: string

    constructor(_id: string, _type: string) {
        this.id = _id
        this.type = _type
    }
}
  
export class EventAttribute {
    internalId: number
    eventAttributeData?: EventAttributeData
    stepEvent: StepEvent
    eventAttributeCondition?: EventAttributeCondition
    attributeOperator: AttributeOperator

    constructor(_internalId: number, _stepEvent: StepEvent) {
        this.internalId = _internalId
        this.stepEvent = _stepEvent
        this.eventAttributeCondition = _stepEvent.defaultEventAttributeCondition
        this.attributeOperator = new AttributeOperator(this)
    }

    setEventAttribute(eventAttributeData: any) {
        this.eventAttributeData = new EventAttributeData(eventAttributeData.id, eventAttributeData.type)
        this.attributeOperator.setOperation(eventAttributeData.type)
    }
}

export class EventAttributeCondition {
    static #types = [
        {id: 'and', name: 'AND'},
        {id: 'or', name: 'OR'}
    ]

    static get getAnd() {return this.#types.find(type => type.id == 'and')} 
    static get getOr() {return this.#types.find(type => type.id == 'or')} 
}

export class AttributeOperator {
    eventAttribute: EventAttribute
    operation?: Operation
    operationData: any = operationData

    constructor(_eventAttribute: EventAttribute){
        this.eventAttribute = _eventAttribute
    }

    setOperation(_type: string) {
        const operator = this.getOperatorType(_type)
        const firstCondition = operator?.conditions[0]
        
        const condition = new Condition(
            (firstCondition?.id as string), 
            (firstCondition?.name as string), 
            (firstCondition?.fieldType as FieldTypes)
        )
        this.operation = new Operation(
            this,
            (operator?.id as string), 
            (operator?.name as string), 
            condition
        )
    }

    getOperatorType(_type: string) {
        return operationData.find((operatorType: any) => operatorType.id == _type)
    }

    getOperatorTypeConditions(_type: string){
        return this.getOperatorType(_type)?.conditions
    } 
}

export class Operation {
    id: string
    name: string
    condition: Condition
    attributeOperator: AttributeOperator
    value: any | string | number

    constructor(_attributeOperator: AttributeOperator, _id: string, _name: string, _condition: Condition) {
        this.attributeOperator = _attributeOperator
        this.id = _id
        this.name = _name
        this.condition = _condition
        this.initializeValue()
    }
    initializeValue() {
        if (this.condition.isFieldTypeNumber){
            this.value = 0
        }
        if (this.condition.isFieldTypeString){
            this.value = ''
        }
        if (this.condition.isFieldTypeRange){
            this.value = [0,0]
        }
    }

    setNumberInput(value: any){
        if (isNaN(value)) {
            this.value = 0
            return
        }
        this.value = value
    }

    setRangeInputFrom(value: any){
        if (isNaN(value)) {
            this.value[0] = 0
            return
        }
        this.value[0] = value
    }

    setRangeInputTo(value: any){
        if (isNaN(value)) {
            this.value[1] = 0
            return
        }
        this.value[1] = value
    }
}

export class Condition {
    id: string
    name: string
    fieldType: FieldTypes

    constructor( _id: string, _name: string, _fieldType: FieldTypes) {
        this.id = _id,
        this.name = _name
        this.fieldType = _fieldType
    }

    get isFieldTypeNumber() {return this.fieldType === FieldTypes.number}
    get isFieldTypeString() {return this.fieldType === FieldTypes.string}
    get isFieldTypeRange() {return this.fieldType === FieldTypes.range}
}













