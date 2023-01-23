import { Component, Input, OnInit, ViewChild, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

export class PageData {
  id: string = ''
  label: string = ''
  iconClass: string = ''

  constructor(_id: string, _label: string, _iconClass: string){
    this.id = _id
    this.label = _label
    this.iconClass = _iconClass
  }
}

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.sass']
})
export class DropdownComponent implements OnInit, OnChanges {
  @Input() selection: any
  @Input() setSelectedItem: any
  @Input() setSelectedPage: any
  @Input() selectionPlaceholder: string = ''
  @Input() selectionLabelParam: string = ''
  @Input() searchPlaceholder: string = ''
  @Input() searchParam: string = ''
  @Input() searchTagLabel: string = ''
  @Input() sizeClass: string = ''
  @Input() hasSearch: boolean = true
  @Input() hasSearchTag: boolean = false
  @Input() hasPages: boolean = false
  @Input() pages?: PageData[]
  @Input() selectedPage?: PageData
  @ViewChild('searchElement') searchElement: any;
  @ViewChild('dropDownElement') dropDownElement: any;
  @Output() onItemSelect = new EventEmitter();
  @Output() onPageSelect = new EventEmitter();
  previousSelectedItem: any
  previousSelectedPage: any
  searchText: string = ''
  filteredSelection: any
  selectedItem: any

  get isItemSelected() {
    return this.selectedItem || this.selectedItem !== undefined ? true : false 
  }

  get dropdownLabel() {
    if (this.isItemSelected) return this.selectedItem[this.selectionLabelParam]
    return this.selectionPlaceholder
  }

  ngOnInit(){
    this.filteredSelection = this.selection
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['setSelectedItem'] && this.setSelectedItem) {
      // this.selectItem(this.setSelectedItem)
      this.selectedItem = this.setSelectedItem
      this.filteredSelection = this.selection
      console.log(this.setSelectedItem)
    }
return
    if (changes['setSelectedPage'] && this.setSelectedPage) {
      this.selectPage(this.setSelectedPage)
      this.filteredSelection = this.selection
      console.log(this.setSelectedPage)
    }
  }

  ngDoCheck() {
    return
    // If setSelected has changed
    if (this.setSelectedItem && this.setSelectedItem !== undefined){
      const stringToCompare = JSON.stringify(this.setSelectedItem)
      if (this.previousSelectedItem && this.previousSelectedItem !== stringToCompare){
        this.previousSelectedItem = stringToCompare
        this.selectItem(this.setSelectedItem)
        this.filteredSelection = this.selection
      }
    }

    if (this.setSelectedPage){
      const stringToCompare = JSON.stringify(this.setSelectedPage)
      if (this.previousSelectedPage !== stringToCompare){
        this.previousSelectedPage = stringToCompare
        this.selectPage(this.setSelectedPage)
        this.filteredSelection = this.selection
      }
    }
  }

  onSearchInput(){
    if (this.searchText === '') {
      this.filteredSelection = this.selection
      return
    }
    this.filteredSelection = this.filterSelection(this.searchText)
  }

  onItemClick(item: any) {
    try {
      this.dropDownElement.nativeElement.classList.remove('show')
    } catch (error) {}
    this.selectItem(item)
  }

  onPageClick(page: PageData){
    this.selectPage(page)
  }

  selectItem(item: any){
    this.selectedItem = item
    this.onItemSelect.emit(item)
  }

  selectPage(page: PageData){
    this.selectedPage = page
    this.onPageSelect.emit(page)
  }

  onDropdownClick(){
    this.searchText = ''
    this.onSearchInput()
    this.focusOnSearch()
  }

  filterSelection(keyword: string) {
    try {
      return this.selection.filter((x: any) => x[this.searchParam].toString().includes(keyword))
    } catch (error) {}
    return []
  }

  focusOnSearch(){
    if (!this.hasSearch) return
    this.searchElement.nativeElement.focus()
  }

  itemDisplay(item: any) {
    try {
      return item[this.selectionLabelParam];
    } catch (error) {}
    return ""
  }

  pageStyle(page: PageData){
    let style = 'border border-4 border-end-0 border-start-0 border-top-0 '
    if (this.selectedPage && this.selectedPage !== undefined && this.selectedPage.id == page.id)
      style += 'page-item-link-border '
    else style += 'border-bottom-0'
    return style
  }

  pageButtonStyle(page: PageData){
    let style = 'btn page-item-link '
    if (this.selectedPage && this.selectedPage !== undefined && this.selectedPage.id == page.id)
      style += 'active-link'
    return style
  }
}
