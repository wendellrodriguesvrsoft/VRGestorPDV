import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableUsuarios1757817937824 implements MigrationInterface {
  name = 'CreateTableUsuarios1757817937824';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "usuarios" ("id" SERIAL NOT NULL, "nome" character varying(60) NOT NULL, "email" character varying(100) NOT NULL, "senha" character varying(100), "ativo" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE ("email"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "usuarios"`);
  }
}
