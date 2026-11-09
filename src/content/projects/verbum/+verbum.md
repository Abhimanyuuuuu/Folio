---
published: true
name: verbum
description: making technical education more accessible through context-aware, domain-specific language switching translations
thumbnail: verbum.png
images: [verbum.png,verbum1.png,verbum2.png,verbum3.png]
---

Verbum (Latin for *words*) is a desktop application that makes technical educational content easier to understand, without losing the terminology that gives it meaning. It combines NLP, Named Entity Recognition, terminology preservation, and language models to translate technical material into different language styles while keeping important technical expressions intact.

The idea came from my mentors, who had experienced a recurring problem while teaching students from different linguistic backgrounds. Most Computer Science textbooks, documentation, and learning resources are written in English, but not everyone learns or thinks in English. They started exploring ways to bridge this gap, particularly for students trying to study independently using resources that weren't available in the language they were most comfortable with.

I joined the project during my research internship, where I worked on investigating possible approaches and developing the NLP pipeline behind the application. Over approximately three months, what started as an exploration of language accessibility turned into a working desktop application, with a complete translation pipeline and a custom-trained NER model.

We initially chose English and Hindi to develop and demonstrate the system, but the idea isn't limited to these languages. Verbum is built around English paired with a target language of choice. With an appropriate translation backend and language-specific resources, the same approach can be adapted to other language pairs.

## the idea

The problem with translating technical material isn't necessarily translating the sentences themselves. It's knowing what *not* to translate.

Consider a sentence explaining a concept in Computer Science. Translating every word literally might make the sentence readable, but it can also change the meaning of technical expressions. A student might understand the translated words but become unfamiliar with the actual terminology they'll encounter in programming, textbooks, documentation, and examinations.

On the other hand, leaving everything in English doesn't solve the original problem either.

I wanted to explore an approach somewhere in between: translate the surrounding explanation into a language the student is comfortable with, while retaining important technical terms in their original form. The result should feel natural rather than like a word-for-word machine translation.

This also led to another observation: people don't necessarily use a language in just one way. Some prefer reading entirely in their native language, some naturally mix it with English, and others are more comfortable with a Romanized version of their language.

Instead of forcing everyone into one translation style, why not offer all three?

## the app

Verbum works as a PDF reader with translation built directly into the reading experience. Instead of copying paragraphs into a separate translation website, users can select text within a PDF and translate it without leaving the document.

The application currently demonstrates three translation modes using Hindi as the initial target language:

- **Full Translation:** Translates the selected English text into the chosen target language. In the initial implementation, this is pure Hindi.
- **Mixed Translation:** Translates the explanatory portions while retaining important English technical terminology. The initial implementation combines English technical terms with Hindi explanations.
- **Romanized Translation:** Produces a conversational, code-mixed output using the Latin script. The initial implementation uses Hinglish, or Romanized Hindi.

These aren't three separate ideas tied to Hindi. They're three ways of mapping English content into a target language: native-script translation, code-mixed translation with English terminology preserved, and Romanized code-mixed translation. The same modes can be adapted to other target languages using suitable translation models and language resources.

The interface has an integrated PDF viewer, text selection, a custom right-click context menu, and a translation sidebar. The sidebar keeps the selected text and its different translations organized in separate tabs, so users can switch between outputs without losing their place in the document.

I wanted the experience to feel like a natural extension of reading a document rather than a separate translation tool.

## the approach

The most important part of the project was figuring out how to preserve technical terminology during translation.

A conventional translation system processes the entire sentence as natural language. It doesn't necessarily know that an expression is a Computer Science concept that should remain unchanged. I explored several approaches to solve this, eventually developing a modular pipeline around Named Entity Recognition (NER).

The workflow for mixed translation is fairly straightforward:

