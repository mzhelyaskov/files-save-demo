import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as FileSaver from 'file-saver';

class Terminal {

  private cache: string;

  constructor(private terminal: ElementRef,
              private http: HttpClient) {
    this.cache = '';
  }

  log(str: string): void {
    const logString = `${str}\n`;
    this.cache += logString;
    const textNode = document.createTextNode(logString);
    this.terminal.nativeElement.appendChild(textNode);
  }

  flash(str: string = '') {
    this.log(str);
    const terminalLog = this.cache + str;
    this.http.post('/log', {terminalLog}).subscribe(() => {
      this.cache = '';
    });
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private terminal: Terminal;

  public title = 'demo-app';

  @ViewChild('console', {static: true}) console: ElementRef;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.terminal = new Terminal(this.console, this.http);
  }

  downloadFileSaver(octetStream: string) {
    this.terminal.log('//--- FileSaver');
    const params = new HttpParams().append('octetStream', octetStream);
    this.http.get('download', {params, observe: 'response', responseType: 'arraybuffer'}).subscribe(response => {
      const filename = this.getFilenameFromResponse(response);
      const contentType = this.getContentTypeFromResponse(response);
      const blob = new Blob([response.body], {type: contentType});
      FileSaver.saveAs(blob, filename);
      this.terminal.log(`filename: ${filename}`);
      this.terminal.log(`Content-Type: ${contentType}`);
      this.terminal.flash();
    });
  }

  downloadAncoreDownloadAttribute(octetStream: string) {
    this.terminal.log('//--- AncoreDownloadAttribute');
    const params = new HttpParams().append('octetStream', octetStream);
    this.http.get('download', {params, observe: 'response', responseType: 'arraybuffer'}).subscribe(response => {
      const filename = this.getFilenameFromResponse(response);
      const contentType = this.getContentTypeFromResponse(response);
      this.terminal.log(`filename: ${filename}`);
      this.terminal.log(`Content-Type: ${contentType}`);
      const blob = new Blob([response.body], {type: contentType});
      if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, filename);
      } else {
        const url = window.URL.createObjectURL(blob);
        const downloadLink: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
        downloadLink.style.display = 'none';
        downloadLink.href = url;
        downloadLink.download = filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        setTimeout(() => {
          document.body.removeChild(downloadLink);
          window.URL.revokeObjectURL(url);
          this.terminal.flash();
        }, 500);
      }
    });
  }

  downloadAncoreDownloadAttributeWithTarget(octetStream: string) {
    this.terminal.log('//--- AncoreDownloadAttributeWithTarget');
    const params = new HttpParams().append('octetStream', octetStream);
    this.http.get('download', {params, observe: 'response', responseType: 'arraybuffer'}).subscribe(response => {
      const filename = this.getFilenameFromResponse(response);
      const contentType = this.getContentTypeFromResponse(response);
      const blob = new Blob([response.body], {type: contentType});
      if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, filename);
      } else {
        const URL = window.URL || window.webkitURL;
        const url = URL.createObjectURL(blob);
        const downloadLink: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
        downloadLink.style.display = 'none';
        downloadLink.href = url;
        downloadLink.download = filename;
        downloadLink.target = '_blank';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        setTimeout(() => {
          document.body.removeChild(downloadLink);
          window.URL.revokeObjectURL(url);
          this.terminal.log(`filename: ${filename}`);
          this.terminal.log(`Content-Type: ${contentType}`);
          this.terminal.flash();
        }, 500);
      }
    });
  }

  downloadWindowsLocationHref(octetStream: string) {
    this.terminal.log('//--- WindowsLocationHref');
    const params = new HttpParams().append('octetStream', octetStream);
    this.http.get('download', {params, observe: 'response', responseType: 'arraybuffer'}).subscribe(response => {
      const filename = this.getFilenameFromResponse(response);
      const contentType = this.getContentTypeFromResponse(response);
      const blob = new Blob([response.body], {type: contentType});
      const URL = window.URL || window.webkitURL;
      const downloadUrl = URL.createObjectURL(blob);
      window.location.href = downloadUrl;
      setTimeout(() => {
        URL.revokeObjectURL(downloadUrl);
        this.terminal.log(`filename: ${filename}`);
        this.terminal.log(`Content-Type: ${contentType}`);
        this.terminal.flash();
      }, 500);
    });
  }

  downloadWindowsOpen(octetStream: string) {
    this.terminal.log('//--- WindowsOpen');
    const params = new HttpParams().append('octetStream', octetStream);
    this.http.get('download', {params, observe: 'response', responseType: 'arraybuffer'}).subscribe(response => {
      const filename = this.getFilenameFromResponse(response);
      const contentType = this.getContentTypeFromResponse(response);
      const blob = new Blob([response.body], {type: contentType});
      const URL = window.URL || window.webkitURL;
      const downloadUrl = URL.createObjectURL(blob);
      window.open(downloadUrl);
      setTimeout(() => {
        URL.revokeObjectURL(downloadUrl);
        this.terminal.log(`filename: ${filename}`);
        this.terminal.log(`Content-Type: ${contentType}`);
        this.terminal.flash();
      }, 500);
    });
  }

  downloadWindowSaveAs(octetStream: string) {
    this.terminal.log('//--- WindowSaveAs (FS)');
    const params = new HttpParams().append('octetStream', octetStream);
    this.http.get('download', {params, observe: 'response', responseType: 'arraybuffer'}).subscribe(response => {
      const filename = this.getFilenameFromResponse(response);
      const contentType = this.getContentTypeFromResponse(response);
      const blob = new Blob([response.body], {type: contentType});
      (window as any).saveAs(blob, filename);
      this.terminal.log(`filename: ${filename}`);
      this.terminal.log(`Content-Type: ${contentType}`);
      this.terminal.flash();
    });
  }

  downloadAsyncOpen(octetStream: string) {
    const params = new HttpParams().append('octetStream', octetStream);
    this.http.get('download', {params, observe: 'response', responseType: 'arraybuffer'}).subscribe(response => {
      const filename = this.getFilenameFromResponse(response);
      const contentType = this.getContentTypeFromResponse(response);
      const blob = new Blob([response.body], {type: contentType});
      const URL = window.URL || window.webkitURL;
      const downloadUrl = URL.createObjectURL(blob);
      const newWindow = window.open(downloadUrl, '_blank');
      setTimeout(() => {
        newWindow.document.title = filename;
      }, 10);
    });
  }

  private getFilenameFromResponse(response: HttpResponse<any>) {
    const filename = '';
    const disposition = response.headers.get('Content-Disposition');
    if (disposition && disposition.indexOf('attachment') !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) {
        return matches[1].replace(/['"]/g, '');
      }
    }
    return filename;
  }

  private getContentTypeFromResponse(response: HttpResponse<any>) {
    return response.headers.get('Content-Type');
  }
}
