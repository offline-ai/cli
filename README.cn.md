# ai-agent(WIP)

AI Agent Script Engine 代理体脚本客户端

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/ai-agent.svg)](https://npmjs.org/package/@offline-ai/cli)
[![Downloads/week](https://img.shields.io/npm/dw/ai-agent.svg)](https://npmjs.org/package/@offline-ai/cli)

AI Agent 脚本引擎特点:

* 简单,方便代理开发,创建智能应用...
* 低代码,少量代码,甚至无代码就能快速开发...
* 灵活,可以在脚本中自由添加新的指令,脚本之间可以自由调用...
* 数据开放,在脚本中可以自由访问输入输出数据,以及内部数据...
* 强大,事件能够在客户端和服务器端无感自由传递,诸多工具函数...
* 安全,脚本支持加密执行,试用次数限制...

使用AI Agent 脚本引擎开发一个智能应用只需要三步:

1. 选择一个合适的脑子🧠(LLM大模型)
   1. 参数规模的选择,根据自己应用的需求决定,参数规模越大,性能越高,但是也会消耗更多资源...响应时间也会变长...
   2. 特长的选择,不同的脑子训练的方式不同,训练的素材(dataset)不同,特长也不同...
   3. 选择合适的量化程度,量化(压缩)程度越大,速度越快,体积越小,精度越差...
   4. 选择合适的最大窗口正文长度(`content_size`), 一般 2048 足够, 这个参数也会影响模型的性能...
   5. 然后直接使用客户端(`@offline-ai/cli`)下载: `ai brain download`
2. 创建应用的智能代理脚本文件,使用客户端(`@offline-ai/cli`)调试代理提示词
3. 嵌入到自己的应用中

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
如果本地无法访问huggingfaces, 请用代理或者Mirror.

运行如下命令执行下载命令, 选择一个下载, 或者输入更多来减少脑(模型)列表.

注意: 所有的量化模型均为用户自行上传

```bash
ai brain download llama3-8b --hubUrl=huggingface-mirror-url-address
```

下载后, 要知道大脑下载的位置,通过读取`brainDir`设置,可见:

```bash
ai config brainDir
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
# `-m your-brain-model.gguf` means 你下载的大脑模型文件
./server -t 4 -c 4096 -ngl 33 -m ~/.local/share/ai/brain/your-brain-model.gguf
```

现在你可以运行你的AI Agent脚本了:

```bash
#不用输入扩展名 `.ai.yaml`.
#默认脚本的搜索路径是当前目录和`~/.local/share/ai/agent`目录 . 你可以在`agentDirs`中配置, 或者直接在命令行中指定,注意命令行指定将覆盖配置文件中的设置.
#`-f` means the agent file
#`-i` means 进入交互模式, char-dobby 是一个角色代理脚本,扮演哈利波特中的dobby.
$ai run -if examples/char-dobby
Dobby: I am Dobby. Dobby is happy.
You: intro yourself pls.
Dobby: I am Dobby. I'm a brave and loyal house-elf, and I'm very proud to be a free elf. I love socks and wearing mismatched pairs.

# 在命令行上输入内容(content)和内容的json schema 规范(output), 它就会产出该内容对应的json数据.
# 注意其生成质量受所选脑子🧠的影响.
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

具体脚本指令手册参见: [ai-tool-agent](https://www.npmjs.com/package/@isdk/ai-tool-agent)
