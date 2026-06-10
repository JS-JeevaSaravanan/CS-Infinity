

OSI layers
https://www.imperva.com/learn/application-security/osi-model/



### CrowdStrike goes upto which point of OSI layer ?

​CrowdStrike Falcon primarily operates at the **Application Layer (Layer 7)** of the OSI model, focusing on endpoint security and threat detection. Its lightweight agent, deployed on endpoints, collects data such as process execution details, file activity, and system configurations, which are then analyzed to identify suspicious behaviors and potential threats.​[indjobsinfo.com](https://indjobsinfo.com/crowdstrike-falcon-platform-a-comprehensive-overview/?utm_source=chatgpt.com)[Metron Security Blogs](https://hub.metronlabs.com/deep-dive-unveiling-the-architecture-of-crowdstrike-falcon/?utm_source=chatgpt.com)

Additionally, CrowdStrike extends its capabilities to the **Network Layer (Layer 3)** through its Network Detection Services. This service correlates security telemetry across endpoints, identities, and network devices to detect threats at the network level, including command-and-control (C2) activities in encrypted traffic and potential lateral movement within the network. ​[CrowdStrike](https://www.crowdstrike.com/en-us/resources/data-sheets/network-detection-services/?utm_source=chatgpt.com)

In summary, while CrowdStrike Falcon's core functionalities are centered around the Application Layer, it also encompasses aspects of the Network Layer to provide comprehensive security coverage.​[Help Net Security](https://www.helpnetsecurity.com/2020/05/22/crowdstrike-falcon-3/?utm_source=chatgpt.com)




### Hexnode:

Hexnode Unified Endpoint Management (UEM) operates primarily at the **Application Layer (Layer 7)** of the OSI model, focusing on managing and securing endpoints through software agents and cloud-based services.

**Key Components:**

- **Admin Console:** A web-based interface for administrators to configure and monitor devices.
- **Hexnode Cloud Server:** Hosts the management platform and communicates with endpoints via secure channels.
- **Notification Services:** Utilizes services like Apple Push Notification Service (APNs), Firebase Cloud Messaging (FCM), and Windows Push Notification Services (WNS) to send commands to devices.
- **Endpoints:** Devices such as Android, iOS, macOS, and Windows that are enrolled and managed through the platform.


While Hexnode primarily functions at the Application Layer, it also interacts with lower layers (Network and Transport) to establish secure communications with endpoints.

For detailed information on Hexnode's architecture and supported platforms, you can refer to their official documentation. linkturn0search0



### Sysmon:


**Sysmon** (System Monitor) is a Windows system utility developed by Microsoft's Sysinternals team. It enhances Windows logging capabilities by providing detailed information about system activities, which is invaluable for detecting and analyzing malicious behavior.

---

### 🔧 How Sysmon Works

Sysmon operates by installing a Windows service and a kernel-mode driver on the systemThe service logs events immediately, while the driver starts at boot to capture early system activityThese events are then written to the Windows Event Log, specifically under `Applications and Services Logs/Microsoft/Windows/Sysmon/Operational` To capture detailed system events, Sysmon employs several mechanisms

- **Event Tracing for Windows (ETW):**Utilized for logging network events
    
- **Kernel Callbacks:**Registered to monitor specific system activities, such as process creation
    
- **Minifilter Driver:**Intercepts file system operations to monitor file activity citeturn0search4
    

---

### 📋 Key Capabilities

Sysmon provides granular logging of various system events, includin:

- *_Process Creation (Event ID 1):_ Logs details about newly created processes, including command-line arguments and image hashe.
    
- *_Network Connections (Event ID 3):_ Records outbound network connections, capturing source and destination IPs, ports, and associated processe.
    
- *_File Creation (Event ID 11):_ Monitors file creation events, noting file names, paths, and hashe.
    
- *_Driver Loading (Event ID 6):_ Tracks when drivers are loaded into the system, including their file names and hashe.
    
- *_Registry Changes (Event ID 12):_ Detects modifications to registry keys and value. citeturn0search0
    

---

### ⚙️ Installation and Configuration

Sysmon is installed via the command lin: 

```bash
sysmon -accepteula -i sysmonconfig.xml
``

This command installs Sysmon with a specified configuration fil. The configuration file defines which events to log and can be tailored to focus on specific activitie. citeturn0search0

---

### 🧠 Use Case

Sysmon is particularly useful fr:

- **Incident Response:* Providing detailed logs to understand the sequence of events during a security incidet.
- **Threat Hunting:* Enabling proactive searches for signs of malicious activity within the systm.
- **Forensic Analysis:* Offering insights into system changes and behaviors for post-incident investigatios.

---

If you need assistance with configuring Sysmon or integrating it into your security monitoring setup, feel free to ask! 
```



