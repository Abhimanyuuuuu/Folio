---
published: true
name: lector
description: a graph RAG powered-EPUB reader that remembers the story, so you don't have to worry about running into spoilers when you have questions
thumbnail: lector.png
images: [lector.png, lector1.png, lector2.png, lector3.png, lector4.png]
github: 
website: 
date: 2026-11-09
---

Lector is a local-first, GraphRAG-powered EPUB reader that lets you ask questions about the books you're reading without having to worry about accidentally spoiling the story. Unlike a conventional RAG system, it builds a persistent memory of the narrative, understands connections between characters, and uses your reading progress to decide what information it is allowed to retrieve.

The idea came to me while reading [Six of Crows by Leigh Bardugo](https://www.goodreads.com/book/show/23437156-six-of-crows). I had a question about something that happened in the story, so naturally I Googled it. Almost immediately, I ran into the problem: some results contained spoilers from much later in the book, while others didn't answer the question properly at all. I didn't want to stop reading just because I was curious about something.

That experience got me thinking: what if I could ask questions about a book and get answers based only on what I've read so far?

That's how Lector started. I spent 2 months building it, experimenting with different approaches to retrieval, local NLP, knowledge graphs, and spoiler prevention. What started as a simple idea for a better way to look up information in a novel eventually turned into a fairly involved RAG system.

The name is Latin for "reader". There was also a slightly less academic reason for keeping it: I'm a fan of Hannibal Lecter, particularly Mads Mikkelsen's portrayal of the character in *Hannibal*.

## the idea

Most RAG systems work reasonably well when the information they're retrieving is relatively independent. Ask questions about a collection of documents, retrieve a few relevant chunks, and pass them to an LLM. But novels are different.

A story isn't just a collection of paragraphs. Characters have histories, relationships change, events build on one another, and seemingly insignificant details can become important hundreds of pages later. A question about a character's motivation might require connecting something they said in chapter two with an event in chapter fifteen.

Simply retrieving text based on keyword or semantic similarity doesn't always capture those connections. And there's another problem unique to reading: information can be relevant and factually correct while still being something the reader shouldn't know yet.

I wanted to build something that could do three things:

- **Remember the story:** Maintain a persistent representation of characters, mentions, relationships, and supporting evidence instead of treating every question as an isolated search.
- **Understand context:** Retrieve information across chapters, connecting relevant passages through a knowledge graph.
- **Respect reading progress:** Never intentionally use evidence from beyond the reader's confirmed position in the book.

The goal wasn't to replace reading or summarize an entire novel. It was to create something closer to a companion that could help you understand what you've already read.

## the app

Lector is built around an EPUB reader derived from [Flow](https://github.com/pacexy/flow). You can import and read your books normally, with the RAG functionality integrated alongside the reading experience.

Once a book is prepared, you can ask questions about its characters, events, relationships, or anything else that has happened so far. Answers include citations that take you back to the relevant passages in the EPUB.

The important part is that Lector distinguishes between your displayed reading progress and your confirmed reading boundary. Moving around the book doesn't automatically tell the system that you've read everything you've navigated past. You explicitly confirm your progress before it can be used as the retrieval boundary.

That distinction is central to how spoiler protection works.

The reader handles EPUB rendering and source extraction, while a local Python backend handles indexing, retrieval, graph processing, and answer orchestration. The original EPUB normally stays in browser storage, and the backend maintains its own local index and knowledge graph.

## the retrieval system

The first major challenge was making retrieval work well for something as interconnected as a novel.

I started with a hybrid retrieval pipeline combining BM25 keyword search and semantic embeddings. BM25 is useful when a question contains specific names, phrases, or details, while semantic retrieval helps find passages that discuss the same idea using different wording.

Their results are combined using Reciprocal Rank Fusion (RRF), which merges rankings without assuming that the underlying scores are directly comparable.

But I didn't want retrieval to stop at the passages that happened to match the question. This is where GraphRAG comes in.

Lector can expand the initial retrieval results through a character-centric knowledge graph. If a relevant passage mentions a character, graph traversal can discover other characters and supporting passages connected to them. This uses bounded breadth-first traversal, so expansion stays controlled rather than following an entire network of loosely related characters.

The graph isn't intended to replace the original text. It helps find additional evidence, and the actual source passages are brought back into the context. Every graph fact must resolve to valid source evidence before it can be used.

In my retrieval evaluation, adding graph expansion improved Recall@10 from 0.69 to 0.87 (an 18% improvement) and MRR@10 from 0.77 to 0.82 compared with hybrid retrieval alone.

## building the story memory

I initially explored using an LLM to extract entities, events, and relationships from the book. However, running a generative extraction pipeline over an entire novel was expensive and slow, especially when I wanted the graph to be generated locally.

I eventually moved to a custom NLP-based approach using lightweight NLP models.

The active pipeline processes the book locally to identify character mentions, resolve coreferences, and extract quotes. I then map those results back to the original EPUB chunks so that extracted information retains its source and location.

For relationships, I use characters mentioned together in a sentence and a set of verb-based heuristics to classify candidate interactions, such as conflict, help, transfer, dialogue, and movement. These are candidate relationships rather than guaranteed semantic facts, which makes retaining their supporting text especially important.

The resulting character profiles, mentions, candidate edges, and evidence are stored in SQLite. This means the graph doesn't have to be reconstructed every time the reader opens the book. It also gives retrieval a persistent representation of the story that can grow beyond the context of a single question.

The NLP pipeline achieved 90.3% entity extraction F1 and 83.4% relationship discovery F1 in my evaluation. It processed approximately 150K tokens in under four minutes, at around 625 tokens per second locally. Compared with my earlier local LLM-based extraction approach using Microsoft GraphRAG, this reduced generation time by approximately 99%.

## spoiler protection

This was probably the most important part of the project. A system that answers questions about novels is not very useful if it casually reveals what happens later.

I approached this as an evidence-filtering problem rather than simply asking the LLM not to reveal spoilers.

The protection happens in two stages:

1. **Retrieval and graph filtering:** Before passages or graph facts can be used, they're checked against the reader's confirmed boundary. Chunks that extend beyond that boundary are excluded entirely, even if part of the chunk is within the reading range. Graph facts are also rejected if their supporting evidence or connected source material isn't eligible.
2. **Final context and answer validation:** Before sending anything to the LLM, the context assembler checks the selected evidence again. After generation, the backend revalidates the citations and evidence to ensure that the source material hasn't changed or become ineligible.

Only the selected, eligible passages and relevant graph information are sent to the answer model. The entire EPUB, index, and knowledge graph aren't sent to the external API.

This is deliberately conservative. It can exclude a passage that partially overlaps the reading boundary, but I'd rather lose a little retrieval coverage than reveal something from a future chapter.

It's worth noting that this is position-based spoiler protection, not perfect semantic spoiler detection. It prevents future-chapter evidence from entering the answer context, but it can't guarantee that an earlier passage won't indirectly hint at something the reader hasn't discovered yet.

Across 77 spoiler-sensitive tests, I recorded 0% evidence leakage. The answer evaluation also achieved 93% faithfulness and 71% citation precision.

## implementation

The project is split between the browser reader and a local Python backend.

The frontend uses React, Next.js, TypeScript, and epub.js. It handles EPUB rendering, source extraction, reading progress, citation navigation, and the reader interface. Dexie and IndexedDB are used for browser-side book and progress storage.

The backend is written in Python using FastAPI. It handles deterministic, source-aware chunking, BM25, semantic retrieval, RRF, custom NLP for graph construction, graph expansion, context assembly, and SQLite persistence.

For semantic embeddings, Lector can use a local Ollama model. The final answer generation is handled separately through the Groq API. I wanted the expensive and book-specific processing to happen locally, while keeping the hosted inference dependency limited to the final question-answering step.

The pipeline is designed so that indexing and graph construction happen during first-time book preparation. Subsequent questions use the persisted index and graph rather than rebuilding everything from scratch.

Some of the important implementation choices were:

- **Source mapping:** Every extracted passage retains its original section, order, and available EPUB CFI, allowing answers to link back to the actual text.
- **Deterministic chunking:** Chunks are created within section boundaries, with controlled overlap, so retrieval results retain reliable source locations.
- **Evidence-first graph retrieval:** Graph traversal discovers additional passages, but canonical source text remains the basis for answering.
- **Local persistence:** SQLite stores canonical chunks, embeddings, graph data, and preparation jobs, avoiding the need for an external database.
- **Strict answer output:** The answer model is required to return structured JSON with citation references, which are validated against the passages supplied to it.

## performance

I also wanted the system to be practical to use, not just an interesting experiment.

After first-time preprocessing, the pipeline achieved an overall latency of 841ms at p50 and 1,468ms at p95, with retrieval itself taking approximately 625ms at p50. External inference is isolated to answer generation, with approximately 200ms time to first token in my measurements.

The NLP graph construction is also local, so the book-specific extraction and memory-building process doesn't require sending an entire novel to a hosted LLM.

These numbers are particularly important to me because GraphRAG can easily become unnecessarily expensive or slow if every query triggers large-scale graph processing or repeated extraction. Persisting the graph and bounding traversal helps keep the query path manageable.

## challenges

The hardest part wasn't getting a RAG pipeline to return relevant paragraphs. It was making all the pieces agree on what information was actually relevant and allowed to be used.

**Building a useful graph was harder than I expected.** Characters can be referred to by different names, pronouns, titles, or descriptions. Coreference errors can create incorrect connections, and two characters appearing in the same sentence doesn't necessarily mean they have a meaningful relationship. I had to make sure graph edges retained their source evidence instead of treating every extracted connection as truth.

**Spoiler protection affected the entire architecture.** Initially, it might seem like a simple instruction to the LLM: don't mention anything after chapter X. But that doesn't solve the problem if future information has already entered the retrieved context. I had to carry reading boundaries through retrieval, graph expansion, context assembly, and final evidence validation.

**Keeping everything local also came with trade-offs.** Running NLP over an entire novel takes time, model dependencies can be difficult to configure, and local extraction approaches don't always offer the same quality or speed. I ended up favoring a more deterministic NLP-based pipeline over a generative extraction approach for the active graph.

And perhaps the most interesting challenge was deciding how much graph information to retrieve. A graph can grow quickly, but more connections don't automatically mean better answers. Bounded traversal and source validation became just as important as the extraction itself.

## thoughts

Lector started because I wanted to look up something about a book without having the internet tell me what happens next. Along the way, it became a way for me to explore how conventional RAG could be extended for information that evolves over time and depends heavily on context.

I'm particularly happy with the idea of treating a novel as something more than a collection of searchable text. A persistent, evidence-linked representation of its characters and interactions gives the system a way to connect information across chapters, while the original passages keep those connections grounded.

There are still limitations I'd like to work on. Character-centric graphs don't capture every aspect of a story, heuristic relationship extraction can produce false connections, and position-based spoiler protection isn't the same as understanding every possible narrative implication. Citation validation also doesn't automatically prove that every generated sentence is semantically supported by its citation.

But that's part of what made this project interesting. I didn't just want to put a chatbot next to an EPUB reader. I wanted to explore what it would take to build a reader that actually remembers what you've read.

And, hopefully, one that knows when to keep its mouth shut.