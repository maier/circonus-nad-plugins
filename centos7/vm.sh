#!/bin/bash

me=$(basename ${0%.sh})
units="-b"
[[ "$me" == "vmk" ]] && units="-k"
[[ "$me" == "vmm" ]] && units="-m"
[[ "$me" == "vmg" ]] && units="-g"

print_vm() {
    printf "%s\`%s\tL\t%s\n" $1 $2 $3
}

MEM=($(free $units | grep ^Mem:))
MEM_TOTAL=${MEM[1]}
# For consistency across platforms, count cache as free, not used
#let MEM_USED=${MEM[1]}-${MEM[3]}-${MEM[5]}-${MEM[6]}   # centos7 results in negative number
let MEM_USED=${MEM[2]}
#let MEM_FREE=${MEM[3]}+${MEM[5]}+${MEM[6]}             # centos7 results in more memory than is physically on the host
let MEM_FREE=${MEM[3]}+${MEM[5]}
MEM_PERC=$(awk -v u=$MEM_USED -v t=$MEM_TOTAL 'BEGIN { print u / t }')

SWAP=($(free $units | grep ^Swap:))
SWAP_TOTAL=${SWAP[1]}
SWAP_USED=${SWAP[2]}
SWAP_FREE=${SWAP[3]}
SWAP_PERC=0
if [[ $SWAP_TOTAL -gt 0 ]]; then
	SWAP_PERC=$(awk -v u=$SWAP_USED -v t=$SWAP_TOTAL 'BEGIN { print u / t }')
fi

# pgfault is min+maj
PG_FAULTS=$(grep ^pgfault /proc/vmstat | awk '{ print $2 }')
PG_MAJFAULTS=$(grep ^pgmajfault /proc/vmstat | awk '{ print $2 }')
let PG_MINFAULTS=$PG_FAULTS-$PG_MAJFAULTS

print_vm memory total $MEM_TOTAL
print_vm memory used $MEM_USED
print_vm memory free $MEM_FREE
printf "memory\`percent_used\tn\t%0.2f\n" $MEM_PERC
print_vm swap total $SWAP_TOTAL
print_vm swap used $SWAP_USED
print_vm swap free $SWAP_FREE
printf "swap\`percent_used\tn\t%0.2f\n" $SWAP_PERC
print_vm info page_fault $PG_FAULTS
print_vm info page_fault\`minor $PG_MINFAULTS
print_vm info page_fault\`major $PG_MAJFAULTS
