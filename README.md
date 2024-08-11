# Deploying a Simple Node.js Application on Kubernetes with ConfigMap

### **Project Overview**

The goal of this project is to deploy a simple Node.js application on a Kubernetes cluster using a ConfigMap to manage environment variables. This involves setting up the Kubernetes environment, creating and containerizing the Node.js application, configuring Kubernetes resources, and verifying the deployment.

### Instructions


Let’s now create a `Dockerfile` in the working directory as same as [`app.js`](http://app.js) file to containerize the existing application

```docker
FROM node:14-alpine
WORKDIR /app
COPY app.js /app
RUN npm install
ENV PORT=80
CMD ["node", "app.js"]
```

**Build and Push Docker Image**

```bash
docker login # provide proper credentials for DockerHub
docker build -t prabeshkalika/assignment3:latest .
docker push prabeshkalika/assignment3:latest
```

Before we get started with Kubernetes, we will have to install it first.

```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
minikube start
```

Now, we can interact with Kubernetes with `kubectl` CLI.

Let’s create our deployment file first called `node-app-deployment.yaml` with following contents:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: node-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: node-app
  template:
    metadata:
      labels:
        app: node-app
    spec:
      containers:
      - name: node-app
        image:  prabeshkalika/assignment3
        ports:
        - containerPort: 80
        env:
        - name: INTERVAL
          valueFrom:
            configMapKeyRef:
              name: node-app-config
              key: INTERVAL
```


💡 Notice that for container image we used the image that has been published to DockerHub from earlier steps.

This file defines the service configuration for exposing the Node.js application within the Kubernetes cluster and to the external world.
Create a `node-app-service.yaml` file with contents as such:

```yaml
# node-app-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: node-app-service
spec:
  type: NodePort
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30000
  selector:
    app: node-app
```

💡 Notice that for container image we used the image that has been published to DockerHub from earlier steps.

This file defines a ConfigMap for managing environment variables used by the Node.js application.

Create a `node-app-config.yaml` file with contents as such:

```yaml
# node-app-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: node-app-service
spec:
  type: NodePort
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30000
  selector:
    app: node-app
```
**Deploy to Kubernetes and the NodePort service**

```bash
kubectl create -f node-app-deployment.yaml
kubectl create -f node-app-service.yaml
kubetl create -f node-app-config.yaml
```

To validate if the resources has been appropriately reflected, run

```bash
kubectl get deployments # should see a new deployment created
# then, for the service
kubectl get svc # should see a NodePort service
```

**Test the Application**

Now, let’s ensure the Kubernetes cluster is accessible and the application is running correctly.

```bash
kubectl get nodes -o wide
```

Note the IP of the node, we will need that later.

To see if our application is serving properly, make an HTTP GET request to the node IP followed by the NodePort instructed in the `service.yaml` file.

```bash
curl <node-ip-from-minikube>:30000
```
![alt text](image.png)
**You have reached the end!**
