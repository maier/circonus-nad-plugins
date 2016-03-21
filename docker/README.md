# Docker

## dev setup

```sh

cd ..
vagrant up
vagrant ssh -c "sudo yum install -y docker-engine"
vagrant ssh -c "sudo service docker start"
```

get a sample container up and running to have something output for testing:

```sh
vagrant ssh
sudo docker pull redis
sudo docker run --name redis -d redis
```

```sh
cd /vagrant/docker
/opt/node/bin/npm install
/opt/node/bin/node events.js
```

## install

1. copy contents of docker directory to `/etc/circonus/etc/node_agent.d/docker`
1. change to desination directory and run `/opt/circonus/embedded/bin/npm install`
1. create a config file, if needed, in `/opt/circonus/etc/docker.json`
1. create a symlink from `stats.js` to `../stats.js`

## stats

metrics from running containers.


## events

docker events sent to an httptrap check as text metrics.


## config

`/opt/circonus/etc/docker.json`

Default configuraiton uses `config.docker: null` resulting in default settings being pulled from the environment (e.g. DOCKER_HOST, DOCKER_TLS_VERIFY, DOCKER_CERT_PATH) or using the default Docker socket `/var/run/docker.sock`.

```json
{
  "docker": {
    "socketPath": "",
    "protocol": "",
    "host": "",
    "port": "",
    "version": "",
    "key": "",
    "cert": "",
    "ca": "",
    "timeout": 15,
    "checkSeverIdentity": true
  },
  "circonus": {
    "checkURL": "",
    "brokerCACertFile": ""
  }
}
```

`config.docker` should be null or a valid configuration for connecting to Docker. See [docker-modem](https://github.com/apocas/docker-modem) for `config.docker` settings/implementation details. If `config.circonus.brokerCACertFile` is not provided the default Circonus public broker certificate will be used. [http://login.circonus.com/pki/ca.crt](http://login.circonus.com/pki/ca.crt) (e.g. `curl http://login.circonus.com/pki/ca.crt -o brokerca.crt`)

The _events_ module **requires** `config.circonus.checkURL`. 
