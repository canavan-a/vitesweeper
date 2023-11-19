## Manually push container to AWS using:

aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin {account id}.dkr.ecr.us-east-2.amazonaws.com

## Tag local image

docker tag vitesweeper:latest 766216391680.dkr.ecr.us-east-2.amazonaws.com/vitesweeper:latest

## Push tagged image

docker push 766216391680.dkr.ecr.us-east-2.amazonaws.com/vitesweeper:latest