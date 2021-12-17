import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BackendService } from 'src/app/services/backend.service';
import Swal from 'sweetalert2';
import { NgbModalConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule  } from '@swimlane/ngx-datatable';

interface Grupo {
  id: string;
  codigoGrupo: string;
  capacidadEstudiantes: number;
  docenteId: string;
  asignaturaId: string;
  fechaCreacion: string;
}

interface Asignatura {
  id: string;
  nombreAsignatura: string;
  codigoAsignatura: string;
}

interface Docente {
  id: string;
  nombresUsuario: string;
  apellidosUsuario: string;
  noIdentificacion: string;
  rol: string;
}
@Component({
  selector: 'app-administrador-grupos',
  templateUrl: './administrador-grupos.component.html',
  styleUrls: ['./administrador-grupos.component.scss']
})
export class AdministradorGruposComponent implements OnInit {

  listaGrupos: Grupo[] = [];
  listaAsignaturas: Asignatura[] = [];
  listaDocentes: Docente[] = [];
  formGrupos: any;
  modoCrud = 'crear';
  idGrupo!: '';

  constructor(
    private fb: FormBuilder,
    private backend: BackendService,
    config: NgbModalConfig,
    private modalService: NgbModal
  ) {
    this.formGrupos = this.fb.group({
      codigoGrupo: ['', Validators.required],
      capacidadEstudiantes: ['', Validators.required],
      docenteId: ['', Validators.required],
      asignaturaId: ['', Validators.required]
    });
    this.getGrupos();
    this.getAsignaturas();
    this.getDocentes();
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
  }

  /** @title CRUD functions */
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

  getDocentes() {
    const filter = { "where": { "rol": "Docente" } };

    this.backend.getRequestFilter('usuarios', JSON.stringify(filter)).subscribe(
      {
        next: (data) => {
          this.listaDocentes = data;
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

  postGrupo() {
    const grupoNuevo = this.formGrupos.getRawValue();
    grupoNuevo['fechaCreacion'] = new Date();
    grupoNuevo['capacidadEstudiantes'] = parseInt(grupoNuevo['capacidadEstudiantes']);

    this.backend.postRequest(
      '/grupos',
      JSON.stringify(grupoNuevo)
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
          this.limpiarFormulario();
        }
      }
    );
  }

  actualizar(grupo: any): void {
    this.formGrupos.patchValue(grupo)
    this.idGrupo = grupo.id;
    this.modoCrud = 'actualizar';
  }

  patchGrupo() {
    Swal.fire({
      title: '¿Está seguro?',
      text: "El grupo se actualizara y los datos anteriores no podrán ser recuperados",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#162440',
      cancelButtonColor: '#f25244',
      confirmButtonText: 'Modificar'
    }).then((result) => {
      if (result.isConfirmed) {
        const grupoActualizado = this.formGrupos.getRawValue();

        grupoActualizado['fechaCreacion'] = new Date();
        grupoActualizado['capacidadEstudiantes'] = parseInt(grupoActualizado['capacidadEstudiantes']);

        this.backend.patchRequest(
          '/grupos',
          this.idGrupo,
          grupoActualizado
        ).subscribe(
          {
            next: () => {
              Swal.fire(
                'Grupo actualizado',
                `El grupo ${grupoActualizado.codigoGrupo} ha sido actualizado correctamente`,
                'success'
              );
            },
            error: (err) => {
              Swal.fire(
                'Grupo actualizado',
                `El grupo ${grupoActualizado.codigoGrupo} no ha sido actualizado`,
                'error'
              );
            },
            complete: () => {
              this.getGrupos();
              this.limpiarFormulario();
            }
          }
        );
      }
    });
  }

  deleteGrupo(grupo: any): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: "El grupo se eliminará y no podrá ser recuperado",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#162440',
      cancelButtonColor: '#f25244',
      confirmButtonText: '¡Eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.backend.deleteRequest(
          '/grupos',
          grupo.id
        ).subscribe(
          {
            next: () => {
              Swal.fire(
                '¡Eliminado!',
                `El grupo ${grupo.codigoGrupo} - ${grupo.docenteId} ha sido eliminado correctamente`,
                'success'
              );
            },
            error: (err) => {
              Swal.fire(
                '¡Eliminado!',
                `El grupo ${grupo.codigoGrupo} - ${grupo.docenteId} no ha sido eliminado`,
                'error'
              );
            },
            complete: () => {
              this.getGrupos()
            }
          }
        );
      }
    })
  }

  limpiarFormulario(): void {
    this.formGrupos.reset();
  }

  /** @title Modal functions */
  closeResult: string = "";

  openModalId(content: any) {
    this.idGrupo;
    this.open(content);
  }

  open(content: any) {
    this.modalService.open(
      content,
      {
        ariaLabelledBy: 'modal-basic-title',
        size: 'xl',
        centered: true,
        scrollable: true
      }
    ).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  /**@title Table [ngxDatatable] */
  columns: any[] = [
    { prop: 'codigoGrupo', name: 'Código' },
    { prop: 'docenteId', name: 'Docente' },
    { prop: 'fechaCreacion', name: 'Fecha de creación' },
    { prop: 'capacidadEstudiantes', name: 'Capacidad de estudiantes' },
    { prop: 'acciones', name: 'Acciones' }
  ];

  rows: any[] = [];
  

}
