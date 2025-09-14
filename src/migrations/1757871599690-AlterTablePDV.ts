import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTablePDV1757871599690 implements MigrationInterface {
  name = 'AlterTablePDV1757871599690';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pdv" DROP CONSTRAINT "PK_62ab763a2b52078f50819f49ef3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pdv" ADD CONSTRAINT "PK_fe0e3d1880932e93a0d24c6ea95" PRIMARY KEY ("id", "uuid")`,
    );
    await queryRunner.query(
      `ALTER TABLE "pdv" DROP CONSTRAINT "PK_fe0e3d1880932e93a0d24c6ea95"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pdv" ADD CONSTRAINT "PK_62ab763a2b52078f50819f49ef3" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "pdv" DROP CONSTRAINT "UQ_99acf76597eb633fa83151ece15"`,
    );
    await queryRunner.query(`ALTER TABLE "pdv" DROP COLUMN "uuid"`);
    await queryRunner.query(
      `ALTER TABLE "pdv" ADD "uuid" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "pdv" DROP CONSTRAINT "PK_62ab763a2b52078f50819f49ef3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pdv" ADD CONSTRAINT "PK_fe0e3d1880932e93a0d24c6ea95" PRIMARY KEY ("id", "uuid")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pdv" DROP CONSTRAINT "PK_fe0e3d1880932e93a0d24c6ea95"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pdv" ADD CONSTRAINT "PK_62ab763a2b52078f50819f49ef3" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "pdv" DROP COLUMN "uuid"`);
    await queryRunner.query(
      `ALTER TABLE "pdv" ADD "uuid" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pdv" ADD CONSTRAINT "UQ_99acf76597eb633fa83151ece15" UNIQUE ("uuid")`,
    );
    await queryRunner.query(
      `ALTER TABLE "pdv" DROP CONSTRAINT "PK_62ab763a2b52078f50819f49ef3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pdv" ADD CONSTRAINT "PK_fe0e3d1880932e93a0d24c6ea95" PRIMARY KEY ("id", "uuid")`,
    );
    await queryRunner.query(
      `ALTER TABLE "pdv" DROP CONSTRAINT "PK_fe0e3d1880932e93a0d24c6ea95"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pdv" ADD CONSTRAINT "PK_62ab763a2b52078f50819f49ef3" PRIMARY KEY ("id")`,
    );
  }
}
