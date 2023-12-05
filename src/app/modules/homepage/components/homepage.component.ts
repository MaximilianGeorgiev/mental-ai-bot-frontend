import { Component } from '@angular/core';
import { CustomRipple } from '../../../shared/components/ripple/ripple.component';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [CustomRipple],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

}