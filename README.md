# Circonus NAD plugins

NAD plugin development.

* [apache/](apache/) pull metrics from Apache's server-status endpoint.
* [centos7/](centos7/) updated `vm.sh`
* [docker/](docker/) supports the Docker API stats and events endpoints.
* [linux/](linux/) `load.sh` and `df.sh`
* [mysql/](mysql/) MySQL *server* perspective

The Vagrantfile contains a CentOS 7 box definition and will install NAD and register the VM with Circonus.

```sh
cp example.cosi.yaml cosi.yaml
vi cosi.yaml
# edit settings and save
vagrant up
```

> Metric value note: (ref: [resmon docs](http://labs.omniti.com/labs/resmon/wiki/ModuleDevelopment))
> The possible types are as follows. Any other value gets changed to '0':
> * 0 - autodetect (this is the default)
> * i - signed 32 bit integer
> * I - unsigned 32 bit integer
> * l - signed 64 bit integer
> * L - unsigned 64 bit integer
> * n - double
> * s - string
> 
> Applies to text output for NAD and [httptrap](https://maier.circonus.com/user/docs/Data/CheckTypes#HTTPTrap)
