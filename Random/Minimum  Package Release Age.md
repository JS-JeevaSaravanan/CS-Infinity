
## Minimum Release Age (Enterprise Notes)

**Purpose:** Delay adoption of newly released packages/artifacts to reduce the risk of broken, recalled, or unstable releases.

|Environment|Recommended Value|
|---|---|
|Development|**1440 min (1 day)**|
|Staging|**4320 min (3 days)**|
|Production|**10080 min (7 days)**|

### Best Practice

- **1440 min (24 hours):** Good balance between freshness and stability.
- **4320 min (3 days):** Better for pre-production validation.
- **10080 min (7 days):** Recommended for enterprise production to minimize release-related risk.

### Enterprise Hardening

Minimum release age should be combined with:

- Version pinning
- CI/CD automated testing
- Vulnerability (CVE) scanning
- Trusted repositories/publishers
- Canary or phased deployments
- Rollback strategy

**Key Takeaway:** Release age is one layer of defense—not a replacement for testing and security controls.