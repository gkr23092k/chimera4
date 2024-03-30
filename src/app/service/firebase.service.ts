import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore'; // Replace with appropriate version
import {  query, where } from '@angular/fire/firestore'; // Corrected import
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
}) 
export class FirebaseService {

  constructor(private firestore: AngularFirestore) { }

  getAllItems(): Observable<any[]> {
    return this.firestore.collection('items').snapshotChanges();
  }

  addDocument(collectionName: string, data: any) {
    return this.firestore.collection(collectionName).add(data);
  }


  deletedatakey(data:any) {
    console.log('delete called')
    return this.firestore.doc('/items/'+data.id).delete()
  }


}
