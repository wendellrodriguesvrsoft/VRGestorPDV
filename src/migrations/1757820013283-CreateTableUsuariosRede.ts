import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableUsuariosRede1757820013283
  implements MigrationInterface
{
  name = 'CreateTableUsuariosRede1757820013283';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "usuariorede" ("id" SERIAL NOT NULL, "ativo" boolean NOT NULL DEFAULT true, "idRede" integer NOT NULL, "idEmpresas" integer array DEFAULT '{}', "idLojas" integer array DEFAULT '{}', "idLojaPadrao" integer NOT NULL, "idUsuario" integer NOT NULL, CONSTRAINT "PK_9acadba04f03105b8c476c79181" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "usuariorede" ADD CONSTRAINT "FK_732446e0b9530aafd07d57a00ad" FOREIGN KEY ("idUsuario") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "usuariorede" DROP CONSTRAINT "FK_732446e0b9530aafd07d57a00ad"`,
    );
    await queryRunner.query(`DROP TABLE "usuariorede"`);
  }
}
