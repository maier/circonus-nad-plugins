#!/usr/bin/env bash

AWK=$(type -P awk)
[[ $? -eq 0 ]] || { 
	echo "Unable to find 'awk'"
	exit 1
}

PROCFILE="/proc/meminfo"
[[ -f "$PROCFILE" ]] || {
	echo "Unable to find '${PROCFILE}'"
	exit 1
}

set -eu

$AWK 'BEGIN {
	list[""] = 0;
}
{
	item=$1
	value=$2
	
	if ((idx = index(item, ":")) > 0) {
		item = substr(item, 1, idx - 1)
	}

	list[item] = value
}
END {
	memTotal=list["MemTotal"]

	memFree=list["MemFree"]
	memBuffers=list["Buffers"]
	memCached=list["Cached"]
	memFreeTotal=(memFree + memBuffers + memCached)

	memUsed=memTotal - memFreeTotal
	memFreePct=memFreeTotal / memTotal
	memUsedPct=memUsed / memTotal

    swapTotal=list["SwapTotal"]
    swapFree=list["SwapFree"]
    swapUsed=swapTotal - swapFree
    swapFreePct=swapFree / swapTotal
    swapUsedPct=swapUsed / swapTotal

	for (key in list) {
		if (key != "") {
			printf("%s\tL\t%d\n", key, list[key])
		}
	}

    printf("MemUsed\tL\t%d\n", memUsed)
    printf("MemFreeTotal\tL\t%d\n", memFreeTotal)
	printf("MemFreePct\tn\t%.02f\n", memFreePct)
	printf("MemUsedPct\tn\t%.02f\n", memUsedPct)
    printf("SwapUsed\tL\t%d\n", swapUsed)
	printf("SwapFreePct\tn\t%.02f\n", swapFreePct)
	printf("SwapUsedPct\tn\t%.02f\n", swapUsedPct)
	
}' < $PROCFILE

