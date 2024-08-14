# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [0.1.3](https://github.com/offline-ai/cli/compare/v0.1.2...v0.1.3) (2024-08-14)


### Features

* search scripts can be aborted by ctrl+C to avoid stuck ([55548f5](https://github.com/offline-ai/cli/commit/55548f5e18184824f080d9a4270214befabb2444))

## [0.1.2](https://github.com/offline-ai/cli/compare/v0.1.1...v0.1.2) (2024-08-12)

## [0.1.1](https://github.com/offline-ai/cli/compare/v0.1.0...v0.1.1) (2024-08-11)

## [0.1.0](https://github.com/offline-ai/cli/compare/v0.0.17...v0.1.0) (2024-08-11)


### ⚠ BREAKING CHANGES

* remove pwd for agentDirs and promptDirs

### Bug Fixes

* remove pwd for agentDirs and promptDirs ([6b6e4df](https://github.com/offline-ai/cli/commit/6b6e4df183b505f6abece778f3caae274037cb28))

## [0.0.17](https://github.com/offline-ai/cli/compare/v0.0.16...v0.0.17) (2024-08-11)

## [0.0.16](https://github.com/offline-ai/cli/compare/v0.0.15...v0.0.16) (2024-08-11)


### Bug Fixes

* do not search current dir! ([7a79464](https://github.com/offline-ai/cli/commit/7a7946485ad810db9ff4a585835dc5f4c2e2581e))

## [0.0.15](https://github.com/offline-ai/cli/compare/v0.0.14...v0.0.15) (2024-08-11)


### Features

* add --trace-warnings for develop ([9ac0630](https://github.com/offline-ai/cli/commit/9ac06306ee9f2ecf645ff5bc0e591ace5d5be48f))
* add brain refresh command ([88590c7](https://github.com/offline-ai/cli/commit/88590c7aa4ff3876f6ae5560996fda626d5bb8fa))
* add char type ([9b6a4f8](https://github.com/offline-ai/cli/commit/9b6a4f851bdd6007bb70d64901f0004a59b6bde1))
* add new `backup-chat` option ([97039c5](https://github.com/offline-ai/cli/commit/97039c5a38431781f180f1d4db18a51fc7da7a3f))
* add refresh models from huggingface directly ([57bcdfc](https://github.com/offline-ai/cli/commit/57bcdfc279da3cfdac77020dcd4008b6da598c31))
* add test fixture command(draft) ([adcc9c9](https://github.com/offline-ai/cli/commit/adcc9c979f3cca616036fefccce4e5e7967e0034))
* add translator-simple example ([860a65f](https://github.com/offline-ai/cli/commit/860a65f00d3f9993bebde3c3fa4d11a4b12eafdb))
* **brain:** add verify quant callback ([d1a9eeb](https://github.com/offline-ai/cli/commit/d1a9eeb2f2c3f9a5182cc73d865077756ef3a4f7))
* **refresh:** add hubUrl, verifyQuant, brainDir options to refresh brain ([85b0386](https://github.com/offline-ai/cli/commit/85b0386c17b8d5f810214912b9ee1e7e695bbf33))
* show downloaded and filesize ([9faa2dc](https://github.com/offline-ai/cli/commit/9faa2dc0d7b103b29457416667a28a84bf2f8f31))


### Bug Fixes

* can not init error ([1f7b695](https://github.com/offline-ai/cli/commit/1f7b695d94a9773f478d24523e3554f7a1d6a783))
* rename char dobby _id ([f5355ed](https://github.com/offline-ai/cli/commit/f5355edb3436a57c371e0fa18efc6f52712e3b79))
* should show init error ([939f2cd](https://github.com/offline-ai/cli/commit/939f2cd72c776eef5c0d9a5cf6e883fd0895d334))
* show error object to debug ([4868886](https://github.com/offline-ai/cli/commit/48688862421f635c790b77d1f7fc4ff2dfd67220))
* use new character name spec. ([d89966c](https://github.com/offline-ai/cli/commit/d89966c4e435dbff010be48d414960606aedaacd))


### Refactor

* **brain:** check location first ([a4734b9](https://github.com/offline-ai/cli/commit/a4734b9213357fefdce6d371685e12549c8ac4f7))
* change event name to llmStream ([321e009](https://github.com/offline-ai/cli/commit/321e009f41f0411a922209920dfac91f3b406d6a))
* follow new ai-script ([50127cb](https://github.com/offline-ai/cli/commit/50127cb1fa4370cf5483d8882ef7fb7aedd79265))
* upgradeBrains ([2466801](https://github.com/offline-ai/cli/commit/246680158345706f53e25055a1a63658996f380d))

## [0.0.14](https://github.com/offline-ai/cli/compare/v0.0.13...v0.0.14) (2024-07-08)


### Features

* register hook supports ([c8c12da](https://github.com/offline-ai/cli/commit/c8c12da862c5dac8848156e5c6c57419b916ed8e))


### Bug Fixes

* show error always after logUpdate.clear ([26494c9](https://github.com/offline-ai/cli/commit/26494c9af3b8a84a467c00643a82bf56e0e84572))

## [0.0.13](https://github.com/offline-ai/cli/compare/v0.0.12...v0.0.13) (2024-06-21)


### Bug Fixes

* alias search error ([5187df1](https://github.com/offline-ai/cli/commit/5187df1b652d76da996e77d31cb4416b6b4c01f8))

## [0.0.12](https://github.com/offline-ai/cli/compare/v0.0.11...v0.0.12) (2024-06-21)


### Features

* add a seperator "<---STREAMING END--->" when no consoleClear ([bd8770c](https://github.com/offline-ai/cli/commit/bd8770cf2b9e7619c2a05b21fb7879815a57f6e4))
* show brain file size ([0f36ee8](https://github.com/offline-ai/cli/commit/0f36ee85d03d9d787c789a0841a556f3b32c2fae))


### Bug Fixes

* can not save history if abort on non-interactive mode ([212ae5d](https://github.com/offline-ai/cli/commit/212ae5d1b13185661e46ae233616e7a85e04b120))


### Refactor

* change default onlyFeatured to false ([0a1d28e](https://github.com/offline-ai/cli/commit/0a1d28e77ed8c2d0516d75d72af9bde317316466))
* change noConsoleClear flag to consoleClear and default to true for interactive mode, false for non-interactive mode ([5e1fc1a](https://github.com/offline-ai/cli/commit/5e1fc1a19765d309a01ce57504b7b7c1826acb37))

## [0.0.11](https://github.com/offline-ai/cli/compare/v0.0.10...v0.0.11) (2024-06-17)


### Bug Fixes

* should show load script error ([a001453](https://github.com/offline-ai/cli/commit/a0014532a19d3443a30ebe73eb3080746565799d))

## [0.0.10](https://github.com/offline-ai/cli/compare/v0.0.9...v0.0.10) (2024-06-16)


### Features

* add examples dir into agentsDir ([3093faa](https://github.com/offline-ai/cli/commit/3093faa324e6f632df9c1f66d300a1cb498de7f2))

## [0.0.9](https://github.com/offline-ai/cli/compare/v0.0.8...v0.0.9) (2024-06-13)


### Features

* add http proxy supports ([23c38f7](https://github.com/offline-ai/cli/commit/23c38f7784d2ed0e07c97e37cbad1a99d7bb3799))
* pass data string as last user message in the script dynamically ([ccaa0e1](https://github.com/offline-ai/cli/commit/ccaa0e19dc3fc2638d410fefbaa442af66d5b82f))


### Bug Fixes

* args data could accept string ([d0d51f8](https://github.com/offline-ai/cli/commit/d0d51f855a37578d923a2d672f3d6f2e4d84b905))
* can not save chat history for special id ([e4df600](https://github.com/offline-ai/cli/commit/e4df600e6ab74f4a03bec8efe13a6666458cca50))
* do not use logUpdate if noConsoleClear ([bb5c825](https://github.com/offline-ai/cli/commit/bb5c8252bb805a0a20058766fd4cd89f9e1d41af))
* no-chats should be use non-interactive mode ([68d8fff](https://github.com/offline-ai/cli/commit/68d8fff42ef3c1fa272b70390a01364d3c68dcaa))
* **run:** should follow the option autoRunLLMIfPromptAvailable of script in interactive mode ([7e67c39](https://github.com/offline-ai/cli/commit/7e67c397e51443579ea0d9f3ce6519579c2975e3))

## [0.0.8](https://github.com/offline-ai/cli/compare/v0.0.7...v0.0.8) (2024-06-11)


### Features

* **brainCommand:** add refresh flag option ([129dd3f](https://github.com/offline-ai/cli/commit/129dd3fd622212b351a551e641da92aae91ad8d7))

## [0.0.7](https://github.com/offline-ai/cli/compare/v0.0.6...v0.0.7) (2024-06-10)


### Bug Fixes

* noConsoleClear can not work ([b3d2323](https://github.com/offline-ai/cli/commit/b3d23230437d5fac3c75a357eaf917a4058574a1))

## [0.0.6](https://github.com/offline-ai/cli/compare/v0.0.5...v0.0.6) (2024-06-10)


### Features

* **command:** run add noConsoleClear flag option to debug ([c92ebe4](https://github.com/offline-ai/cli/commit/c92ebe434926c64ae4966d58dcf67899d754cc24))

## [0.0.5](https://github.com/offline-ai/cli/compare/v0.0.4...v0.0.5) (2024-06-09)

## [0.0.4](https://github.com/offline-ai/ai/compare/v0.0.3...v0.0.4) (2024-06-09)


### Features

* expand env for path ([5e269c2](https://github.com/offline-ai/ai/commit/5e269c2b4b86a0a3777fa91a0f49a41561915620))
* **load-config:** add expandPath func ([39a50f4](https://github.com/offline-ai/ai/commit/39a50f43ce44701cb0894cefd0d1731c622e9dca))

## [0.0.3](https://github.com/offline-ai/ai/compare/v0.0.2...v0.0.3) (2024-06-09)

## [0.0.2](https://github.com/offline-ai/ai/compare/v0.0.1...v0.0.2) (2024-06-09)

## 0.0.1 (2024-06-09)


### Features

* add $detectLang method to script ([56fe813](https://github.com/offline-ai/ai/commit/56fe813e1da5a73c32bb2052332b0700e2ca2477))
* add abort ([6880ac0](https://github.com/offline-ai/ai/commit/6880ac00f99210b7b5d9a86c5de2f1863bbd9167))
* add abstract ai-command ([95f93a2](https://github.com/offline-ai/ai/commit/95f93a2ce934a250760380ace1d3f381239b6a9f))
* add AIScriptEx to call external script in script ([f4ea069](https://github.com/offline-ai/ai/commit/f4ea069e94ae93675941b1c3a4caac59bff1b755))
* add brain helper funcs ([536e294](https://github.com/offline-ai/ai/commit/536e29480bf757865ae1cb7bbe985baf03cf92c1))
* add brain manager command ([e8cbdab](https://github.com/offline-ai/ai/commit/e8cbdabb1306f11e89df345630fafebf51143016))
* add command line prompt ([123df12](https://github.com/offline-ai/ai/commit/123df12a5b4b4412bd8c255d9cb2d5bf87d412ce))
* add config command ([e91d4b2](https://github.com/offline-ai/ai/commit/e91d4b21ad2e2d851be0de7d0c19b8ef29a37612))
* add current working dir to searchPaths if no specify searchPaths ([a49b906](https://github.com/offline-ai/ai/commit/a49b90625a72079c3443a7b83947d68e5cc03fe4))
* add empty input to make assistant continue ([c59037f](https://github.com/offline-ai/ai/commit/c59037fb26c1ac30be4f5248b69d52bd56e815e9))
* add enableJsonFlag to abstract AICommand ([17234bc](https://github.com/offline-ai/ai/commit/17234bc37b3abf0b4b7cb394e71dbef8f6e6cb1b))
* add flags.banner to enable/disable banner ([bb898d5](https://github.com/offline-ai/ai/commit/bb898d5290bf836ad0a86d1a1cfa1973736e91ab))
* add history option to run command ([b7433b9](https://github.com/offline-ai/ai/commit/b7433b9a3f20fe546f15eca8fa8e12142f70a9db))
* add interfact and stream supports ([d21b9ef](https://github.com/offline-ai/ai/commit/d21b9ef8c1659514a403ca5762fce96f0d579f69))
* add load-config helper functions ([7fd31ff](https://github.com/offline-ai/ai/commit/7fd31ff7a238e3ccea118adab1b81f0c3e0d052c))
* add load/save chat history ([68dec24](https://github.com/offline-ai/ai/commit/68dec24620a2878acdf752aa94cc571d4739dec8))
* add logLevel aliases: loglevel, log-level ([b097a4f](https://github.com/offline-ai/ai/commit/b097a4f8eaccddd183298866bcf9619f72740c70))
* add saveConfigFile func ([f9f56ae](https://github.com/offline-ai/ai/commit/f9f56ae4af16d36929832112258b749dbed58379))
* add slash command support ([2f2b928](https://github.com/offline-ai/ai/commit/2f2b9287d0756e72c097b0edc11a5933f9ddd5ec))
* **AICommand:** add loadConfig method to AICommand ([3c1ad5f](https://github.com/offline-ai/ai/commit/3c1ad5f989629abcc95d1264854af822ec9212e2))
* can record the assistant message for abort controller ([db94f61](https://github.com/offline-ai/ai/commit/db94f61b8cd079da3d880c58faad9be33279c852))
* **config:** can get single config item value now ([61d1024](https://github.com/offline-ai/ai/commit/61d1024bc011b75cafa7902f72f9d75af8513515))
* convert to argument data to json ([c3a1883](https://github.com/offline-ai/ai/commit/c3a1883902afe74ebca6e65994ab3e73a964df98))
* display stream content on non-interactive mode ([7623503](https://github.com/offline-ai/ai/commit/7623503d610393ddce7fb30b7d51265c88efdf15))
* **prompt:** add tab support ([4b8fac8](https://github.com/offline-ai/ai/commit/4b8fac8b328a5c0fb95ec74ce0d43f5b210c5a46))
* read config from user-config file ([cef8bdd](https://github.com/offline-ai/ai/commit/cef8bdd7656f5c86a8137baa0aab598b36c19170))
* **showBanner:**  add extenal string to show ([e6aaf41](https://github.com/offline-ai/ai/commit/e6aaf41cff8261c088f737e0ed4077b9f894a12d))
* start newChats via defaults in non-interactive mode, set newChats to false will replace history.yaml file now ([efabd11](https://github.com/offline-ai/ai/commit/efabd1197eef5250154a0519a50b30f5b617fdb2))
* use color-json to output json ([90976d9](https://github.com/offline-ai/ai/commit/90976d92c5366610d7f786754bf887866e6ce694))
* **uText:** using random font if no specify font ([525db76](https://github.com/offline-ai/ai/commit/525db76fe2ba9ad7bb1084e31294066116cc2719))


### Bug Fixes

* add exclude fonts ([16277ac](https://github.com/offline-ai/ai/commit/16277ac20be4e7e9f066638525e9389cd63a7d8e))
* can detect lang for 2 chars now ([996308e](https://github.com/offline-ai/ai/commit/996308e21c4fb78e550eb6755870033dbcb64409))
* can not get correct createdAt time as log file ([e5ab2f7](https://github.com/offline-ai/ai/commit/e5ab2f7b9431bcbb2986763e6ac166323b379194))
* can not quit immediately ([d5909a9](https://github.com/offline-ai/ai/commit/d5909a9ad01ebabc24f26a18aa79bdfa3e21bda8))
* do not check file exists in command here ([e7ccee0](https://github.com/offline-ai/ai/commit/e7ccee032e728dce6fdb4ec4ec179f8aa207041e))
* do not exit directly when detect ctrl+c, just send SIGINT event ([a272158](https://github.com/offline-ai/ai/commit/a272158b00c28cffd984f943c0d6f298aca51511))
* do not output result if interactive ([7f761d3](https://github.com/offline-ai/ai/commit/7f761d361c67147bbbfa38d5fea4a9b0198b614f))
* do not save inputs history if no filename ([5fd7ba1](https://github.com/offline-ai/ai/commit/5fd7ba1095459563cada11991dd77308e25f39d5))
* do not show bannar if output json ([d6b3d12](https://github.com/offline-ai/ai/commit/d6b3d12999385df8eff43aa855391125c1d142d0))
* **help:** duplication banner ([a5c047f](https://github.com/offline-ai/ai/commit/a5c047f6b4e956d186940f773d9d982a0405c348))
* hidden the test command ([ee4dc59](https://github.com/offline-ai/ai/commit/ee4dc598926e9dfaf07b59706f8b0f7f97ce0f5b))
* ignore AbortError ([09a43a7](https://github.com/offline-ai/ai/commit/09a43a70fdd29f7be188ba7278f296fc29e1f5ed))
* multi duplications stream response for event duplication ([41c639e](https://github.com/offline-ai/ai/commit/41c639e0bbce43b1398b30bc23cc6beedfa35ed3))
* output the local messages after initDone ([74d1045](https://github.com/offline-ai/ai/commit/74d10456895356d972208e71c44e8f50c1e42a74))
* raise error in interactive if output is forceJson ([640081f](https://github.com/offline-ai/ai/commit/640081fcb65a8aab0b8e34f47e5c88b19a68bc1c))
* **run-script:** can not call/exec external script ([7a2643e](https://github.com/offline-ai/ai/commit/7a2643e84be48dd15875eebb1de1d8ce79340802))
* should be quient if loglevel is silence ([95d087d](https://github.com/offline-ai/ai/commit/95d087d566e680c7a8110237c1ca3d0618980c9d))
* should use local zone as log time ([e3aecc6](https://github.com/offline-ai/ai/commit/e3aecc639ddd0a44f42a9842048d26f1502b1f9b))
* show variable command expand depth level to 9 ([5cac2b6](https://github.com/offline-ai/ai/commit/5cac2b665cf0f77c6ea2a338233ac786e6bd19eb))
* stream output is duplication ([84bfb56](https://github.com/offline-ai/ai/commit/84bfb56cb421c6ee15865df549e4c46502a4d91c))
* the ConfigFile etc move to ai-tool now ([f7df29a](https://github.com/offline-ai/ai/commit/f7df29a5c27621be09d25266f71ef18e7c0c0d53))
