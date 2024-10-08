import typeorm = require('typeorm')

class NMvFTc1724148548680 implements typeorm.MigrationInterface {
    name = 'NMvFTc1724148548680'

    public async up(queryRunner: typeorm.QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "user_refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying(500) NOT NULL, "expired_at" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "accessTokenId" uuid, CONSTRAINT "REL_1dfd080c2abf42198691b60ae3" UNIQUE ("accessTokenId"), CONSTRAINT "PK_c5f5cf35bd8aabd1ebe9bb13409" PRIMARY KEY ("id")); COMMENT ON COLUMN "user_refresh_tokens"."expired_at" IS '令牌过期时间'; COMMENT ON COLUMN "user_refresh_tokens"."createdAt" IS '令牌创建时间'`,
        )
        await queryRunner.query(
            `CREATE TABLE "content_comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "body" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "mpath" character varying DEFAULT '', "parentId" uuid, "postId" uuid NOT NULL, "authorId" uuid NOT NULL, CONSTRAINT "PK_c37e5a30e089d53670b0b1c36e5" PRIMARY KEY ("id")); COMMENT ON COLUMN "content_comments"."body" IS '评论内容'; COMMENT ON COLUMN "content_comments"."createdAt" IS '创建时间'`,
        )
        await queryRunner.query(
            `CREATE INDEX "IDX_5f70a0489331d4346e46ea4d88" ON "content_comments" ("body") `,
        )
        await queryRunner.query(
            `CREATE TABLE "content_tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_6a24e5245d735b48bfe9ca5c1cc" PRIMARY KEY ("id")); COMMENT ON COLUMN "content_tags"."name" IS '分类名称'; COMMENT ON COLUMN "content_tags"."description" IS '标签描述'`,
        )
        await queryRunner.query(
            `CREATE INDEX "IDX_6f504a08a58010e15c55b1eb23" ON "content_tags" ("name") `,
        )
        await queryRunner.query(
            `CREATE TYPE "public"."content_posts_type_enum" AS ENUM('html', 'markdown')`,
        )
        await queryRunner.query(
            `CREATE TABLE "content_posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "body" text NOT NULL, "summary" character varying, "keywords" text, "type" "public"."content_posts_type_enum" NOT NULL DEFAULT 'markdown', "publishedAt" character varying, "customOrder" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "categoryId" uuid, "authorId" uuid NOT NULL, CONSTRAINT "PK_b3b972a0cd884ad3fdc5d62c49c" PRIMARY KEY ("id")); COMMENT ON COLUMN "content_posts"."title" IS '文章标题'; COMMENT ON COLUMN "content_posts"."body" IS '文章内容'; COMMENT ON COLUMN "content_posts"."summary" IS '文章描述'; COMMENT ON COLUMN "content_posts"."keywords" IS '关键字'; COMMENT ON COLUMN "content_posts"."type" IS '文章类型'; COMMENT ON COLUMN "content_posts"."publishedAt" IS '发布时间'; COMMENT ON COLUMN "content_posts"."customOrder" IS '自定义文章排序'; COMMENT ON COLUMN "content_posts"."createdAt" IS '创建时间'; COMMENT ON COLUMN "content_posts"."updatedAt" IS '更新时间'; COMMENT ON COLUMN "content_posts"."deletedAt" IS '删除时间'`,
        )
        await queryRunner.query(
            `CREATE INDEX "IDX_9ef6db9d13df6882d36c8af0cc" ON "content_posts" ("title") `,
        )
        await queryRunner.query(
            `CREATE INDEX "IDX_f43723dc196c18767a3893a3f7" ON "content_posts" ("summary") `,
        )
        await queryRunner.query(
            `CREATE TABLE "content_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "customOrder" integer NOT NULL DEFAULT '0', "mpath" character varying DEFAULT '', "parentId" uuid, CONSTRAINT "PK_1e90dab7a3f22189b39b01445a6" PRIMARY KEY ("id")); COMMENT ON COLUMN "content_categories"."name" IS '分类名称'; COMMENT ON COLUMN "content_categories"."customOrder" IS '分类排序'`,
        )
        await queryRunner.query(
            `CREATE INDEX "IDX_d6aaf8517ca57297a8c3a44d3d" ON "content_categories" ("name") `,
        )
        await queryRunner.query(
            `CREATE TABLE "rbac_roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "label" character varying, "description" text, "systemed" boolean NOT NULL DEFAULT false, "deletedAt" TIMESTAMP, CONSTRAINT "PK_b5f28376a8596e5361fbb5734e7" PRIMARY KEY ("id")); COMMENT ON COLUMN "rbac_roles"."name" IS '角色名称'; COMMENT ON COLUMN "rbac_roles"."label" IS '显示名称'; COMMENT ON COLUMN "rbac_roles"."description" IS '角色描述'; COMMENT ON COLUMN "rbac_roles"."systemed" IS '是否为不可更改的系统权限'; COMMENT ON COLUMN "rbac_roles"."deletedAt" IS '删除时间'`,
        )
        await queryRunner.query(
            `CREATE TABLE "rbac_permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "label" character varying, "description" text, "rule" text NOT NULL, CONSTRAINT "PK_7bea059f5bd50222b6aa3d6f026" PRIMARY KEY ("id")); COMMENT ON COLUMN "rbac_permissions"."name" IS '权限名称'; COMMENT ON COLUMN "rbac_permissions"."label" IS '权限显示名'; COMMENT ON COLUMN "rbac_permissions"."description" IS '权限描述'; COMMENT ON COLUMN "rbac_permissions"."rule" IS '权限规则'`,
        )
        await queryRunner.query(
            `CREATE TYPE "public"."role_menus_type_enum" AS ENUM('0', '1', '2')`,
        )
        await queryRunner.query(
            `CREATE TABLE "role_menus" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "label" character varying NOT NULL, "name" character varying NOT NULL, "type" "public"."role_menus_type_enum" NOT NULL DEFAULT '0', "icon" character varying, "customOrder" integer NOT NULL DEFAULT '1', "isFrame" boolean, "frameSrc" character varying, "isCache" boolean, "path" character varying NOT NULL, "component" character varying, "perms" character varying, "query" character varying, "hide" boolean, "status" boolean, "newFeature" boolean, "hideTab" boolean, "mpath" character varying DEFAULT '', "parentId" uuid, CONSTRAINT "PK_efd7de02124423e1c2960df3ab4" PRIMARY KEY ("id")); COMMENT ON COLUMN "role_menus"."label" IS 'i18n 标签'; COMMENT ON COLUMN "role_menus"."name" IS '菜单名称'; COMMENT ON COLUMN "role_menus"."type" IS '菜单类型'; COMMENT ON COLUMN "role_menus"."icon" IS '菜单图标'; COMMENT ON COLUMN "role_menus"."customOrder" IS '显示排序'; COMMENT ON COLUMN "role_menus"."isFrame" IS '是否外链'; COMMENT ON COLUMN "role_menus"."frameSrc" IS '外链地址'; COMMENT ON COLUMN "role_menus"."isCache" IS '是否缓存'; COMMENT ON COLUMN "role_menus"."path" IS '路由地址'; COMMENT ON COLUMN "role_menus"."component" IS '组件路径'; COMMENT ON COLUMN "role_menus"."perms" IS '权限字符'; COMMENT ON COLUMN "role_menus"."query" IS '路由参数'; COMMENT ON COLUMN "role_menus"."hide" IS '显示状态'; COMMENT ON COLUMN "role_menus"."status" IS '菜单状态'; COMMENT ON COLUMN "role_menus"."newFeature" IS '是否新特性'; COMMENT ON COLUMN "role_menus"."hideTab" IS '是否隐藏tab'`,
        )
        await queryRunner.query(
            `CREATE TYPE "public"."login_logs_status_enum" AS ENUM('success', 'failed')`,
        )
        await queryRunner.query(
            `CREATE TABLE "login_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login_time" TIMESTAMP, "login_ip" character varying(40), "login_device" character varying(500), "status" "public"."login_logs_status_enum", "fail_reason" character varying(500), "userId" uuid NOT NULL, CONSTRAINT "PK_15f7b02ad55d5ba905b2962ebab" PRIMARY KEY ("id")); COMMENT ON COLUMN "login_logs"."login_time" IS '登录时间'; COMMENT ON COLUMN "login_logs"."login_ip" IS '登录IP'; COMMENT ON COLUMN "login_logs"."login_device" IS '设备信息如浏览器类型,操作系统等'; COMMENT ON COLUMN "login_logs"."status" IS '登录状态'; COMMENT ON COLUMN "login_logs"."fail_reason" IS '登录失败原因'`,
        )
        await queryRunner.query(
            `CREATE TYPE "public"."operation_logs_operation_type_enum" AS ENUM('Create', 'Update', 'Delete', 'Read', 'Other')`,
        )
        await queryRunner.query(
            `CREATE TYPE "public"."operation_logs_status_enum" AS ENUM('success', 'failed')`,
        )
        await queryRunner.query(
            `CREATE TYPE "public"."operation_logs_method_enum" AS ENUM('GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD')`,
        )
        await queryRunner.query(
            `CREATE TABLE "operation_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "operation_name" character varying NOT NULL, "operation_type" "public"."operation_logs_operation_type_enum" NOT NULL, "operation_time" TIMESTAMP, "operation_ip" character varying(40), "operation_device" character varying(500), "operation_url" character varying, "status" "public"."operation_logs_status_enum", "fail_reason" character varying(500), "time" character varying(20), "method" "public"."operation_logs_method_enum", "userId" uuid NOT NULL, CONSTRAINT "PK_18c884ac5d5008d1110501edca5" PRIMARY KEY ("id")); COMMENT ON COLUMN "operation_logs"."operation_name" IS '操作的名称或描述'; COMMENT ON COLUMN "operation_logs"."operation_type" IS '操作类型（创建、读取、更新、删除、其它）'; COMMENT ON COLUMN "operation_logs"."operation_time" IS '操作时间'; COMMENT ON COLUMN "operation_logs"."operation_ip" IS '操作IP'; COMMENT ON COLUMN "operation_logs"."operation_device" IS '设备信息如浏览器类型,操作系统等'; COMMENT ON COLUMN "operation_logs"."operation_url" IS '请求URL'; COMMENT ON COLUMN "operation_logs"."status" IS '操作状态'; COMMENT ON COLUMN "operation_logs"."fail_reason" IS '登录失败原因'; COMMENT ON COLUMN "operation_logs"."time" IS '执行时间'; COMMENT ON COLUMN "operation_logs"."method" IS '请求方法'`,
        )
        await queryRunner.query(
            `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nickname" character varying, "username" character varying NOT NULL, "password" character varying(500) NOT NULL, "phone" character varying, "email" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")); COMMENT ON COLUMN "users"."nickname" IS '姓名'; COMMENT ON COLUMN "users"."username" IS '用户名'; COMMENT ON COLUMN "users"."password" IS '密码'; COMMENT ON COLUMN "users"."phone" IS '手机号'; COMMENT ON COLUMN "users"."email" IS '邮箱'; COMMENT ON COLUMN "users"."createdAt" IS '用户创建时间'; COMMENT ON COLUMN "users"."updatedAt" IS '用户更新时间'; COMMENT ON COLUMN "users"."deletedAt" IS '删除时间'`,
        )
        await queryRunner.query(
            `CREATE TABLE "user_access_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying(500) NOT NULL, "expired_at" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_f07c49baf74e5d699c83e2ec2bd" PRIMARY KEY ("id")); COMMENT ON COLUMN "user_access_tokens"."expired_at" IS '令牌过期时间'; COMMENT ON COLUMN "user_access_tokens"."createdAt" IS '令牌创建时间'`,
        )
        await queryRunner.query(
            `CREATE TABLE "dicts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "name" character varying NOT NULL, "systemFlag" boolean NOT NULL DEFAULT false, "remark" character varying, "status" boolean DEFAULT true, CONSTRAINT "PK_f0b149c7886a416532883d829ea" PRIMARY KEY ("id")); COMMENT ON COLUMN "dicts"."id" IS '字典编号'; COMMENT ON COLUMN "dicts"."code" IS '字典编码'; COMMENT ON COLUMN "dicts"."name" IS '字典名称'; COMMENT ON COLUMN "dicts"."systemFlag" IS '是否系统内置, 是 否'; COMMENT ON COLUMN "dicts"."remark" IS '备注信息'; COMMENT ON COLUMN "dicts"."status" IS '启用状态, 启用 停用'`,
        )
        await queryRunner.query(
            `CREATE TABLE "dict_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "label" character varying NOT NULL, "value" character varying NOT NULL, "description" character varying, "sortOrder" integer, "remark" character varying, "status" boolean DEFAULT true, "dictId" uuid NOT NULL, CONSTRAINT "PK_bd7dc29e3264ca710eef8fe329a" PRIMARY KEY ("id")); COMMENT ON COLUMN "dict_items"."label" IS '标签名'; COMMENT ON COLUMN "dict_items"."value" IS '数据值'; COMMENT ON COLUMN "dict_items"."description" IS '描述'; COMMENT ON COLUMN "dict_items"."sortOrder" IS '排序值，默认升序'; COMMENT ON COLUMN "dict_items"."remark" IS '备注信息'; COMMENT ON COLUMN "dict_items"."status" IS '启用状态'; COMMENT ON COLUMN "dict_items"."dictId" IS '字典编号'`,
        )
        await queryRunner.query(
            `CREATE TABLE "content_posts_tags_content_tags" ("contentPostsId" uuid NOT NULL, "contentTagsId" uuid NOT NULL, CONSTRAINT "PK_09521bc8511dd79bab9883e2331" PRIMARY KEY ("contentPostsId", "contentTagsId"))`,
        )
        await queryRunner.query(
            `CREATE INDEX "IDX_1e8c41827d0d509e70de1f6b70" ON "content_posts_tags_content_tags" ("contentPostsId") `,
        )
        await queryRunner.query(
            `CREATE INDEX "IDX_888e6754015ee17f9e22faae57" ON "content_posts_tags_content_tags" ("contentTagsId") `,
        )
        await queryRunner.query(
            `CREATE TABLE "rbac_roles_users_users" ("rbacRolesId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_6eb1c27782a91443e252a8f003b" PRIMARY KEY ("rbacRolesId", "usersId"))`,
        )
        await queryRunner.query(
            `CREATE INDEX "IDX_3c933e8c0950496fa3a616e4b2" ON "rbac_roles_users_users" ("rbacRolesId") `,
        )
        await queryRunner.query(
            `CREATE INDEX "IDX_789b5818a876ba2c4f058bdeb9" ON "rbac_roles_users_users" ("usersId") `,
        )
        await queryRunner.query(
            `CREATE TABLE "rbac_permissions_roles_rbac_roles" ("rbacPermissionsId" uuid NOT NULL, "rbacRolesId" uuid NOT NULL, CONSTRAINT "PK_6ba07b788fa05760748ac53da8c" PRIMARY KEY ("rbacPermissionsId", "rbacRolesId"))`,
        )
        await queryRunner.query(
            `CREATE INDEX "IDX_a3fab43faecb8e0f9b0345cedb" ON "rbac_permissions_roles_rbac_roles" ("rbacPermissionsId") `,
        )
        await queryRunner.query(
            `CREATE INDEX "IDX_df26ec979184812b60c1c1a4e3" ON "rbac_permissions_roles_rbac_roles" ("rbacRolesId") `,
        )
        await queryRunner.query(
            `CREATE TABLE "rbac_permissions_users_users" ("rbacPermissionsId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_401951042ab27b2b55c359e75f4" PRIMARY KEY ("rbacPermissionsId", "usersId"))`,
        )
        await queryRunner.query(
            `CREATE INDEX "IDX_d12a35b88ace69f10656e31e58" ON "rbac_permissions_users_users" ("rbacPermissionsId") `,
        )
        await queryRunner.query(
            `CREATE INDEX "IDX_5910a3c31c94389248bd34afc4" ON "rbac_permissions_users_users" ("usersId") `,
        )
        await queryRunner.query(
            `ALTER TABLE "user_refresh_tokens" ADD CONSTRAINT "FK_1dfd080c2abf42198691b60ae39" FOREIGN KEY ("accessTokenId") REFERENCES "user_access_tokens"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "content_comments" ADD CONSTRAINT "FK_982a849f676860e5d6beb607f20" FOREIGN KEY ("parentId") REFERENCES "content_comments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "content_comments" ADD CONSTRAINT "FK_5e1c3747a0031f305e94493361f" FOREIGN KEY ("postId") REFERENCES "content_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        )
        await queryRunner.query(
            `ALTER TABLE "content_comments" ADD CONSTRAINT "FK_4a3469cba32f2dd9712821285e5" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        )
        await queryRunner.query(
            `ALTER TABLE "content_posts" ADD CONSTRAINT "FK_4027367881933f659d02f367e92" FOREIGN KEY ("categoryId") REFERENCES "content_categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "content_posts" ADD CONSTRAINT "FK_8fcc2d81ced7b8ade2bbd151b1a" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        )
        await queryRunner.query(
            `ALTER TABLE "content_categories" ADD CONSTRAINT "FK_a03aea27707893300382b6f18ae" FOREIGN KEY ("parentId") REFERENCES "content_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "role_menus" ADD CONSTRAINT "FK_875b128ce419d8a668f62727588" FOREIGN KEY ("parentId") REFERENCES "role_menus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "login_logs" ADD CONSTRAINT "FK_dfd602e41a69edd16aed5075a7c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        )
        await queryRunner.query(
            `ALTER TABLE "operation_logs" ADD CONSTRAINT "FK_8049d11c9615051b06f0b189396" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        )
        await queryRunner.query(
            `ALTER TABLE "user_access_tokens" ADD CONSTRAINT "FK_71a030e491d5c8547fc1e38ef82" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "dict_items" ADD CONSTRAINT "FK_0f28012ad788c025992d67fe12a" FOREIGN KEY ("dictId") REFERENCES "dicts"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        )
        await queryRunner.query(
            `ALTER TABLE "content_posts_tags_content_tags" ADD CONSTRAINT "FK_1e8c41827d0d509e70de1f6b70e" FOREIGN KEY ("contentPostsId") REFERENCES "content_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        )
        await queryRunner.query(
            `ALTER TABLE "content_posts_tags_content_tags" ADD CONSTRAINT "FK_888e6754015ee17f9e22faae578" FOREIGN KEY ("contentTagsId") REFERENCES "content_tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "rbac_roles_users_users" ADD CONSTRAINT "FK_3c933e8c0950496fa3a616e4b27" FOREIGN KEY ("rbacRolesId") REFERENCES "rbac_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        )
        await queryRunner.query(
            `ALTER TABLE "rbac_roles_users_users" ADD CONSTRAINT "FK_789b5818a876ba2c4f058bdeb98" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "rbac_permissions_roles_rbac_roles" ADD CONSTRAINT "FK_a3fab43faecb8e0f9b0345cedba" FOREIGN KEY ("rbacPermissionsId") REFERENCES "rbac_permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        )
        await queryRunner.query(
            `ALTER TABLE "rbac_permissions_roles_rbac_roles" ADD CONSTRAINT "FK_df26ec979184812b60c1c1a4e3a" FOREIGN KEY ("rbacRolesId") REFERENCES "rbac_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "rbac_permissions_users_users" ADD CONSTRAINT "FK_d12a35b88ace69f10656e31e587" FOREIGN KEY ("rbacPermissionsId") REFERENCES "rbac_permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        )
        await queryRunner.query(
            `ALTER TABLE "rbac_permissions_users_users" ADD CONSTRAINT "FK_5910a3c31c94389248bd34afc48" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
    }

    public async down(queryRunner: typeorm.QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "rbac_permissions_users_users" DROP CONSTRAINT "FK_5910a3c31c94389248bd34afc48"`,
        )
        await queryRunner.query(
            `ALTER TABLE "rbac_permissions_users_users" DROP CONSTRAINT "FK_d12a35b88ace69f10656e31e587"`,
        )
        await queryRunner.query(
            `ALTER TABLE "rbac_permissions_roles_rbac_roles" DROP CONSTRAINT "FK_df26ec979184812b60c1c1a4e3a"`,
        )
        await queryRunner.query(
            `ALTER TABLE "rbac_permissions_roles_rbac_roles" DROP CONSTRAINT "FK_a3fab43faecb8e0f9b0345cedba"`,
        )
        await queryRunner.query(
            `ALTER TABLE "rbac_roles_users_users" DROP CONSTRAINT "FK_789b5818a876ba2c4f058bdeb98"`,
        )
        await queryRunner.query(
            `ALTER TABLE "rbac_roles_users_users" DROP CONSTRAINT "FK_3c933e8c0950496fa3a616e4b27"`,
        )
        await queryRunner.query(
            `ALTER TABLE "content_posts_tags_content_tags" DROP CONSTRAINT "FK_888e6754015ee17f9e22faae578"`,
        )
        await queryRunner.query(
            `ALTER TABLE "content_posts_tags_content_tags" DROP CONSTRAINT "FK_1e8c41827d0d509e70de1f6b70e"`,
        )
        await queryRunner.query(
            `ALTER TABLE "dict_items" DROP CONSTRAINT "FK_0f28012ad788c025992d67fe12a"`,
        )
        await queryRunner.query(
            `ALTER TABLE "user_access_tokens" DROP CONSTRAINT "FK_71a030e491d5c8547fc1e38ef82"`,
        )
        await queryRunner.query(
            `ALTER TABLE "operation_logs" DROP CONSTRAINT "FK_8049d11c9615051b06f0b189396"`,
        )
        await queryRunner.query(
            `ALTER TABLE "login_logs" DROP CONSTRAINT "FK_dfd602e41a69edd16aed5075a7c"`,
        )
        await queryRunner.query(
            `ALTER TABLE "role_menus" DROP CONSTRAINT "FK_875b128ce419d8a668f62727588"`,
        )
        await queryRunner.query(
            `ALTER TABLE "content_categories" DROP CONSTRAINT "FK_a03aea27707893300382b6f18ae"`,
        )
        await queryRunner.query(
            `ALTER TABLE "content_posts" DROP CONSTRAINT "FK_8fcc2d81ced7b8ade2bbd151b1a"`,
        )
        await queryRunner.query(
            `ALTER TABLE "content_posts" DROP CONSTRAINT "FK_4027367881933f659d02f367e92"`,
        )
        await queryRunner.query(
            `ALTER TABLE "content_comments" DROP CONSTRAINT "FK_4a3469cba32f2dd9712821285e5"`,
        )
        await queryRunner.query(
            `ALTER TABLE "content_comments" DROP CONSTRAINT "FK_5e1c3747a0031f305e94493361f"`,
        )
        await queryRunner.query(
            `ALTER TABLE "content_comments" DROP CONSTRAINT "FK_982a849f676860e5d6beb607f20"`,
        )
        await queryRunner.query(
            `ALTER TABLE "user_refresh_tokens" DROP CONSTRAINT "FK_1dfd080c2abf42198691b60ae39"`,
        )
        await queryRunner.query(`DROP INDEX "public"."IDX_5910a3c31c94389248bd34afc4"`)
        await queryRunner.query(`DROP INDEX "public"."IDX_d12a35b88ace69f10656e31e58"`)
        await queryRunner.query(`DROP TABLE "rbac_permissions_users_users"`)
        await queryRunner.query(`DROP INDEX "public"."IDX_df26ec979184812b60c1c1a4e3"`)
        await queryRunner.query(`DROP INDEX "public"."IDX_a3fab43faecb8e0f9b0345cedb"`)
        await queryRunner.query(`DROP TABLE "rbac_permissions_roles_rbac_roles"`)
        await queryRunner.query(`DROP INDEX "public"."IDX_789b5818a876ba2c4f058bdeb9"`)
        await queryRunner.query(`DROP INDEX "public"."IDX_3c933e8c0950496fa3a616e4b2"`)
        await queryRunner.query(`DROP TABLE "rbac_roles_users_users"`)
        await queryRunner.query(`DROP INDEX "public"."IDX_888e6754015ee17f9e22faae57"`)
        await queryRunner.query(`DROP INDEX "public"."IDX_1e8c41827d0d509e70de1f6b70"`)
        await queryRunner.query(`DROP TABLE "content_posts_tags_content_tags"`)
        await queryRunner.query(`DROP TABLE "dict_items"`)
        await queryRunner.query(`DROP TABLE "dicts"`)
        await queryRunner.query(`DROP TABLE "user_access_tokens"`)
        await queryRunner.query(`DROP TABLE "users"`)
        await queryRunner.query(`DROP TABLE "operation_logs"`)
        await queryRunner.query(`DROP TYPE "public"."operation_logs_method_enum"`)
        await queryRunner.query(`DROP TYPE "public"."operation_logs_status_enum"`)
        await queryRunner.query(`DROP TYPE "public"."operation_logs_operation_type_enum"`)
        await queryRunner.query(`DROP TABLE "login_logs"`)
        await queryRunner.query(`DROP TYPE "public"."login_logs_status_enum"`)
        await queryRunner.query(`DROP TABLE "role_menus"`)
        await queryRunner.query(`DROP TYPE "public"."role_menus_type_enum"`)
        await queryRunner.query(`DROP TABLE "rbac_permissions"`)
        await queryRunner.query(`DROP TABLE "rbac_roles"`)
        await queryRunner.query(`DROP INDEX "public"."IDX_d6aaf8517ca57297a8c3a44d3d"`)
        await queryRunner.query(`DROP TABLE "content_categories"`)
        await queryRunner.query(`DROP INDEX "public"."IDX_f43723dc196c18767a3893a3f7"`)
        await queryRunner.query(`DROP INDEX "public"."IDX_e51068c39974ca11fae5d44c88"`)
        await queryRunner.query(`DROP INDEX "public"."IDX_9ef6db9d13df6882d36c8af0cc"`)
        await queryRunner.query(`DROP TABLE "content_posts"`)
        await queryRunner.query(`DROP TYPE "public"."content_posts_type_enum"`)
        await queryRunner.query(`DROP INDEX "public"."IDX_6f504a08a58010e15c55b1eb23"`)
        await queryRunner.query(`DROP TABLE "content_tags"`)
        await queryRunner.query(`DROP INDEX "public"."IDX_5f70a0489331d4346e46ea4d88"`)
        await queryRunner.query(`DROP TABLE "content_comments"`)
        await queryRunner.query(`DROP TABLE "user_refresh_tokens"`)
    }
}

module.exports = NMvFTc1724148548680
