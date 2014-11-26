// Created by bcolucci on 11/26/14.
'use strict';

var generators = require('yeoman-generator'),
  sh = require('execSync');

var configs = {};

var PhpComponentGenerator = generators.Base.extend({

  init: function () {
    this.log("\n~~~~ PHP Component Generator ~~~~");
  },

  prompt_author_infos: function () {
    var done = this.async();
    this.prompt([
      {type: 'input', name: 'name', message: 'Author name:', default: 'John Doe'},
      {type: 'input', name: 'email', message: 'Author email:', default: 'johndoe@crakmedia.com'}
    ], function (answers) {
      configs.authorName = answers.name;
      configs.authorEmail = answers.email;
      done();
    }.bind(this));
  },

  prompt_component_infos: function () {
    var done = this.async();
    this.prompt([
      {type: 'input', name: 'id', message: 'Component ID:', default: 'awesome-stuff'},
    ], function (answers) {
      configs.componentId = answers.id;
      var defaultComponentName = answers.id.split('-').map(function (p) {
        return p.charAt(0).toUpperCase() + p.slice(1);
      }).join('');
      this.prompt([
        {type: 'input', name: 'name', message: 'Component name:', default: defaultComponentName},
      ], function (answers) {
        configs.componentName = answers.name;
        done();
      }.bind(this));

    }.bind(this));
  },

  prompt_git_infos: function () {
    var done = this.async();
    this.prompt([
      {type: 'input', name: 'url', message: 'Git repository URL:'}
    ], function (answers) {
      configs.gitURL = answers.url;
      done();
    }.bind(this));
  },

  prompt_destination_folder: function () {
    var defaultDestFolder = configs.gitURL ? configs.gitURL.split('/').pop().split('.').shift() + '-component' : null;
    var done = this.async();
    this.prompt(
      {type: 'input', name: 'folder', message: 'Destination folder:', default: defaultDestFolder},
      function (answers) {
        configs.destFolder = answers.folder;
        done();
      }.bind(this));
  },

  writing: function () {

    configs.srcNamespace = 'Crak\\Component\\' + configs.componentName;
    configs.testNamespace = 'Crak\\Component\\' + configs.componentName + '\\Test';

    this.destinationRoot(configs.destFolder);

    this.copy('phpunit.xml', 'phpunit.xml.dist');

    this.template('composer.json', 'composer.json', configs);
    this.template('README.md', 'README.md', configs);
    this.template('SampleClass.php.txt', 'src/SampleClass.php', configs);
    this.template('SampleUnitTest.php.txt', 'test/Unit/SampleUnitTest.php', configs);

    if (configs.gitURL.length > 0) {
      this.copy('gitignore', '.gitignore');
    }
  },

  end: function () {
    this.log(sh.run('composer install'));

    if (configs.gitURL.length > 0) {
      var gitCommandToInit = "" +
        "\n\tcd " + this.destinationRoot() +
        "\n\tgit init" +
        "\n\tgit add --all" +
        "\n\tgit commit -m 'Initial Commit'" +
        "\n\tgit remote add origin " + configs.gitURL +
        "\n\tgit push origin master\n";
      this.log('~~~~ In order to init a new Git repository ~~~~' + gitCommandToInit);
    }
  }

});

module.exports = PhpComponentGenerator;
