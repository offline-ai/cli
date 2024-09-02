# Offline AI PPE CLI(WIP)

> 【[English](./README.md)|中文】
---
[可编程提示引擎](https://github.com/offline-ai/ppe)的智能体脚本客户端

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/%40offline-ai%2Fcli.svg)](https://npmjs.org/package/@offline-ai/cli)
[![Downloads/week](https://img.shields.io/npm/dw/%40offline-ai%2Fcli.svg)](https://npmjs.org/package/@offline-ai/cli)

觉得这个项目不错？请用点星来表示您的支持！🌟

AI Agent 脚本引擎特点:

* 简单,方便智能体开发,创建智能应用...
* 低代码,少量代码,甚至无代码就能快速开发...
* 灵活,可以在脚本中自由添加新的指令,脚本之间可以自由调用...
* 数据开放,在脚本中可以自由访问输入输出数据,以及内部数据...
* 强大,事件能够在客户端和服务器端无感自由传递,诸多工具函数...
* 安全,脚本支持加密执行,试用次数限制(TODO)...
* 智能体脚本遵循[可编程提示词工程规范](https://github.com/offline-ai/ppe/blob/main/README.cn.md)
  * 访问该站点查看详细脚本的用法

使用AI Agent 脚本引擎开发一个智能应用只需要三步:

1. 选择一个合适的脑子🧠(LLM大模型)
   1. 参数规模的选择,根据自己应用的需求决定,参数规模越大,输出质量越高,但是也会消耗更多资源...响应时间也会变长...
   2. 特长的选择,不同的脑子训练的方式不同,训练的素材(dataset)不同,特长也不同...
   3. 选择合适的量化程度,量化(压缩)程度越大,速度越快,体积越小,精度越差...
   4. 选择合适的最大窗口正文长度(`content_size`), 一般 2048 足够, 这个参数也会影响模型的性能...
   5. 然后直接使用客户端(`@offline-ai/cli`)下载: `ai brain download`
2. 创建应用的智能体脚本文件,使用客户端(`@offline-ai/cli`)调试智能体提示词
3. 嵌入到自己的智能应用中
4. 一键打包生成独立的智能应用(TODO)

## Quick Start

* [快速上手编程值南](./guide-cn.md)
* 更多的例子: [examples](./examples)
* [智能编程指南 - AI 应用](./lib/guide/) - WIP
  * 在项目根目录下运行 `ai run guide --streamEcho line`

### Install

```bash
npm install -g @offline-ai/cli
ai brain download QuantFactory/Phi-3-mini-4k-instruct-GGUF-v2 -q Q4_0
Downloading to ~/.local/share/ai/brain
Downloading https://huggingface.co/QuantFactory/Phi-3-mini-4k-instruct-GGUF-v2/resolve/main/Phi-3-mini-4k-instruct.Q4_0.gguf... 5.61% 121977704 bytes
1. https://huggingface.co/QuantFactory/Phi-3-mini-4k-instruct-GGUF-v2/resolve/main/Phi-3-mini-4k-instruct.Q4_0.gguf
   ~/.local/share/ai/brain/phi-3-mini-4k-instruct.Q4_0.gguf
done
mkdir llamacpp
cd llamacpp
# goto https://github.com/ggerganov/llama.cpp/releases/latest download latest release
wget https://github.com/ggerganov/llama.cpp/releases/download/b3563/llama-b3563-bin-ubuntu-x64.zip
unzip llama-b3563-bin-ubuntu-x64.zip
```

升级更新:

```bash
# install again
npm install -g @offline-ai/cli
```

### Run

首先需要运行 llama.cpp server 提供者(Provider):

```bash
#run llama.cpp server
cd llamacpp/build/bin
#set -ngl 0 if no gpu
./llama-server -t 4 -c 4096 -ngl 33 -m ~/.local/share/ai/brain/phi-3-mini-4k-instruct.Q4_0.gguf
```

现在你可以运行 AI 智能体脚本(可编程提示词)，例如，在`examples`目录下的`Dobby`角色:

```bash
# 进入交互对话模式
$ai run --interactive --script examples/char-dobby
```

直接运行 `translator` 脚本库:

```bash
# API 模式，将 TODO 文件翻译成英语
$ai run -f translator "{file: './TODO', target: 'English'}"

# 进入交互对话模式
$ai run -if translator
```

## Usage

安装客户端:

```sh
$ npm install -g @offline-ai/cli
$ ai COMMAND
running command...
$ ai (--version)
@offline-ai/cli/0.0.1 linux-x64 node-v20.14.0
$ ai --help [COMMAND]
USAGE
  $ ai COMMAND
...
```

从huggingface上下载大脑🧠(LLM).
如果本地无法访问huggingface, 请用代理或者Mirror.

运行如下命令执行下载命令, 选择一个下载, 或者输入更多来减少脑(模型)列表.

注意:

* 所有的量化(压缩)大脑🧠模型均为用户自行上传,因此并不能保证这些用户自行量化(压缩)的大脑🧠模型都能使用
* 目前已经存在的GGUF量化大脑🧠模型已经上万,有不少都是重复的
* `ai brain list` 列表中显示的大脑列表,默认是经过`featured`过滤了的一部分列表, 如果要显示所有的大脑列表,请输入`--no-onlyFeatured`
* `ai brain download` 下载支持自动续传

```bash
#默认列出已经下载的大脑列表
#等于 `ai brain list --downloaded`
$ai brain
$ai brain list --downloaded
1. name: "deepseek-v2-chat", likes: 17, downloads: 1189, hf_repo: "leafspark/DeepSeek-V2-Chat-GGUF"
   * IQ2_XXS: deepseek-v2-chat.IQ2_XXS-00001-of-00003.gguf (3 files)
   * IQ3_XS: deepseek-v2-chat.IQ3_XS-00001-of-00008.gguf (8 files)
   * Q2_K: deepseek-v2-chat.Q2_K-00001-of-00005.gguf (5 files)
   * Q3_K_M: deepseek-v2-chat.Q3_K_M-00001-of-00006.gguf (6 files)
   * Q5_K_M: deepseek-v2-chat.Q5_K_M-00001-of-00008.gguf (8 files)
   * Q6_K: deepseek-v2-chat.Q6_K-00001-of-00010.gguf (10 files)
   * Q8_0: deepseek-v2-chat.Q8_0-00001-of-00012.gguf (12 files)
total: 1
#可以指定大脑模型的关键字搜索
$ai brain list qwen1.5
1. name: "codeqwen1.5-7b-chat", likes: 84, downloads: 196977, hf_repo: "Qwen/CodeQwen1.5-7B-Chat-GGUF"
   * Q2_K: codeqwen-1_5-7b-chat.Q2_K.gguf
   * Q3_K_M: codeqwen-1_5-7b-chat.Q3_K_M.gguf
   * Q4_0: codeqwen-1_5-7b-chat.Q4_0.gguf
   * Q4_K_M: codeqwen-1_5-7b-chat.Q4_K_M.gguf
   * Q5_0: codeqwen-1_5-7b-chat.Q5_0.gguf
   * Q5_K_M: codeqwen-1_5-7b-chat.Q5_K_M.gguf
   * Q6_K: codeqwen-1_5-7b-chat.Q6_K.gguf
   * Q8_0: codeqwen-1_5-7b-chat.Q8_0.gguf
2. name: "qwen1.5-72b-chat", likes: 62, downloads: 3657, hf_repo: "Qwen/Qwen1.5-72B-Chat-GGUF"
   * Q2_K: qwen1_5-72b-chat.Q2_K.gguf
   * Q3_K_M: qwen1_5-72b-chat.Q3_K_M.gguf
   * Q4_0: qwen1_5-72b-chat.Q4_0-00001-of-00002.gguf (2 files)
   * Q4_K_M: qwen1_5-72b-chat.Q4_K_M-00001-of-00002.gguf (2 files)
   * Q5_0: qwen1_5-72b-chat.Q5_0-00001-of-00002.gguf (2 files)
   * Q5_K_M: qwen1_5-72b-chat.Q5_K_M-00001-of-00002.gguf (2 files)
   * Q6_K: qwen1_5-72b-chat.Q6_K-00001-of-00002.gguf (2 files)
   * Q8_0: qwen1_5-72b-chat.Q8_0-00001-of-00003.gguf (3 files)
...
total: 35
#下载大脑, 如果输入的关键字存在多个选择,会要求指定
#llama3-8b 是待搜索的大脑模型名称
#`-q Q4_0` 是下载的量化等级,如果没有提供,会提示指定
#`--hubUrl` 是huggingface的镜像URL地址
$ai brain download llama3-8b -q Q4_0 --hubUrl=huggingface-mirror-url-address
```

下载后, 要知道大脑下载的位置,通过读取`brainDir`设置,可见:

```bash
$ai config brainDir
{
  "brainDir": "~/.local/share/ai/brain"
}
```

你可以创建自己的配置文件在: `~/.config/ai/.ai.yaml` 或者用 json format: `~/.config/ai/.ai.json`.

然后,你需要下载并运行LLM后端服务器: [llama.cpp](https://github.com/ggerganov/llama.cpp/releases/latest)

下载指令如下:

```bash
mkdir llamacpp
cd llamacpp
wget https://github.com/ggerganov/llama.cpp/releases/download/b3091/llama-b3091-bin-ubuntu-x64.zip
unzip llama-b3091-bin-ubuntu-x64.zip
cd build/bin
#运行服务器
#`-ngl 33` means GPU layers to load, adjust it according to your GPU.
#`-c 4096` means max context length
#`-t 4` means thread count
#`-m your-brain-model.gguf` means 你下载的大脑模型文件
./server -t 4 -c 4096 -ngl 33 -m ~/.local/share/ai/brain/your-brain-model.gguf
```

现在你可以运行你的AI Agent脚本了:

```bash
#不用输入扩展名 `.ai.yaml`.
#默认脚本的搜索路径是当前目录和`~/.local/share/ai/agent`目录 . 你可以在`agentDirs`中配置, 或者直接在命令行中指定,注意命令行指定将覆盖配置文件中的设置.
#`-f` means the agent file
#`-i` means 进入交互模式, char-dobby 是一个角色智能体脚本,扮演哈利波特中的dobby.
$ai run -if examples/char-dobby
Dobby: I am Dobby. Dobby is happy.
You: intro yourself pls.
Dobby: I am Dobby. I'm a brave and loyal house-elf, and I'm very proud to be a free elf. I love socks and wearing mismatched pairs.

#在命令行上输入内容(content)和内容的json schema 规范(output), 它就会产出该内容对应的json数据.
#注意其生成质量受所选脑子🧠的影响.
$ai run -f examples/json '{content: "I recently purchased the Razer BlackShark V2 X Gaming Headset, and it has significantly enhanced my gaming experience. This headset offers incredible sound quality, comfort, and features that are perfect for any serious gamer. Here’s why I highly recommend it: The 7.1 surround sound feature is a game-changer. The audio quality is superb, providing a truly immersive experience. I can clearly hear directional sounds, which is crucial for competitive gaming. The depth and clarity of the sound make it feel like I’m right in the middle of the action. The 50mm drivers deliver powerful, high-quality sound. The bass is deep and punchy without being overwhelming, while the mids and highs are crisp and clear. This balance makes the headset versatile, not only for gaming but also for listening to music and watching movies.", "output":{"type":"object","properties":{"sentiment":{"type":"string","description":"Sentiment (positive or negative)"},"products":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string","description":"Name of the product"},"brand":{"type":"string","description":"Company that made the product"}}},"description":"Products mentioned in the review"},"anger":{"type":"boolean","description":"Is the reviewer expressing anger?"}},"required":["sentiment","products","anger"]}}'

{
  "sentiment": "positive",
  "products": [
    {
      "name": "Razer BlackShark V2 X Gaming Headset",
      "brand": "Razer"
    }
  ],
  "anger": false
}
```

注意:

* 默认运行后的历史记录在`~/.local/share/ai/logs/chats/[script_file_basename]/history`目录下. 可以在这里检查`seeds`, `temperature`等信息.
  * 在交互模式下默认会自动加载历史记录,如果不需要,可以用`--new-chat`
  * 非交互模式下不会自动加载历史记录,每一次运行都会生成新的历史记录.
  * 彻底禁用历史记录, 可以用`--no-chats`

**嵌入到自己的代码中(本地方式)**:

```ts
import { AIScriptServer } from '@isdk/ai-tool-agent';

// 配置你的脚本搜索路径
AIScriptEx.searchPaths = ['.']
const script = AIScriptServer.load('examples/json')
// 设置默认为大模型流式响应
script.llmStream = stream

const content = "I recently purchased the Razer BlackShark V2 X Gaming Headset, and it has significantly enhanced my gaming experience. This headset offers incredible sound quality, comfort, and features that are perfect for any serious gamer. Here’s why I highly recommend it: The 7.1 surround sound feature is a game-changer. The audio quality is superb, providing a truly immersive experience. I can clearly hear directional sounds, which is crucial for competitive gaming. The depth and clarity of the sound make it feel like I’m right in the middle of the action. The 50mm drivers deliver powerful, high-quality sound. The bass is deep and punchy without being overwhelming, while the mids and highs are crisp and clear. This balance makes the headset versatile, not only for gaming but also for listening to music and watching movies."
const output = {
  "type":"object",
  "properties":{
    "sentiment":{"type":"string","description":"Sentiment (positive or negative)"},
    "products":{
      "type":"array",
      "items":{
        "type":"object",
        "properties":{
          "name":{"type":"string","description":"Name of the product"},
          "brand":{"type":"string","description":"Company that made the product"}}
      },
      "description":"Products mentioned in the review"
    },
    "anger":{"type":"boolean","description":"Is the reviewer expressing anger?"}},
  "required":["sentiment","products","anger"]
}

const result =await script.exec({content, output})
console.log(result)
// 就可以看到大模型输出的json结果:
{
  "sentiment": "positive",
  "products": [
    {
      "name": "Razer BlackShark V2 X Gaming Headset",
      "brand": "Razer"
    }
  ],
  "anger": false
}
```

具体脚本指令手册参见: [可编程提示词工程规范](https://github.com/offline-ai/ppe/blob/main/README.cn.md)

## Credit

* [OpenAI](https://openai.com/)
* [HuggingFace](https://huggingface.co/)
* [llama-cpp](https://github.com/ggerganov/llama.cpp)
