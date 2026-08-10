# Provisions the ShopEase EC2 instance + security group.
# Mirrors the manual setup: AL2023, t3.micro, existing key pair.
#
# Usage:
#   terraform init
#   terraform plan
#   terraform apply

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "ap-southeast-2"
}

# Always pull the latest AL2023 AMI instead of hardcoding an ID.
# Note: filter is scoped to the general-purpose release only —
# a looser pattern also matches the ECS-optimized variant, which
# ships with Docker preinstalled and no git.
data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_security_group" "shopease_sg" {
  name        = "shopease-terraform-sg"
  description = "Allow SSH and HTTP for ShopEase deployment"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "shopease-terraform-sg"
  }
}

resource "aws_instance" "shopease_server" {
  ami                    = data.aws_ami.amazon_linux_2023.id
  instance_type          = "t3.micro"
  key_name               = "naetik-devops"
  vpc_security_group_ids = [aws_security_group.shopease_sg.id]

  root_block_device {
    volume_size = 30
    volume_type = "gp3"
  }

  tags = {
    Name = "shopease-server-terraform"
  }
}

output "instance_public_ip" {
  value = aws_instance.shopease_server.public_ip
}

output "instance_id" {
  value = aws_instance.shopease_server.id
}
