module.exports = {
    root: true,
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
    },
    extends: ['@repo/eslint-config/nestjs'],
};
