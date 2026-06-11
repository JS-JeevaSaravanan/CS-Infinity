


# 🌍 Timezone Handling Best Practices

## 1. Store Timestamps in UTC

- Always store dates/times in the database as **UTC**.
    
- This avoids ambiguity from daylight savings and varying user timezones.
    
- Example:
    
    ```
    2025-10-01T04:30:00Z
    ```
    

---

## 2. Conversion Responsibility

### Backend Responsibilities

- Convert **only when the output leaves system control**, e.g.:
    
    - **Exports / reports / downloadable files**
        
    - **Emails, notifications, scheduled jobs**
        
    - **APIs consumed by 3rd parties**
        
- Requires user’s timezone (from profile/settings or request context).
    
- Example (Node.js + `date-fns-tz`):
    
    ```ts
    import { utcToZonedTime, format } from 'date-fns-tz';
    
    const utcDate = new Date('2025-10-01T04:30:00Z');
    const userTZ = 'America/New_York';
    
    const localDate = utcToZonedTime(utcDate, userTZ);
    const formatted = format(localDate, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone: userTZ });
    ```
    

---

### Frontend Responsibilities

- Convert **for UI display** (web or mobile), since client devices know their own timezone.
    
- Allows automatic adjustment if the user changes system timezone.
    
- Example (browser JS):
    
    ```js
    const utcDate = "2025-10-01T04:30:00Z";
    const local = new Date(utcDate).toLocaleString();
    ```
    

---

## 3. Recommended Strategy

- **DB → always UTC**
    
- **Frontend → convert for UI display**
    
- **Backend → convert for exports, reports, and system-generated outputs**
    

---

## 4. Optional Hybrid Approach

- Backend sends both:
    
    - **UTC timestamp**
        
    - **User timezone string** (from profile)
        
- Frontend formats using those.
    
- Provides consistency while keeping flexibility.
    

---

## 5. Key Rules of Thumb

- ✅ Always **store in UTC**.
    
- ✅ Convert **close to the consumer** (frontend for UI, backend for exports).
    
- ✅ Store user’s timezone in profile if backend needs to do conversion.
    
- ✅ Use reliable libraries (`date-fns-tz`, `luxon`, `moment-timezone`).
    
- ❌ Never store local times directly in DB.
    
- ❌ Avoid mixing conversion logic across layers without a clear rule.
    

---

