# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.20.0"></a>
# [0.20.0](https://github.com/denouche/virtual-assistant/compare/v0.19.1...v0.20.0) (2017-03-25)


### Features

* allow to give strings or RegExp in feature trigger keywords ([6be5cc6](https://github.com/denouche/virtual-assistant/commit/6be5cc6))



<a name="0.19.1"></a>
## [0.19.1](https://github.com/denouche/virtual-assistant/compare/v0.19.0...v0.19.1) (2017-02-12)


### Bug Fixes

* logger was misnamed. Now you can use this.debug to log using the embedded "debug" library ([8e60bf7](https://github.com/denouche/virtual-assistant/commit/8e60bf7))
* mock database adapter was producing errors ([7c0029a](https://github.com/denouche/virtual-assistant/commit/7c0029a))



<a name="0.19.0"></a>
# [0.19.0](https://github.com/denouche/virtual-assistant/compare/v0.18.0...v0.19.0) (2017-02-11)


### Features

* **database:** add SQL support for persistence. Based on js-data (which internally uses Knex) ([625bb08](https://github.com/denouche/virtual-assistant/commit/625bb08))



<a name="0.18.0"></a>
# [0.18.0](https://github.com/denouche/virtual-assistant/compare/v0.17.0...v0.18.0) (2017-02-10)


### Features

* **database:** allow to·add database prefix table ([d1f9f2a](https://github.com/denouche/virtual-assistant/commit/d1f9f2a))



<a name="0.17.0"></a>
# [0.17.0](https://github.com/denouche/virtual-assistant/compare/v0.16.4...v0.17.0) (2017-02-10)


### Bug Fixes

* **configuration:** now accept value with spaces ([453ca74](https://github.com/denouche/virtual-assistant/commit/453ca74))


### Features

* **database:** change all the persistence to use js-data, add Google Datastore adapter and MongoDB adapter ([4e7fc63](https://github.com/denouche/virtual-assistant/commit/4e7fc63))



<a name="0.16.4"></a>
## [0.16.4](https://github.com/denouche/virtual-assistant/compare/v0.16.3...v0.16.4) (2017-01-31)


### Bug Fixes

* do not crash on unknown database module ([8791107](https://github.com/denouche/virtual-assistant/commit/8791107))



<a name="0.16.3"></a>
## [0.16.3](https://github.com/denouche/virtual-assistant/compare/v0.16.2...v0.16.3) (2017-01-30)


### Bug Fixes

* add feature id in launch event ([e5baaea](https://github.com/denouche/virtual-assistant/commit/e5baaea))



<a name="0.16.2"></a>
## [0.16.2](https://github.com/denouche/virtual-assistant/compare/v0.16.1...v0.16.2) (2017-01-29)


### Bug Fixes

* do not merge event, keep the content in an 'event' field ([8cc0851](https://github.com/denouche/virtual-assistant/commit/8cc0851))



<a name="0.16.1"></a>
## [0.16.1](https://github.com/denouche/virtual-assistant/compare/v0.16.0...v0.16.1) (2017-01-29)


### Bug Fixes

* do not create a new collection for each statistic ([950f9ed](https://github.com/denouche/virtual-assistant/commit/950f9ed))



<a name="0.16.0"></a>
# [0.16.0](https://github.com/denouche/virtual-assistant/compare/v0.15.3...v0.16.0) (2017-01-29)


### Bug Fixes

* the same collection was used for each collection names ([0600f95](https://github.com/denouche/virtual-assistant/commit/0600f95))


### Features

* add statistics service to be able to save events triggers ([6688619](https://github.com/denouche/virtual-assistant/commit/6688619))



<a name="0.15.3"></a>
## [0.15.3](https://github.com/denouche/virtual-assistant/compare/v0.15.2...v0.15.3) (2017-01-29)



<a name="0.15.2"></a>
## [0.15.2](https://github.com/denouche/virtual-assistant/compare/v0.15.1...v0.15.2) (2017-01-28)


### Bug Fixes

* embedded database initilization failed ([acaf427](https://github.com/denouche/virtual-assistant/commit/acaf427))



<a name="0.15.1"></a>
## [0.15.1](https://github.com/denouche/virtual-assistant/compare/v0.15.0...v0.15.1) (2017-01-28)


### Bug Fixes

* do not display warning for missing embedded database configuration if the configuration is present ([ca00841](https://github.com/denouche/virtual-assistant/commit/ca00841))



<a name="0.15.0"></a>
# [0.15.0](https://github.com/denouche/virtual-assistant/compare/v0.14.0...v0.15.0) (2017-01-28)


### Features

* add abstract dao, add feature usage statistics ([0c37c24](https://github.com/denouche/virtual-assistant/commit/0c37c24))
* expose DatabaseService ([d767e03](https://github.com/denouche/virtual-assistant/commit/d767e03))



<a name="0.14.0"></a>
# [0.14.0](https://github.com/denouche/virtual-assistant/compare/v0.13.0...v0.14.0) (2017-01-28)


### Features

* Storage service is now Database service. Fix missing import ([c3e6912](https://github.com/denouche/virtual-assistant/commit/c3e6912))



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
