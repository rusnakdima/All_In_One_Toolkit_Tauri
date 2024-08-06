/* system libraries */
import { Routes } from "@angular/router";

/* components */
import { AboutComponent } from "@views/about/about.component";
import { ArrayVisualizerComponent } from "@views/array-visualizer/array-visualizer.component";
import { Base64EncDecComponent } from "@views/base64-enc-dec/base64-enc-dec.component";
import { ColorPalleteComponent } from "@views/color-pallete/color-pallete.component";
import { CssConverterComponent } from "@views/css-converter/css-converter.component";
import { CsvToTableComponent } from "@views/csv-to-table/csv-to-table.component";
import { DashboardComponent } from "@views/dashboard/dashboard.component";
import { JsonToTableComponent } from "@views/json-to-table/json-to-table.component";
import { JsonToXlsComponent } from "@views/json-to-xls/json-to-xls.component";
import { JsonToXmlComponent } from "@views/json-to-xml/json-to-xml.component";
import { KeyCodeComponent } from "@views/key-code/key-code.component";
import { MarkdownEditorComponent } from "@views/markdown-editor/markdown-editor.component";
import { Md5EncDecComponent } from "@views/md5-enc-dec/md5-enc-dec.component";
import { PlistToTableComponent } from "@views/plist-to-table/plist-to-table.component";
import { Sha256EncDecComponent } from "@views/sha256-enc-dec/sha256-enc-dec.component";
import { UrlEncDecComponent } from "@views/url-enc-dec/url-enc-dec.component";
import { VirusTotalComponent } from "@views/virus-total/virus-total.component";
import { VisualDataOnChartComponent } from "@views/visual-data-on-chart/visual-data-on-chart.component";
import { WheelFortuneComponent } from "@views/wheel-fortune/wheel-fortune.component";
import { WordCounterComponent } from "@views/word-counter/word-counter.component";
import { XlsToJsonComponent } from "@views/xls-to-json/xls-to-json.component";
import { XlsToXmlComponent } from "@views/xls-to-xml/xls-to-xml.component";
import { XmlToJsonComponent } from "@views/xml-to-json/xml-to-json.component";
import { XmlToTableComponent } from "@views/xml-to-table/xml-to-table.component";
import { XmlToXlsComponent } from "@views/xml-to-xls/xml-to-xls.component";

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', title: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, title: 'Dashboard' },
  { path: 'about', component: AboutComponent, title: 'About' },
  { path: 'word_counter', component: WordCounterComponent, title: 'Word counter' },
  { path: 'url_enc_dec', component: UrlEncDecComponent, title: 'URL Encode/Decode' },
  { path: 'base64_enc_dec', component: Base64EncDecComponent, title: 'Base64 Encode/Decode' },
  { path: 'md5_enc_dec', component: Md5EncDecComponent, title: 'MD5 Encode/Decode' },
  { path: 'sha256_enc_dec', component: Sha256EncDecComponent, title: 'SHA256 Encode/Decode' },
  { path: 'virus_total', component: VirusTotalComponent, title: 'VirusTotal' },
  { path: 'color_pallete', component: ColorPalleteComponent, title: 'Colot Pallete' },
  { path: 'key_code', component: KeyCodeComponent, title: 'JS Key Code Event' },
  { path: 'array_visualizer', component: ArrayVisualizerComponent, title: 'Array Visualizer' },
  { path: 'visual_data_chart', component: VisualDataOnChartComponent, title: 'Visualization data on chart' },
  { path: 'wheel_fortune', component: WheelFortuneComponent, title: 'Wheel Fortune' },
  { path: 'csv_to_table', component: CsvToTableComponent, title: 'CSV visualizer in Table' },
  { path: 'json_to_table', component: JsonToTableComponent, title: 'JSON visualizer in Table' },
  { path: 'xml_to_table', component: XmlToTableComponent, title: 'XML visualizer in Table' },
  { path: 'plist_to_table', component: PlistToTableComponent, title: 'Plist Viewer' },
  { path: 'css_converter', component: CssConverterComponent, title: 'CSS Converter' },
  { path: 'md_editor', component: MarkdownEditorComponent, title: 'Markdown Editor' },
  { path: 'json_to_xml', component: JsonToXmlComponent, title: 'Convert JSON to XML' },
  { path: 'xml_to_json', component: XmlToJsonComponent, title: 'Convert XML to JSON' },
  { path: 'xls_to_json', component: XlsToJsonComponent, title: 'Convert XLS to JSON' },
  { path: 'json_to_xls', component: JsonToXlsComponent, title: 'Convert JSON to XLS' },
  { path: 'xls_to_xml', component: XlsToXmlComponent, title: 'Convert XLS to XML' },
  { path: 'xml_to_xls', component: XmlToXlsComponent, title: 'Convert XML to XLS' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];