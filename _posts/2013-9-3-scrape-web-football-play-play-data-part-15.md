---
layout: post
title:  "Scrape the web for football play-by-play data, part 1.5"
date:   2013-9-3
---

UPDATE: [part two](http://somesquares.org/blog/2013/9/scrape-web-football-play-play-data-part-2) is up, where we parse the detailed play-by-play data for one game. Next up: compiling a database of plays from many games.

####Mea Culpa
After yesterday's post ([part one in this series](http://somesquares.org/blog/2013/9/parse-web-football-play-play-data-part-1)) some folks asked why was I applying regular expressions directly to HTML rather than using a tool like [XPath](http://www.w3schools.com/xpath/xpath_intro.asp) to navigate the DOM. The sad truth is that, prior to fielding those questions, I had no idea that XPath even existed, let alone its R implementation in the [XML package](http://cran.r-project.org/web/packages/XML/XML.pdf).

I've rewritten the example to use XPath, but we don't get to unleash its full power here because the play-by-play data we're scraping ([see this example](http://scores.espn.go.com/ncf/playbyplay?gameId=332430275&period=0)) is stored in a flat table. It seems to me that XPath will be most useful for highly structured data.

Nevertheless, stripping out all the HTML as XPath does makes it easier to write the regular expressions that will interpret the narrative play-by-play text (e.g., `Joel Stave pass complete to Jared Abbrederis for 65 yards for a TOUCHDOWN.`)

####A helper function
One thing we're going to do a lot of is run a regular expression against a string and then extract all the named capturing groups. To make life easier, I've written a utility function for that purpose. You pass in the pattern and the string to match; it returns a table where each row contains the complete set of named capturing groups (unmatched optional groups are returned as NA):

```r
regex = function(pattern, str, perl=TRUE, fixed=FALSE, ignore.case=TRUE) {
    #Process the regex
    match = gregexpr(pattern, str, perl=perl, fixed=fixed, ignore.case=ignore.case)[[1]]
    
    #Get the named capture groups
    capts = attr(match, 'capture.names')
    starts = attr(match, 'capture.start')
    lengths = attr(match, 'capture.length')
    
    #Remove unnamed captures:
    capts = capts[capts!=""]
    
    #Initialize the table of results
    result = matrix(NA, nrow=0, ncol=length(capts))
    
    #Produce a table of results where each row is a complete match
    for (j in 1:length(match)) {
        row = vector()
        
        #Loop through the possible capture groups and find those that matched.
        for (capt in capts) {
            start = starts[j,capt]
            length = lengths[j,capt]
            
            #Uncaptured groups are returned NA.
            if (length<=0) {row = c(row, NA)}
            else {
                #Remove leading and trailing whitespace:
                item = substr(str, start, start+length-1)
                item = gsub("[\\s\\.]*$","", item, perl=TRUE)
                item = gsub("^[\\s\\.]*","", item, perl=TRUE)
                row = c(row, item)
            }
        }
        
        #Add this match to the table
        result = rbind(result, row)
    }
    
    #Annotate the table and return it
    colnames(result) = capts
    return(result)
}
```

####Part 1 revisited

With that done, here's the code to duplicate yesterday's effort using XPath. The next part will extract detailed information for each play.

```r
#Load the raw data and extract the part including 'mod-pbp', the play-by-play module.
library(RCurl)
library(XML)

url = "http://scores.espn.go.com/ncf/playbyplay?gameId=332430275&period=0"
tree <- htmlTreeParse(url, isURL=TRUE, useInternalNodes=TRUE)

pbp <- xpathSApply(tree, paste(
    "//table[contains(@class,'mod-pbp')]/child::tr/td[position()<3]",
    "//table[contains(@class,'mod-pbp')]/child::tbody/tr/child::td[position()<3]",
    "//table[contains(@class,'mod-pbp')]/child::thead/tr/th[1]",
    "//table[contains(@class,'mod-pbp')]/child::thead/tr/td", sep=" | "), xmlValue) 


#Quarter breaks:
quarters = c('1st', '2nd', '3rd', '4th')
starts = sapply(quarters, function(x) {paste(x, "Quarter Play by Play")})
breaks = lapply(starts, function(x) {grep(x, pbp, ignore.case=TRUE)})

#Get the play-by-play HTML for the four quarters into a list
quarter_pbp = list()
for (k in 1:4) {
    start = breaks[[k]]
    if (k<4) {end = breaks[[k+1]]-1}
    else {end = length(pbp)}
    
    quarter_pbp[[k]] = pbp[start:end]
}

#Drive breaks:
#Divide each quarter of play-by-play into drives:
#(Note that the kickoffs to begin each half will be considered drives here.)
drives = list()
for (k in 1:4) {
    #Begin by identifying the beginning of each drive:
    drivebreaks = grep("(?<team>[A-Za-z ]+) at (?<min>\\d{1,2}):(?<sec>\\d\\d)", quarter_pbp[[k]], perl=TRUE, fixed=FALSE, ignore.case=TRUE)
    
    for (j in 1:length(drivebreaks)) {
        head = quarter_pbp[[k]][drivebreaks[j]] 
        match = regex("(?<team>[A-Za-z ]+) at (?<min>\\d{1,2}):(?<sec>\\d\\d)", head) 
        
        #Drive-level metadata:
        teamname = match[1,'team']
        minutes = match[1,'min']
        seconds = match[1,'sec']

        #Game time (in seconds) remaining at the beginning of the drive:
        time = ((4-k)*15 + as.numeric(minutes))*60 + as.numeric(seconds)
        
        #Extract the play-by-play HTML for this drive:
        if (j<length(drivebreaks)) {nextstart = drivebreaks[j+1]}
        else {nextstart = length(quarter_pbp[[k]])}
        drive_pbp = quarter_pbp[[k]][drivebreaks[j]:(nextstart-1)]

        #One drive can span the 1st-2nd or 3rd-4th quarters:
        i = length(drives)
        if ((k==2 || k==4) && j==1 && teamname==drives[[i]][['team']]) {
            drives[[i]][['pbp']] = c(drives[[i]][['pbp']], drive_pbp)
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
    #Break the drive into plays:
    nplay = (length(drives[[k]][['pbp']])-1) %/% 2
    playmeta_regex = "(?<down>1st|2nd|3rd|4th|1ST|2ND|3RD|4TH) (and|AND) (?<togo>\\d{1,2}|goal|Goal|GOAL) at (?<field>[A-Za-z]{3,4}) (?<yardline>\\d{1,2})" 

    for (j in 1:nplay) {
        playmeta = regex(playmeta_regex, drives[[k]][['pbp']][2*j], perl=TRUE, fixed=FALSE, ignore.case=TRUE)
    
        #Get the play-by-play HTML for this play.
        pbp = drives[[k]][['pbp']][2*j+1] #substr(drives[[k]][['pbp']], playbreaks[['raw']][j], end)

        ###Play-level metadata:
        down = playmeta[1,'down']
        togo = playmeta[1,'togo']

        #Guestimate the game time remaining:
        time = drives[[k]][['time']] - (j-1)/nplay * drives[[k]][['duration']]

        ##How far from the end zone did the play begin?
        #Figure out which side of the field the play began from:
        field = playmeta[1,'field']

        if (!is.na(field)) {
            #Figure out which yard-line the play began from:
            line = as.numeric(playmeta[1,'yardline'])
    
            #which team name is the field most like?
            costs = list(insertions=2, deletions=0, substitutions=1)
            off = drives[[k]][['team']]
            def = teams[teams != off]
            offense_unlike = adist(off, field, costs=costs, ignore.case=TRUE)
            defense_unlike = adist(def, field, costs=costs, ignore.case=TRUE)

            #Now compute the distance from the goal line:
            if (offense_unlike < defense_unlike) {dist = 100 - line}
            else {dist = line}
        
            #Replace 'goal' to go with the distance to the goal line:
            if (substr(togo[1],1,1)=='g' || substr(togo[1],1,1)=='G') {togo = dist}
            togo = as.numeric(togo)
        } else {
            dist = NA
            togo=NA
        }        
        
        #Add this play to the list
        plays[[length(plays)+1]] = list(poss=drives[[k]][['team']], down=down, togo=togo, time=time, dist=dist, pbp=pbp)
    }
}
```