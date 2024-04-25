/* system libraries */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';

/* services */
import { DashboardService } from '@services/dashboard.service';

/* models */
import { DashboardLink } from '@models/dashboard-link';

/* components */
import { INotify, WindowNotifyComponent } from '@views/shared/window-notify/window-notify.component';
import { SearchComponent } from '@views/shared/fields/search/search.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  providers: [DashboardService],
  imports: [CommonModule, RouterModule, SearchComponent, WindowNotifyComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  title: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dashboardService: DashboardService
  ) {}

  nameOutlet: string = 'primary';

  dataNotify: Subject<INotify> = new Subject();

  links: Array<DashboardLink> = [
    { title: 'Word counter in file', url: 'word_counter', icon: ['https://cdn-icons-png.flaticon.com/512/7603/7603910.png'] },
    { title: 'URL Encode/Decode', url: 'url_enc_dec', icon: ['https://cdn-icons-png.flaticon.com/512/3214/3214679.png'] },
    { title: 'Base64 Encode/Decode', url: 'base64_enc_dec', icon: ['https://cdn-icons-png.flaticon.com/512/3093/3093179.png'] },
    { title: 'VirusTotal', url: 'virus_total', icon: ['https://cdn-icons-png.flaticon.com/512/7975/7975064.png'] },
    { title: 'Color Pallete', url: 'color_pallete', icon: ['https://cdn-icons-png.flaticon.com/512/5223/5223048.png'] },
    { title: 'JS Key Code Event', url: 'key_code', icon: ['https://cdn-icons-png.flaticon.com/512/124/124125.png'] },
    { title: 'Array visualizer', url: 'array_visualizer', icon: ['https://cdn-icons-png.flaticon.com/512/4799/4799899.png'] },
    { title: "Visualization data on chart", url: "visual_data_chart", icon: ["https://cdn-icons-png.flaticon.com/512/893/893220.png"] },
    { title: 'CSV visualizer in Table', url: 'csv_to_table', icon: ['https://cdn-icons-png.flaticon.com/512/1126/1126902.png', 'https://cdn-icons-png.flaticon.com/512/3899/3899497.png', 'https://cdn-icons-png.flaticon.com/512/4598/4598376.png'] },
    { title: 'JSON visualizer in Table', url: 'json_to_table', icon: ['https://cdn-icons-png.flaticon.com/512/136/136525.png', 'https://cdn-icons-png.flaticon.com/512/3899/3899497.png', 'https://cdn-icons-png.flaticon.com/512/4598/4598376.png'] },
    { title: 'XML visualizer in Table', url: 'xml_to_table', icon: ['https://cdn-icons-png.flaticon.com/512/136/136526.png', 'https://cdn-icons-png.flaticon.com/512/3899/3899497.png', 'https://cdn-icons-png.flaticon.com/512/4598/4598376.png'] },
    { title: 'Plist viewer', url: 'plist_to_table', icon: ['https://i0.wp.com/apptyrant.com/wordpress/wp-content/uploads/2023/05/Plistdocumenticonimage.png.webp?resize=300%2C300&ssl=1'] },
    { title: 'CSS Converter', url: 'css_converter', icon: ['https://cdn-icons-png.flaticon.com/512/136/136527.png'] },
    { title: 'Markdown Editor', url: 'md_editor', icon: ['https://cdn-icons-png.flaticon.com/512/14422/14422333.png'] },
    { title: 'Convert JSON to XML', url: 'json_to_xml', icon: ['https://cdn-icons-png.flaticon.com/512/136/136525.png', 'https://cdn-icons-png.flaticon.com/512/3899/3899497.png', 'https://cdn-icons-png.flaticon.com/512/136/136526.png'] },
    { title: 'Convert XML to JSON', url: 'xml_to_json', icon: ['https://cdn-icons-png.flaticon.com/512/136/136526.png', 'https://cdn-icons-png.flaticon.com/512/3899/3899497.png', 'https://cdn-icons-png.flaticon.com/512/136/136525.png'] },
    { title: 'Convert JSON to XLS', url: 'json_to_xls', icon: ['https://cdn-icons-png.flaticon.com/512/136/136525.png', 'https://cdn-icons-png.flaticon.com/512/3899/3899497.png', 'https://cdn-icons-png.flaticon.com/512/8263/8263105.png'] },
    { title: 'Convert XLS to JSON', url: 'xls_to_json', icon: ['https://cdn-icons-png.flaticon.com/512/8263/8263105.png', 'https://cdn-icons-png.flaticon.com/512/3899/3899497.png', 'https://cdn-icons-png.flaticon.com/512/136/136525.png'] },
    { title: 'Convert XML to XLS', url: 'xml_to_xls', icon: ['https://cdn-icons-png.flaticon.com/512/136/136526.png', 'https://cdn-icons-png.flaticon.com/512/3899/3899497.png', 'https://cdn-icons-png.flaticon.com/512/8263/8263105.png'] },
    { title: 'Convert XLS to XML', url: 'xls_to_xml', icon: ['https://cdn-icons-png.flaticon.com/512/8263/8263105.png', 'https://cdn-icons-png.flaticon.com/512/3899/3899497.png', 'https://cdn-icons-png.flaticon.com/512/136/136526.png'] },
  ];
  tempLinks: Array<DashboardLink> = [];
  recentActionLinks: Array<DashboardLink> = [];

  ngOnInit() {
    this.nameOutlet = this.route.outlet;
    this.dashboardService.updateLibrary()
    .then((data: any) => {
      this.dataNotify.next({status: 'success', text: data});
    })
    .catch((err: any) => {
      console.error(err);
      this.dataNotify.next({status: 'error', text: err});
    });
    
    const recAct = localStorage["recAct"];
    if (recAct && recAct != '') {
      this.recentActionLinks = JSON.parse(recAct);
    }
    this.tempLinks = this.links.slice();
  }

  redirToLink(url: string) {
    this.router.navigate([{outlets: { [this.nameOutlet]: [`${url}`] } }]);
  }

  searchFunc(data: any) {
    this.links = data;
  }

  saveLink(link: DashboardLink) {
    const indexLink = this.recentActionLinks.findIndex((recLink: DashboardLink) => recLink.url == link.url);
    if (indexLink > -1) {
      this.recentActionLinks.splice(indexLink, 1);
    }
    this.recentActionLinks.unshift(link);
    if (this.recentActionLinks.length > 7) {
      this.recentActionLinks.pop();
    }
    localStorage["recAct"] = JSON.stringify(this.recentActionLinks);
  }
  
  clearRecentLink() {
    this.recentActionLinks = [];
    localStorage.removeItem("recAct");
  }
}
