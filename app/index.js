// Created by bcolucci on 11/26/14.
'use strict';

var generators = require('yeoman-generator'),
  sh = require('execSync');

var configs = {};

var getGitConfig = function (n) {
  return sh.exec('git config --get ' + n).stdout.trim();
};

var defaultAuthorName = getGitConfig('user.name'),
  defaultAuthorEmail = getGitConfig('user.email'),
  defaultComponentId = null;

var PhpComponentGenerator = generators.Base.extend({

  init: function () {
    this.log("\n~~~~ PHP Component Generator ~~~~");
  },

  prompt_author_infos: function () {
    var done = this.async();
    this.prompt([
      {type: 'input', name: 'name', message: 'Author name:', default: defaultAuthorName},
      {type: 'input', name: 'email', message: 'Author email:', default: defaultAuthorEmail}
    ], function (answers) {
      configs.authorName = answers.name;
      configs.authorEmail = answers.email;
      done();
    }.bind(this));
  },

  prompt_git_infos: function () {
    var done = this.async();
    this.prompt([
      {type: 'input', name: 'url', message: 'Git repository URL:'}
    ], function (answers) {
      configs.gitURL = answers.url;
      defaultComponentId = configs.gitURL.split('/').pop().split('.').shift();
      done();
    }.bind(this));
  },

  prompt_component_infos: function () {
    var done = this.async();
    this.prompt([
      {type: 'input', name: 'id', message: 'Component ID:', default: defaultComponentId},
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

  prompt_destination_folder: function () {
    var defaultDestFolder = configs.gitURL ? defaultComponentId + '-component' : './';
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
    this.log('\n');

    if (configs.gitURL.length > 0) {
      this.copy('gitignore', '.gitignore');
    }

    this.copy('phpunit.xml', 'phpunit.xml.dist');

    this.template('composer.json', 'composer.json', configs);
    this.template('README.md', 'README.md', configs);
    this.template('SampleClass.php.txt', 'src/SampleClass.php', configs);
    this.template('SampleUnitTest.php.txt', 'test/Unit/SampleUnitTest.php', configs);
    this.template('SampleAssertsTrait.php.txt', 'test/Mock/SampleAssertsTrait.php', configs);
  },

  end: function () {
    this.log('\n');
    this.log(sh.run('composer install'));

    if (configs.gitURL.length > 0) {

      //TODO script that part
      var gitCommandToInit = "" +
        "\n\tcd " + this.destinationRoot() + '\\' +
        " && git init" + '\\' +
        " && git add --all" + '\\' +
        " && git commit -m 'Initial Commit'" + '\\' +
        " && git remote add origin " + configs.gitURL + '\\' +
        " && git push origin master\n";

      this.log('\n');
      this.log('~~~~ In order to init a new Git repository (copyu/paste) ~~~~\n' + gitCommandToInit);
    }
  }

});

module.exports = PhpComponentGenerator;
