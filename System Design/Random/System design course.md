

https://www.youtube.com/watch?v=sV_4pOGosnU&list=PL4CFloQ4GGWICE0Tz6iXKfN3XWkXRlboU



Key system design points:*HLD - does not involve coding, focus on overall architecture of system from. Modules point of view, tech stack used etcLLD - focuses on the granular level. Like how a module is broken down to features and features can be developed using components. Also focuses on APIS, data structure and data store - involve coding.*Interview structure:*  
- functional requirements  
- non functional requirements  
- scoping  
- problem solving  
- component architecture  
- tech stack  
- apis  
- modular level things  
- Data store  
- accessibility  
- optimisation*Optimisations* :  
- Images:  
1. compression  
2. progressive adaptation - webp, png  
3. Blured image or solid color usage  
4. Sprite files - reduce number of network requests  
5. Src set - load diff image sizes  
6. Device to pixel ratio- Videos:  
1. Progressive adaptation (webm, gifs,MP4)  
2. Video without audio  
3. Poster image loading in video tag  
4. Preload videos  
5. Streaming data as chunks- Fonts:  
1. Font face observer  
2. FOUT & FOIT  
3. Progressive adaptation (woff 2 better than woff)  
4. Data uris  
5. Rely on web based fonts  
6. Use cdn- CSS:  
1. Load critical css first  
2. Use of media attr in link tags  
3. Avoid use of lengthy class names or selectors- Javascript:  
1. Defer and async  
2. Critical js load first  
3. Do less stuff  
4. Do async stuff  
5. Ship less pollyfill  
6. Maintain application cache - images, css etc- Other concepts:  
1. Lazy loading  
2. Eager loading  
3. Resource hinting - preload, prefetch, pre render  
4. Content visibility  
5. Intersection observer  
6. Prevention of reflows in css - (layout, paint and composition - use fixed sizes , don't dynamically insert style, avoid inline style)  
7. Html is render blocking and js is parser blocking  
8. Priority fecthing tag in images  
9. Http 2 uses sep request for each resource but http 3 makes single request to fetch all the resources  
10. code splitting  
11. Budles  
12. Content encoding can be gzip or brottle (need to check)*Video streaming* :  
- Rtmp  
- Http live streaming*Client to server communication:*  
- sockets (two way)  
- polling (long and short)  
- server sent events*google doc tech:*  
- operational transformation  
- differential synchronisation  
- merkel tree (hashing concept) for version history  
- offline edit - local store data*Google Calendar tech:*  
- use of tree - event ids to search for conflicting events*Book my show tech:*  
- concurrent ticket booking  (optimistic and pessimistic approach - locking and releasing seats)  
- svg or canvas for stadium ticket booking  
- for dynamic layout - backend sends space information - red highlighted non seats for each row