import {Entity, model, property, hasMany} from '@loopback/repository';
import {Asignatura} from './asignatura.model';

@model()
export class ProgramaAcademico extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  nombrePrograma: string;

  @property({
    type: 'string',
    required: true,
  })
  codigoPrograma: string;

  @property({
    type: 'number',
    required: true,
  })
  semestres: number;

  @property({
    type: 'number',
    required: true,
  })
  creditos: number;

  @property({
    type: 'string',
    required: true,
  })
  nivelEducativo: string;

  @property({
    type: 'date',
    required: true,
  })
  fechaCreacion: string;

  @hasMany(() => Asignatura)
  asignaturas: Asignatura[];

  constructor(data?: Partial<ProgramaAcademico>) {
    super(data);
  }
}

export interface ProgramaAcademicoRelations {
  // describe navigational properties here
}

export type ProgramaAcademicoWithRelations = ProgramaAcademico & ProgramaAcademicoRelations;