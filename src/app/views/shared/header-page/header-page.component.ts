import { CommonModule, Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header-page',
  standalone: true,
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  imports: [CommonModule],
  templateUrl: './header-page.component.html'
})
export class HeaderPageComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  title: string = '';

  ngOnInit(): void {
    setInterval(() => {
      const path = this.router.parseUrl(this.router.url).root.children[this.route.outlet]['segments'][0]['path'];
      const urlParam = this.router.config.find(x => x.path === path!);
      if (urlParam) {
        this.title = urlParam["title"]!.toString();
      } else {
        this.title = "Not Found";
      }
    }, 100);
  }

  back() {
    this.location.back();
  }
}
