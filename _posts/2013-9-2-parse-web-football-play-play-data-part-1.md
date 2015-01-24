---
layout: post
title:  "Scrape the web for football play-by-play data, part 1"
date:   2013-9-2
categories: rstats
tags: blog
---

UPDATE x2: [part two](http://somesquares.org/blog/2013/9/scrape-web-football-play-play-data-part-2) is up, where we parse the detailed play-by-play data for one game. Next up: compiling a database of plays from many games.

UPDATE: [part 1.5](http://somesquares.org/blog/2013/9/scrape-web-football-play-play-data-part-15) uses [XPath](http://www.w3schools.com/xpath/xpath_intro.asp) to traverse the webpage for the relevant data, rather than running regular expressions directly on the HTML, as I've done here. The code in the linked post supersedes this one.

##Football's back everyone!
My fascination (obsession, Kate might say) with sports is not a minority position nationally, let alone in Madison, Wisconsin. Yet within my social milieu, it stands out. In order to clothe it in respectability, I'm forced to turn it into that most euphemistic of bores: a *learning experience*.

So if my friends want to learn from my blog how to scrape text data from the Web and analyze it in R, then dammit they're going to have to hear about football in the bargain.

##The lay of the land
So. You're hoping to start a career analyzing college football advanced statistics, and you're going to need data. Happily, scorekeeping seems fairly well standardized across college football. Sadly, the play-by-play is pretty rudimentary - for each play we get the location, the down and distance to go, the passer and/or ball carrier, the yardage gained, and sometimes the tackler. Time on the clock is recorded at the beginning of each drive. Short of a herculean effort like [Football Outsiders](http://www.footballoutsiders.com/) is putting in as they re-watch every professional game ever played, that's the data that's available.

With something like 100 games happening each week, you're not going to enter your data by hand, are you? No! You, dear reader, are much too smart for that. You're going to scrape [ESPN's website](http://scores.espn.go.com/ncf/scoreboard) for the play-by-play data and parse it with [regular expressions](http://en.wikipedia.org/wiki/Regular_expression).

##Aw shit, he's processing text in R
The web is made of text and you already told me that you're going to process the websites via regular expressions, so obviously we'll write our play-by-play processing script in [python](http://docs.python.org/2/library/re.html) or [perl](http://perldoc.perl.org/perlre.html), right? I wish I could tell you that living in the year 2013 meant scripting everything in python, Junior, but life's not going to just serve up pure buttered Win on a platter. We'll parse the webpage in [R](http://www.r-project.org) because we want to eventually analyze our data in R.

While it would be possible to use python to parse the webpages into R-friendly tables, I'm going to use R for everything. Again, it's a *learning experience*.

The script is below. Some of the R manpages I used while creating this script are:

* [**generic R regex**](http://stat.ethz.ch/R-manual/R-devel/library/base/html/regex.html) - All the details you don't find in the other manpages are probably here.
* [**gregexpr**](http://stat.ethz.ch/R-manual/R-devel/library/base/html/grep.html) - Match a pattern multiple times on a single string, returning indexes and lengths of the matched substring and any captured groups.
* [**substr**](http://stat.ethz.ch/R-manual/R-devel/library/base/html/substr.html) - Extract substrings from a longer string using the index of the substring's first and last characters.
* [**adist**](http://stat.ethz.ch/R-manual/R-devel/library/utils/html/adist.html) - The 'distance' between two strings, which I use to decipher the various team name abbreviations.

##The script
Without further ado, the script to turn [the play-by-play from Wisconsin's 2013 season-opening win against Massachusetts](http://scores.espn.go.com/ncf/playbyplay?gameId=332430275&period=0) into a list of plays with some metadata (down, distance to go, distance from the goal line, and approximate time remaining). In a later installment, we'll parse the remaining HTML to extract the play type, the passer and/or ball-carrier, and the yards gained.

{% highlight r %}
#Load the raw data and extract the part including 'mod-pbp', the play-by-play module.
raw = scan("http://scores.espn.go.com/ncf/playbyplay?gameId=332430275&period=0", what=character(0), sep='\n')
index = grep('mod-pbp', raw)
pbp = raw[index]

#Quarter breaks:
quarters = c('1st', '2nd', '3rd', '4th')
starts = sapply(quarters, function(x) {paste(x, "Quarter Play by Play")})
breaks = lapply(starts, function(x) {regexpr(x,pbp)})

#Get the play-by-play for the four quarters into a list
quarter_pbp = list()
for (k in 1:4) {
    start = breaks[[k]][1] + attr(breaks[[k]], 'match.length')
    if (k<4) {end = breaks[[k+1]][1] - 1}
    else {end = nchar(pbp)}
    
    quarter_pbp[[k]] = substr(pbp, start, end)
}

#Drive breaks:
#Divide each quarter of play-by-play into drives:
#(Note that the kickoffs to begin each half will be considered drives here.)
drives = list()
for (k in 1:4) {
    #Begin by identifying the beginning of each drive:
    drivebreaks = gregexpr("(?<team>[A-Za-z]+) at (?<min>\\d{1,2}):(?<sec>\\d\\d)", quarter_pbp[[k]], perl=TRUE, fixed=FALSE)[[1]]
    
    for (j in 1:length(drivebreaks)) {
        start = drivebreaks[j]
        end = start + attr(drivebreaks, 'capture.length')[j,'team'] - 1
        teamname = substr(quarter_pbp[[k]], start, end)

        #Minutes remaining in the quarter when the drive begins
        minstart = attr(drivebreaks, 'capture.start')[j,'min']
        minlength = attr(drivebreaks, 'capture.length')[j,'min'] - 1
        minutes = substr(quarter_pbp[[k]], minstart, minstart + minlength)

        #Seconds remaining in the quarter when the drive begins
        secstart = attr(drivebreaks, 'capture.start')[j,'sec']
        seclength = attr(drivebreaks, 'capture.length')[j,'sec'] - 1
        seconds = substr(quarter_pbp[[k]], secstart, secstart + seclength)

        #Game time (in seconds) remaining at the beginning of the drive:
        time = ((4-k)*15 + as.numeric(minutes))*60 + as.numeric(seconds)
        
        #Extract the play-by-play for this drive:
        if (j<length(drivebreaks)) {nextstart = drivebreaks[j+1] - 1}
        else {nextstart = nchar(quarter_pbp[[k]])}
        end = start + attr(drivebreaks, 'match.length')[j]
        drive_pbp = substr(quarter_pbp[[k]], end, nextstart)
        
        #One drive can span the 1st-2nd or 3rd-4th quarters:
        i = length(drives)
        if ((k==2 || k==4) && j==1 && teamname==drives[[i]][['team']]) {
            drives[[i]][['pbp']] = paste(drives[[i]][['pbp']], drive_pbp, esp='')
        }

        #If this is a new drive then add it to the list.
        else {drives[[i+1]] = list(team=teamname, time=time, pbp=drive_pbp)}        

        #Use the beginning time of this drive to compute the duration of the previous drive:
        if (i>0) {drives[[i]][['duration']] = drives[[i]][['time']] - time}
    }
}

#Set the duration of the final drive equal to the 
drives[[length(drives)]][['duration']] = drives[[length(drives)]][['time']]

#Get the unique team names:
teams = unique(sapply(drives, function(x) {x[['team']]}))

#Summarize each play and attach metadata
plays = list()

for (k in 1:length(drives)) {
    #Divide the drive into plays:
    playbreak_regex = "(?<down>1st|2nd|3rd|4th|1ST|2ND|3RD|4TH) (and|AND) (?<togo>\\d{1,2}|goal|Goal|GOAL) at (?<field>[A-Za-z]{3,4}) (?<yardline>\\d{1,2})</td>" 
    playbreaks = gregexpr(playbreak_regex, drives[[k]][['pbp']], perl=TRUE, fixed=FALSE)[[1]]
    nplay = length(playbreaks)

    for (j in 1:nplay) {
        #Get the play-by-play for this play.
        if (j==nplay) {end = nchar(drives[[k]][['pbp']])}
        else {end = playbreaks[j+1]}
        pbp = substr(drives[[k]][['pbp']], playbreaks[j], end)

        ###Parse the play:
        #First the down:
        downstart = attr(playbreaks, 'capture.start')[j,'down']
        downlength = attr(playbreaks, 'capture.length')[j,'down'] - 1
        down = substr(drives[[k]][['pbp']], downstart, downstart+downlength)

        #Then the yards to go:
        togostart = attr(playbreaks, 'capture.start')[j,'togo']
        togolength = attr(playbreaks, 'capture.length')[j,'togo'] - 1
        togo = substr(drives[[k]][['pbp']], togostart, togostart+togolength)

        #Guestimate the game time remaining:
        time = drives[[k]][['time']] - (j-1)/nplay * drives[[k]][['duration']]

        ##How far from the end zone did the play begin?
        #Figure out which side of the field the play began from:
        fieldstart = attr(playbreaks, 'capture.start')[j,'field']
        fieldlength = attr(playbreaks, 'capture.length')[j,'field'] - 1
        field = substr(drives[[k]][['pbp']], fieldstart, fieldstart+fieldlength)

        #Figure out which yard-line the play began from:
        linestart = attr(playbreaks, 'capture.start')[j,'yardline']
        linelength = attr(playbreaks, 'capture.length')[j,'yardline'] - 1
        line = as.numeric(substr(drives[[k]][['pbp']], linestart, linestart+linelength))
    
        #which team name is the field most like?
        off = drives[[k]][['team']]
        def = teams[teams != off]
        offense_unlike = adist(off, field, costs=list(insertions=2, deletions=0, substitutions=1), ignore.case=TRUE)
        defense_unlike = adist(def, field, costs=list(insertions=2, deletions=0, substitutions=1), ignore.case=TRUE)

        #Now compute the distance from the goal line:
        if (offense_unlike < defense_unlike) {dist = 100 - line}
        else {dist = line}

        #Add this play to the list
        plays[[length(plays)+1]] = list(down=down, togo=togo, time=time, dist=dist, pbp=pbp)
    }
}
{% endhighlight %}