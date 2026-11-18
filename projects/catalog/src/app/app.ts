import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Only used when the remote runs standalone on port 4201.
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class App {}
