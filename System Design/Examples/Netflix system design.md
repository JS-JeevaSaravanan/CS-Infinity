


Font end :


High Level  - architectural , modular divisions, tech stack
Low Level - granular level, store, compnents, coding included interface, object structures...


Func requirements - primary main func of product - purpose of product with its features... things that user interacts..  
non func requirements - secondary things of product - disable people interacivity, performance optimisation..  - improve produce




Netflix:
HLD - High Level Design
vedio streaming - 
tech stack - react, react-native, nodejs, redux , 
chart or block diagrams or flow diagrams - to represent modular divisions flow and communications..


LLD : Low Level Design
movie cards/posters, search and filter , account management, movie recommendations, rating and cast details

movie card / poster..
-carousal done, and reuse carousal
- array of objects, render in UI
- rating review, cast and movie details each have separate store , in order to update specific things , its easily manageable.. 
- fetch details or required things in respective stores with unique ids

search :
- trie datastructure... for words suggestion
- debounce used, optimisation 
- elastic search from backend

filter
 - by cast, genre, time
 - sort and rearrange
 - separate service, update and after items, item ids change only referesh grid!

login 
 - existing user and new user
 - oAuth logic support with different things like Google, linkedIn


Functional requirements:

Streaming vedio
Login users, account managements
Video download for later see
like and review of videos


Non functional requirements:

gloabalization  - languages, time zones ... 
localization - specific to local - eg. local festival things.. 

Performance and optimisation :

Accessibility:

Keyboard shortcuts: support color blinding


Responsiveness- mobile devices

Customization ( not sure fun or non func req ) - Theme - dark theme support


to refer {

https://www.youtube.com/watch?v=Tu-hZ6lqNtY

}















