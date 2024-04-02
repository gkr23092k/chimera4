import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore'; // Replace with appropriate version
import {  query, where } from '@angular/fire/firestore'; // Corrected import
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
}) 
export class FirebaseService {
  user: string | null;

  constructor(private firestore: AngularFirestore) {
    this.user = localStorage.getItem('g0r@usern@mechimera');

    // console.log(this.user,'from services')
   }

  getAllItems(): Observable<any[]> {
    return this.firestore.collection('items', ref => ref.where('Name', '==', this.user)).snapshotChanges();
  }

  addDocument(collectionName: string, data: any) {
    return this.firestore.collection(collectionName).add(data);
  }


  deletedatakey(data:any) {
    console.log('delete called')
    return this.firestore.doc('/items/'+data.id).delete()
  }


}
