#!/usr/bin/env bash

AWK=$(type -P awk)
[[ $? -eq 0 ]] || {
    echo "Unable to find 'awk'"
    exit 1
}

PROCFILE="/proc/vmstat"
[[ -f "$PROCFILE" ]] || {
    echo "Unable to find '${PROCFILE}'"
    exit 1
}

set -eu

$AWK '{ printf("%s\tL\t%d\n", $1, $2) }' < $PROCFILE
