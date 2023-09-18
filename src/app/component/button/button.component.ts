import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  constructor() { }
  @Input() title:string = 'Text';
  @Output() onClick:any = new EventEmitter();

  ngOnInit(): void {
  }

  onClickButton(){
    this.onClick.emit();
  }

}
