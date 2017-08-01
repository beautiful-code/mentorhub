pipeline {
  agent any
  stages {
    stage('Bundler') {
      steps {
        sh '''/bin/bash --login
bundle install'''
      }
    }
    stage('Rubocop') {
      steps {
        sh '''/bin/bash --login
bundle exec rubocop'''
      }
    }
    stage('Rspec') {
      steps {
        sh '''/bin/bash --login
bundle exec rspec spec/'''
      }
    }
  }
}