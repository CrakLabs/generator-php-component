
# Yeoman PHP Component generator

## Pre-configuration

Please set correctly your global git user configuration for the most efficient usage.

    git config --global user.name "John Doe"
    git config --global user.email "johndoe@crakmedia.com"

## How to install

### Unix

    cd ~
    yum install npm nodejs
    npm install -g yo
    rm -rf generator-php-component /lib/node_modules/generator-php-component
    git clone ssh://git@git.repository.lan/cn/generator-php-component.git
    cd generator-php-component
    npm install
    npm link
    cd -

### Windows

    TODO

## How to use

    [johndoe@workstation ~]$ yo php-component

    ~~~~ PHP Component Generator ~~~~
    [?] Author name: John Doe
    [?] Author email: johndoe@crakmedia.com
    [?] Git repository URL: ssh://git@git.repository.lan/~johndoe/awesome-stuff.git
    [?] Component ID: awesome-stuff
    [?] Component name: AwesomeStuff
    [?] Destination folder: awesome-stuff-component

       create .gitignore
       create phpunit.xml.dist
       create composer.json
       create README.md
       create src/SampleClass.php
       create test/Unit/SampleUnitTest.php

    Loading composer repositories with package information
    Installing dependencies (including require-dev)
      - Installing sebastian/version (1.0.3)
        Loading from cache

      [...]

    phpunit/phpunit-mock-objects suggests installing ext-soap (*)
    phpunit/phpunit suggests installing phpunit/php-invoker (~1.1)
    Writing lock file
    Generating autoload files

    ~~~~ In order to init a new Git repository (copyu/paste) ~~~~

    	cd /home/johndoe/work/generator-php-component/awesome-stuff-component\ && git init\
    	&& git add --all\ && git commit -m 'Initial Commit'\
    	&& git remote add origin ssh://git@git.repository.lan:7999/~johndoe/awesome-stuff.git\
    	&& git push origin master

At this step the project is ready. You can make a phpunit and start!

    [johndoe@workstation ~]$ cd awesome-stuff-component
    [johndoe@workstation ~/awesome-stuff-component]$ phpunit
    PHPUnit 4.3.5 by Sebastian Bergmann.

    Configuration read from /home/johndoe/awesome-stuff-component/phpunit.xml.dist

    Time: 69 ms, Memory: 8.25Mb

    OK (1 test, 2 assertions)

    Generating code coverage report in HTML format ... done

### The project structure will be:

    /awesome-stuff-component
        /src
            SampleClass.php
        /test
            /Mock
                SampleAssertsTrait.php
            /Unit
                SampleUnitTest.php
        vendor/
        .gitignore
        composer.json
        composer.lock
        phpunit.xml.dist
        README.md
