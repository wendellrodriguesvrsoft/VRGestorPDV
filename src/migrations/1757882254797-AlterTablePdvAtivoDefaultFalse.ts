import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTablePdvAtivoDefaultFalse1757882254797 implements MigrationInterface {
    name = 'AlterTablePdvAtivoDefaultFalse1757882254797'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pdv" ALTER COLUMN "ativo" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pdv" ALTER COLUMN "ativo" SET DEFAULT true`);
    }

}
