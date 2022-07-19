import { MigrationInterface, QueryRunner } from "typeorm";

export class EndpointBodyFix1658212499946 implements MigrationInterface {
    name = 'EndpointBodyFix1658212499946'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "endpoint" DROP COLUMN "requestBody"`);
        await queryRunner.query(`ALTER TABLE "endpoint" ADD "requestBody" jsonb array DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "endpoint" DROP COLUMN "requestBody"`);
        await queryRunner.query(`ALTER TABLE "endpoint" ADD "requestBody" jsonb NOT NULL DEFAULT '{}'`);
    }

}
