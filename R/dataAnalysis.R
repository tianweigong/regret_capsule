#' ---
#' title: Rational Analysis of Dynamic Regret
#' author: Tianwei Gong
#' output:
#'    html_document:
#'      toc: true
#'      toc_depth: 3
#'      toc_float: true
#'      theme: default
#'      highlight: tango
#' ---

#+ General settings, echo = FALSE, results = 'hide' -------------------
knitr::opts_chunk$set(warning = FALSE, message = FALSE)

#+ load packages -------------------
#' # load packages
library(tidyr)
library(dplyr)
library(ggplot2)
library(Rmisc)
library(reshape2)
library(plyr)
library(knitr)

# rm(list=ls())

#+ Visualization -------------------
#' # Visualization
df.raw=read.csv("tia_cap_pilot.csv")
df.raw$group=NA
df.raw$group[df.raw$mycondition==0]="short_do"
df.raw$group[df.raw$mycondition==1]="long_rough_do"
df.raw$group[df.raw$mycondition==2]="long_smooth_do"
df.raw$group[df.raw$mycondition==3]="short_undo"
df.raw$group[df.raw$mycondition==4]="long_rough_undo"
df.raw$group[df.raw$mycondition==5]="long_smooth_undo"

pic.re=summarySE(df.raw,measurevar = "myregret",groupvars = "group")
kable(pic.re)
ggplot(pic.re,aes(x=group,y=myregret))+
  geom_bar(position=position_dodge(),
               stat="identity")+
  geom_errorbar(aes(ymin=myregret-se, ymax=myregret+se),
                width=.2, 
                position=position_dodge(.9))+
  ylab("regret")+
  ggtitle("regret rating")

pic.cf=df.raw %>%subset(mycf<150) %>% #Remove the participants that might misunderstand the question
  summarySE(measurevar = "mycf",groupvars = "group")
kable(pic.cf)
ggplot(pic.cf,aes(x=group,y=mycf))+
  geom_bar(position=position_dodge(),
           stat="identity")+
  geom_errorbar(aes(ymin=mycf-se, ymax=mycf+se),
                width=.2, 
                position=position_dodge(.9))+
  ylab("counterfactual")+
  ggtitle("counterfactual thinking")