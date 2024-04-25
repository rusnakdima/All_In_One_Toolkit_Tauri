/* system libraries */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

/* components */
import { HeaderPageComponent } from '@views/shared/header-page/header-page.component';

@Component({
  selector: 'app-array-visualizer',
  standalone: true,
  imports: [CommonModule, HeaderPageComponent],
  templateUrl: './array-visualizer.component.html'
})
export class ArrayVisualizerComponent {
  title: string = '';

  constructor() {}

  dataArray: Array<any> = []

  ngOnInit(): void {}

  executeCode(event: any) {
    let data = event.target.value;
    setTimeout(() => {
      try {
        data += "\nreturn array;"
        const result = new Function(data)();
        // console.log(result)
        this.dataArray = result;
      } catch (error) {
        console.error(error);
      }
    }, 1500);
  }
}
