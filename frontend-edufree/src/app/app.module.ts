import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ProgramasComponent } from './programas/programas.component';
import { InscripcionesComponent } from './inscripciones/inscripciones.component';
import { MainFooterComponent } from './componentes/main-footer/main-footer.component';
import { MainNavbarComponent } from './componentes/main-navbar/main-navbar.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { UserNavbarComponent } from './componentes/user-navbar/user-navbar.component';
import { UserFooterComponent } from './componentes/user-footer/user-footer.component';
import { UserSidebarComponent } from './componentes/user-sidebar/user-sidebar.component';
import { AdministradorUsuariosComponent } from './administradores/administrador-usuarios/administrador-usuarios.component';
import { AdministradorProgramasComponent } from './administradores/administrador-programas/administrador-programas.component';
import { AdministradorAsignaturasComponent } from './administradores/administrador-asignaturas/administrador-asignaturas.component';
import { AdministradorCalificacionesComponent } from './administradores/administrador-calificaciones/administrador-calificaciones.component';
import { AdministradorGruposComponent } from './administradores/administrador-grupos/administrador-grupos.component';
import { IndexComponent } from './index/index.component';
import { UsuariosPorGrupoComponent } from './administradores/usuarios-por-grupo/usuarios-por-grupo.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProgramasComponent,
    InscripcionesComponent,
    MainLayoutComponent,
    MainFooterComponent,
    MainNavbarComponent,
    UserLayoutComponent,
    UserNavbarComponent,
    UserFooterComponent,
    UserSidebarComponent,
    AdministradorUsuariosComponent,
    AdministradorProgramasComponent,
    AdministradorAsignaturasComponent,
    AdministradorGruposComponent,
    AdministradorCalificacionesComponent,
    IndexComponent,
    UsuariosPorGrupoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    AppRoutingModule,
    NgxDatatableModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
