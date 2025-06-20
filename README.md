# openapi-practice

This repo is a playground for testing OpenAI API calls using different prompt structures, token streaming, and result handling patterns.

## Key Highlights

- `src/chat.ts`: Streams response from OpenAI's chat endpoint with custom prompt injection and max token handling.
- `src/image.ts`: Generates images using DALL·E endpoint with different style and format parameters.
- `src/moderation.ts`: Tests how moderation flags work with various prompt formats.
- `src/voice.ts`: (Planned) Transcribe voice input and use as prompt input for LangChain pipelines.
- `.env`: Configure your `OPENAI_API_KEY` and run with `ts-node`.
