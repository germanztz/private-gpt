
#stops a deployment for running
microk8s kubectl -n private-gpt scale deployment -l avena.engine=cuda --replicas=0
microk8s kubectl -n private-gpt scale deployment -l avena.engine=cpu --replicas=0


#get failed pods
microk8s kubectl -n private-gpt get pods --field-selector=status.phase!=Running


#runs a pod to execute a curl and then deletes the pod
microk8s kubectl -n private-gpt run curl --image=radial/busyboxplus:curl -i --tty --rm

#list microk8s images
microk8s.ctr images list

