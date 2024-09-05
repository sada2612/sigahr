import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { Client } from 'src/app/common/datatypes/DataTypes';
import { Api } from 'src/app/common/enum/enum';
import { AlertService } from 'src/app/common/service/alert/alert.service';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import { clientFields } from 'src/app/common/constantss/const';
import { FormComponent } from '../../../common/component/form/form.component';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [SharedModule, CommonModule, FormComponent],
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export default class ClientComponent {
  @ViewChild('clientModal') clientModalRef!: ElementRef;
  clients: Client[] = [];
  active: any;
  selectedClient: Client | null = null;
  clientFields = clientFields;
  private clientModal: any;

  constructor(
    private apiService: ApiService,
    private alertService: AlertService
  ) {
    this.getAllClient();
  }
  ngAfterViewInit() {
    if (typeof (window as any).bootstrap !== 'undefined') {
      this.clientModal = new (window as any).bootstrap.Modal(this.clientModalRef.nativeElement);
    } else {
      console.error('Bootstrap JavaScript is not loaded.');
    }
  }
  getAllClient() {
    this.apiService.getAll(Api.Client).subscribe((data) => {
      this.clients = data;
    });
  }

  async updateClient(client) {
    this.apiService.update(Api.Client, client).subscribe(async (data) => {
      if (data.IsValid) {
        this.getAllClient()
        this.closeModel()
      }
    });
  }
  async addClient(client) {
    this.apiService.post(Api.Client, client).subscribe(async (data) => {
      if (data.IsValid) {
        this.getAllClient()
        this.closeModel()
      }
    });
  }
  closeModel() {
    this.clientModal.hide();
    this.selectedClient = null;
  }
  openModal(client?: Client) {
    this.selectedClient = client ? { ...client } : new Client();
    this.clientModal.show();
  }
  onClientSaved(client?: Client) {

    if (client.ClientId) {
      this.updateClient(client);
    } else {
      this.addClient(client);
    }
  }
}
