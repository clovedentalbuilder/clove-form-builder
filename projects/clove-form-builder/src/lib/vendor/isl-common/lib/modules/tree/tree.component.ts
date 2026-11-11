import {Component, Input} from '@angular/core';
import {Tree} from "./classes/tree";

@Component({
    standalone: false,
  selector: 'tree',
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.css'
})
export class TreeComponent {

  @Input({ alias: 'data', required: true })
  data?: Tree;

}
