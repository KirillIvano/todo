module.exports = {
    'env': {
        'es6': true,
        'browser': true,
        'node': true,
    },
    'extends': [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    'plugins': [
        '@typescript-eslint',
        'prettier',
    ],
    'parserOptions': {
        'ecmaVersion': 2019,
        'sourceType': 'module',
    },
    'parser': '@typescript-eslint/parser',
    'rules': {
        "prettier/prettier": 'error',

        // disable to work with prettier
        "arrow-body-style": "off",
        "prefer-arrow-callback": "off",
        'indent': "off",
        'quotes': "off",
        'semi': "off",
        'no-trailing-spaces': "off",

        // new react
        'react/react-in-jsx-scope': "off",
        'react/prop-types': "off",

        // code styling
        'prefer-const': 'error',
        'camelcase': 'error',
        'key-spacing': 'error',
        'no-console': 'error',
        'object-curly-spacing': ['error', 'never'],

        // too strict rules
        '@typescript-eslint/explicit-function-return-type': ['off'],

        // for node stuff
        '@typescript-eslint/no-var-requires': ['off'],
    },

};
