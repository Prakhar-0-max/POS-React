#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# POS System — EC2 Server Setup Script
# Run this on a fresh Amazon Linux 2023 / Ubuntu 22.04 EC2 instance
# ═══════════════════════════════════════════════════════════════

set -e

echo "🚀 POS System - EC2 Setup Script"
echo "================================="

# ─── Detect OS ───
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
fi

# ─── Install Docker & Docker Compose ───
echo "📦 Installing Docker..."

if [ "$OS" = "amzn" ]; then
    # Amazon Linux 2023
    sudo yum update -y
    sudo yum install -y docker git
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker ec2-user

    # Docker Compose
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose

elif [ "$OS" = "ubuntu" ]; then
    # Ubuntu 22.04
    sudo apt update -y
    sudo apt install -y docker.io docker-compose git
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker ubuntu
fi

echo "✅ Docker installed!"

# ─── Clone the project ───
echo "📥 Please clone your project:"
echo "   git clone <your-repo-url> /home/\$USER/pos-system"
echo "   cd /home/\$USER/pos-system"
echo ""
echo "📝 Then create .env file with your RDS credentials:"
echo "   Copy from backend/.env.example"
echo ""
echo "🏗️  Then run:"
echo "   docker-compose up -d --build"
echo ""
echo "🔍 Check status:"
echo "   docker-compose ps"
echo "   docker-compose logs -f backend"
echo ""
echo "🌐 Access:"
echo "   Frontend: http://<EC2-PUBLIC-IP>:3000"
echo "   Backend:  http://<EC2-PUBLIC-IP>:8080/api"
echo "   Health:   http://<EC2-PUBLIC-IP>:8080/actuator/health"
