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
                script {
                    // Extract the latest commit message
                    def commitMsg = sh(script: 'git log -1 --pretty=%B', returnStdout: true).trim()

                    // Check if the message contains [skip ci]
                    if (commitMsg.contains('[skip ci]')) {
                        echo "Skipping pipeline execution: [skip ci] detected in commit message."
                        currentBuild.result = 'ABORTED'
                        return
                    }
                }
            }
        }

        stage('Install backend deps') {
            when { expression { currentBuild.result != 'ABORTED' } }
            steps {
                dir('Backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Run tests') {
            when { expression { currentBuild.result != 'ABORTED' } }
            steps {
                dir('Backend') {
                    sh 'npm test'
                }
            }
        }

        stage('Deploy to server') {
            when { expression { currentBuild.result != 'ABORTED' } }
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
            when { expression { currentBuild.result != 'ABORTED' } }
            steps {
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
        aborted {
            echo 'Pipeline skipped — [skip ci] detected in commit message.'
        }
    }
}