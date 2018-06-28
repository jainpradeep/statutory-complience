import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class StatutoryClerance {
    constructor(private http: HttpClient) { 
     }
     insertStatutoryClearence(newStatutoryClearance:any) {
        return this.http.post<any>('http://localhost:3000/insertStatutoryClearence', newStatutoryClearance )
            .pipe(map(res => {
                if (res.msg = "success") {
                    console.log("httpCallsuccess")
                }
                return res;
            }));
    }
    getStatutoryClearanceData(){
        return this.http.post<any>('http://localhost:3000/getStatutoryClearence', {} )
        .pipe(map(res => {
            if (res.msg = "success") {
                return res;
            }
            return res;
        }));
    }

    deleteStatutoryClearence(statutoryClearanceObj:any){
        return this.http.post<any>('http://localhost:3000/deleteStatutoryClearence', statutoryClearanceObj )
        .pipe(map(res => {
            if (res.msg = "success") {
                return res;
            }
            return res;
        }));
    }
    
    editStatutoryClearence(statutoryClearanceObj:any){
        return this.http.post<any>('http://localhost:3000/editStatutoryClearence', statutoryClearanceObj )
        .pipe(map(res => {
            if (res.msg = "success") {
                return res;
            }
            return res;
        }));
    }

    sendReminderEmail(statutoryClearanceObj:any){
        return this.http.post<any>('http://localhost:3000/editStatutoryClearence', statutoryClearanceObj )
        .pipe(map(res => {
            if (res.msg = "success") {
                return res;
            }
            return res;
        }));
    }
}