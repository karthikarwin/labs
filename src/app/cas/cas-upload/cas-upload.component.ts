import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PDFProgressData, PDFDocumentProxy, PDFSource } from 'ng2-pdf-viewer/';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CasService } from '@app/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cas-upload',
  templateUrl: './cas-upload.component.html',
  styleUrls: ['./cas-upload.component.css']
})
export class CasUploadComponent implements OnInit {
  passHide: Boolean = false;
  pdfPasswordBackup: any;

  class: string;
  showModal: Boolean = false;
  @ViewChild(PdfViewerComponent) private pdfComponent: PdfViewerComponent;
  user: any;
  myModal: string;
  pdfForm: FormGroup;
  file: any;
  pdfSrc: string | PDFSource | ArrayBuffer;
  error: any;
  page = 1;
  rotation = 0;
  zoom = 1.0;
  originalSize: Boolean = false;
  pdf: any;
  renderText: Boolean = true;
  progressData: PDFProgressData;
  isLoaded: Boolean = false;
  stickToPage = false;
  showAll: Boolean = true;
  autoresize: Boolean = true;
  fitToPage: Boolean = false;
  outline: any[];
  isOutlineShown: Boolean = false;
  shwUpldBtn: Boolean = false;
  loadingBank: Boolean = false;
  isError: Boolean = false;
  errorMessage: any;

  constructor(private router: Router, private fb: FormBuilder,
  private casService: CasService, private toastr: ToastrService) { }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('currentUser'));
    this.pdfForm = this.fb.group({
      pdfFile: ['', Validators.required],
      pdfPassword: ['', Validators.required]
    });
  }


  /**
   * Set custom path to pdf worker
   */
  setCustomWorkerPath() {
    (<any>window).PDFJS.workerSrc = '/lib/pdfjs-dist/build/pdf.worker.js';
  }

  incrementPage(amount: number) {
    this.page += amount;
  }

  incrementZoom(amount: number) {
    this.zoom += amount;
  }

  rotate(angle: number) {
    this.rotation += angle;
  }

  /**
   * Render PDF preview on selecting file
   */
  onFileSelected() {
    const $pdf: any = document.querySelector('#file');

    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.pdfSrc = e.target.result;
      };
      reader.readAsArrayBuffer($pdf.files[0]);
    }
  }

  /**
   * Get pdf information after it's loaded
   * @param pdf
   */
  afterLoadCompconste(pdf: PDFDocumentProxy) {
    this.pdf = pdf;
    this.isLoaded = true;

    this.loadOutline();
  }

  /**
   * Get outline
   */
  loadOutline() {
    this.pdf.getOutline().then((outline: any[]) => {
      this.outline = outline;
    });
  }

  /**
   * Handle error callback
   *
   * @param error
   */
  onError(error: any) {
    this.error = error; // set error
    const pdfPassword = this.pdfForm.get('pdfPassword').value;
    if (error.name === 'PasswordException') {
      if (pdfPassword === '') {
        alert('wrong password');
      }
      const password = pdfPassword;
      if (password) {
        this.error = null;
        this.pdfPasswordBackup = pdfPassword;
        this.pdfForm.get('pdfPassword').setValue('');
        this.setPassword(password);
        /* if (this.setPassword(password)) {
          this.pdfPassword = '';
          console.log('OK');
        } */
      }
    }
  }

  setPassword(password: string) {
    let newSrc;

    if (this.pdfSrc instanceof ArrayBuffer) {
      newSrc = { data: this.pdfSrc };
    } else if (typeof this.pdfSrc === 'string') {
      newSrc = { url: this.pdfSrc };
    } else {
      newSrc = { ...this.pdfSrc };
    }

    newSrc.password = password;

    this.pdfSrc = newSrc;
  }

  /**
   * Pdf loading progress callback
   * @param {PDFProgressData} progressData
   */
  onProgress(progressData: PDFProgressData) {
    // console.log(progressData);
    this.progressData = progressData;
    this.isLoaded = false;
    this.error = null; // clear error
  }

  getInt(value: number): number {
    return Math.round(value);
  }

  /**
   * Navigate to destination
   * @param destination
   */
  navigateTo(destination: any) {
    this.pdfComponent.pdfLinkService.navigateTo(destination);
  }

  /**
   * Scroll view
   */
  scrollToPage() {
    this.pdfComponent.pdfViewer.scrollPageIntoView({
      pageNumber: 3
    });
  }

  /**
   * Page rendered callback, which is called when a page is rendered (called multiple times)
   *
   * @param {CustomEvent}
   */

  setRightPassword() {
    this.pdfForm.get('pdfPassword').setValue(this.pdfPasswordBackup);
  }

  savePdf() {
    // console.log(e.value);
    this.loadingBank = true;
    const formData: FormData = new FormData();
    formData.append('file', this.file);
    formData.append('password', this.pdfPasswordBackup);
    console.log(this.pdfForm);
    this.casService.pdfImport(formData)
      .subscribe( (pdfRes: any) => {
        this.loadingBank = false;
        // console.log('statement', data);
        /* this.toastr.success('File Uploaded Successfully'); */
        if ( parseInt(pdfRes.statementType, 10) === 2 ) {
          this.showModal = true;
        } else if ( parseInt(pdfRes.statementType, 10) === 1 ) {
          this.toastr.success('Congrats!  We have updated your new transactions. Confirm your portfolio value to proceed further');
          sessionStorage.setItem('pdfData', JSON.stringify(pdfRes));
          this.router.navigateByUrl('/cas/cas-review');
        }
      }, err => {
        this.isError = true;
        this.errorMessage = err.error.message;
        this.toastr.error(this.errorMessage);
        this.loadingBank = false;
        /* this.toastr.error(err.error.message); */
      });
      /* this.router.navigateByUrl('/cas/cas-review'); */
  }

  onfileSelected(file) {
    this.pdfForm.get('pdfPassword').setValue('');
    // console.log(file);
    this.shwUpldBtn = false;
    this.file = file.target.files[0];
    const name = file.target.files[0].name;
    this.pdfForm.get('pdfFile').setValue(name);
    // console.log('File', this.file);
  }

  cancelAction() {
    this.showModal = false;
  }

  keyDownFunction(event) {
    if (event.keyCode === 13) {
      return false;
    }
  }

  check(e) {
    /* this.pdfPassword = this.pdfPasswordBackup;
    console.log(this.pdfPassword); */
    this.shwUpldBtn = true;
    // this.passHide = true;
  }
}
