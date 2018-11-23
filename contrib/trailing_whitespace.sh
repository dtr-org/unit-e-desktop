#!/bin/bash

! find . \( -name node_modules -o -name dist \) -prune -o \
         \( -name '*.ts' -o -name '*.html' -o -name '*.js' -o -name '*.scss' \) -exec grep -n ' \s\+$' {} +
