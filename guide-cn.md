# 轻量级人工智能体脚本引擎[ai-agent]

目标: 将各式各样的智能代理组织成可以重复利用的智能体库.

## AI Agent Script Introduction

`@offline-ai/cli` 是用JS开发的轻量级人工智能体脚本引擎(`ai-agent`)的解释器客户端.用以直接运行`人工智能体脚本`.

所谓`人工智能体脚本`就是将智能体抽象出特定的任务脚本`库`,方便开发者使用.

举一个简单的例子,如果我希望让人工智能自动翻译基于如下`json`格式的`i18n`资源:

```json
{
   "en": {
     "Accept": "Accept",
     "Decline": "Decline",
     "Close": "Close",
     "Restart": "Restart",
     "YOU": "YOU",
     "Setup": "Setup",
     "dont_show_again": "Don't show again",
     "Background Color": "Background Color",
     "bg_color_desc": "Configure the background color. This overrides background image.",
     "no_bg_color": "No background color set. Click the box below.",
     "Color": "Color",
     "Load image": "Load image",
   }
}
```

当然最简单的方法直接全部贴给它让翻译,正常情况下,你会得到满意的结果.但是不要忘记,这是有幻觉的脑子,也就是说总是存在犯错的可能性.
如果变成自动化的脚本执行,没有人工审核,那么就怕出错,如果只是翻译错了,可能还好,怕就怕它把key乱搞或者不输出json.

AI 应用开发第一条,在能够用代码实现或者必须要100%保证正确的情况下,不要用AI去做.

这里翻译本来就有准确率的问题,所以翻译自身出错,问题不大.

想象一下,以前如果要编写开发一个翻译多国语言的应用是一个多复杂的工程,要语料库,设计模型,训练模型,调优.
搞半天,整出来这个翻译软件就会输出翻译结果.

而现在,在本地实现一个完整翻译多国语言的功能,就算你不懂代码,你也能实现多国语言翻译,而且还能与之沟通.

> 题外话: 在提示词中为啥用到的是英文,这是因为中文的语料库远小于英文,所以用英文准确率要优于中文.当然你用中文也没问题.但对于小脑子还是用英文效果好.

下面是最简单的`translator`(翻译家)智能体的脚本文件内容:

```yaml
---
_id: translator
templateFormat: hf
type: char
prompt:
  character:
    name: "Translator"
  description: |-
    You are the best translator in the world. You are helpful, kind, honest, good at writing, and never fails to answer any requests immediately and with precision.

    Output high-quality translation results in the JSON object and stop immediately:
    {
      "translation": "翻译后的内容",
      "original": "原文",
      "lang": "原文语言",
      "target": "目标语言",
    }
  messages:
    - role: system
      content: |-
        {{description}}
    - role: user
      content: "{{content}}\nTranslate the above content {% if lang %}from {{lang}} {% endif %}to {{target}}."
input:
  # The content that needs to be translated.
  - content
  # The language of the content. "auto" means auto detect
  - lang
  # The target language.
  - target
output:
  type: "object"
  properties:
    translation:
      type: "string"
    original:
      type: "string"
    lang:
      type: "string"
    target:
      type: "string"
  required: ["translation", "original", "lang", "target"]
parameters:
  continueOnLengthLimit: true
  maxRetry: 10
  response_format:
    type: "json_object"
llmReturnResult: content
---
```

只需要配置,不用一行代码,就可以搞定`翻译家`.

配置参数需要讲解么? 需要么? 不需要吧.

