import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-select-box',
  templateUrl: './select-box.component.html',
  styleUrls: ['./select-box.component.scss'],
})
export class SelectBoxComponent implements OnInit {

  constructor() {}
  @Input() array: string[] = [];
  @Input() title: string = 'Select Box';
  @Output() selectedValueChange = new EventEmitter<string>();
  selectControl = new FormControl();
  
  ngOnInit(): void {
    this.selectControl.valueChanges.subscribe((value) => {
      this.selectedValueChange.emit(value);
    });
  }
}
