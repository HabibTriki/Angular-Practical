import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Cv } from "../model/cv";
import {ItemComponent} from "../item/item.component";
import {NgClass, NgForOf} from "@angular/common";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.css"],
  imports: [
    ItemComponent,
    NgClass,
    NgForOf
  ],
  standalone: true
})
export class ListComponent {
  @Input() cvs: Cv[] | null = [];
}
