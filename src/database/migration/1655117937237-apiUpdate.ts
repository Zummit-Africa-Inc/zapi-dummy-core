/* eslint-disable prettier/prettier */
import {MigrationInterface, QueryRunner} from "typeorm";

export class apiUpdate1655117937237 implements MigrationInterface {
    name = 'apiUpdate1655117937237'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api" ALTER COLUMN "base_url" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "api" ALTER COLUMN "type" SET DEFAULT 'private'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api" ALTER COLUMN "type" SET DEFAULT 'public'`);
        await queryRunner.query(`ALTER TABLE "api" ALTER COLUMN "base_url" SET NOT NULL`);
    }

}
