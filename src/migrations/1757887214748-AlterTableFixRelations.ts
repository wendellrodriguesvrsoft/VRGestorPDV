import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableFixRelations1757887214748 implements MigrationInterface {
    name = 'AlterTableFixRelations1757887214748'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loja" DROP CONSTRAINT "FK_e3e987ef61f8092032952844af7"`);
        await queryRunner.query(`ALTER TABLE "loja" DROP COLUMN "idRede"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "usuariosrede_id_seq" OWNED BY "usuariosrede"."id"`);
        await queryRunner.query(`ALTER TABLE "usuariosrede" ALTER COLUMN "id" SET DEFAULT nextval('"usuariosrede_id_seq"')`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "usuariosrede_id_seq" OWNED BY "usuariosrede"."id"`);
        await queryRunner.query(`ALTER TABLE "usuariosrede" ALTER COLUMN "id" SET DEFAULT nextval('"usuariosrede_id_seq"')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuariosrede" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "usuariosrede_id_seq"`);
        await queryRunner.query(`ALTER TABLE "usuariosrede" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "usuariosrede_id_seq"`);
        await queryRunner.query(`ALTER TABLE "loja" ADD "idRede" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "loja" ADD CONSTRAINT "FK_e3e987ef61f8092032952844af7" FOREIGN KEY ("idRede") REFERENCES "rede"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
