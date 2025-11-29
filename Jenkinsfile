pipeline {
  agent {
    docker {
      image 'cimg/node:22.6.0'
      args '-v /var/run/docker.sock:/var/run/docker.sock'
    }
  }

  environment {
    BACKEND_DIR = "backend"
    FRONTEND_DIR = "frontend"
  }

  stages {
    stage('Clonar repositorio') {
      steps {
        echo '📦 Clonando repositorio...'
        deleteDir()
        git url: 'https://github.com/blopa2000/book_tracker.git', branch: 'main'
      }
    }

    stage('Instalar dependencias') {

      steps {
        dir("${BACKEND_DIR}") {
          sh 'npm install'
        }

        dir("${FRONTEND_DIR}") {
          sh 'npm install'
        }
      }
    }

    stage('Ejecutar tests y subir cobertura') {

      steps {
        withCredentials([string(credentialsId: 'codecov-token', variable: 'CODECOV_TOKEN')]) {

          dir("${BACKEND_DIR}") {
            sh 'npm test'
            sh 'npx codecov -t $CODECOV_TOKEN'
          }

          dir("${FRONTEND_DIR}") {
            sh 'npm test'
            sh 'npx codecov -t $CODECOV_TOKEN'
          }

        }
      }
    }

  }

  post {
    success {
      echo "✅ Pipeline completado con éxito"
    }
    failure {
      echo "❌ Error en la ejecución del pipeline"
    }
  }
}
