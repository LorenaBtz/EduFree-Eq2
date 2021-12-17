import { Component, OnInit, TemplateRef  } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BackendService } from 'src/app/services/backend.service';
import Swal from 'sweetalert2';

interface Asignatura {
  nombreAsignatura: string;
  componente: string;
  cantidadCreditos: number;
  codigoAsignatura: string;
  programaAcademicoId: string;
  fechaCreacion: string;
}

interface Programa {
  id: string;
  nombrePrograma: string;
}

@Component({
  selector: 'app-administrador-asignaturas',
  templateUrl: './administrador-asignaturas.component.html',
  styleUrls: ['./administrador-asignaturas.component.scss']
})
export class AdministradorAsignaturasComponent implements OnInit {

  listaAsignaturas: Asignatura[] = [];
  listaProgramas: Programa[] = [];
  formAsignaturas: any;
  modoCrud = 'crear';
  idAsignatura!: '';

  constructor(
    private fb: FormBuilder,
    private backend: BackendService,
  ) {
    this.formAsignaturas = this.fb.group({
      nombreAsignatura: ['', Validators.required],
      componente: ['', Validators.required],
      cantidadCreditos: ['', Validators.required],
      codigoAsignatura: ['', Validators.required],
      programaAcademicoId: ['', Validators.required]
    });
    this.getAsignaturas();
    this.getProgramas();
  }

  ngOnInit(): void {
  }

  getAsignaturas() {
    this.backend.getRequest('/asignaturas').subscribe(
      {
        next: (data) => {
          this.listaAsignaturas = data;
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

  getProgramas() {
    this.backend.getRequest('/programas-academicos').subscribe({
      next: (data) => {
        this.listaProgramas = data;
      },
      error: (err) => {
      },
      complete: () => {
      },
    });
  }

  crear() {
    this.modoCrud = 'crear';
  }

  postAsignaturas() {
    const asignaturaNueva = this.formAsignaturas.getRawValue();
    asignaturaNueva['fechaCreacion'] = new Date();
    asignaturaNueva['cantidadCreditos'] = parseInt(asignaturaNueva['cantidadCreditos']);

    this.backend.postRequest(
      '/asignaturas',
      JSON.stringify(asignaturaNueva)
    ).subscribe(
      {
        next: () => {
          Swal.fire(
            'Asignatura creada',
            'La asignatura se ha creado correctamente',
            'success'
          );
        },
        error: (err) => {
          Swal.fire(
            'Error',
            `La asignatura ${asignaturaNueva.nombreAsignatura} no ha sido creada`,
            'error'
          );
        },
        complete: () => {
          this.getAsignaturas();
          this.limpiarFormulario();
        }
      }
    );
  }

  actualizar(asignatura: any): void {
    this.formAsignaturas.patchValue(asignatura)
    this.idAsignatura = asignatura.id;
    this.modoCrud = 'actualizar';
  }

  patchAsignaturas(): void {
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

        const asignaturaActualizada = this.formAsignaturas.getRawValue();
        asignaturaActualizada['cantidadCreditos'] = parseInt(asignaturaActualizada['cantidadCreditos']);

        this.backend.patchRequest(
          '/asignaturas',
          this.idAsignatura,
          asignaturaActualizada
        ).subscribe(
          {
            next: () => {
              Swal.fire(
                'Asignatura creada',
                'La asignatura se ha actualizado correctamente',
                'success'
              );
            },
            error: (err) => {
              Swal.fire(
                'Error',
                `La asignatura ${asignaturaActualizada.nombreAsignatura} no ha sido actualizada`,
                'error'
              );
            },
            complete: () => {
              this.getAsignaturas();
              this.limpiarFormulario();
            }
          }
        );
      }
    })
  }

  deleteAsignaturas(asignatura: any): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: "El programa se eliminará y no podrá ser recuperado",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#162440',
      cancelButtonColor: '#f25244',
      confirmButtonText: '¡Eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.backend.deleteRequest(
          '/asignaturas',
          asignatura.id
        ).subscribe(
          {
            next: () => {
              Swal.fire(
                '¡Eliminado!',
                `La asignatura ${asignatura.nombreAsignatura} - ${asignatura.codigoAsignatura} ha sido eliminado correctamente`,
                'success'
              );
            },
            error: (err) => {
              Swal.fire(
                '¡Eliminado!',
                `La asignatura ${asignatura.nombreAsignatura} - ${asignatura.codigoAsignatura} no ha sido eliminado`,
                'success'
              )
            },
            complete: () => {
              this.getAsignaturas();
            }
          }
        );
      }
    })
  }

  limpiarFormulario(): void {
    this.formAsignaturas.reset();
  }

}
