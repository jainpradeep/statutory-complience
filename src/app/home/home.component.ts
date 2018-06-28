import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { first } from 'rxjs/operators';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { User } from '../_models';
import { UserService } from '../_services';
import { StatutoryClerance } from '../_services';
import {  FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';
import { Pipe, PipeTransform } from '@angular/core';
import { DEFAULT_INTERPOLATION_CONFIG } from '@angular/compiler';
import { formatDate } from '@angular/common';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
const now = new Date();
const URL = '/api/upload';

@Component({templateUrl: 'home.component.html',
styleUrls: ['home.component.css'],
providers: [StatutoryClerance]})
export class HomeComponent implements OnInit {
    stations: any = ["Manali", "Asanur", "Trichy", "Madurai", "Sans kari","Chittoor","Bangalore"];
    statutoryClearanceList:any = [];
    currentView = "formView"
    newStatutoryClearance:any = {
        name:"",
        station:"",
        expiryDate:null,
        reminderDate:null,
        firstResponsablePersonName : "",
        firstResponsablePersonEmail : "",
        firstReminderPerson:"",
        FirstReminderPersonEmail:"",
        secondReminderPerson:"",
        SecondReminderPersonEmail:"",
        email:"",
        progress:0,
        certificateUploaded: false
    }
    hideEdit:boolean = false;
    displayMonths = 2;
    navigation = 'select';
    showWeekNumbers = false;
    outsideDays = 'visible';    

  public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'file'});
 
  closeResult: string;
    constructor(private _statutoryClerance: StatutoryClerance, private chRef: ChangeDetectorRef, private modalService: NgbModal) {
       
    }
        
    showAddRow(){
        this.currentView = "formView";
    }

    saveStatutoryClearance(){
       if( this.currentView == "formView"){
        let $this = this;
        this.newStatutoryClearance.reminderDate = new Date(this.newStatutoryClearance.reminderDate.year,this.newStatutoryClearance.reminderDate.month, this.newStatutoryClearance.reminderDate.day);
        this.newStatutoryClearance.expiryDate = new Date(this.newStatutoryClearance.expiryDate.year,this.newStatutoryClearance.expiryDate.month, this.newStatutoryClearance.expiryDate.day);
        this._statutoryClerance.insertStatutoryClearence(this.newStatutoryClearance)
        .pipe(first())
        .subscribe(
            data => {
                    this.newStatutoryClearance.progress = 50;
                    this.newStatutoryClearance.cuurentView = "uploadView"
                    this.chRef.markForCheck();
                    this.getStatutoryClerance();
            },
            error => {
                console.log(error)
            });
        }
        else{
            this.saveEditStatutoryClearance();
        }
       }

    deleteStatutoryClearance(clearenceData:any){
        let $this = this;
        this._statutoryClerance.deleteStatutoryClearence(clearenceData)
        .pipe(first())
        .subscribe(
            data => {
                    this.chRef.markForCheck();
                    this.getStatutoryClerance();
            },
            error => {
                console.log(error)
            });
    }

    getStatutoryClerance(){
        this._statutoryClerance.getStatutoryClearanceData()        
        .pipe(first())
        .subscribe(
            data => {
                this.statutoryClearanceList = data;
                this.chRef.markForCheck();
            },
            error => {
                console.log(error)
            });
    }

    editStatutoryClearence(clearenceData:any){
        this.currentView = "editView";
        this.newStatutoryClearance = clearenceData;
        this.newStatutoryClearance.reminderDate = new Date(this.newStatutoryClearance.reminderDate);
        this.newStatutoryClearance.expiryDate = new Date(this.newStatutoryClearance.expiryDate);
    }

    uploadStatutoryClearenceCertificate(clearenceData:any){
        this.currentView = "uploadView"
    }

    saveEditStatutoryClearance(){        
        this._statutoryClerance.editStatutoryClearence(this.newStatutoryClearance)        
        .pipe(first())
        .subscribe(
            data => {
                this.getStatutoryClerance();
                this.chRef.markForCheck();
                this.hideEdit = false;
            },
            error => {
                console.log(error)
            });
    }

    sendReminderEmail(clearenceObj:any){        
        let reqJson:any = {to: [clearenceObj.firstResponsablePersonEmail,clearenceObj.SecondReminderPersonEmail,clearenceObj.FirstReminderPersonEmail],
                            clearenceData : clearenceObj
        }
        this._statutoryClerance.sendReminderEmail(reqJson)        
        .pipe(first())
        .subscribe(
            data => {
                console.log("it works")
            },
            error => {
                console.log(error)
            });
    }
    

    ngOnInit() {
        this.getStatutoryClerance()
        this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
        this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
             console.log('ImageUpload:uploaded:', item, status, response);
             let $this = this;
             setTimeout(function(){ 
                $this.newStatutoryClearance.progress = 100;
                $this.newStatutoryClearance.cuurentView = "formView";
             }, 3000);
         };
    }

    open(content:any) {
        this.modalService.open(content).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      }
    
      private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
          return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
          return 'by clicking on a backdrop';
        } else {
          return  `with: ${reason}`;
        }
      }
    

    ngOnDestroy() {

    }
    
}