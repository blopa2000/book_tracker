pipeline {
  agent any

  environment {
      BACKEND_DIR = "backend"
      FRONTEND_DIR = "frontend"
  }

  stages {
    stage('Clonar repositorio') {
      steps {
        git branch: 'main', url: 'https://github.com/blopa2000/book_tracker.git'
      }
    }

    stage('Construir Backend') {
      steps {
        dir("${BACKEND_DIR}") {
          sh 'npm install'
        }
      }
    }

    stage('Construir Frontend') {
      steps {
        dir("${FRONTEND_DIR}") {
          sh 'npm install'
          sh 'npm run build'
        }
      }
    }

    stage('Levantar Contenedores') {
      steps {
        sh 'docker-compose down'
        sh 'docker-compose up -d --build'
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
