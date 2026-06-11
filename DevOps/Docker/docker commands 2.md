

Here are the most commonly used (and actually useful) Docker commands, grouped so you can quickly find what you need 👇

---

## 🔍 Containers (running things)

- **List running containers**
    
    ```bash
    docker ps
    ```
    
- **List all containers (including stopped)**
    
    ```bash
    docker ps -a
    ```
    
- **Run a container**
    
    ```bash
    docker run -it nginx
    ```
    
- **Run in detached mode**
    
    ```bash
    docker run -d nginx
    ```
    
- **Stop a container**
    
    ```bash
    docker stop <container_id>
    ```
    
- **Start a stopped container**
    
    ```bash
    docker start <container_id>
    ```
    
- **Restart a container**
    
    ```bash
    docker restart <container_id>
    ```
    
- **Remove a container**
    
    ```bash
    docker rm <container_id>
    ```
    

---

## 📦 Images

- **List images**
    
    ```bash
    docker images
    ```
    
- **Pull an image**
    
    ```bash
    docker pull nginx
    ```
    
- **Build an image**
    
    ```bash
    docker build -t my-app .
    ```
    
- **Remove an image**
    
    ```bash
    docker rmi <image_id>
    ```
    

---

## 📜 Logs & Debugging

- **View logs**
    
    ```bash
    docker logs <container_id>
    ```
    
- **Follow logs (live)**
    
    ```bash
    docker logs -f <container_id>
    ```
    
- **Execute command inside container**
    
    ```bash
    docker exec -it <container_id> bash
    ```
    

---

## 🧹 Cleanup

- **Remove all stopped containers**
    
    ```bash
    docker container prune
    ```
    
- **Remove unused images**
    
    ```bash
    docker image prune
    ```
    
- **Remove everything unused (containers, images, networks)**
    
    ```bash
    docker system prune
    ```
    

---

## 🌐 Networking & Volumes

- **List networks**
    
    ```bash
    docker network ls
    ```
    
- **List volumes**
    
    ```bash
    docker volume ls
    ```
    

---

## ⚡ Helpful Shortcuts

- **Get container IDs only**
    
    ```bash
    docker ps -q
    ```
    
- **Stop all running containers**
    
    ```bash
    docker stop $(docker ps -q)
    ```
    
- **Remove all containers**
    
    ```bash
    docker rm $(docker ps -aq)
    ```
    

---

If you want, I can also give you a **minimal “daily workflow” cheat sheet** (like 5–6 commands you’ll actually use 90% of the time).