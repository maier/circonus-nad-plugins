#!/usr/bin/env bash

AWK=$(type -P awk)
[[ $? -eq 0 ]] || {
    echo "Unable to find 'awk'"
    exit 1
}

print_vm() {
    printf "%s\`%s\tL\t%s\n" $1 $2 $3
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

    if (substr(item, 0, 9) == "HugePages") {
        list[item] = value
    } else {
        list[item] = value * 8
    }
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
    if (swapTotal > 0) {
	    swapFreePct=swapFree / swapTotal
	    swapUsedPct=swapUsed / swapTotal
    } else {
	    swapFreePct=0
	    swapUsedPct=0
    }

    for (key in list) {
        if (key != "") {
            printf("meminfo`%s\tL\t%d\n", key, list[key])
        }
    }

    printf("memory`total\tL\t%d\n", memTotal)
    printf("memory`used\tL\t%d\n", memUsed)
    printf("memory`free\tL\t%d\n", memFreeTotal)
    printf("memory`percent_used\tL\t%.02f\n", memUsedPct)
    printf("memory`percent_free\tL\t%.02f\n", memFreePct)
    printf("swap`total\tL\t%d\n", swapTotal)
    printf("swap`used\tL\t%d\n", swapUsed)
    printf("swap`free\tL\t%d\n", swapFreeTotal)
    printf("swap`percent_used\tL\t%.02f\n", swapUsedPct)
    printf("swap`percent_free\tL\t%.02f\n", swapFreePct)
}' < $PROCFILE


PROCFILE="/proc/vmstat"
[[ -f "$PROCFILE" ]] || {
    echo "Unable to find '${PROCFILE}'"
    exit 1
}

# pgfault is min+maj
PG_FAULTS=$(grep ^pgfault $PROCFILE | $AWK '{ print $2 }')
PG_MAJFAULTS=$(grep ^pgmajfault $PROCFILE | $AWK '{ print $2 }')
let PG_MINFAULTS=$PG_FAULTS-$PG_MAJFAULTS

print_vm info page_fault $PG_FAULTS
print_vm info page_fault\`minor $PG_MINFAULTS
print_vm info page_fault\`major $PG_MAJFAULTS
