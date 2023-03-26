import { Component } from '@angular/core';

@Component({
  selector: 'credbase-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isOpen: boolean = false;
}
