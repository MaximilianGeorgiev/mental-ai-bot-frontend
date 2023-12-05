import { Component } from '@angular/core';
import { CustomRipple } from '../../../shared/components/ripple/ripple.component';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [CustomRipple, MatButtonModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

}