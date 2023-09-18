import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
})
export class DateRangePickerComponent implements OnInit {
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  constructor() {}
  @Input() date = this.range.value;
  @Output() dateRange = new EventEmitter();

  ngOnInit(): void {
    this.range.valueChanges.subscribe((data) => {
      // this.date = data
      this.dateRange.emit(data)
    });
  }

  onSubmit() {
    this.dateRange.emit();
  }
}
