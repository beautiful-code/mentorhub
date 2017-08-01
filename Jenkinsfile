pipeline {
  agent any
  stages {
    stage('Bundler') {
      steps {
        sh '''/bin/bash --login
/usr/local/rvm/bin/rvm use 2.3.1
bundle install'''
      }
    }
    stage('Rubocop') {
      steps {
        sh 'bundle exec rubocop'
      }
    }
    stage('Rspec') {
      steps {
        sh 'bundle exec rspec spec/'
      }
    }
  }
}