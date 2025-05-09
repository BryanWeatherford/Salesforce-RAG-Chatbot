# Retrieval-Augmented Generation (RAG) System for Salesforce

This app is an AI chatbot using RAG (Retrieval Augmented Generation) to provide Question & Answer(Q&A) and summarization capabilities based on Salesforce's quarterly earnings presentation transcripts.

## Stack

- Framework: [Next.js](https://nextjs.org/)
- Chat functionality: [Vercel AI SDK](https://sdk.vercel.ai/docs/introduction), [LangChain.js](https://js.langchain.com/docs/get_started/introduction)
- Generative model: [OpenAI](https://openai.com/)
- Vector database: [Pinecone](https://docs.pinecone.io/home)
- Component library: [shadcn/ui](https://ui.shadcn.com/)
- Styling: [Tailwind CSS](https://tailwindcss.com/)

## How to start

### 1. Install dependencies

```
npm i
```

### 2. Fill out secrets , Get API Keys from Pinecone and OpenAI, LangChain

Create .env file using the .env.example and fill the all keys.
```
OPENAI_API_KEY=your_openai_aip_key
PINECONE_API_KEY=your_pinecone_aip_key
PINECONE_INDEX=index_name
PINECONE_CLOUD=aws
PINECONE_REGION=us-east-1
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=your_langchain_aip_key
```

### 3. Seed database , Copy PDF files to docs folder and Seed the Vector DB

```
npm run seed
```

### 4. Run app locally

```
npm run dev
```

### Open in your browser

You can now visit http://localhost:3000.
