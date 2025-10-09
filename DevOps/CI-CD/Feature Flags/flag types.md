

### 🔑 **Value Types**

|Type|Description|Example|
|---|---|---|
|**Boolean**|On/off toggle for a feature|`isNewDashboardEnabled = true`|
|**Multivariate**|Choose between multiple options (not just true/false)|`searchAlgorithm = "v2"` / `"v1"` / `"beta"`|
|**Percentage Rollout**|Enable feature for a % of users|`30% of users see new checkout`|
|**User Targeting**|Enable based on user attributes|`user.role == "admin"` or `region == "EU"`|
|**Time-based**|Activate feature at a specific time/date|`launchTime = "2025-10-10T08:00Z"`|
|**Remote Config**|Use flags to hold values (not just enable/disable)|`maxItemsPerPage = 50`, `themeColor = "#FFCC00"`|


🧠 **Tip**: Use the simplest flag type you need — but plan for complexity as the feature matures (e.g. evolve from boolean → multivariate).


### 🔑 **Functional Types**

| Type                | Purpose                                  | Example                                        |
| ------------------- | ---------------------------------------- | ---------------------------------------------- |
| **Release Flag**    | Gradually roll out new features          | Enable new checkout UI for 10% of users        |
| **Experiment Flag** | A/B test or canary deployment            | Show Variant A or B of landing page            |
| **Ops Flag**        | Quickly toggle features during incidents | Disable real-time chat if latency spikes       |
| **Permission Flag** | Restrict features by user role/group     | Enable admin dashboard only for staff users    |
| **Dev Flag**        | Control dev-only/incomplete features     | Enable debug tools only in staging environment |


✅ These help control **what runs**, **for whom**, and **when**, without redeploying.