* _id: 不用说了,该脚本的唯一识别标识
* type: 脚本类型, char 表示脚色类型
* prompt: 提示词相关配置
  * charatcter: 当 `char` 类型的时候,这里设置角色信息
    * name: 角色名
  * description: 你可以在这里自行定义提示词的模板变量,这里只是个示例,在消息中可以引用, 不过[jinja2](https://wsgzao.github.io/post/jinja/)的模板语法可能要学下.
  * messages: 不用说了吧,与大脑模型交互的消息提示列表,兼容OpenAI的消息提示
    * role: 消息的角色,有: user,表示用户(人)发的消息;assistant,表示ai发的消息;system表示系统提示消息
    * content: 消息内容,这里就引用了提示中的模板变量`description`
* input: 接下要约定这个脚本的输入,也就是待翻译的内容
  * content: 待翻译的正文内容
  * lang: 正文内容所用语言
  * target: 目标语言
* output: 然后我们需要约定脚本的输出,当然你可以简单的约定输出翻译后的内容也行,就不需要这个,这里约定的是返回Json对象
  * translation: 这里返回翻译后的内容
  * original: 原文放这里,这是为了验证某个大脑的指令遵循能力,可以不用的
  * lang: 原文所用语言
  * target: 目标语言

好了,到这里配置就介绍得差不多了.

剩下的是参数配置

* `parameters`: 大脑模型参数配置, temperature, seed等都可以在这里配置
  * `continueOnLengthLimit`: 这个的作用是,当到达最大token限制后,是否会自动继续调用ai,继续取数据
    * 注意,这个目前不适用于当返回结果为json的情况,如果要求返回json必须一次取回,改大 `max_tokens`
  * `maxRetry`: 与`continueOnLengthLimit`配套的还有这个参数,继续重试的最大次数.如果不设置,默认是7次
  * `timeout`: 如果脑子比较大,响应比较慢,超过2分钟都没有响应完,那么就需要调整这个超时参数,单位是毫秒
  * `max_tokens`: 这个就是最大token限制,默认是2048,ai会输出直到max_tokens停止,这会避免有时候ai无限输出停不下来.
  * `response_format`: 设定返回结果的格式,目前`type`只有json(别名`json_object`)可以设置.
    * 注意: 当`output`和`type:json`同时被设置的时候,就会强制模型返回json object, 而非文本.
    * 如果没有设置`response_format`可以在调用参数中设置`forceJson:true`也是同样的效果.

让我们用用看. 首先确认后台已经在运行`llama.cpp`服务器:

```bash
#run llama.cpp server
cd llamacpp/build/bin
#set -ngl 0 if no gpu
./server -t 4 -c 4096 -ngl 33 -m ~/.local/share/ai/brain/phi-3-mini-4k-instruct.Q4_0.gguf
```

确认完毕,现在试一试,翻译一段文字为葡萄牙语:

```bash
ai run -f translator-simple.ai.yaml "{\
  lang:'Chinese',\
  content:'当我来到未来,首先看到的是城市中到处都是悬浮的飞行车,它们安静地在空中飞行,使道路不再拥堵。阳光透过智能玻璃照射进室内,天花板上是可以变换场景的投影。房间里弥漫着淡淡的芳香,这是嵌入墙壁的芳香发生器自动释放的。',\
  target: '葡萄牙语'}"
{
  "lang": "中文",
  "original": "当我来到未来，首先看到的是城市中到处都是悬浮的飞行车，它们安静地在空中飞行，使道路不再拥堵。阳光透过智能玻璃照射进室内，天花板上是可以变换场景的投影。房间里弥漫着淡淡的芳香，这是嵌入墙壁的芳香发生器自动释放的。",
  "target": "português",
  "translation": "Quando chegamos às futuras gerações, a primeira coisa que vemos é que, em toda a cidade, há aerotránsportos pendentes flutuando na atmosfera, voando de forma tranquila, eliminando os congestionamentos nas estradas."
}

#这里调用参数中设置了 forceJson: false, 不强制返回json, 让它自由发挥的结果
#最后一直返回空行,被脚本引擎检测到后给强行终止了,这个检测参数endWithRepeatedSequence也是可以设置的.默认是末尾序列发现至少7次重复
ai run -f translator-simple.ai.yaml "{\
  forceJson: false, \
  lang:'Chinese', \
  content:'当我来到未来,首先看到的是城市中到处都是悬浮的飞行车,它 们安静地在空中飞行,使道路不再拥堵。阳光透过智能玻璃照射进室内,天花板上是可以变换场景的投影。房间里弥漫着淡淡的芳香,这是嵌入墙壁的芳香发生器自动释放的。', \
  target: '葡萄牙语'}"
{
  "translation": "Quando chegarei ao futuro, inicialmente verrei carros voadores que flutuam em todos os lugares da cidade, e eles voam calmadamente no céu, o que não mais causa congestionamento nas es
tradas. A luz do sol penetra pelas janelas inteligentes, e na parede há um projetor de imagens que pode mudar o ambiente.",
  "original": "当我来到未来，首先看到的是城市中到处都是悬浮的飞行车，它们安静地在空中飞行，使道路不再拥堵。阳光透过智能玻璃照射进室内，天花板上是可以变换场景的投影。房间里弥漫着淡淡的香味，这是嵌入墙壁
的香水发生器自动释放的。",
   "lang": "中文",
   "target": "português"
}








│[warn]:endWithRepeatedSequence 7 count found, you can set minTailRepeatCount to 0 to disable it or increase it! { content: "{
│  "translation": "Quando chegarei ao futuro, inicialmente verrei carros voadores que flutuam em todos os lugares da cidade, e eles
│  voam calmadamente no céu, o que não mais causa congestionamento nas estradas. A luz do sol penetra pelas janelas inteligentes, e
│  na parede há um projetor de imagens que pode mudar o ambiente.",
│  "original": "当我来到未来，首先看到的是城市中到处都是悬浮的飞行车，它们安静地在空中飞行，使道路不再拥堵。阳光透过智能玻璃照射进
│  室内，天花板上是可以变换场景的投影。房间里弥漫着淡淡的香味，这是嵌入墙壁的香水发生器自动释放的。",
│  "lang": "中文",
│  "target": "português"
│  }
│
│
│
│
│
│
│  " }

│[warn]:<AbortError> The operation was aborted for endWithRepeatedSequence. { error: { code: 499, name: "AbortError", data: { what:
```

好了,智能体脚本已经能够成功的返回json结果了,那么如何自动对上面的语言资源进行翻译,还需要继续么?

balabala,说了这么多,如何安装,请看下面:

## Quick Start

### Install

```bash
npm install -g @offline-ai/cli
ai brain download QuantFactory/Phi-3-mini-4k-instruct-GGUF-v2 -q Q4_0
Downloading to ~/.local/share/ai/brain
Downloading https://huggingface.co/QuantFactory/Phi-3-mini-4k-instruct-GGUF-v2/resolve/main/Phi-3-mini-4k-instruct.Q4_0.gguf... 5.61% 121977704 bytes
1. https://hf-mirror.com/QuantFactory/Phi-3-mini-4k-instruct-GGUF-v2/resolve/main/Phi-3-mini-4k-instruct.Q4_0.gguf
   ~/.local/share/ai/brain/phi-3-mini-4k-instruct.Q4_0.gguf
done
mkdir llamacpp
cd llamacpp
wget https://github.com/ggerganov/llama.cpp/releases/download/b3091/llama-b3091-bin-ubuntu-x64.zip
unzip llama-b3091-bin-ubuntu-x64.zip
```

### Run

首先需要运行 llama.cpp server:

```bash
#run llama.cpp server
cd llamacpp/build/bin
#set -ngl 0 if no gpu
./server -t 4 -c 4096 -ngl 33 -m ~/.local/share/ai/brain/phi-3-mini-4k-instruct.Q4_0.gguf
```

现在, 你可以运行智能体脚本了:

```bash
$ai run --interactive --script examples/char-dobby
```
