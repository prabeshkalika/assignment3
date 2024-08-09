# nApp


## Expose the application using a NodePort service:
```SHELL
kubectl expose deployment node-app --type=NodePort --port=80
```

## Verify the Deployment:
```SHELL
kubectl logs deployment/node-app
```

## Access the Application:
```SHELL
minikube service node-app --url
```