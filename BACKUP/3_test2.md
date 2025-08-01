# [test2](https://github.com/imjuya/gitblog/issues/3)

# 橘鸦 AI 早报 2025-08-01

## 概览
- 阶跃星辰正式开源321B多模态模型Step3
- 千问发布Qwen3-Coder-30B-A3B-Instruct
- Black Forest Labs与Krea合作发布图像模型FLUX.1 Krea [dev]
- Cohere发布专为企业设计的112B多模态模型Command A Vision
- 字节跳动发布实验性扩散语言模型Seed Diffusion Preview
- Veo 3 Fast 即将登陆 Google AI Studio
- Quora推出Poe API，提供对上百种AI模型的统一访问
- Gemini CLI更新，支持自定义斜杠命令及多项功能改进
- Google开源LangExtract：从非结构化文本中提取结构化信息的Python库
- Vercel发布AI SDK 5，全面革新全栈AI应用开发
- OpenAI在挪威启动Stargate数据中心项目
- 国务院常务会议部署深入实施“人工智能+”行动
- AI行业动态与研究简讯

## 阶跃星辰正式开源321B多模态模型Step3
> **阶跃星辰**开源了其**321B**参数的`MoE`多模态大模型`Step3`，旨在通过创新的架构为企业提供高性价比的推理方案。

**阶跃星辰**宣布正式开源其最新一代基础大模型`Step3`。该模型采用专家混合（`MoE`）架构，总参数量为**321B**，激活参数量为**38B**，旨在为企业和开发者提供性能与成本极致均衡的推理方案。

`Step3`模型在设计上专注于多模态推理，通过端到端的设计最小化解码成本，在视觉语言推理任务中表现出色。技术上，模型采用了自研的`MFA`（Multi-matrix Factorization Attention）注意力机制和`AFD`（Attention-FFN Disaggregation）系统架构。`MFA`旨在降低KV缓存开销和计算消耗，而`AFD`则将Attention和FFN计算解耦为两个子系统，通过流水线并行调度提升吞吐效率。为支持`AFD`，**阶跃星辰**还开源了专用的通信库`StepMesh`，以实现跨卡的低延迟高带宽数据传输。

在性能评测方面，`Step3`在**MMMU**、**MathVision**、**AIME 2025**等多个基准上，表现优于同类开源模型。在社区测试中，该模型也展现了不错的指令遵循和生成能力。**vLLM**项目宣布已支持`Step3`模型，并报告在**Hopper GPU**上实现了高达**4,039 tok/sec/GPU**的吞吐量。

`Step3`模型权重已在**Hugging Face**和**魔搭社区**发布，支持`bf16`和`block-fp8`格式。用户可以通过**阶跃星辰开放平台**访问其`OpenAI`兼容的API，上下文长度为**64K**。目前提供折扣价格，具体如下：


<div style="text-align:center;">

| 项目 | 价格（每百万token） |
| :--- | :--- |
| 输入 | **1.5元** |
| 输出 | **4元** |

</div>



<img src="https://static.stepfun.com/static/studio-doc/7dfddc5d-2bf0-495d-a843-ce30a9788e4e_1753967248524.jpeg" alt="Step3模型性能图" style="max-width:100%;height:auto;display:block;margin:16px 0;" />

```
https://mp.weixin.qq.com/s/RKsSTgbzP1A-xC8ADmZ2kw
https://huggingface.co/stepfun-ai/step3
https://github.com/stepfun-ai/Step3
```

## 千问发布Qwen3-Coder-30B-A3B-Instruct
> **千问团队**发布了采用`MoE`架构的**30.5B**编码模型`Qwen3-Coder-30B-A3B-Instruct`，该模型支持**256K**超长上下文并针对`Agentic`任务进行了优化。

**千问团队**发布了`Qwen3-Coder`系列的新模型——`Qwen3-Coder-30B-A3B-Instruct`。这是一款精简但性能强大的编码模型，采用专家混合（`MoE`）架构，总参数量为**30.5B**，激活参数量为**3.3B**。

该模型在多个方面进行了关键增强。其在`Agentic`编码和`Agentic`浏览器使用等任务上表现出色，并支持为`Qwen Code`、`CLINE`等平台设计的特定函数调用格式。模型原生支持**256K tokens**的超长上下文，并可通过`Yarn`技术扩展至**1M tokens**，专为仓库级别的代码理解进行了优化。

