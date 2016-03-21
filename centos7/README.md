# CentOS 7 VM

replacement for stock `vm.sh` which output negative number for **memory`used**

changes how used memory is calculated based on updated `free` output.

```sh
[root@nad-dev vagrant]# /opt/circonus/etc/node-agent.d/vm.sh
memory`total	L	1041264640
*memory`used	L	-547135488*
memory`free	L	1588400128
swap`total	L	1073737728
swap`used	L	0
swap`free	L	1073737728
info`page_fault	L	5969334
info`page_fault`minor	L	5968598
info`page_fault`major	L	736
```

versus

```sh
[root@nad-dev vagrant]# ./vm.sh
memory`total	L	1041264640
*memory`used	L	172998656*
memory`free	L	868265984
swap`total	L	1073737728
swap`used	L	0
swap`free	L	1073737728
info`page_fault	L	5974156
info`page_fault`minor	L	5973420
info`page_fault`major	L	736
```

## install

can be installed via a _cosi agent hook_ during initial system setup or, for existing systems, copy `vm.sh` to `/opt/circonus/etc/node_agent.d/linux/vm.sh`. If the vm script is already enabled, the changes will be picked up on the next polling cycle. Otherwise change to `/opt/circonus/etc/node_agent.d` and create a symlink (`ln -s linux/vm.sh vm.sh`).

