// babel.config.js
module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            // ✅ Support des fichiers .env
            ['module:react-native-dotenv', {
                moduleName: '@env',
                path: '.env',
                safe: true,           // vérifie que les variables existent dans .env.example
                allowUndefined: false,
            }],
        ],
    };
};
