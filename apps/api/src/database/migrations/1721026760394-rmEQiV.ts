import typeorm = require('typeorm');

class RmEQiV1721026760394 implements typeorm.MigrationInterface {
    name = 'RmEQiV1721026760394'

    public async up(queryRunner: typeorm.QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`login_logs\` (\`id\` varchar(36) NOT NULL, \`login_time\` datetime NULL COMMENT '登录时间', \`login_ip\` varchar(40) NULL COMMENT '登录IP', \`login_device\` varchar(500) NULL COMMENT '设备信息如浏览器类型,操作系统等', \`status\` enum ('success', 'failed') NULL COMMENT '登录状态', \`fail_reason\` varchar(500) NULL COMMENT '登录失败原因', \`userId\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`)
        await queryRunner.query(`CREATE TABLE \`operation_logs\` (\`id\` varchar(36) NOT NULL, \`operation_name\` varchar(255) NOT NULL COMMENT '操作的名称或描述', \`operation_type\` varchar(255) NOT NULL COMMENT '操作类型（创建、读取、更新、删除、其它）', \`operation_time\` datetime NULL COMMENT '登录时间', \`operation_ip\` varchar(40) NULL COMMENT '登录IP', \`operation_device\` varchar(500) NULL COMMENT '设备信息如浏览器类型,操作系统等', \`operation_url\` varchar(255) NULL COMMENT '请求URL', \`status\` enum ('success', 'failed') NULL COMMENT '操作状态', \`fail_reason\` varchar(500) NULL COMMENT '登录失败原因', \`userId\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`)
        await queryRunner.query(`ALTER TABLE \`login_logs\` ADD CONSTRAINT \`FK_dfd602e41a69edd16aed5075a7c\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`)
        await queryRunner.query(`ALTER TABLE \`operation_logs\` ADD CONSTRAINT \`FK_8049d11c9615051b06f0b189396\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`)
    }

    public async down(queryRunner: typeorm.QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`operation_logs\` DROP FOREIGN KEY \`FK_8049d11c9615051b06f0b189396\``)
        await queryRunner.query(`ALTER TABLE \`login_logs\` DROP FOREIGN KEY \`FK_dfd602e41a69edd16aed5075a7c\``)
        await queryRunner.query(`DROP TABLE \`operation_logs\``)
        await queryRunner.query(`DROP TABLE \`login_logs\``)
    }

}

module.exports = RmEQiV1721026760394
