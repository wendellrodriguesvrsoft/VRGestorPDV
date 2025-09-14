import { BadRequestException, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuarios } from './entities/usuarios.entity';
import { UsuarioRede } from './entities/usuarios-rede.entity';
import { ResponseData } from '../shared/interfaces/helper.interface';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioRedeDto } from './dto/update-usuario-rede.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuarios)
    private usuariosRepository: Repository<Usuarios>,
    @InjectRepository(UsuarioRede)
    private usuarioRedeRepository: Repository<UsuarioRede>,
  ) {}

  async findAll(): Promise<ResponseData<Usuarios>> {
    const result = await this.usuariosRepository
      .createQueryBuilder('usuario')
      .select([
        'usuario.id AS id',
        'usuario.nome AS nome',
        'usuario.email AS email',
      ])
      .where('usuario.ativo = true')
      .orderBy('usuario.nome', 'ASC')
      .getRawMany();

    const count = await this.usuariosRepository
      .createQueryBuilder('usuario')
      .where('usuario.ativo = true')
      .orderBy('usuario.nome', 'ASC')
      .getCount();

    return { data: result, count, pageSize: count };
  }

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuarios> {
    const usuario = await this.findByEmail(createUsuarioDto.email);

    if (usuario) {
      const redeAlreadyRegistered = usuario.usuariosRede.some((usuarioRede) =>
        createUsuarioDto.usuariosRede.some(
          (usuarioRedeDto) => usuarioRede.idRede === usuarioRedeDto.idRede,
        ),
      );

      if (redeAlreadyRegistered) {
        throw new BadRequestException('Email já cadastrado');
      }

      if (
        createUsuarioDto.usuariosRede &&
        createUsuarioDto.usuariosRede.length > 0
      ) {
        const usuarioRedeRecords = createUsuarioDto.usuariosRede.map(
          (usuarioRedeDto) => {
            const usuarioRede = new UsuarioRede(usuarioRedeDto);
            usuarioRede.usuarios = usuario;
            return usuarioRede;
          },
        );

        await this.usuarioRedeRepository.save(usuarioRedeRecords);
      }

      const updatedUsuario = {
        ...createUsuarioDto,
        ...usuario,
        senha: usuario.senha,
      };

      delete (updatedUsuario as unknown as UpdateUsuarioDto).senha;

      const savedUsuario = await this.usuariosRepository.save(
        updatedUsuario as Usuarios,
      );

      return this.usuariosRepository.findOne({
        where: { id: savedUsuario.id },
        relations: ['usuariosRede'],
      });
    }

    const newUsuario = new Usuarios(createUsuarioDto);
    const created = await this.usuariosRepository.save(newUsuario);

    if (
      createUsuarioDto.usuariosRede &&
      createUsuarioDto.usuariosRede.length > 0
    ) {
      const usuarioRedeRecords = createUsuarioDto.usuariosRede.map(
        (usuarioRedeDto) => {
          const usuarioRede = new UsuarioRede(usuarioRedeDto);
          usuarioRede.usuarios = created;
          usuarioRede.idUsuario = created.id;
          return usuarioRede;
        },
      );

      await this.usuarioRedeRepository.save(usuarioRedeRecords);
    }

    return this.usuariosRepository.findOne({
      where: { id: created.id },
      relations: ['usuariosRede'],
    });
  }

  async findOne(id: number): Promise<Usuarios> {
    const usuario = await this.usuariosRepository
      .createQueryBuilder('usuario')
      .select([
        'usuario.id AS id',
        'usuario.nome AS nome',
        'usuario.email AS email',
      ])
      .where({ id })
      .andWhere('usuario.ativo = true')
      .getRawOne();

    if (!usuario) {
      throw new BadRequestException('Registro(s) não encontrado(s)!');
    }

    return usuario;
  }

  async findByEmail(email: string): Promise<Usuarios | null> {
    return this.usuariosRepository.findOne({
      where: { email },
      relations: ['usuariosRede'],
    });
  }

  async remove(id: number): Promise<Usuarios> {
    await this.usuariosRepository.update(id, { ativo: false });
    return this.findOne(id);
  }

  async update(
    id: number,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuarios> {
    const foundUsuario = await this.usuariosRepository.findOneOrFail({
      where: { id, ativo: true },
      relations: ['usuariosRede'],
    });

    if (updateUsuarioDto.email) {
      const usuario = await this.findByEmail(updateUsuarioDto.email);

      if (
        usuario &&
        usuario.email === updateUsuarioDto.email &&
        usuario.id !== foundUsuario.id
      ) {
        const redeAlreadyRegistered = usuario.usuariosRede.some(
          (usuariosRede) =>
            updateUsuarioDto.usuariosRede.some(
              (usuarioRedeDto) => usuariosRede.idRede === usuarioRedeDto.idRede,
            ),
        );

        if (redeAlreadyRegistered) {
          throw new BadRequestException('MENSAGENS.EMAIL-CADASTRADO');
        }
      }
    }

    const foundUsuarioRede = [...foundUsuario.usuariosRede];

    const filteredUsuarioRede = foundUsuarioRede.filter((usuarioRede) => {
      return !(updateUsuarioDto.usuariosRede as UpdateUsuarioRedeDto[]).some(
        (usuarioRedeDto) => {
          return usuarioRedeDto.id === usuarioRede.id;
        },
      );
    });

    const mergedUsuario = {
      ...foundUsuario,
      ...updateUsuarioDto,
      senha: foundUsuario.senha,
      usuariosRede: [
        ...(updateUsuarioDto.usuariosRede as UpdateUsuarioRedeDto[]),
        ...filteredUsuarioRede,
      ],
    };

    delete (mergedUsuario as UpdateUsuarioDto).senha;

    const usuario = await this.usuariosRepository.save(
      mergedUsuario as Usuarios,
    );

    return this.findOne(usuario.id);
  }
}
