// Karma configuration file, see link for more information
// https://karma-runner.github.io/6.4/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        // você pode adicionar opções de configuração para Jasmine aqui
        // a propriedade possible options estão listadas em
        // https://jasmine.github.io/api/edge/Configuration.html
        // por exemplo, você pode desabilitar a randomização com `random: false`
        // ou definir uma semente específica com `seed: 4321`
        random: true,
        seed: '',
        stopOnFailure: false
      },
      clearContext: false // deixa a saída do Jasmine Spec Runner visível no navegador
    },
    jasmineHtmlReporter: {
      suppressAll: true // remove as mensagens duplicadas
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/gestiona-app'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcov' }
      ],
      // Configuração de thresholds (opcional)
      check: {
        global: {
          statements: 80,
          branches: 70,
          functions: 80,
          lines: 80
        }
      }
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['Chrome'],
    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--no-sandbox',
          '--disable-web-security',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--headless'
        ]
      }
    },
    restartOnFileChange: true,
    singleRun: false
  });
};