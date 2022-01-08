import { Component } from '@angular/core';
import { PrivateKey, PublicKey } from "../../../../RSA-Module";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as bc from 'bigint-conversion';
import { AlertController } from '@ionic/angular';
import { PublicKeyService } from '../services/public-key.service';
import { PublicKeyModel } from '../models/publicKey';
import { DataModel } from '../models/dataEncrypted';
import { DataEncryptedService } from '../services/data-encrypted.service';
import { Console } from 'console';
import { PrivateKeyModel } from '../models/privateKey';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  signForm: FormGroup;
  sub = false;
  data:any;
  x:any;
  response: String[];
  response2: DataModel[];
  resultados: String[];
  resultado:any;
  n:any;
  d:any

  publicKeys: PublicKeyModel[];
  privateKey: PrivateKeyModel[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public alertController: AlertController,
    private formBuilder: FormBuilder,
    public publicKeyService: PublicKeyService,
    public privateKeyService: PublicKeyService,
    public dataEncryptedService: DataEncryptedService,
  ) {}

  get formControls2() { return this.signForm.controls; }

  ngOnInit() {

    let password = localStorage.getItem('password');

    this.publicKeyService.getUser(password).subscribe((response) => {
      this.resultado = response;

      this.d = bc.base64ToBigint(this.resultado[0].privateKey[0].d)
      this.n = bc.base64ToBigint(this.resultado[0].publicKey[0].n)
      let e = bc.base64ToBigint("AQAB");
      const publicKey = new PublicKey(e, this.n);
      const privateKey = new PrivateKey(this.d, publicKey);


      this.dataEncryptedService.getData2(password).subscribe((response2) => {
        this.response2 = response2; 

        for(let i =0; i<this.response2.length;i++){
          const publicKey2 = new PublicKey(e, bc.base64ToBigint(response2[i].keyA));
          const y = publicKey2.verify(bc.base64ToBigint(this.response2[i].data));
          this.response2[i].data = bc.bigintToText(y);
        }

      });

      this.dataEncryptedService.getAmount(password).subscribe((response) => {
        this.response = response; 
      });



    });  

    this.signForm = this.formBuilder.group({
      text2: ['', Validators.required], key2: ['', Validators.required]
  });
  }

  refresh(){
    window.location.reload();
  }
   
  submitSign() {

    this.sub = true;

    if (this.signForm.invalid) {
      return;
    }  

    let text = this.formControls2.text2.value;
    let keyB = this.formControls2.key2.value;
    let keyA = bc.bigintToBase64(this.n);
    let e = bc.base64ToBigint("AQAB");
    const publicKey = new PublicKey(e, this.n);
    const privateKey = new PrivateKey(this.d, publicKey);
    console.log(privateKey);
    console.log(text);
    const y = privateKey.sign(bc.textToBigint(text));
    let s = bc.bigintToBase64(y);
    console.log(s);

    this.dataEncryptedService.postData2(s, keyA, keyB).subscribe((response) => {
      this.signForm.reset();
    });

  }

}
