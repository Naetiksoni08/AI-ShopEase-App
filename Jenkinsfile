pipeline {
    agent any

    environment {
        DEPLOY_HOST = 'ec2-user@52.64.235.225'
        DEPLOY_PATH = '/home/ec2-user/AI-ShopEase-App'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install backend deps') {
            steps {
                dir('Backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Run tests') {
            steps {
                dir('Backend') {
                    sh 'npm test'
                }
            }
        }

        stage('Deploy to server') {
            steps {
                sshagent(credentials: ['ec2-deploy-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${DEPLOY_HOST} '
                            cd ${DEPLOY_PATH} &&
                            git pull origin master &&
                            docker compose up -d --build
                        '
                    """
                }
            }
        }

        stage('Health check') {
            steps {
                // FIXED: Wrapped the ssh command with sshagent
                sshagent(credentials: ['ec2-deploy-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${DEPLOY_HOST} '
                            curl -sf http://localhost || exit 1
                        '
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment succeeded — app is live.'
        }
        failure {
            echo 'Pipeline failed — check the stage logs above.'
        }
    }
}