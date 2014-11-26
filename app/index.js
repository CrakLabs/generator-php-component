/**
 * Created by bcolucci on 11/26/14.
 */
'use strict';

var generators = require('yeoman-generator'),
  util = require('util'),
  path = require('path'),
  sh = require('execSync');

var getGitConfig = function (n) {
  return sh.exec('git config --get ' + n).stdout.trim();
};

var defaultAuthorName = getGitConfig('user.name'),
  defaultAuthorEmail = getGitConfig('user.email'),
  gitRemoteUrl = getGitConfig('remote.origin.url');

var defaultComponentID = gitRemoteUrl.split('/').pop().split('.').shift(),
  defaultComponentName = defaultComponentID.split('-').map(function (part) {
    return part.charAt(0).toUpperCase() + part.slice(1);
  }).join('');

var PhpComponentGenerator = generators.Base.extend({
  prompting: function () {
    var done = this.async();
    this.prompt([
      {
        type: 'input',
        name: 'authorName',
        message: 'Author name (ex: John Doe):',
        default: defaultAuthorName
      },
      {
        type: 'input',
        name: 'authorEmail',
        message: 'Author email (ex: johndoe@crakmedia.com):',
        default: defaultAuthorEmail
      },
      {
        type: 'input',
        name: 'componentId',
        message: 'Component ID:',
        default: defaultComponentID
      },
      {
        type: 'input',
        name: 'componentName',
        message: 'Component name:',
        default: defaultComponentName
      }
    ], function (answers) {
      this.config.set('answers', answers);
      done();
    }.bind(this));
  },
  writing: function () {
    var answers = this.config.get('answers');

    answers.srcNamespace = 'Crak\\Component\\' + answers.componentName;
    answers.testNamespace = 'Crak\\Component\\' + answers.componentName + '\\Test';

    this.copy('gitignore', '.gitignore');
    this.copy('phpunit.xml', 'phpunit.xml.dist');

    this.template('composer.json', 'composer.json', answers);
    this.template('SampleClass.php.txt', 'src/SampleClass.php', answers);
    this.template('SampleUnitTest.php.txt', 'test/Unit/SampleUnitTest.php', answers);
  },
  end: function () {
    this.log(sh.run('rm .yo-rc.json'));
    this.log(sh.run("git add * .gitignore"));
    this.log(sh.run("git commit -m'Initial commit'"));
    this.log(sh.run("git push origin master"));
    this.log(sh.run('composer install'));
    this.log(sh.run('phpunit'));
  }
});

module.exports = PhpComponentGenerator;