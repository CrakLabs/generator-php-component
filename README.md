
# Yeoman PHP Component generator

## Pre-configuration

Please set correctly your global git user configuration for the most efficient usage.

    git config --global user.name "John Doe"
    git config --global user.email "johndoe@crakmedia.com"

## How to install

    cd ~ && sudo yum install npm nodejs && sudo npm install yo \
      && rm -rf generator-php-component /lib/node_modules/generator-php-component \
      && git clone ssh://git@stash.crakmedia.lan:7999/cn/generator-php-component.git \
      && cd generator-php-component && npm install && sudo npm link && cd -

## How to use

    yo php-component

