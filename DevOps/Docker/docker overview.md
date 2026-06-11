Here's a **crisp yet in-depth article** covering:

- 🐳 **Docker overview**
    
- ⚙️ **Main Docker commands**
    
- 🏗️ **Use cases**
    
- 📦 **Building & running Dockerfiles**
    
- 🔐 **Environment variables**
    
- 🔁 **Multi-stage builds**
    

---

# 🚀 Docker: The Developer’s Guide to Containers

Docker is a lightweight containerization platform that allows developers to package applications with all dependencies into standardized units — containers — for reliable, fast deployment.

---

## 📦 Why Use Docker?

|Use Case|Benefit|
|---|---|
|🧪 Isolated dev/test envs|No more “it works on my machine”|
|🚀 Fast deployment|Start in seconds, with reproducible environments|
|🔁 CI/CD integration|Seamless Docker-based pipelines|
|📁 Dependency management|Lock dependencies inside containers|
|☁️ Cloud portability|Build once, run anywhere|

---

## 🏗️ Dockerfile Anatomy (Frontend App Example)

Here’s a multi-stage Dockerfile for building a frontend and serving it with `serve`:

```Dockerfile
# 🔨 Stage 1: Build
FROM node:20-alpine AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

ARG ARTIFACTORY_B64
WORKDIR /app

# Authenticate to Artifactory
RUN echo "//your-artifactory-url/:_auth=\"${ARTIFACTORY_B64}\"" >> .npmrc

RUN npm install -g pnpm@9.4.0
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# 🚀 Stage 2: Serve
FROM node:20-alpine AS runner
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 8000
CMD ["serve", "-s", "dist", "-l", "8000"]
```

---

## 🛠️ Key Docker Commands

|Command|Description|
|---|---|
|`docker build -t name .`|Build an image from Dockerfile|
|`docker run -p 8000:8000 name`|Run a container and expose port|
|`docker ps`|Show running containers|
|`docker stop <container>`|Stop a running container|
|`docker rm <container>`|Remove container|
|`docker rmi <image>`|Remove image|
|`docker exec -it <container> sh`|Shell into running container|
|`docker logs <container>`|View container logs|
|`docker-compose up -d`|Start services via docker-compose|

---

## 🔐 Passing Environment Variables

### 1. **Via `.env` file**

Create:

```env
# .env
PORT=8000
REACT_APP_API_URL=https://api.example.com
```

Run with:

```bash
docker run --env-file .env -p 8000:8000 my-app
```

> ✅ Environment variables are injected into the container.

### 2. **Via `ARG` and `ENV` in Dockerfile**

In `Dockerfile`:

```Dockerfile
ARG ARTIFACTORY_B64
ENV NODE_ENV=production
```

Build with:

```bash
docker build --build-arg ARTIFACTORY_B64=xxxx -t my-app .
```

---

## 🔁 Multi-Stage Builds

Use multi-stage Docker builds to:

- ✅ Keep final images **small**
    
- ✅ Separate build tools from runtime
    
- ✅ Avoid leaking secrets like tokens in final image
    

> Example used above: `builder` vs `runner` stages.

---

## 🧹 Best Practices

- 🛑 Add a `.dockerignore` to reduce image size:
    

```dockerignore
node_modules
dist
*.log
Dockerfile
.env
```

- ✅ Use `--frozen-lockfile` or `--immutable` with `pnpm` or `npm ci`
    
- 🔒 Never commit secrets to Dockerfiles or env files in source control
    

---

## 🔧 When to Use Docker

|Situation|Should You Use Docker?|
|---|---|
|Developing a full-stack app|✅ Yes|
|Running CI/CD builds|✅ Yes|
|Building a simple script|⚠️ Maybe|
|Deploying across multiple environments|✅ Yes|
|Managing complex dependencies|✅ Yes|

---

## 📌 Summary

Docker simplifies and streamlines how developers build, ship, and run apps. From frontend apps using `pnpm` to full-stack microservices, containers are the industry standard for fast, repeatable deployments.

---

Want this as a downloadable markdown file or blog-ready post? I can generate it for you.
