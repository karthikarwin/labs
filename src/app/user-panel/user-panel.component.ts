import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css']
})
export class UserPanelComponent implements OnInit {

  _opened: Boolean = true;

  constructor() { }

  ngOnInit() {
  }


  _toggleSidebar() {
    this._opened = !this._opened;
  }

}