模型架构细节包括**48**个层、**32**个Q注意力头和**4**个KV注意力头，以及**128**个专家和**8**个激活专家。官方指出，新模型仅支持非思考模式。

**Hugging Face**页面提供了详细的快速上手代码示例，并建议在遇到内存不足问题时，可将上下文长度缩短至**32,768**。该模型也已获得**Ollama**、**LMStudio**、**MLX-LM**等本地应用的支持。

<img src="https://qianwen-res.oss-cn-beijing.aliyuncs.com/Qwen3-Coder/qwen3-coder-30a3-main.jpg" alt="Qwen3-Coder模型" style="max-width:100%;height:auto;display:block;margin:16px 0;" />

```
https://huggingface.co/Qwen/Qwen3-Coder-30B-A3B-Instruct
```

## Black Forest Labs与Krea合作发布图像模型FLUX.1 Krea [dev]
> **Black Forest Labs**与**Krea**合作发布了**120亿**参数的开放权重图像模型`FLUX.1 Krea [dev]`，该模型采用“修正流”技术，旨在生成具有独特美学和真实感的图像。

**Black Forest Labs**与**Krea**合作，发布了一款名为`FLUX.1 Krea [dev]`的开放权重模型。这是一个**120亿**参数的“修正流”（`rectified flow`）Transformer模型，专为生成具有独特美学和卓越真实感的摄影级图像而设计。

该模型是**Krea 1**的开放权重版本，经过训练可以生成更加真实和多样化的图像，避免了过度饱和的纹理和常见的“AI感”。它通过指导蒸馏（`guidance distillation`）技术进行训练，提高了效率。官方称该模型为“有主见”的文生图模型，旨在为用户提供视觉上有趣的惊喜。

`FLUX.1 Krea [dev]`的权重已在**Hugging Face**上发布，并已集成到**ComfyUI**和**Diffusers**中。用户可以在**ComfyUI**中直接下载`safetensors`文件使用，或通过**Diffusers**的`FluxPipeline`进行调用。模型生成的输出可用于个人、科研和商业目的，但需遵守`FLUX.1 [dev]`非商业许可协议（`FluxDev Non-Commercial License Agreement`）和可接受使用政策。

在安全方面，**Black Forest Labs**和**Krea**在发布前采取了多项措施，包括对预训练数据进行`NSFW`内容过滤，与**互联网观察基金会**（**IWF**）合作过滤已知的`CSAM`（儿童性虐待材料），以及进行多轮微调以抑制滥用。模型在对抗性测试中表现出高弹性，并包含了推理过滤器以防止生成非法内容。

<img src="https://pbs.twimg.com/amplify_video_thumb/1950920435035508739/img/aDfDCqXD4UQ30rnI.jpg" alt="FLUX.1 Krea [dev]生成图像示例" style="max-width:100%;height:auto;display:block;margin:16px 0;" />

```
https://huggingface.co/black-forest-labs/FLUX.1-Krea-dev
https://bfl.ai/announcements/flux-1-krea-dev
```

## Cohere发布专为企业设计的112B多模态模型Command A Vision
> **Cohere**发布了专为企业优化的**1120亿**参数多模态模型`Command A Vision`，该模型在保持低资源占用的同时，提供了卓越的图像理解和多语言处理能力。

**Cohere**发布了一款名为`Command A Vision`的全新多模态模型，该模型经过优化，旨在为企业提供卓越的图像理解能力，同时保持较低的计算资源占用。作为一个拥有**1120亿**参数的开放权重研究版本，`Command A Vision`在私有化部署时仅需**两块**或更少的GPU（如**两块A100**或**一块H100**），确保了企业级的可扩展性。

模型架构方面，`Command A Vision`将基于`Command A`的语言模型与**Google**的`SigLIP2-patch16-512`视觉编码器通过一个多模态适配器相结合。它支持**32k**的上下文长度，并能处理**英语**、**葡萄牙语**、**意大利语**、**法语**、**德语**和**西班牙语**等多种语言。在图像处理上，该模型使用最多**12个** **512x512**像素的图像块和**1个**缩略图来编码单张图片，总计最多使用**3328个**视觉token，推荐处理最高分辨率为**2048x1536**（**300万像素**）的图像。

在性能上，**Cohere**表示`Command A Vision`在多个关键多模态基准测试中超越了**GPT-4.1**、**Llama 4 Maverick**和**Mistral Medium 3**等同类模型。它特别擅长处理企业级的视觉任务，包括分析图表、图形、表格和技术图纸；通过`OCR`技术从发票、表单等文档中准确提取文本和结构化信息；以及理解现实世界的复杂场景，可用于工业风险检测和零售分析等应用。该模型结合了`Command A`的先进`RAG`与引用功能，并支持`JSON`模式以输出结构化数据。

