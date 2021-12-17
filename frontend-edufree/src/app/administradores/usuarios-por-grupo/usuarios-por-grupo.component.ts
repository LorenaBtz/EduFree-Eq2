import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BackendService } from 'src/app/services/backend.service';
import Swal from 'sweetalert2';

interface EstudiantesPorGrupo {
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
  id: string;
  codigoGrupo: string;
  docenteId: string;
  asignaturaId: string;
  asignatura: any[];
}
@Component({
  selector: 'app-usuarios-por-grupo',
  templateUrl: './usuarios-por-grupo.component.html',
  styleUrls: ['./usuarios-por-grupo.component.scss']
})
export class UsuariosPorGrupoComponent implements OnInit {

  listaEstudiantesporGrupo: EstudiantesPorGrupo[] = [];
  listaRelacion: any[] = [];
  listaEstudiantes: Estudiante[] = [];
  listaGrupos: any[] = [];
  formEstudiantesPorGrupo: any;
  modoCrud = 'crear';
  idEstudianteAsignado!: '';

  constructor(
    private fb: FormBuilder,
    private backend: BackendService
  ) {
    this.formEstudiantesPorGrupo = this.fb.group({
      usuarioId: ['', Validators.required],
      grupoId: ['', Validators.required],
      calificacion: ['', Validators.required],
      fechaCreacion: ['', Validators.required]
    });
    this.getEstudiantesPorGrupo();
    this.getEstudiantes();
    this.getGrupos();
  }

  ngOnInit(): void {
  }

  getEstudiantesPorGrupo() {

    this.backend.getRequest('/usuarios-por-grupo').subscribe(
      {
        next: (data) => {
          console.log(data);
          this.listaEstudiantesporGrupo = data;

          const filter = { "include": [{ "relation": "grupos" }], "where": { "rol": "Estudiante" } };
          this.backend.getRequestFilter('usuarios', JSON.stringify(filter)).subscribe(
            {
              next: (data) => {
                console.log(data);
                this.listaRelacion = data;
              },
              error: (err) => {
                console.log(err);
              }
            }
          );
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          console.log(this.listaEstudiantesporGrupo);
        }
      }
    );
  }

  getGrupos() {
    const filter = { "include": [{"relation": "asignatura"}]};

    this.backend.getRequestFilter('grupos',JSON.stringify(filter)).subscribe(
      {
        next: (data) => {
          console.log(data);
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

  postEstudiantesPorGrupo() {
    const nuevoEstudiantePorGrupo = this.formEstudiantesPorGrupo.getRawValue();
    nuevoEstudiantePorGrupo['fechaCreacion'] = new Date();
    nuevoEstudiantePorGrupo['calificacion'] = 0;

    this.backend.postRequest(
      '/usuarios-por-grupo',
      JSON.stringify(nuevoEstudiantePorGrupo)
    ).subscribe(
      {
        next: () => {
          Swal.fire({
            title: `Estudiante agregado al grupo ${nuevoEstudiantePorGrupo.grupoId}`,
            text: `El estudiante ${nuevoEstudiantePorGrupo.usuarioId} ha sido relacionado al grupo ${nuevoEstudiantePorGrupo.grupoId} correctamente`,
            icon: 'success'
          });
        },
        error: () => {
          Swal.fire({
            title: 'Error',
            text: 'La relacion estudiante - grupo no ha sido creada',
            icon: 'error'
          });
        },
        complete: () => {
          this.getEstudiantesPorGrupo();
        }
      }
    );
  }

  actualizar(estudianteAsignado: any) {
    this.formEstudiantesPorGrupo.patchValue(estudianteAsignado);
    this.idEstudianteAsignado = estudianteAsignado.id;
    this.modoCrud = 'actualizar';
  }

  patchEstudiantesPorGrupo() {
    Swal.fire({
      title: '¿Está seguro?',
      text: "La Asignatura se actualizara y los datos anteriores no podrán ser recuperados",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#162440',
      cancelButtonColor: '#f25244',
      confirmButtonText: 'Modificar'
    }).then((result) => {
      if (result.isConfirmed) {
        const actualizarEstudiantePorGrupo = this.formEstudiantesPorGrupo.getRawValue();
        actualizarEstudiantePorGrupo['fechaCreacion'] = new Date();

        this.backend.patchRequest(
          '/usuarios-por-grupo',
          this.idEstudianteAsignado,
          actualizarEstudiantePorGrupo
        ).subscribe(
          {
            next: () => {
              Swal.fire({
                title: `Estudiante agregado al grupo ${actualizarEstudiantePorGrupo.grupoId}`,
                text: `El estudiante ${actualizarEstudiantePorGrupo.usuarioId} ha sido relacionado al grupo ${actualizarEstudiantePorGrupo.grupoId} correctamente`,
                icon: 'success'
              });
            },
            error: () => {
              Swal.fire({
                title: 'Error',
                text: 'La relacion estudiante - grupo no ha sido creada',
                icon: 'error'
              });
            },
            complete: () => {
              this.getEstudiantesPorGrupo();
            }
          }
        );
      }
    });
  }

  deleteEstudiantesPorGrupo(EstudiantesPorGrupo: any) {
    Swal.fire({
      title: '¿Está seguro?',
      text: "El estudiante se eliminara de la relacion",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#162440',
      cancelButtonColor: '#f25244',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.backend.deleteRequest(
          '/usuarios-por-grupo',
          EstudiantesPorGrupo.id
        ).subscribe(
          {
            next: () => {
              Swal.fire({
                title: `Estudiante eliminado del grupo ${EstudiantesPorGrupo.grupoId}`,
                text: `El estudiante ${EstudiantesPorGrupo.usuarioId} ha sido eliminado del grupo ${EstudiantesPorGrupo.grupoId} correctamente`,
                icon: 'success'
              });
            },
            error: () => {
              Swal.fire({
                title: 'Error',
                text: 'El estudiante no ha sido eliminado del grupo',
                icon: 'error'
              });
            },
            complete: () => {
              this.getEstudiantesPorGrupo();
            }
          }
        );
      }
    });
  }

  limpiarFormulario(){
    this.formEstudiantesPorGrupo.reset();
  }

}
