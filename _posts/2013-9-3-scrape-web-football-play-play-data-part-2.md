---
layout: post
title:  "Scrape the web for football play-by-play data, part 2"
date:   2013-9-4
categories: rstats
tags: blog
---

UPDATE: [Part three](http://somesquares.org/blog/2015/1/scrape-football-data-3) of this series introduces the R package `pbp`, which contains the most up-to-date version of this software.

Last things first: here's an extremely quick look at the distribution of rushing gains by Wisconsin's running backs in [that game](http://scores.espn.go.com/ncf/playbyplay?gameId=332430275&period=0), based on the script we're developing in this series:

{% highlight r %}
library(ggplot2)

#Get the plays where one of Wisconsin's running backs carried the ball:
rbs = c("Melvin Gordon", "James White", "Corey Clement")
subset = play_table[play_table$carrier %in% rbs & play_table$rush,]

#Make a ggplot2 boxplot:
p = ggplot(subset, aes(carrier, gain))
p + geom_boxplot(aes(fill=carrier))
{% endhighlight %}

![UW-RBs](http://somesquares.org/static/img/uw-rbs.jpg){:.pure-img}

This is part two in a series. It will make more sense if you begin with [part one](http://somesquares.org/blog/2013/9/parse-web-football-play-play-data-part-1), or at least [part 1.5](http://somesquares.org/blog/2013/9/scrape-web-football-play-play-data-part-15).

####The story thus far
At this point we have a list in R called `plays`, with an entry for each play in a given college football game. Each item in the list is itself a list, with the elements `poss`, indicating possession; `down` for the down; `togo` for the yards to go; `dist`, the distance to the goal line; `time`, the approximate game time remaining (in seconds); and `pbp`, the narrative play-by-play text for this play.

An example play-by-play string:

    Stacey Bedell rush for no gain, fumbled, forced by Brendan Kelly, recovered by Wisc Ethan Armstrong at the UMass 35.
    
Obviously, that's information we want to be able to analyze, but the computer is dumb and can't understand a simple, non-grammatical sentence like that one.

Once again, we turn to regular expressions. We'll divide all possible football plays into a few types and compare the play-by-play for each play to a regex for each type of play. When the play matches a type, we can extract the roles that are relevant to that play typ (e.g. pass plays have a passer and a receiver but rush plays only have a ball-carrier). I've chosen to break plays into these categories (each bullet point will get its own regular expression):

#####Special teams:
 * kickoff
 * punt
 * extra point (PAT)
 * field goal
 
#####Scrimmage plays:
 * rush
 * pass
 * interception

#####Results: 
 * fumble
 * penalty
 * touchdown
 * first down

#####Other:
 * timeout
 
In each case, we're going to use the utility function `regex` from the [earlier post](http://somesquares.org/blog/2013/9/scrape-web-football-play-play-data-part-15) to extract named groups matching the play's roles.
 
Note that college football scores a sack as a rush, which is silly. But negative rush plays are not uncommon, so in order to reclassify sacks as pass plays we need to figure out who are the quarterbacks and then call any quarterback run for negative yardage a sack. IFor tis purpose, I've chosen to call any player who throws at least two passes in a game a quarterback.

Some scorers record tacklers but most don't. I haven't bothered trying to catch tacklers here.

Here's the code. It should work if appended to the code from [part 1.5](http://somesquares.org/blog/2013/9/scrape-web-football-play-play-data-part-15):

{% highlight r %}
#Special teams plays:
kickoff_regex = "(?<kicker>[-a-zA-Z\\. ']+) kickoff for (?<kickdist>\\d{1,3}) yards? (returned by (?<returner>[-a-zA-Z\\. ']+) for ((?<retgain>\\d{1,3}) yards|(a )?loss of (?<retloss>\\d+) yards?|(?<retnogain>no gain))|.*(?<touchback>touchback)).*"
punt_regex = "(?<punter>[-a-zA-Z\\. ']+) punt for (?<kickdist>\\d{1,3}) yards?(.*(?<touchback>touchback).*|.*out[- ]of[- ]bounds at|.*fair catch by (?<catcher>[-a-zA-Z\\. ']+) at|.*returned by (?<returner>[-a-zA-Z\\. ']+) (for ((?<retgain>\\d{1,3}) yards|(a )?loss of (?<retloss>\\d+) yards?|(?<retnogain>no gain)))?)?"
fg_regex = "(?<kicker>[-a-zA-Z\\. ']+) (?<kickdist>\\d{1,3}) yards? field goal (?<made>GOOD|MADE)|(?<missed>MISSED|NO GOOD).*"
pat_regex = "(?<kicker>[-a-zA-Z\\. ']+) extra point (?<made>GOOD|MADE)|(?<missed>MISSED|NO GOOD)"

#Scrimmage plays
rush_regex = "(?<player>[-a-zA-Z\\. ']+) rush [\\s\\w]*for ((?<gain>\\d+) yards?|(a )?loss of (?<loss>\\d+) yards?|(?<nogain>no gain))"
pass_regex = "(?<QB>[-a-zA-Z\\. ']+) pass (((?<complete>complete)|(?<incomplete>incomplete))( to (?<receiver>[-a-zA-Z\\. ']+).*(?(complete) for ((?<gain>\\d+) yards?|(a )?loss of (?<loss>\\d+) yards?|(?<nogain>no gain))))?)?"

#Turnovers/timeouts/penalties:
fumble_regex = "fumbled?.*(forced by (?<forcer>[-a-zA-Z\\. ']+))?.*(recovered by (?<team>[a-zA-Z]+) (?<recoverer>[-a-zA-Z\\. ']+))?"
interception_regex = "intercept(ed|ion)? by (?<intercepter>[-a-zA-Z\\. ']+) at (the )?(?<side>[a-zA-Z]+) (?<yardline>\\d{1,2})[\\.,]?( returned for ((?<retgain>\\d{1,3}) yards|(a )?loss of (?<retloss>\\d+) yards?|(?<retnogain>no gain)))?"
penalty_regex = "(?<team>[-a-zA-Z\\. ']+) penalty (?<dist>\\d{1,3}) yards? (?<penalty>[-a-zA-Z\\. ']+)( on (?<player>[-a-zA-Z\\. ']+))? (?<decision>accepted|declined)"
timeout_regex = "Timeout (?<team>[-a-zA-Z\\. ']+).* (?<min>\\d{1,2})?:(?<sec>\\d\\d)"

#Results:
first_regex = "(?<first>1st down|first down)"
td_regex = "(?<touchdown>touchdown)"

#Establish the columns:
rush = pass = sack = td = first = punt = kickoff = fg = pat = INT = fumble = penalty = timeout = FALSE
poss = down = togo = time = dist = passer = carrier = kicker = returner = touchback = faircatch = kick_dist = kick_return = gain = fumble_return = int_return = made = intercepter = forced_by = recovered_by = penalized_team = penalized_player = penalty_dist = complete = NA
default_row = data.frame(poss, down, time, togo, dist, gain, rush, pass, complete, sack, td, first, punt, kickoff, fg, pat, INT, fumble, penalty, timeout, passer, carrier, kicker, returner, touchback, faircatch, kick_dist, kick_return, fumble_return, made, intercepter, int_return, forced_by, recovered_by, penalized_team, penalized_player, penalty_dist)

play_table = data.frame(matrix(NA, ncol=length(default_row), nrow=0))  
colnames(play_table) = colnames(default_row)

for (k in 1:length(plays)) {
    #Get the already-established metadata:
    this = default_row
    this$poss = plays[[k]][['poss']]
    this$down = plays[[k]][['down']]
    this$time = plays[[k]][['time']]
    this$togo = plays[[k]][['togo']]
    this$dist = plays[[k]][['dist']]

    pbp = plays[[k]][['pbp']]
    
    if (length(grep(fg_regex, pbp, perl=TRUE, fixed=FALSE, ignore.case=TRUE))>0) {
        match = regex(fg_regex, pbp, perl=TRUE, fixed=FALSE, ignore.case=TRUE)
        this$fg = TRUE
        this$kicker = match[['result']][1,'kicker']
        this$dist = match[['result']][1,'kickdist']
        if (!is.na(match[['result']][1,'made'])) {this$made = TRUE}
        else {this$made = FALSE}
    } else if (length(grep(punt_regex, pbp, perl=TRUE, fixed=FALSE, ignore.case=TRUE))>0) {
        match = regex(punt_regex, pbp, perl=TRUE, fixed=FALSE, ignore.case=TRUE)
        this$punt = TRUE
        this$kicker = match[['result']][1,'punter']
        this$returner = match[['result']][1,'returner']
        this$kick_dist = match[['result']][1,'kickdist']
        
        if (!is.na(match[['result']][1,'touchback'])) {
            this$touchback = TRUE
            this$kick_return = 0
        }
        if (!is.na(match[['result']][1,'catcher'])) {
            this$faircatch = TRUE
            this$returner = match[['result']][1,'catcher']
            this$kick_return = 0
        }
        
        if (!is.na(match[['result']][1,'retgain'])) {this$kick_return = as.numeric(match[['result']][1,'retgain'])}
        else if (!is.na(match[['result']][1,'retloss'])) {this$kick_return = -as.numeric(match[['result']][1,'retloss'])}
        else if (!is.na(match[['result']][1,'retnogain'])) {this$kick_return = 0}
    } else if (length(grep(rush_regex, pbp, perl=TRUE, fixed=FALSE, ignore.case=TRUE))>0) {
        match = regex(rush_regex, pbp, perl=TRUE, fixed=FALSE, ignore.case=TRUE)
        this$rush = TRUE
        this$carrier = match[['result']][1,'player']
        if (!is.na(match[['result']][1,'gain'])) {this$gain = as.numeric(match[['result']][1,'gain'])}
        else if (!is.na(match[['result']][1,'loss'])) {this$gain = -as.numeric(match[['result']][1,'loss'])}
        else if (!is.na(match[['result']][1,'nogain'])) {this$gain = 0}
    } else if (length(grep(pass_regex, pbp, perl=TRUE, fixed=FALSE, ignore.case=TRUE))>0) {
        match = regex(pass_regex, pbp, perl=TRUE, fixed=FALSE, ignore.case=TRUE)
        this$pass = TRUE
        this$passer = match[['result']][1,'QB']
        this$carrier = match[['result']][1,'receiver']
        
        if (!is.na(match[['result']][1,'gain'])) {this$gain = as.numeric(match[['result']][1,'gain'])}
        else if (!is.na(match[['result']][1,'loss'])) {this$gain = -as.numeric(match[['result']][1,'loss'])}
        else if (!is.na(match[['result']][1,'nogain'])) {this$gain = 0}
        
        if (!is.na(match[['result']][1,'complete'])) {this$complete = TRUE}
        else {
            this$complete = FALSE
            this$gain = 0
        }
    } else if (length(grep(timeout_regex, pbp, perl=TRUE, fixed=FALSE, ignore.case=TRUE))>0) {
    }
    
    #Fumbles, penalties, touchdowns, first downs can happen on any play:
    if (length(grep(penalty_regex, pbp, perl=TRUE, fixed=FALSE, ignore.case=TRUE))>0) {
        match = regex(penalty_regex, pbp, perl=TRUE, fixed=FALSE, ignore.case=TRUE)
        this$penalty = TRUE
    }
    if (length(grep(fumble_regex, pbp, perl=TRUE, fixed=FALSE, ignore.case=TRUE))>0) {
        match = regex(fumble_regex, pbp, perl=TRUE, fixed=FALSE, ignore.case=TRUE)
        this$fumble = TRUE
    }
    if (length(grep(td_regex, pbp, perl=TRUE, fixed=FALSE, ignore.case=TRUE))>0) {
        this$td = TRUE
        match = regex(pat_regex, pbp, perl=TRUE, fixed=FALSE, ignore.case=TRUE)
        if (!is.na(match[['result']][1,'made'])) {
            this$pat = TRUE
            this$made = TRUE
            this$kicker = match[['result']][1,'kicker']
        } else if (!is.na(match[['result']][1,'missed'])) {
            this$pat = TRUE
            this$made = FALSE
            this$kicker = match[['result']][1,'kicker']
        }
    }
    if (length(grep(first_regex, pbp, perl=TRUE, fixed=FALSE, ignore.case=TRUE))>0) {
        this$first = TRUE
    }
    if (length(grep(kickoff_regex, pbp, perl=TRUE, fixed=FALSE, ignore.case=TRUE))>0) {
        match = regex(kickoff_regex, pbp, perl=TRUE, fixed=FALSE, ignore.case=TRUE)
        this$kickoff = TRUE
        this$kicker = match[['result']][1,'kicker']
        this$returner = match[['result']][1,'returner']
        this$kick_dist = match[['result']][1,'kickdist']
        
        if (!is.na(match[['result']][1,'touchback'])) {
            this$touchback = TRUE
            this$kick_return = 0
        }
        
        if (!is.na(match[['result']][1,'retgain'])) {this$kick_return = as.numeric(match[['result']][1,'retgain'])}
        else if (!is.na(match[['result']][1,'retloss'])) {this$kick_return = -as.numeric(match[['result']][1,'retloss'])}
        else if (!is.na(match[['result']][1,'retnogain'])) {this$kick_return = 0}
    }
    if (length(grep(interception_regex, pbp, perl=TRUE, fixed=FALSE, ignore.case=TRUE))>0) {
        match = regex(interception_regex, pbp, perl=TRUE, fixed=FALSE, ignore.case=TRUE)
        this$pass = TRUE
        this$INT = TRUE
        this$complete = FALSE
        this$intercepter = match[['result']][1,'intercepter']
        
        if (!is.na(match[['result']][1,'retgain'])) {this$int_return = as.numeric(match[['result']][1,'retgain'])}
        else if (!is.na(match[['result']][1,'retloss'])) {this$int_return = -as.numeric(match[['result']][1,'retloss'])}
        else if (!is.na(match[['result']][1,'retnogain'])) {this$int_return = 0}
    }
    
    play_table = rbind(play_table, this)
}


#Sacks should count against passing, not rushing. Consider anyone who threw at least two passes a QB:
QBs = vector()
for (qb in unique(play_table$passer)) {
    if (!is.na(qb) && sum(play_table$passer==qb, na.rm=TRUE)) {
        QBs = c(QBs, qb)
    }
}

#Now any non-positive rush for a QB should be a sack.
sack_indx = which(play_table$rush & play_table$gain<=0 & play_table$carrier %in% QBs)
play_table$rush[sack_indx] = FALSE
play_table$pass[sack_indx] = TRUE
play_table$complete[sack_indx] = FALSE
play_table$sack[sack_indx] = TRUE
{% endhighlight %}

Of course, this data is just for one game. For more detailed analysis, we'll need to create a database of plays from several games. Stay tuned.