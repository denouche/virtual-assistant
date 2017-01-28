# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.13.0"></a>
# [0.13.0](https://github.com/denouche/virtual-assistant/compare/v0.12.0...v0.13.0) (2017-01-28)


### Features

* **storage:** add storage service, with mongodb and embedded database support ([352106f](https://github.com/denouche/virtual-assistant/commit/352106f))



<a name="0.12.0"></a>
# [0.12.0](https://github.com/denouche/virtual-assistant/compare/v0.11.0...v0.12.0) (2017-01-21)


### Features

* rework feature cache management, add user cache to link users to running features, in order to be able to let the user choose to quit a feature ([06393d7](https://github.com/denouche/virtual-assistant/commit/06393d7))



<a name="0.11.0"></a>
# [0.11.0](https://github.com/denouche/virtual-assistant/compare/v0.10.0...v0.11.0) (2017-01-10)


### Bug Fixes

* remove old comment ([00b36e0](https://github.com/denouche/virtual-assistant/commit/00b36e0))


### Features

* remove adherence between features and slack service, use the interface field to get informations ([f8fc116](https://github.com/denouche/virtual-assistant/commit/f8fc116))



<a name="0.10.0"></a>
# [0.10.0](https://github.com/denouche/virtual-assistant/compare/v0.9.0...v0.10.0) (2017-01-08)


### Features

* move getCacheId function to assistant feature ([9928fdd](https://github.com/denouche/virtual-assistant/commit/9928fdd))



<a name="0.9.0"></a>
# [0.9.0](https://github.com/denouche/virtual-assistant/compare/v0.8.1...v0.9.0) (2017-01-08)


### Features

* add the ability to stop the execution of feature after the prehandle method ([a8a7edf](https://github.com/denouche/virtual-assistant/commit/a8a7edf))



<a name="0.8.1"></a>
## [0.8.1](https://github.com/denouche/virtual-assistant/compare/v0.8.0...v0.8.1) (2017-01-08)


### Bug Fixes

* feature cache key generation was bugguy ([8d10d68](https://github.com/denouche/virtual-assistant/commit/8d10d68))



<a name="0.8.0"></a>
# [0.8.0](https://github.com/denouche/virtual-assistant/compare/v0.7.4...v0.8.0) (2017-01-08)


### Features

* allow to configure administrators for the bot in addition to default slack administrators ([17563c4](https://github.com/denouche/virtual-assistant/commit/17563c4))
* rework cache id generation, remove getId function and replace it with getScope ([0c2ba5f](https://github.com/denouche/virtual-assistant/commit/0c2ba5f))
* storage service ([ed1b5ad](https://github.com/denouche/virtual-assistant/commit/ed1b5ad))



<a name="0.7.4"></a>
## [0.7.4](https://github.com/denouche/virtual-assistant/compare/v0.7.3...v0.7.4) (2017-01-06)


### Bug Fixes

* configuration delete was buggy ([4de087f](https://github.com/denouche/virtual-assistant/commit/4de087f))



<a name="0.7.3"></a>
## [0.7.3](https://github.com/denouche/virtual-assistant/compare/v0.7.2...v0.7.3) (2017-01-06)


### Bug Fixes

* add debug for configuration update ([78d3377](https://github.com/denouche/virtual-assistant/commit/78d3377))



<a name="0.7.2"></a>
## [0.7.2](https://github.com/denouche/virtual-assistant/compare/v0.7.1...v0.7.2) (2017-01-03)


### Bug Fixes

* rename clearCache method ([8df277e](https://github.com/denouche/virtual-assistant/commit/8df277e))



<a name="0.7.1"></a>
## [0.7.1](https://github.com/denouche/virtual-assistant/compare/v0.7.0...v0.7.1) (2017-01-03)


### Bug Fixes

* init method call failed ([2103f2b](https://github.com/denouche/virtual-assistant/commit/2103f2b))



<a name="0.7.0"></a>
# [0.7.0](https://github.com/denouche/virtual-assistant/compare/v0.6.3...v0.7.0) (2017-01-03)


### Features

* add assistant initialization function ([5cac735](https://github.com/denouche/virtual-assistant/commit/5cac735))



<a name="0.6.3"></a>
## [0.6.3](https://github.com/denouche/virtual-assistant/compare/v0.6.2...v0.6.3) (2017-01-02)


### Bug Fixes

* reorder feature list ([d7f49f8](https://github.com/denouche/virtual-assistant/commit/d7f49f8))



<a name="0.6.2"></a>
## [0.6.2](https://github.com/denouche/virtual-assistant/compare/v0.6.1...v0.6.2) (2017-01-02)


### Bug Fixes

* do not display feature description if empty ([84abbce](https://github.com/denouche/virtual-assistant/commit/84abbce))



<a name="0.6.1"></a>
## [0.6.1](https://github.com/denouche/virtual-assistant/compare/v0.6.0...v0.6.1) (2017-01-02)


### Bug Fixes

* add exception for help message ([b754dc7](https://github.com/denouche/virtual-assistant/commit/b754dc7))



<a name="0.6.0"></a>
# [0.6.0](https://github.com/denouche/virtual-assistant/compare/v0.5.1...v0.6.0) (2017-01-02)


### Features

* add description static method in AssistantFeature, to be able to generate a help message ([6412c2e](https://github.com/denouche/virtual-assistant/commit/6412c2e))



<a name="0.5.1"></a>
## [0.5.1](https://github.com/denouche/virtual-assistant/compare/v0.5.0...v0.5.1) (2017-01-02)


### Bug Fixes

* add configuration FSM startup ([b0a2ad7](https://github.com/denouche/virtual-assistant/commit/b0a2ad7))



<a name="0.5.0"></a>
# [0.5.0](https://github.com/denouche/virtual-assistant/compare/v0.4.1...v0.5.0) (2017-01-02)


### Features

* on startup now use handle method ([406e8f2](https://github.com/denouche/virtual-assistant/commit/406e8f2))



<a name="0.4.1"></a>
## [0.4.1](https://github.com/denouche/virtual-assistant/compare/v0.4.0...v0.4.1) (2017-01-02)


### Bug Fixes

* remove the bot id in the handled message ([fb1ded5](https://github.com/denouche/virtual-assistant/commit/fb1ded5))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/denouche/virtual-assistant/compare/v0.3.1...v0.4.0) (2017-01-02)


### Features

* you can now mention the bot anywhere in the sentence ([598598b](https://github.com/denouche/virtual-assistant/commit/598598b))



<a name="0.3.1"></a>
## [0.3.1](https://github.com/denouche/virtual-assistant/compare/v0.3.0...v0.3.1) (2017-01-02)


### Bug Fixes

* **configuration:** fix set was not retrieving the current configuration ([2d616b5](https://github.com/denouche/virtual-assistant/commit/2d616b5))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/denouche/virtual-assistant/compare/v0.2.0...v0.3.0) (2017-01-02)


### Features

* **slack:** export SlackService ([8ced8d2](https://github.com/denouche/virtual-assistant/commit/8ced8d2))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/denouche/virtual-assistant/compare/v0.1.2...v0.2.0) (2017-01-01)


### Features

* **configuration:** add configuration helper and feature ([5911df4](https://github.com/denouche/virtual-assistant/commit/5911df4))



<a name="0.1.2"></a>
## [0.1.2](https://github.com/denouche/virtual-assistant/compare/v0.1.1...v0.1.2) (2016-12-31)


### Bug Fixes

* main import is now named AssistantFeature ([a3d9ead](https://github.com/denouche/virtual-assistant/commit/a3d9ead))



<a name="0.1.1"></a>
## [0.1.1](https://github.com/denouche/virtual-assistant/compare/v0.1.0...v0.1.1) (2016-12-31)



<a name="0.1.0"></a>
# 0.1.0 (2016-12-31)
