import { MigrationInterface, QueryRunner } from "typeorm";

export class EndpointEdit1658164070491 implements MigrationInterface {
    name = 'EndpointEdit1658164070491'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "endpoint" ALTER COLUMN "requestBody" SET DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "endpoint" ALTER COLUMN "requestBody" SET DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "endpoint" ALTER COLUMN "requestBody" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "endpoint" ALTER COLUMN "requestBody" SET DEFAULT '{}'`);
    }

}
