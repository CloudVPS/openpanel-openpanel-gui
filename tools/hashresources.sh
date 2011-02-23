#!/bin/bash

HTML=$1

for resource in `find -type f`; do
    resource=`expr "$resource" : '\./\(.*\)'`
    if grep -q "$resource" "$HTML" ; then
        hash=`md5sum "$resource"`
        #echo "$resource?${hash:0:8}"
        
        sed -i "s^=\"$resource\"^=\"/$resource?${hash:0:12}\"^" "$HTML"
        sed -i "s^url($resource)^url(/$resource?${hash:0:12})^" "$HTML"
        sed -i "s^=\"/$resource\"^=\"/$resource?${hash:0:12}\"^" "$HTML"
        sed -i "s^url(/$resource)^url(/$resource?${hash:0:12})^" "$HTML"
    fi
done
