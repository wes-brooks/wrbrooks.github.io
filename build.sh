#!/bin/sh

# User specific environment and startup programs
HOME=/home/wesley
PATH=$PATH:$HOME/bin
export PATH 

#Ruby environment variables:
export GEM_HOME=$HOME/gems2.1
export RUBYLIB=$HOME/gems2.1/lib
export PATH=$HOME/gems2.1/bin:$PATH

which jekyll
echo `jekyll build`
