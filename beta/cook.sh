git clone https://github.com/libremesh/lime-sdk.git
cd lime-sdk
sudo docker build -t cooker .
git clone https://github.com/MoinhoDigital/network-profiles.git communities
sudo docker run -v "$(pwd)":/app cooker -f
./snippets/regdbtz.sh
sudo docker run -v "$(pwd)":/app cooker -b ar71xx/generic --remote
sudo docker run -v "$(pwd)":/app cooker -c ar71xx/generic --profile=tl-wdr3500-v1 --community=moinho/comun --remote J=1 V=s
sudo docker run -v "$(pwd)":/app cooker -c ar71xx/generic --profile=tl-wdr3600-v1 --community=moinho/comun --remote J=1 V=s
sudo docker run -v "$(pwd)":/app cooker -c ar71xx/generic --profile=tl-wr1043nd-v3 --community=moinho/comun --remote J=1 V=s