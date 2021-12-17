import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';

interface Programa {
  nombrePrograma: string,
  nivelAcademico: string,
  modalidad: string,
  cantidadSemestres: string,
  cantidadCreditos: number,
  costo: string,
  imagen: string,
  descripcion: string
}

@Component({
  selector: 'app-programas',
  templateUrl: './programas.component.html',
  styleUrls: ['./programas.component.scss']
})
export class ProgramasComponent implements OnInit {

  listaProgramas: Programa[] = [];

  constructor(private backend: BackendService) { 
    this.backend.getRequest('/programas-academicos').subscribe(
      {
        next: (data) => {
          //alert(data+"Datos Obtenidos correctamente");
          this.listaProgramas = data;
        },
        error: (err) => {
          //alert(err);
        },
        complete: () => {
          //alert("Completado");
        }
      }
    );
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
