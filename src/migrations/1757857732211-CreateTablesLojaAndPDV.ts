import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTablesLojaAndPDV1757857732211 implements MigrationInterface {
  name = 'CreateTablesLojaAndPDV1757857732211';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "pdv" ("id" SERIAL NOT NULL, "uuid" character varying NOT NULL, "ativo" boolean NOT NULL DEFAULT true, "idLoja" integer NOT NULL, CONSTRAINT "UQ_99acf76597eb633fa83151ece15" UNIQUE ("uuid"), CONSTRAINT "PK_62ab763a2b52078f50819f49ef3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "loja" ("id" SERIAL NOT NULL, "descricao" character varying NOT NULL, "ativo" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_81ad5d6a90a7a01aa53b334cea9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "pdv" ADD CONSTRAINT "FK_06f322288fa28910ae5b8a23ad8" FOREIGN KEY ("idLoja") REFERENCES "loja"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pdv" DROP CONSTRAINT "FK_06f322288fa28910ae5b8a23ad8"`,
    );
    await queryRunner.query(`DROP TABLE "loja"`);
    await queryRunner.query(`DROP TABLE "pdv"`);
  }
}
