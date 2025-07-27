# [test](https://github.com/imjuya/gitblog/issues/1)


![](https://files.mdnice.com/user/105618/9c58ee3c-f685-4bb8-803d-75ae2d1a2a9b.png)

<img width="3840" height="1634" alt="Image" src="https://files.mdnice.com/user/105618/9c58ee3c-f685-4bb8-803d-75ae2d1a2a9b.png" />

# 橘鸦 AI 早报 2025-07-27

## 概览
- InternLM发布开源多模态模型Intern-S1
- NVIDIA发布Llama-3.3-Nemotron-Super-49B-v1.5模型
- inclusionAI发布全模态模型Ming-Lite-Omni v1.5
- xAI Grok 推出新UI，新增“Auto”模式
- Google NotebookLM将推出“视频概览”新功能
- Gemini CLI 将改为每周三定期更新
- LMSYS Chatbot Arena上线“搜索竞技场”
- 新研究提出ASI-Arch：可自主发现新模型架构的AI系统
- Anthropic面临“可能终结业务”的版权集体诉讼

## InternLM发布开源多模态模型Intern-S1
> **上海人工智能实验室**发布了其迄今最先进的开源多模态推理模型`Intern-S1`，该模型在通用能力和专业科学领域均表现卓越。

**上海人工智能实验室** **InternLM** 团队发布了其迄今最先进的开源多模态推理模型`Intern-S1`。`Intern-S1`构建于一个**235B**参数的`MoE`（混合专家）语言模型和一个**6B**参数的`Vision encoder`之上，是一个**241B**多模态混合推理模型。

模型经过了**5万亿（5T）** tokens的多模态数据持续预训练，其中包括超过**2.5万亿**（占比超**50%**）的科学领域专用数据。这种训练方式使得`Intern-S1`在保持强大通用能力的同时，在化学结构解读、蛋白质序列理解、化合物合成路线规划等专业科学领域表现卓越，使其能成为现实世界科学研究的得力助手。该模型的一大特色是其`dynamic tokenizer`，能够原生理解分子式、蛋白质序列和地震信号等专业数据格式。

在性能评估方面，`Intern-S1`在多个通用和科学基准测试中表现出色。与`InternVL3-78B`、`Qwen2.5-VL-72B`、`Gemini-2.5 Pro`和`Grok-4`等知名模型相比，`Intern-S1`在`MMMU`、`MMStar`、`MathVista`、`SFE`、`ChemBench`、`MatBench`、`MicroVQA`、`MSEarthMCQ`和`XLRS-Bench`等多个基准测试中取得了开源模型中的最佳成绩，并在其中部分测试中超越了所有对比的闭源模型。

模型可以通过官方网站体验，推荐的采样超参数为`top_p=1.0`, `top_k=50`, `min_p=0.0`, `temperature=0.7`。模型支持文本、图像和视频输入。官方还提供了多种服务部署方案，包括`lmdeploy`、`vllm`（即将支持）、`sglang`（进行中）和`ollama`本地部署。

![](https://files.mdnice.com/user/105618/e52fc401-2084-4d8b-a0a2-41d508726132.jpg)

```
https://huggingface.co/internlm/Intern-S1
https://github.com/InternLM/Intern-S1
https://chat.intern-ai.org.cn/
```

## NVIDIA发布Llama-3.3-Nemotron-Super-49B-v1.5模型
> **NVIDIA**发布了`Llama-3.3-Nemotron-Super-49B-v1.5`，这是一款专为推理和`Agentic`任务优化的模型，在单个**H100** GPU上实现了高吞吐量。

**NVIDIA**发布了`Llama-3.3-Nemotron-Super-49B-v1.5`模型，这是`Llama-3.3-Nemotron-Super-49B-v1`的显著升级版。该模型是一个基于**Meta** `Llama-3.3-70B-Instruct`衍生的大型语言模型，专为推理、人类聊天偏好和如`RAG`、工具调用等`Agentic`任务进行了后期训练，支持**128K**的上下文长度。

该模型在模型准确性和效率之间提供了良好的权衡。通过采用一种新颖的`神经架构搜索 (NAS)`方法，模型显著减少了内存占用，使其能够在单个**H100** GPU上以高工作负载运行，同时提供了高达**3倍**的吞吐量。模型架构是非标准的，包含`skip attention`和`可变FFN扩展比`等特性。模型经过了多阶段后训练，包括针对数学、代码、科学和工具调用的`监督微调 (SFT)`，以及用于聊天对齐的`奖励感知偏好优化 (RPO)`、用于推理的`带可验证奖励的强化学习 (RLVR)`和用于工具调用能力增强的`迭代直接偏好优化 (DPO)`。

在多个基准测试中，该模型表现出色。例如，在`MATH500`上pass@1达到**97.4**，在`AIME 2024`上达到**87.5**，在`GPQA`上达到**71.97**。模型支持`Reasoning On/Off`模式，用户可通过在系统提示中设置`/no_think`来关闭推理模式。官方推荐在推理开启时使用`temperature=0.6`和`Top P=0.95`，在关闭时使用贪心解码。

该模型已准备好用于商业用途，遵循**NVIDIA Open Model License**和**Llama 3.3社区许可协议**。开发者可以通过**NVIDIA build.nvidia.com**或**Hugging Face**下载和试用该模型，并可使用`vLLM`（推荐`v0.9.2`）进行部署，官方仓库中提供了支持工具调用的解析器插件。

```
https://huggingface.co/nvidia/Llama-3_3-Nemotron-Super-49B-v1_5
```

## inclusionAI发布全模态模型Ming-Lite-Omni v1.5
> **蚂蚁集团** **inclusionAI**团队发布了全面升级的全模态模型`Ming-Lite-Omni v1.5`，在视频、语音、图像生成等多个维度实现显著提升。

**蚂蚁集团** **inclusionAI** 团队发布了`Ming-Lite-Omni v1.5`模型，作为其前代版本的全面升级版，该模型在图像-文本理解、文档理解、视频理解、语音理解与合成、图像生成与编辑等全模态能力上均有显著提升。`Ming-Lite-Omni v1.5`基于`Ling-lite-1.5`构建，总参数量为**203亿**，其中`MoE`（混合专家）部分的活跃参数为**30亿**。

相较于旧版，**v1.5**版本在三个关键领域进行了优化。首先，通过`MRoPE`的3D时空编码和针对长视频的课程学习策略，显著增强了视频理解能力。其次，通过ID与场景一致性损失的双分支图像生成、感知增强以及新的音频解码器和`BPE`编码，优化了多模态生成的一致性和感知控制，可实现高质量的实时语音合成。最后，模型的数据基础得到了全面升级，新增了结构化文本数据、高质量产品信息以及包括方言在内的精细化视觉和语音感知数据。

在多项基准测试中，`Ming-Lite-Omni v1.5`表现出与业界同规模领先模型相当的竞争力。在图像-文本理解方面，模型在`MMVet`、`MathVista`和`OCRBench`等数据集上表现突出。在文档理解方面，其在`OCRBench`和`ChartQA`上取得了10B以下参数模型中的**SOTA**成绩。在视频理解、语音理解（支持普通话、粤语、四川话等多种方言）和语音生成方面，该模型也处于行业领先地位。此外，在图像生成方面，模型在保持人物ID一致性的编辑任务上优势明显，并扩展了对生成式分割、深度预测等感知任务的支持。

该模型已在**Hugging Face**和**ModelScope**上开放下载，并提供了详细的安装指南、代码示例和`Gradio`演示。

```
https://huggingface.co/inclusionAI/Ming-Lite-Omni-1.5
```

## xAI Grok 推出新UI，新增“Auto”模式
> **Elon Musk**宣布**Grok**已推出新UI，并新增了可自动选择模型的`Auto`模式。

**Elon Musk**宣布，**Grok** 已推出新的用户界面。该更新目前已在网页端上线，并将很快推广至手机应用。新界面增加了一个新的模型选择器功能。该功能引入了`Auto`模式，允许应用自动选择合适的模型。

![](https://files.mdnice.com/user/105618/a7bb5aa2-c4fe-4f27-a867-c1e005c744af.jpg)

```
https://x.com/elonmusk/status/1948992239071326244
```

## Google NotebookLM将推出“视频概览”新功能
> **Google**的**NotebookLM**即将推出“视频概览”新功能，能以视频幻灯片形式呈现内容摘要。

根据最新消息，**Google**的**NotebookLM**即将推出一项名为`视频概览 (Video Overviews)`的新功能。初步信息显示，这些视频概览将以视频幻灯片的形式呈现，内容包含文本、图像和其他视觉元素，并由女性声音进行旁白解说。

```
https://x.com/testingcatalog/status/1949120138373914737
https://video.twimg.com/amplify_video/1948891792201404416/vid/avc1/3840x2032/rKXFypAHd9STYyrW.mp4?tag=21
```

## Gemini CLI 将改为每周三定期更新
> 为提高更新流程的有序性，`Gemini CLI`的发布周期将调整为**每周三**定期更新。

`Gemini CLI` 维护团队成员宣布将对其`Gemini CLI`的更新发布计划进行调整。从现在开始，`Gemini CLI`的更新将在**每周三**定期发布，以使更新流程更有序、更有计划性。

![](https://files.mdnice.com/user/105618/220b164c-47b3-4171-8730-1ee7e207d9bb.png)

```
https://x.com/ntaylormullen/status/1948896982308978945
```

## LMSYS Chatbot Arena上线“搜索竞技场”
> **LMSYS**在其**Chatbot Arena**中新增了`搜索竞技场`，供用户测试和比较模型的集成搜索能力。

大型模型系统组织（**LMSYS**）在其知名的“大模型竞技场”（**Chatbot Arena**）中正式上线了`搜索竞技场 (Search Arena)`新板块。用户可以在此测试和比较不同模型在集成搜索能力后的表现。

```
http://lmarena.ai/?chat-modality=search
```

## 新研究提出ASI-Arch：可自主发现新模型架构的AI系统
> 新研究提出`ASI-Arch`系统，这是一个能自主发现并验证新颖模型架构的AI，标志着AI研究范式从人类引导向自动化创新的转变。

一篇新发布的论文《`AlphaGo Moment for Model Architecture Discovery`》介绍了一个名为`ASI-Arch`的系统，这是在神经架构发现领域首次实现`人工超级智能用于AI研究 (ASI4AI)`的展示。该系统旨在打破AI研究受限于人类认知能力的瓶颈，使AI能够进行自身的架构创新。

`ASI-Arch`实现了一个范式转变，从传统的`神经架构搜索 (NAS)`——在人类定义的空间内进行优化，转向了自动化创新。该系统可以端到端地进行架构发现领域的科学研究，能够自主提出新颖的架构概念，将其实现为可执行代码，并通过严格的实验和过往经验进行训练和实证验证。研究团队通过三个基于LLM的角色（“研究员”负责构思代码，“工程师”负责训练和调试，“分析师”负责挖掘结果模式）协同工作，并利用一个记忆库来存储所有实验过程，避免重复工作。

在耗时**20,000个GPU小时**进行的**1,773次**自主实验中，`ASI-Arch`最终发现了**106种**创新的、达到**SOTA**水平的线性注意力架构。研究者表示，这些由AI发现的架构揭示了新兴的设计原则，系统性地超越了人类设计的基线，其意义堪比**AlphaGo**的“**第37手**”，揭示了人类专家未曾预见的策略。

该研究最关键的贡献在于，首次为科学发现本身建立了经验性的`scaling law`，证明了架构上的突破可以通过计算来扩展。这标志着研究进展可以从一个受人类限制的过程转变为一个计算可扩展的过程，为模型的自我加速进化开辟了新路径。

```
https://arxiv.org/abs/2507.18074
```

## Anthropic面临“可能终结业务”的版权集体诉讼
> 因涉嫌使用盗版图书训练模型，**Anthropic**面临的版权集体诉讼已获准进入审判阶段，可能对其业务构成致命风险。

**美国**联邦法官**William Alsup**已批准将几乎所有**美国**图书作者纳入对AI公司**Anthropic**的集体诉讼中。该诉讼指控**Anthropic**在训练其AI模型时，大规模下载并使用了海量的盗版图书。

此案是生成式AI领域首例获准进入审判阶段的版权集体诉讼，因此备受关注。对于资金并不充裕、且近期被曝正寻求**1000亿美元**估值融资的**Anthropic**而言，这构成了“可能致命”或“可能终结业务”的法律风险。

这起案件的影响力远超**Anthropic**一家公司。如果陪审团最终裁定高额赔偿，并且该判决获得上级法院的确认，将为其他面临类似诉讼的科技巨头树立一个高风险的判例。目前，**OpenAI**、**Meta**等公司在**纽约**正面临**12起**已合并的类似版权案件，考虑到这些公司使用的受版权保护作品库规模可能更为庞大，它们面临的潜在理论风险实际上更高。

```
https://www.obsolete.pub/p/anthropic-faces-potentially-business
```

---

作者`橘鸦Juya`，视频版在同名**哔哩哔哩**。如果对你有所帮助，欢迎**点赞、关注、分享**。

![](https://files.mdnice.com/user/105618/5cf275c5-391c-4955-81e5-2b33bbe18c55.png)
