




## Screenshots

### 1st iteration
**First full flow**

![img.png](images/img.png)

### 2nd iteration
**Last step stored in result**

![img_1.png](images/img_1.png)


### 3rd iteration
**Reasoning logs and reasoning output based on config**

**Reasoning output, only logging to console/logs**

![img_2.png](images/img_2.png)

**Reasoning output, logging reasoning output json. JSON could be sent to client (Chat UI), API or other external source via API or event, webhook, etc..**
![img_3.png](images/img_3.png)


## 4th iteration
**Adding toolchain history to graph state**

![Tool Chain History in graph state](images/tool-chain-history.png)


## 5th iteration
- **Added Express server with server side events as a second mechanism to run graph**
- **Updated invoke to stream in order to access the graph state after each node completion**

![Agent called via http server with thought process](images/agent-via-http-with-thought-process.png)
