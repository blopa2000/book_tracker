pipeline {
  agent any

  environment {
    BACKEND_DIR = "backend"
    FRONTEND_DIR = "frontend"
    CODECOV_TOKEN = credentials('codecov-token') // solo si tu repo es privado
  }

  stages {
    stage('Clonar repositorio') {
      steps {
        echo '📦 Clonando el repositorio...'
        deleteDir()
        git url: 'https://github.com/blopa2000/book_tracker.git', branch: 'main'
      }
    }

    stage('Instalar dependencias') {
      agent {
        docker {
          image 'cimg/node:22.6.0'
          args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
      }
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
      agent {
        docker {
          image 'cimg/node:22.6.0'
          args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
      }
      steps {
        dir("${BACKEND_DIR}") {
          sh 'npm run test'      // genera coverage
          sh 'npx codecov'       // sube coverage
        }

        dir("${FRONTEND_DIR}") {
          sh 'npm run test'      // genera coverage
          sh 'npx codecov'       // sube coverage
        }
      }
    }

    stage('Construir y Desplegar con Docker') {
      agent {
        docker {
          image 'cimg/node:22.6.0'
          args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
      }
      steps {
        //SE CREA EL .env ANTES DE LEVANTAR DOCKER
        sh '''
          echo "PORT=5000" > backend/.env
          echo "MONGO_URI=mongodb://mongo:27017/book_tracker" >> backend/.env
        '''

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