`Command A Vision`目前已在**Cohere平台**和**Hugging Face**上提供，遵循`CC-BY-NC`非商业许可，并要求遵守**Cohere Lab**的可接受使用政策。对于商业用途，企业需联系**Cohere**的销售团队。

<img src="https://cohere.com/_next/image?url=https%3A%2F%2Fcohere-ai.ghost.io%2Fcontent%2Fimages%2F2025%2F07%2F250730_blog-image_CommandAVision_chart-detailed-benchmarks-2.png&w=3840&q=75" alt="Command A Vision性能对比图" style="max-width:100%;height:auto;display:block;margin:16px 0;" />

```
https://cohere.com/blog/command-a-vision
https://huggingface.co/CohereLabs/command-a-vision-07-2025
```

## 字节跳动发布实验性扩散语言模型Seed Diffusion Preview
> **字节跳动Seed团队**发布了实验性扩散语言模型`Seed Diffusion Preview`，通过多项创新技术探索离散扩散在结构化代码生成领域的可行性，并实现了显著的推理速度提升。

**字节跳动Seed团队**发布了一款名为`Seed Diffusion Preview`的实验性扩散语言模型，旨在探索离散扩散技术在结构化代码生成领域的可行性。该模型的目标是验证扩散模型作为下一代语言模型基础框架的潜力。

为实现这一目标，团队引入了多项关键技术。首先是“`两阶段课程学习`”，第一阶段通过标准的掩码填充任务训练模型掌握代码的局部上下文和模式，第二阶段则引入基于编辑距离的插入/删除操作，强制模型评估和修正全局代码的合理性。其次，团队提出了“`约束顺序扩散`”训练方法，通过从预训练模型合成并筛选偏好的生成轨迹进行蒸馏，让扩散模型学习代码中固有的因果依赖关系。

为了提升解码效率，团队采用了“`同策略学习`”范式，通过优化一个旨在最小化生成步数同时保证输出质量的代理损失函数，让模型学会更直接、高效地收敛到高质量结果。在工程实现上，团队采用了块级并行扩散采样方案，并利用内部优化的基础设施框架支持高效推理。

实验结果显示，`Seed Diffusion Preview`的代码推理速度可达**2146 tokens/s**，相比同等规模的自回归（`AR`）模型提升了**5.4倍**。同时，在多个核心代码基准测试中，其性能与优秀的`AR`模型相当，甚至在`CanItEdit`等代码修复任务上实现了超越。

<img src="https://lf3-static.bytednsdoc.com/obj/eden-cn/hyvsmeh7uhobf/img_v3_02om_0ade2e5d-5b89-4ea2-b89d-73954f083d4g.jpg" alt="Seed Diffusion模型架构图" style="max-width:100%;height:auto;display:block;margin:16px 0;" />

```
https://seed.bytedance.com/zh/seed_diffusion
```

## Veo 3 Fast 即将登陆 Google AI Studio
> **Google**宣布推出专为速度和成本效益优化的视频模型`Veo 3 Fast`，并为`Veo 3`系列增加了图像到视频生成功能，这些更新已通过`Gemini API`提供。

**Google**宣布为其视频生成模型系列增添新成员`Veo 3 Fast`，并为`Veo 3`和`Veo 3 Fast`增加了图像到视频的生成能力。这些更新现已通过`Gemini API`以付费预览形式提供。

`Veo 3 Fast`是`Veo 3`模型的一个优化版本，专为追求速度和成本效益的开发者设计，使其能够更快地进行创意迭代。该模型支持文本到视频和图像到视频两种模式，非常适用于程序化广告、快速创意原型设计和大规模社交媒体内容生成等场景。

新增的图像到视频功能允许开发者使用`Veo 3`和`Veo 3 Fast`从静态输入图像生成带有声音的高质量视频片段。用户只需提供一张图片和相应的文本提示，即可引导模型生成具有期望动作、叙事和音效的动态视频，并能保持与初始图像的风格一致性。

| 模型/功能 | 定价（每秒视频，含音频） |
| :--- | :--- |
| `Veo 3 Fast` | **0.40美元** |
| `Veo 3` (含图像到视频) | **0.75美元** |

此外，有消息称`Veo 3 Fast`可能很快也会登陆**Google/