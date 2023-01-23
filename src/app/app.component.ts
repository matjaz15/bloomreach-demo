import { Component } from '@angular/core';
import { IAttribute, IFilterResource, IStep } from './components/funnel/resources/responseResource';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  onApplyFilters(filterResponse: IFilterResource) {
    filterResponse.steps.forEach((step: IStep) => {
      console.log(step.type)

      step.attributes.forEach((attribute: IAttribute) => {
        console.log(
          attribute.condition, 
          attribute.fieldType, 
          attribute.name, 
          attribute.operator, 
          attribute.type, 
          attribute.value
        )
      })

    })
  }
}
