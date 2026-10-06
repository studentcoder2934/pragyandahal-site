---
title: Local Real-Time Voice AI
description: I've been putting together a conversational voice system that runs locally on consumer hardware.
status: still experimenting
tags: [AI systems, speech, human-computer interaction]
takeaway: Some versions started speaking quickly but sounded like they restarted at every clause.
---

## What I tried

I've been experimenting with a conversational voice AI system where the whole pipeline runs locally. I wanted to find out how close consumer hardware could get to the speed and naturalness of commercial voice systems.

There's still work to do, especially on timing and how the speech sounds over a longer response.

## Why I tried it

I wanted to understand what happens between someone finishing a sentence and the system replying. There are several models and decisions involved, and I wanted to be able to change them individually rather than only use a finished voice service.

The timing matters a lot when you're actually talking to it. If the system waits too long you wonder if it heard you. If it responds too early it cuts you off. Even when the words are right, the conversation can feel awkward.

## What I built

I worked with speech-to-text, local language models, text-to-speech, voice cloning, endpoint detection, streaming, and the code connecting those pieces. I tried different open-source models and several TTS architectures, measuring latency as I went.

The system has to decide you've finished speaking, transcribe what you said, generate a reply, turn that reply into speech, and play it. Some of those steps can overlap, but changing when one starts affects the others.

## What happened

One issue I spent time on was speech resetting at clause boundaries. With some approaches, I'd generate and play small pieces of the response so the first audio could start sooner. The next piece could then sound like a new sentence with a different cadence, even when it was meant to continue the previous one.

I compared architectures that generated speech differently and listened to longer responses, including the places where chunks met. A version could look good on latency and still sound noticeably broken there.

I haven't finished the system or published a benchmark. These are comparisons I've been doing as part of building it.

## What went wrong

I couldn't judge the conversation from the speed of one model. Reducing the endpoint wait could make it interrupt. Making TTS chunks smaller could help it start sooner and make the rest of the response worse.

I also had to distinguish between time to the first audio and how the audio continued after that. They're both important, but a single number doesn't tell me enough about the experience.

## What I learned

I need to listen to the full response and test actual turn-taking. Can I interrupt it? Does it wait at the right time? Does the voice keep a consistent cadence?

Those questions need a live mic-and-speaker conversation. Getting all the components to run isn't enough to answer them.

## What I'd do differently

I'd include longer responses and interruption tests earlier in the comparisons, and keep recordings under the same conditions. That would make it easier to hear what changed instead of relying on my memory of how a previous version sounded.

I'm still comparing the tradeoffs between starting quickly and keeping the speech continuous.
