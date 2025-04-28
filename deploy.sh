#!/bin/bash
set -e  # Exit on error

SERVICE_NAME=$1       # e.g. service-registry
CONTAINER_NAME=$2     # e.g. service-registry (usually same)
CONTAINER_PORT=$3     # e.g. 8761
HEALTH_ENDPOINT=${4:-/actuator/health}  # optional 4th arg, default to /actuator/health
DOCKER_USERNAME=${DOCKER_USERNAME:-yourdockerhubusername}  # fallback if env var missing

echo "Deploying $SERVICE_NAME..."

# Save private key for SSH
echo "$EC2_PRIVATE_KEY" > ec2_key.pem
chmod 600 ec2_key.pem

wait_for_health() {
  local name=$1
  local url=$2
  local max_retries=12
  local retry_interval=5

  echo "Waiting for $name to be healthy at $url..."

  for i in $(seq 1 $max_retries); do
    status_code=$(curl -s -o /dev/null -w '%{http_code}' "$url" || echo "000")
    if [ "$status_code" == "200" ]; then
      echo "$name is healthy!"
      return 0
    else
      echo "Attempt $i/$max_retries: $name not healthy yet (status $status_code). Waiting..."
      sleep $retry_interval
    fi
  done

  echo "Timeout reached waiting for $name to be healthy."
  return 1
}

ssh -o StrictHostKeyChecking=no -i ec2_key.pem "$EC2_USER@$EC2_HOST" << EOF

  echo "Installing Docker if not present..."
  if ! command -v docker &> /dev/null; then
    sudo apt-get update
    sudo apt-get install -y ca-certificates curl gnupg lsb-release

    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

    echo \
      "deb [arch=\$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      \$(lsb_release -cs) stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io

    sudo usermod -aG docker \$USER
    newgrp docker
    sudo systemctl enable docker
    sudo systemctl start docker
  fi

  echo "Pulling Docker image..."
  sudo docker pull $DOCKER_USERNAME/$SERVICE_NAME:latest

  echo "Stopping old container if it exists..."
  sudo docker stop $CONTAINER_NAME || true
  sudo docker rm $CONTAINER_NAME || true

  echo "Creating Docker network if it doesn't exist..."
  sudo docker network inspect my-microservice-network >/dev/null 2>&1 || \
  sudo docker network create my-microservice-network

  echo "Running new container..."
  sudo docker run -d --name $CONTAINER_NAME --network my-microservice-network -p $CONTAINER_PORT:$CONTAINER_PORT $DOCKER_USERNAME/$SERVICE_NAME:latest

EOF

# Wait for the service health externally from GitHub runner (not inside SSH)
wait_for_health "$SERVICE_NAME" "http://$EC2_HOST:$CONTAINER_PORT$HEALTH_ENDPOINT"
