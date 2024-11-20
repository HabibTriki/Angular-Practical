import { Directive,  HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: 'input[app-rainbow]',
  standalone: true,
})
export class RainbowDirective {
  colors: string[] = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'purple'];

  @HostBinding('style.color') textColor!: string;
  @HostBinding('style.border-color') borderColor!: string;

  constructor(){}

  @HostListener('keyup') newColor() {
    this.changeColor();
  }

  changeColor() {
    const randomIndex = Math.floor(Math.random() * this.colors.length);
    const randomColor = this.colors[randomIndex];
    this.textColor = randomColor;
    this.borderColor = randomColor;
  }
}


