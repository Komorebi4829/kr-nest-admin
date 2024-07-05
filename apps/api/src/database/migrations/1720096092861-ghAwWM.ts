import typeorm = require('typeorm');

class GhAwWM1720096092861 implements typeorm.MigrationInterface {
    name = 'GhAwWM1720096092861'

    public async up(queryRunner: typeorm.QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`dicts\` (\`id\` varchar(36) NOT NULL COMMENT '字典编号', \`code\` varchar(255) NOT NULL COMMENT '字典编码', \`name\` varchar(255) NOT NULL COMMENT '字典名称', \`systemFlag\` tinyint NOT NULL COMMENT '是否系统内置, 1是 0否' DEFAULT '0', \`remark\` varchar(255) NULL COMMENT '备注信息', \`status\` tinyint NULL COMMENT '启用状态, 1启用 0停用' DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`)
        await queryRunner.query(`CREATE TABLE \`dict_items\` (\`id\` varchar(36) NOT NULL, \`label\` varchar(255) NOT NULL COMMENT '标签名', \`value\` varchar(255) NOT NULL COMMENT '数据值', \`description\` varchar(255) NULL COMMENT '描述', \`sortOrder\` int NULL COMMENT '排序值，默认升序', \`remark\` varchar(255) NULL COMMENT '备注信息', \`status\` tinyint NULL COMMENT '启用状态' DEFAULT '1', \`dictId\` varchar(36) NOT NULL COMMENT '字典编号', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`)
        await queryRunner.query(`ALTER TABLE \`dict_items\` ADD CONSTRAINT \`FK_0f28012ad788c025992d67fe12a\` FOREIGN KEY (\`dictId\`) REFERENCES \`dicts\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`)
    }

    public async down(queryRunner: typeorm.QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`dict_items\` DROP FOREIGN KEY \`FK_0f28012ad788c025992d67fe12a\``)
        await queryRunner.query(`DROP TABLE \`dict_items\``)
        await queryRunner.query(`DROP TABLE \`dicts\``)
    }

}

module.exports = GhAwWM1720096092861
