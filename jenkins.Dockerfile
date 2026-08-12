FROM jenkins/jenkins:lts

USER root

# install node + npm so the pipeline can run npm install / npm test
RUN apt-get update && \
    apt-get install -y nodejs npm && \
    apt-get clean

USER jenkins