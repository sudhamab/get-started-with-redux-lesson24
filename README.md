# get-started-with-redux-lesson23

### What is in this repo? 
This is based on the lessons from https://egghead.io/series/getting-started-with-redux, lesson 23,
so one can look at how the running code looks like. It will get more complicated with subsequent 
lessons


### Motivation 

I was finding it a bit hard to remember every single detail of each decision Dan was taking 
as he walks through the tutorials, which by the way are brilliant. 

So after much trial and error, I realized I have to master these tutorials by 
writing the code the way it is being explained. 

I wanted to put document step by step how the code evolved to get more comfortable with thinking in Redux.

So I decided to just follow the videos and create working versions of the entire code from Dan's lessons,
but backtracked from the 17th lesson onwards. 


## Quickstart

```
npm install
npm start 
```

### Whats the goal of this lesson? 

In this lesson Dan tries to further separate out components which are just passing down 
functions as props to components which are lower down the hierarchy via other pass through 
components. 

The reasoning is that pass through components know more about parent and child components 
only because they are in between and should not have to know so much information.

Hence, like in lesson 22, one has to separate out the functionality.

The first candidate is the TodoList Component.

### Different versions of the index.js files 

In this repo, you will find a reference to the index.js file from the previous lesson so you can 
easily diff it to see how the code is changing, in case you want to come back to it.


### Comments in the code.

Have also added some comments of my own observations about the coding style as well as based on the 
lecture videos. 
