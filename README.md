node-virtual-assistant
======================

## Develop

### Install

In order to install the dependencies,just run

```bash
npm install
```

### Run

To run the project
```bash
SLACK_TOKEN='xoxb-slackbot-api-token' DEBUG=*,-nodemon* nodemon
```

## Build the image

```bash
make image
```

This will create an images with tag sfeir/sfeircra-chatbot that you can just run to launch the application.

```bash
docker run -d --restart=always -e "SLACK_TOKEN=xxxxxxxxxxxxxxxxx" denouche/slack-virtual-assistant
```


