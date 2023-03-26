#!/bin/sh
yarn build
/usr/bin/time -f 'Arrays: \t%E time,\t%M bytes memory' node dist/benchmarks/arrays.js
/usr/bin/time -f 'Iterators: \t%E time,\t%M bytes memory' node dist/benchmarks/iterators.js
