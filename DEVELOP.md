
```
## Install Docker from apt repo

# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin 

# test
docker run hello-world


# If error intall docjer rootless

https://docs.docker.com/engine/security/rootless/

    sudo groupadd docker
    sudo usermod -aG docker $USER

dockerd-rootless-setuptool.sh install
[INFO] Creating /home/testuser/.config/systemd/user/docker.service
...
[INFO] Installed docker.service successfully.
[INFO] To control docker.service, run: `systemctl --user (start|stop|restart) docker.service`
[INFO] To run docker.service on system startup, run: `sudo loginctl enable-linger testuser`

[INFO] Make sure the following environment variables are set (or add them to ~/.bashrc):

export PATH=/usr/bin:$PATH
export DOCKER_HOST=unix:///run/user/1000/docker.sock


sudo apt-get install -y docker-ce-rootless-extras

dockerd-rootless-setuptool.sh install --force


#install gpu drivers


https://developer.nvidia.com/cuda-downloads?target_os=Linux&target_arch=x86_64&Distribution=Ubuntu&target_version=24.04&target_type=deb_network

https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html

https://github.com/NVIDIA/nvidia-container-toolkit


#get the repo

git clone git@github.com:germanztz/private-gpt.git

 
chmod -Rf 777 models/
chmod -Rf 777 local_data/

docker-compose --profile llamacpp-cpu up

```
