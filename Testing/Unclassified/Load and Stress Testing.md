

    Load vs Stress Testing — Quick Explainer                                                                  

    Load Testing                                                                                              
                                                         
    Simulates expected production traffic to verify the system meets performance SLAs under normal conditions.
                                                         
    - "Can we handle 50 concurrent users browsing reviews?"                                               
    - Measures: latency (p95/p99), throughput, error rate
    - In our scripts: read-heavy.js, dashboard.js, write-operations.js — ramp to steady VUs, hold, measure

    Stress Testing                                            
                                                                                        
    Pushes beyond normal capacity to find the breaking point.  
                                                                                        
    - "At what point does the API start failing or degrading?" 
    - Measures: where errors spike, when latency becomes unacceptable, recovery behavior
    - In our scripts: spike.js — sudden 4x surge (50 → 200 VUs)           

    Soak Testing                                                          
                                                     
    Sustained moderate load over a long period to detect slow-burn issues.
                                                     
    - "Does memory leak after 30 minutes? Do DB connections exhaust?"
    - In our scripts: soak.js — 30 VUs for 30 minutes
       
    How They Relate              
                
    Load (VUs)                   
      ↑                                         
      │        ┌──── Stress/Spike
      │     ┌──┤                                     
      │  ┌──┘  └──┐            
      │──┘ Load    └──┐   ← Normal capacity line     
      │               └──                                                      
      │  ───────────────── Soak (flat, long duration)                          
      └──────────────────→ Time                                                
                                                                               
    ┌────────┬──────────────────────────┬───────────┬─────────────────────────┐
    │  Type  │           Goal           │ Duration  │       VU Pattern        │
    ├────────┼──────────────────────────┼───────────┼─────────────────────────┤
    │ Load   │ Validate SLAs            │ 5-10 min  │ Ramp → hold → ramp down │
    ├────────┼──────────────────────────┼───────────┼─────────────────────────┤
    │ Stress │ Find breaking point      │ 10-15 min │ Ramp → spike → recover  │
    ├────────┼──────────────────────────┼───────────┼─────────────────────────┤
    │ Soak   │ Detect leaks/degradation │ 30+ min   │ Flat sustained load     │
    └────────┴──────────────────────────┴───────────┴─────────────────────────┘
                                                             
    What to Watch                                                            
                                                             
    - Load: p95 latency stays under threshold, error rate < 1%               
    - Stress: How gracefully the system degrades and recovers
    - Soak: Memory growth, DB connection count, response time drift over time                                          
   