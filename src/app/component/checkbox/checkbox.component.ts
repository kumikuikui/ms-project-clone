import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {

  constructor() { }
  @Input() title = "Checkbox";
  @Input() isChecked: boolean = false;
  @Input() disabled: boolean = false;
  @Output() onChange = new EventEmitter<boolean>();

  ngOnInit(): void {
  }

  onCheckboxChange() {
    // this.isChecked = !this.isChecked;
    this.onChange.emit(this.isChecked);
  }

}
