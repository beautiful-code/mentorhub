pipeline {
  agent any
  stages {
    stage('Bundler') {
      steps {
        sh 'bundle install'
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