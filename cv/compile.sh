#! /bin/bash

mkdir -p aux

pdflatex -output-directory=aux cv
bibtex aux/cv
pdflatex -output-directory=aux cv
pdflatex -output-directory=aux cv

mv aux/cv.pdf ./