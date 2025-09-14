import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableEmpresa1757879797542 implements MigrationInterface {
  name = 'CreateTableEmpresa1757879797542';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "usuariosrede" DROP CONSTRAINT "FK_732446e0b9530aafd07d57a00ad"`,
    );
    await queryRunner.query(
      `CREATE TABLE "empresa" ("id" SERIAL NOT NULL, "descricao" character varying(100) NOT NULL, "ativo" boolean NOT NULL DEFAULT true, "idRede" integer NOT NULL, CONSTRAINT "PK_bee78e8f1760ccf9cff402118a6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rede" ("id" SERIAL NOT NULL, "descricao" character varying(100) NOT NULL, "ativo" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_adb81ca84e65bede56453b56fa9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "loja" ADD "cnpj" character(14) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "loja" ADD "idEmpresa" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "loja" ADD "idRede" integer NOT NULL`);
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "usuariosrede_id_seq" OWNED BY "usuariosrede"."id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usuariosrede" ALTER COLUMN "id" SET DEFAULT nextval('"usuariosrede_id_seq"')`,
    );
    await queryRunner.query(
      `ALTER TABLE "usuariosrede" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "usuariosrede_id_seq" OWNED BY "usuariosrede"."id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usuariosrede" ALTER COLUMN "id" SET DEFAULT nextval('"usuariosrede_id_seq"')`,
    );
    await queryRunner.query(
      `ALTER TABLE "usuariosrede" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "usuariosrede" ADD CONSTRAINT "FK_357bc157bcaee6de6cc2b40c662" FOREIGN KEY ("idUsuario") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "loja" ADD CONSTRAINT "FK_1ad8431da65a8195c294c772179" FOREIGN KEY ("idEmpresa") REFERENCES "empresa"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "loja" ADD CONSTRAINT "FK_e3e987ef61f8092032952844af7" FOREIGN KEY ("idRede") REFERENCES "rede"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "empresa" ADD CONSTRAINT "FK_97094552565c49548a1d92eba68" FOREIGN KEY ("idRede") REFERENCES "rede"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "empresa" DROP CONSTRAINT "FK_97094552565c49548a1d92eba68"`,
    );
    await queryRunner.query(
      `ALTER TABLE "loja" DROP CONSTRAINT "FK_e3e987ef61f8092032952844af7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "loja" DROP CONSTRAINT "FK_1ad8431da65a8195c294c772179"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usuariosrede" DROP CONSTRAINT "FK_357bc157bcaee6de6cc2b40c662"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usuariosrede" ALTER COLUMN "id" SET DEFAULT nextval('usuariorede_id_seq')`,
    );
    await queryRunner.query(
      `ALTER TABLE "usuariosrede" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(`DROP SEQUENCE "usuariosrede_id_seq"`);
    await queryRunner.query(
      `ALTER TABLE "usuariosrede" ALTER COLUMN "id" SET DEFAULT nextval('usuariorede_id_seq')`,
    );
    await queryRunner.query(
      `ALTER TABLE "usuariosrede" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(`DROP SEQUENCE "usuariosrede_id_seq"`);
    await queryRunner.query(`ALTER TABLE "loja" DROP COLUMN "idRede"`);
    await queryRunner.query(`ALTER TABLE "loja" DROP COLUMN "idEmpresa"`);
    await queryRunner.query(`ALTER TABLE "loja" DROP COLUMN "cnpj"`);
    await queryRunner.query(`DROP TABLE "rede"`);
    await queryRunner.query(`DROP TABLE "empresa"`);
    await queryRunner.query(
      `ALTER TABLE "usuariosrede" ADD CONSTRAINT "FK_732446e0b9530aafd07d57a00ad" FOREIGN KEY ("idUsuario") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
