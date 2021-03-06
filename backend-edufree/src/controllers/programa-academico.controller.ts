import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {ProgramaAcademico} from '../models';
import {ProgramaAcademicoRepository} from '../repositories';

export class ProgramaAcademicoController {
  constructor(
    @repository(ProgramaAcademicoRepository)
    public programaAcademicoRepository : ProgramaAcademicoRepository,
  ) {}

  @post('/programas-academicos')
  @response(200, {
    description: 'ProgramaAcademico model instance',
    content: {'application/json': {schema: getModelSchemaRef(ProgramaAcademico)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProgramaAcademico, {
            title: 'NewProgramaAcademico',
            exclude: ['id'],
          }),
        },
      },
    })
    programaAcademico: Omit<ProgramaAcademico, 'id'>,
  ): Promise<ProgramaAcademico> {
    // console.log(JSON.stringify(programaAcademico));
    programaAcademico.fechaCreacion = new Date().toString();
    // console.log(JSON.stringify(programaAcademico));
    return this.programaAcademicoRepository.create(programaAcademico);
  }

  @get('/programas-academicos/count')
  @response(200, {
    description: 'ProgramaAcademico model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ProgramaAcademico) where?: Where<ProgramaAcademico>,
  ): Promise<Count> {
    return this.programaAcademicoRepository.count(where);
  }

  @get('/programas-academicos')
  @response(200, {
    description: 'Array of ProgramaAcademico model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ProgramaAcademico, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ProgramaAcademico) filter?: Filter<ProgramaAcademico>,
  ): Promise<ProgramaAcademico[]> {
    return this.programaAcademicoRepository.find(filter);
  }

  @patch('/programas-academicos')
  @response(200, {
    description: 'ProgramaAcademico PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProgramaAcademico, {partial: true}),
        },
      },
    })
    programaAcademico: ProgramaAcademico,
    @param.where(ProgramaAcademico) where?: Where<ProgramaAcademico>,
  ): Promise<Count> {
    return this.programaAcademicoRepository.updateAll(programaAcademico, where);
  }

  @get('/programas-academicos/{id}')
  @response(200, {
    description: 'ProgramaAcademico model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ProgramaAcademico, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(ProgramaAcademico, {exclude: 'where'}) filter?: FilterExcludingWhere<ProgramaAcademico>
  ): Promise<ProgramaAcademico> {
    return this.programaAcademicoRepository.findById(id, filter);
  }

  @patch('/programas-academicos/{id}')
  @response(204, {
    description: 'ProgramaAcademico PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProgramaAcademico, {partial: true}),
        },
      },
    })
    programaAcademico: ProgramaAcademico,
  ): Promise<void> {
    await this.programaAcademicoRepository.updateById(id, programaAcademico);
  }

  @put('/programas-academicos/{id}')
  @response(204, {
    description: 'ProgramaAcademico PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() programaAcademico: ProgramaAcademico,
  ): Promise<void> {
    await this.programaAcademicoRepository.replaceById(id, programaAcademico);
  }

  @del('/programas-academicos/{id}')
  @response(204, {
    description: 'ProgramaAcademico DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.programaAcademicoRepository.deleteById(id);
  }
}
