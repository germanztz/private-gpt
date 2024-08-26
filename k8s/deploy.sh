
#stops a deployment for running
microk8s kubectl -n private-gpt scale deployment private-gpt-ollama --replicas=0


#get failed pods
microk8s kubectl -n private-gpt get pods --field-selector=status.phase!=Running


#rons a pod to execute a curl and then deletes the pod
microk8s kubectl -n private-gpt run curl --image=radial/busyboxplus:curl -i --tty --rm