import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BackendService } from 'src/app/services/backend.service';
import Swal from 'sweetalert2';
interface Calificacion {
  usuarioId: string;
  grupoId: string;
  calificacion: number;
  fechaCreacion: string;
}
interface Estudiante {
  id: string;
  nombresUsuario: string;
  apellidosUsuario: string;
  noIdentificacion: string;
  rol: string;
}
interface Grupo {
  codigoGrupo: string;
  docenteId: string;
}
@Component({
  selector: 'app-administrador-calificaciones',
  templateUrl: './administrador-calificaciones.component.html',
  styleUrls: ['./administrador-calificaciones.component.scss']
})
export class AdministradorCalificacionesComponent implements OnInit {

  listaCalificaciones: Calificacion[] = [];
  listaEstudiantes: Estudiante[] = [];
  listaGrupos: Grupo[] = [];
  formCalificaciones: any;
  modoCrud = 'crear';
  idCalificacion!: '';

  constructor(
    private fb :FormBuilder,
    private backend: BackendService
  ) {
    this.formCalificaciones = this.fb.group({
      usuarioId: ['', Validators.required],
      grupoId: ['', Validators.required],
      calificacion: ['', Validators.required],
      fechaCreacion: ['', Validators.required]
    });
    this.getCalificaciones();
    this.getGrupos();
    this.getEstudiantes();

  }


  ngOnInit(): void {
  }

  getCalificaciones() {
    this.backend.getRequest('/usuarios-por-grupo').subscribe(
      {
        next: (data) => {
          this.listaGrupos = data;
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          console.log('Completado');
        }
      }
    );
  }

  getGrupos() {
    this.backend.getRequest('/grupos').subscribe(
      {
        next: (data) => {
          this.listaGrupos = data;
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          console.log('Completado');
        }
      }
    );
  }

  getEstudiantes() {
    const filter = { "where": { "rol": "Estudiante" } };

    this.backend.getRequestFilter('usuarios', JSON.stringify(filter)).subscribe(
      {
        next: (data) => {
          this.listaEstudiantes = data;
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          console.log('Completado');
        }
      }
    );
  }

  crear() {
    this.modoCrud = 'crear';
  }

  postCalificacion() {
    const notaNueva = this.formCalificaciones.getRawValue();
    notaNueva['fechaCreacion'] = new Date();
    notaNueva['capacidadEstudiantes'] = parseInt(notaNueva['capacidadEstudiantes']);

    this.backend.postRequest(
      '/usuarios-por-grupo',
      JSON.stringify(notaNueva)
    ).subscribe(
      {
        next: (data) => {
          Swal.fire({
            title: 'Grupo creado',
            text: 'El grupo ha sido creado correctamente',
            icon: 'success'
          });
        },
        error: (err) => {
          Swal.fire({
            title: 'Error',
            text: 'El grupo no ha sido creado',
            icon: 'error'
          });
        },
        complete: () => {
          this.getGrupos();
        }
      }
    );
  }
  isFormVisible = false;
  
  toggleIsFormVisible() {
    this.isFormVisible = !this.isFormVisible;
  }

}