1. **Recognize technical terminology:** A fine-tuned transformer-based NER model identifies Computer Science terms within the selected text.
2. **Protect the entities:** Recognized terms are replaced with unique placeholders before the remaining sentence is sent for translation.
3. **Translate the sentence:** The translation backend processes the surrounding text without modifying the protected terminology.
4. **Reconstruct the output:** The original technical expressions are inserted back into the translated sentence.

This separation allows the translation system to focus on making the explanation understandable while a dedicated component handles terminology preservation.

For the initial experiments, I also explored rule-based approaches and conventional NLP techniques. However, recognizing technical expressions across different sentence structures, particularly multi-word expressions, required something more flexible. This led me towards transformer-based token classification.

## building the NER dataset

One of the more challenging parts was finding suitable training data. General-purpose NER datasets weren't designed to recognize the kinds of technical expressions found in Computer Science educational material. Existing bilingual glossaries contained useful terminology, but they weren't structured as sentence-level training examples.

I ended up building a custom dataset pipeline rather than relying entirely on existing corpora.

The process involved combining several resources, each serving a different purpose:

- **Technical glossaries:** The CSTT Information Practices English-Hindi glossary provided domain-specific Computer Science terminology, including multi-word expressions.
- **TechNER:** Originally containing annotated technical sentences in Chinese, this dataset was translated into English to make its technical entities usable for our English-language pipeline.
- **IIT Bombay Hinglish Corpus:** Provided examples of English-Hinglish sentence pairs and helped explore the linguistic structure of code-mixed text.
- **Other multilingual resources:** Existing datasets were selectively transformed, translated, and reformatted to suit the requirements of our domain-specific tasks.

The glossary itself wasn't enough to train an NER model. It provided terms, not the contextual sentences in which those terms would appear. To address this, I experimented with several data augmentation techniques:

- Template-based sentence generation with automatically inserted technical terms.
- Semantic rephrasing to introduce different sentence structures and contexts.
- Randomized technical keyword sampling to generate varied combinations of entities.
- Transformation and formatting of existing multilingual and bilingual resources into model-compatible training examples.

Together, these approaches produced a custom NER training corpus containing over 100,000 rows. The objective wasn't simply to generate more data, but to expose the model to technical terminology appearing in different linguistic contexts.

I then fine-tuned a DistilBERT-based token-classification model using Hugging Face Transformers and PyTorch. The model used BIO tagging (Begin, Inside, Outside) to identify technical expressions, including multi-word entities.

The resulting model achieved an **89.5% entity-level F1-score and 88.3% precision**, evaluated across more than **250,000 domain-specific entity instances**.

## experimentation and translation

Alongside the NER work, I experimented with different translation approaches and model architectures. I didn't want to simply pick a translation API and build the rest of the application around it without understanding its limitations.

For standard translation, I compared Google Translate through the `googletrans` library, AI4Bharat's IndicTrans2, and Helsinki-NLP's MarianMT model. I evaluated them based on translation quality, inference speed, integration complexity, and suitability for technical educational content.

For the initial implementation, Google Translate offered the most practical balance for the standard translation modes. It was relatively fast, produced fluent translations, and didn't require deploying a large model locally.

For Romanized translation, I took a different approach.

I integrated Meta's LLaMA 3 70B through the Groq API and experimented with structured prompts to control the output. The model was instructed to translate general explanatory content into conversational Romanized Hindi while preserving technical terms, links, abbreviations, and the original meaning.

This was particularly interesting because the goal wasn't just translation. It was to reproduce the way bilingual students naturally communicate and understand technical explanations.

I also explored reducing the application's dependence on large external models. Since no suitable English-Hinglish parallel corpus existed for our specific domain, I created one using English technical sentences derived from TechNER and LLaMA-generated Hinglish translations.

The idea was to use this dataset to train a smaller, locally deployable sequence-to-sequence model. I selected FLAN-T5 Small as a candidate and developed the dataset-generation and fine-tuning workflow. However, actual fine-tuning wasn't completed because of GPU availability and memory constraints in the available compute environment.

This remained an important direction for future development: achieving the flexibility of a large language model without depending on one for every translation request.

