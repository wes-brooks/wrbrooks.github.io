#!/bin/sh

# User specific environment and startup programs
HOME=/home/wesley
PATH=$PATH:$HOME/bin
export PATH

#Ruby environment variables:
export GEM_HOME=$HOME/gems
export RUBYLIB=$HOME/gems/lib
export PATH=$HOME/gems/bin:$PATH

which jekyll
echo `jekyll build`
