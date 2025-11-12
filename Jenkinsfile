pipeline {
  agent {
    docker {
      image 'cimg/node:22.6.0'   // Imagen con Node y npm ya instalados
      args '-v /var/run/docker.sock:/var/run/docker.sock' // permite usar Docker
    }
  }

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
        sh 'docker-compose down || true'
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