## implementation

The application is built using Electron.js on the frontend and Python for the NLP backend, with Mozilla's PDF.js handling document rendering.

The frontend and backend communicate through Python Shell, allowing the application to send selected text for processing and receive the resulting translations. The Python side handles entity recognition, terminology masking, translation, and output reconstruction, while the Electron application manages the document viewer and user interactions.

A few of the features I implemented include:

- An integrated PDF viewer with document navigation, zooming, and text selection.
- A custom context menu with copy, translate, and page rotation options.
- A translation sidebar with separate tabs for the selected text and its three output modes.
- Dynamic translation updates and loading states while the backend processes requests.
- A reopen-last-file feature to make it easier to continue reading across sessions.

The translation pipeline is split into separate Python scripts for the conventional translation and LLM-based Romanized translation workflows. This kept the different approaches modular and made experimentation easier without having to restructure the entire application.

The result was a functional desktop application that brings the different NLP components together in one interface.

## results

The project was evaluated across both the technical entity-recognition task and the overall translation workflow.

The fine-tuned DistilBERT NER model achieved:

- **Entity-level F1-score:** 89.5%
- **Precision:** 88.3%
- **Evaluation coverage:** 250,000+ domain-specific entity instances

For translation evaluation, the complete workflow achieved:

- **BLEU-4:** 0.2692
- **chrF:** 0.6484
- **Semantic similarity:** 95.94%

The integrated application also achieved a **635 ms p50 overall latency** in the tested configuration.

These results provided a working foundation for terminology-aware translation rather than relying on conventional sentence-level translation alone. More importantly, the project brought together custom dataset engineering, model fine-tuning, multiple translation approaches, and desktop application development into one end-to-end system.

## challenges

The biggest challenge was that the problem didn't have a ready-made dataset or a single model that could solve it.

A general-purpose translation model could translate sentences, but it wasn't necessarily aware of which expressions carried technical meaning. A general-purpose NER model could identify common entities, but Computer Science terminology required domain-specific recognition. And even when a glossary contained the right terms, it didn't provide the contextual examples needed to train a token-classification model.

A lot of the work therefore went into connecting these pieces: transforming existing resources, generating synthetic examples, experimenting with different architectures, and designing a pipeline where each component had a clearly defined responsibility.

Another challenge was balancing model capability with computational constraints. Large language models were useful for generating natural-sounding outputs, but depending entirely on them wasn't ideal for a lightweight educational application. API usage limits, internet dependency, and inference costs made it difficult to consider them a complete long-term solution.

This pushed me to explore smaller transformer architectures and alternative data-generation workflows, even though the local Hinglish model training couldn't be completed within the available resources.

There was also the practical challenge of turning research experiments into an application that someone could actually use. A model working in a notebook is one thing; integrating it into a PDF reader, managing separate Python environments and dependencies, handling user interactions, and returning translations without interrupting the reading experience is another.

## thoughts and future work

Verbum was an interesting project because it made me think about NLP beyond the usual objective of improving translation scores. The real problem was understanding how language affects learning, and how a technical system could adapt educational content to different levels of language familiarity without compromising the underlying subject matter.

I particularly enjoyed working on the dataset and terminology-preservation pipeline. Building a domain-specific NER dataset from resources that weren't originally designed for that task, and then using it as part of a larger translation workflow, was one of the more rewarding parts of the three-month internship.

There is still plenty of room to take the project further. I'd like to explore additional language pairs, improve the handling of context-dependent technical expressions, and develop smaller locally hosted translation models to reduce reliance on external APIs.

The broader idea is to make Verbum adaptable rather than language-specific. Hindi was simply where we started. The same approach could be used for English paired with other languages, provided the appropriate translation resources and language-specific components are available.

Ultimately, Verbum is built around a simple idea: students shouldn't have to be equally proficient in the language of a textbook just to understand the subject it teaches. Language should be a bridge to learning, not a barrier.