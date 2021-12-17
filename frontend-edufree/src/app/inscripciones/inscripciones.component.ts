import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';

interface Programa {
  nombrePrograma: string,
}

@Component({
  selector: 'app-inscripciones',
  templateUrl: './inscripciones.component.html',
  styleUrls: ['./inscripciones.component.scss']
})
export class InscripcionesComponent implements OnInit {
  listaProgramas: Programa[] = [];

  constructor(private backend: BackendService) {
    this.backend.getRequest('/programas-academicos').subscribe(
      {
        next: (data) => {
         // alert(data+"Datos Obtenidos correctamente");
          this.listaProgramas = data;
        },
        error: (err) => {
          //alert(err);
        },
        complete: () => {
         // alert("Completado");
        }
      }
    );
  }

  ngOnInit(): void {
  }

}
