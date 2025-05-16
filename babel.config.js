module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@*': './src/*',
          '@app': './src/app',
          '@assets': './src/assets',
          '@components': './src/components',
          '@hooks': './src/lib/hooks',
          '@core': './src/core',
          '@screens': './src/screens',
          '@models': './src/models',
          '@navigation': './src/navigation',
          '@constants': './src/constants',
          '@localization': './src/localization',
          '@contexts': './src/contexts',
          '@types': './src/types',
          '@utils': './src/utils',
          '@lib': './src/lib',
          '@styles': './src/styles',
          '@queries': './src/queries',
          '@store': './src/store'
        }
      }
    ],
    'react-native-reanimated/plugin',
    ['module:react-native-dotenv', { moduleName: '@env', path: '.env' }]
  ]
};
