import { MigrationInterface, QueryRunner } from "typeorm";

export class default1665414012237 implements MigrationInterface {
    name = 'default1665414012237'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "permissions" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "permissions"`);
    }

}
