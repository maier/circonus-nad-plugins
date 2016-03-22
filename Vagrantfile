# -*- mode: ruby -*-
# vi: set ft=ruby :

require 'yaml'

cosi = YAML.load_file("cosi.yaml")

Vagrant.configure(2) do |config|
  config.vm.box = "maier/centos-7.2.1511-x86_64"
  config.vm.hostname = "nad-dev"
  
  # config.vm.provider "virtualbox" do |vb|
  #   # Display the VirtualBox GUI when booting the machine
  #   vb.gui = true
  #
  #   # Customize the amount of memory on the VM:
  #   vb.memory = "1024"
  # end
  #
  
  config.vm.provision "shell", inline: <<-SHELL
    # install the docker repo
    tee /etc/yum.repos.d/docker.repo <<-'EOF'
    [dockerrepo]
    name=Docker Repository
    baseurl=https://yum.dockerproject.org/repo/main/centos/$releasever/
    enabled=1
    gpgcheck=1
    gpgkey=https://yum.dockerproject.org/gpg
    EOF
    # update system base
    yum update -y
    # nad requires perl...
    yum install -y perl
    #
    # circonus one step install
    curl -sSL "https://onestep.circonus.com/install" | bash -s -- --agent push --key #{cosi["api_key"]} --app #{cosi["api_app"]}
    #
    # install dev version of node
    node_ver=#{cosi["node_version"]}
    echo && echo "Installing NodeJS v${node_ver}"
    mkdir /opt/node
    node_tgz="node-v${node_ver}-linux-x64.tar.gz"
    echo "downloading..."
    curl -sSL "https://nodejs.org/download/release/v${node_ver}/${node_tgz}" -o "/opt/node/${node_tgz}"
    echo "unpacking into /opt/node"
    tar -C /opt/node --strip-components=1 -zxf "/opt/node/${node_tgz}"
    [[ $(grep -c PATH /home/vagrant/.bashrc) -eq 0 ]] && echo 'PATH="$PATH:/opt/node/bin"' >> /home/vagrant/.bashrc
  SHELL
end
