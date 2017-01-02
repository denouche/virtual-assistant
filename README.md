# virtual-assistant

[![NPM version](https://badge.fury.io/js/virtual-assistant.svg)](https://badge.fury.io/js/virtual-assistant.svg)

This project is a library that offer a extendable chatbot via external feature-plugins.

This library offer Javascript classes and services that will help you and guide you in the development of your own feature-plugins.

For now the chatbot support Slack and this can be extended to other plateforms, feel free to contribute.


## Develop my own feature-plugin

Just create a new project, create a new npm module and install this library as npm dependency:
```
npm install virtual-assistant
```

Create your own class extending the abstract `AssistantFeature` and export it from your module.

You can take this "hello world" plugin as example: https://github.com/denouche/virtual-assistant-plugin-hello-world

For persistent interactions, running through multiple dialogs you can use a final state machine to handle the dialog sequence: https://github.com/jakesgordon/javascript-state-machine
