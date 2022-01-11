import { FormControl, FormGroup } from '@angular/forms';
import { Component, AfterViewInit, ElementRef, ViewChild,ViewChildren,QueryList} from '@angular/core';
import { Web3Service } from './services/web3.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('scrollframe',{static:false}) private scrollFrame!: ElementRef;
  @ViewChildren('item') itemElements!: QueryList<any>;

  private scrollContainer: any;

  title = 'Ejemplo Ethereum';
  msgEstado = 'No Conectado.';
  estado = false;
  count = 0;
  resultado = '';
  balanceOf = '';
  numerosumados=0;
  aprobacion='';
  puntosapprove = 0;
  resultTransferencia='';
  proceso='';
  descuento='';
  totalx=0;
  name='';
  decimales=0;
  simbolo='';

  blockHash = '';
  blockNumber = '';
  from = '';
  transactionHash = '';

  elementos: any = [];
  elementosClient: any = [];



  cabeceras = ['Transaction Hash', 'Block Number','Valor'];



  constructor(public web3s: Web3Service){}

  consulta = new FormGroup({
   addressConsulta: new FormControl('')
   });

  sumaform = new FormGroup({
    num1: new FormControl(''),
    num2: new FormControl('')
    });

  transform = new FormGroup({
    cuenta: new FormControl(''),
    nump: new FormControl('')
    });

 regresarform = new FormGroup({
    puntosnum: new FormControl('')
    });

 transferircuentaacuenta = new FormGroup({
    origen: new FormControl(''),
    destino: new FormControl(''),
    canti: new FormControl('')
    });
  
 approveForm = new FormGroup({
    cuentaprrove: new FormControl(''),
    cantiapprove: new FormControl('')
    });

    consultapproveForm = new FormGroup({
    propietario: new FormControl(''),
    cuentaaprrove: new FormControl('')
    });

  async getBalanceByAccount(accountAddress: any): Promise<any> {
    return await this.web3s.contrato.methods.balanceOf(accountAddress).call();
  }
  

  async Balance(): Promise<void> {
    const addressDapp =  this.consulta.get('addressConsulta')?.value;
    console.log(addressDapp);
    const accountBalance = await this.getBalanceByAccount(addressDapp);
    console.log(`accountBalance => ${accountBalance}`);
    this.balanceOf = accountBalance;
  }

  async suma(accountAddress: any, accounadres2: any): Promise<any> {
    return await this.web3s.contrato.methods.safeAdd(accountAddress,accounadres2).call();
  }

  async detalles(): Promise<any>{
    const contrato = '0x80A5B39B1e87E4bf20706D61Cb42fE90e3d15E58'
    const a = await this.web3s.contrato.methods.totalSupply().call();
    this.totalx=a;
    const b = await this.web3s.contrato.methods.name().call();
    this.name=b;
    const d = await this.web3s.contrato.methods.symbol().call();
    this.simbolo=d;
    const c = await this.web3s.contrato.methods.decimals().call();
    this.decimales=c;

  }

  async sumarnum(): Promise<void> {
    const addressDapp1 =  this.sumaform.get('num1')?.value;
    const addressDapp2 =  this.sumaform.get('num2')?.value;
    const balance = await this.suma(addressDapp1,addressDapp2);
    this.numerosumados = balance;
  }

  async transferir(): Promise<void> {
    const address1 =  this.transform.get('cuenta')?.value;
    const numsgc =  this.transform.get('nump')?.value;
    
    this.web3s.contrato.methods.transfer(address1, numsgc).send({from: this.web3s.accounts[0]})

    .then((response:any) => {
      this.resultado = "Transacción exitosa";
      this.blockHash = response.blockHash;
      this.blockNumber = response.blockNumber;
      this.from = response.from;
      this.transactionHash = response.transactionHash;
      this.web3s.contrato.methods.approve(address1, numsgc).send({from: this.web3s.accounts[0]})
   })

   .catch((error: any) => {
      console.log(error);
      this.resultado = "Error";
   });
  }

  getBalance(): void {
    this.web3s.contrato.methods.balanceOf(this.web3s.accounts[0])
    .call()
    .then((response: any) => {
      this.balanceOf = response;
    });
  }

  async transferirfrom(): Promise<void> {
    const origen = this.transferircuentaacuenta.get('origen')?.value;
    const destino = this.transferircuentaacuenta.get('destino')?.value;
    const canti = this.transferircuentaacuenta.get('canti')?.value;

    this.web3s.contrato.methods.transferFrom(origen, destino ,canti).send({from: this.web3s.accounts[0]})
    
    .then((response:any) => {
      this.proceso = "Transacción exitosa";
      this.blockHash = response.blockHash;
      this.blockNumber = response.blockNumber;
      this.from = response.from;
      this.transactionHash = response.transactionHash;
      this.getBalance();
   })
   .catch((error: any) => {
      console.log(error);
      this.proceso = "Error";
   });
  }

  async getAllowance(accountPropietario: any, accountAprovada: any): Promise<any> {
    return await this.web3s.contrato.methods.allowance(accountPropietario, accountAprovada).call();
  }

  async consultarAprovacion(): Promise<void> {
    const prop =  this.consultapproveForm.get('propietario')?.value;
    const aprob =  this.consultapproveForm.get('cuentaaprrove')?.value;
    const puntosaprob = await this.getAllowance(prop, aprob);
    console.log(puntosaprob);
    this.puntosapprove = puntosaprob;
  }

  async gastar(): Promise<void> {
    const cuent1 =  '0x80A5B39B1e87E4bf20706D61Cb42fE90e3d15E58';
    const puntosnums =  this.regresarform.get('puntosnum')?.value;
    
    this.web3s.contrato.methods.transfer(cuent1, puntosnums).send({from: this.web3s.accounts[0]})

    .then((response:any) => {
      this.descuento = "Descuento Exitoso";
      this.blockHash = response.blockHash;
      this.blockNumber = response.blockNumber;
      this.from = response.from;
      this.transactionHash = response.transactionHash;
      this.web3s.contrato.methods.approve(cuent1, puntosnums).send({from: this.web3s.accounts[0]})
   })

   .catch((error: any) => {
      console.log(error);
      this.descuento = "Error no se aplico el descuento :(";
   });
  }

  async approvepuntos(): Promise<void> {
    const cuentaprov = this.approveForm.get('cuentaprrove')?.value;
    const cantiaprov = this.approveForm.get('cantiapprove')?.value;

    console.log(cuentaprov);
    console.log(cantiaprov);

    this.web3s.contrato.methods.approve(cuentaprov,cantiaprov).send({from: this.web3s.accounts[0]})
    .then((response:any) => {
      this.aprobacion = "Aprobacion exitosa";
      this.blockHash = response.blockHash;
      this.blockNumber = response.blockNumber;
      this.from = response.from;
      this.transactionHash = response.transactionHash;
      this.getBalance();
   })
   .catch((error: any) => {
      console.log(error);
      this.aprobacion = "Aprobacion denegada";
   });
  }

  ngAfterViewInit(): void {
    this.conectar();
    this.scrollContainer = this.scrollFrame.nativeElement;
    //this.elementos.changes.subscribe(() => this.onElementosChanged());
  }

  private onElementosChanged(): void {
    this.scrollToBottom();
  }

  conectar():void {
    this.web3s.connectAccount().then((r)=>{
      this.msgEstado = "Conectado.";
      this.estado = true;
      this.subscribeToEvents();
    });
  }

  getCount(): void {
    this.web3s.contrato.methods.getCount().call().then((response: any) => {
                                                        this.count = response;
                                                       });
  }

  borrar(): void {
    this.blockHash = "";
    this.blockNumber = "";
    this.from = "";
    this.transactionHash = "";
  }

  increment(): void {
    this.web3s.contrato.methods.increment().send({from: this.web3s.accounts[0]})
                                           .then((response:any) => {
                                              this.resultado = "Transacción realizada!";

                                              this.blockHash = response.blockHash;
                                              this.blockNumber = response.blockNumber;
                                              this.from = response.from;
                                              this.transactionHash = response.transactionHash;
                                           })
                                           .catch((error: any) => {
                                              console.log(error);
                                              this.resultado = "Error en la transacción!";
                                           });
  }

  subscribeToEvents() {
    // Subscribe to pending transactions
    const self = this;
    this.web3s.contrato.events.ValueChanged({
                                              fromBlock: 0
                                            },
                                            (error: any, event: any) => {
                                              if (!error){
                                                // setInterval(() => {
                                                  this.elementos.push(
                                                    { blockHash: event.blockHash,
                                                      transactionHash: event.transactionHash,
                                                      blockNumber:event.blockNumber,
                                                      valor: event.returnValues.newValue
                                                    }
                                                  );
                                                // }, 500);
                                              }
                                            });

  }

  scrollToBottom() {
    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }
}
