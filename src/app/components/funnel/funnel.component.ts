import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { PageData } from '../dropdown/dropdown.component';
import { HttpClient } from '@angular/common/http';
import { IEventAttributesApiResource } from './resources/fetchResource'
import { Condition, EventAttribute, Funnel, Operation, Step, StepEvent} from './funnel.api';
import { operationData } from './resources/staticData'

@Component({
  selector: 'app-funnel',
  templateUrl: './funnel.component.html',
  styleUrls: ['./funnel.component.sass'],
})
export class FunnelComponent implements OnInit{
  @Input() eventAttributesUrl!: string
  @Output() applyFilters = new EventEmitter();
  
  currentHoverStep?: Step
  currentHoverEventAttribute?: EventAttribute
  funnel: Funnel
  pages: PageData[]

  constructor(private http : HttpClient){
    this.funnel = new Funnel([])
    this.funnel.addFunnelStep()

    this.pages = operationData.map((x: any) => {
      return new PageData(x.id, x.name, x.iconClass)
    })
  }

  ngOnInit(){
    this.getEventAttributesData()
  }

  getEventAttributesData() {
    this.http.get<IEventAttributesApiResource>(this.eventAttributesUrl)
    .subscribe((response: IEventAttributesApiResource) => {
      this.funnel = new Funnel(response.events)
      this.funnel.addFunnelStep()
    })
  }

  // ==Funnel events==
  onDiscardFilters() {
    this.funnel.deleteAllSteps()
    this.funnel.addFunnelStep()
  }

  onAddFunnelStep() {
    this.funnel.addFunnelStep()
  }

  onApplyFilters() {
    const res = this.funnel.applyFilters()
    this.applyFilters.emit(res)
  }

  // ==Step events==
  onStepHoverEnter(step: Step) {
    this.currentHoverStep = step
  }

  onStepHoverExit() {
    this.currentHoverStep = undefined
  }

  onEventAttributeHoverEnter(eventAttribute: EventAttribute) {
    this.currentHoverEventAttribute = eventAttribute
  }

  onEventAttributeHoverExit() {
    this.currentHoverEventAttribute = undefined
  }

  onDeleteStep(step: Step) {
    this.funnel.deleteStep(step)
  }

  onCopyStep(step: Step) {
    this.funnel.copyStep(step)
  }

  onRemoveEventAttribute(eventAttribute: EventAttribute, step: Step) {
    if (step.selectedStepEvent)
      step.selectedStepEvent.deleteAttribute(eventAttribute)
  }

  onStepEventSelect(stepEventData: any, step: Step) {
    step.setStepEvent(stepEventData)
  }

  onRefineMore(stepEvent: StepEvent) {
    stepEvent.addEventAttribute()
  }

  onEventAttributeSelect(eventAttributeData: any, eventAttribute: EventAttribute) {
    eventAttribute.setEventAttribute(eventAttributeData)
  }

  onOperatorConditionItemSelect(operatorCondition: Condition, operation: Operation){
    // Set new condition
    operation.condition.id = operatorCondition.id
    operation.condition.name = operatorCondition.name
    operation.condition.fieldType = operatorCondition.fieldType

    // Reset value
    operation.initializeValue()
  }
  
  onOperatorConditionPageSelect(pageData: PageData, operation: Operation){
    operation.attributeOperator.setOperation(pageData.id)
  }

  onInputNumber($event: any, operation: Operation){
    operation.setNumberInput($event.target.value)
  }

  onInputRangeFrom($event: any, operation: Operation){
    operation.setRangeInputFrom($event.target.value)
  }

  onInputRangeTo($event: any, operation: Operation){
    operation.setRangeInputTo($event.target.value)
  }

  canShowStepOptions(step: Step) {
    return (this.currentHoverStep && 
      this.currentHoverStep !== undefined && 
      this.currentHoverStep === step)
  } 

  canShowStepDeleteButton() {
    return this.funnel.steps.length > 1
  } 

  canShowRemoveEventAttributeButton(eventAttribute: EventAttribute) {
    return (this.currentHoverEventAttribute && 
      this.currentHoverEventAttribute !== undefined && 
      this.currentHoverEventAttribute === eventAttribute)
  } 

  canShowEventAttributeDeleteButton(step: Step) {
    return step.selectedStepEvent && step.selectedStepEvent?.eventAttributes.length > 1
  } 

  getDefaultPage(operation: Operation){
    return this.pages.find((x: any) => x.id == operation.id)
  }

  setDefaultStep(step: Step){
    return step.selectedStepEvent
  }

}
