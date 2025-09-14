import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableUsuariosRede1757875983468 implements MigrationInterface {
  name = 'AlterTableUsuariosRede1757875983468';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "usuariorede" RENAME TO "usuariosrede"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "usuariosrede" RENAME TO "usuariorede"`,
    );
  }
}
