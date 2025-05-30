import { getEnv, validateEnviromentVariables } from '../utils/env-utils';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { ServerlessSpecCloudEnum } from '@pinecone-database/pinecone';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { Document } from 'langchain/document';
import fs from 'fs';
import path from 'path';

async function indexExists(pineconeClient: Pinecone, indexName: string) {
  try {
    const data = await pineconeClient.listIndexes();
    return data?.indexes?.some(index => index.name === indexName);
  } catch (err) {
    console.error('An error occured while attempting to list an index', err);
    return false;
  }
}

async function createPineconeIndex(
  pineconeClient: Pinecone,
  indexName: string,
  indexCloud: string,
  indexRegion: string
) {
  console.log(`Creating ${indexName} index...`);
  try {
    const index = await indexExists(pineconeClient, indexName);

    if (!index) {
      await pineconeClient.createIndex({
        name: indexName,
        dimension: 256,
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: indexCloud as ServerlessSpecCloudEnum,
            region: indexRegion
          }
        },
        waitUntilReady: true
      });

      console.log(`${indexName} index created successfully!`);
    } else {
      return Promise.reject('Seeding the database aborted. Index already exists');
    }
  } catch (err) {
    console.error('An error occurred while attempting to create index:', err);
  }
}


async function getChunkedDocsFromPdf() {
  console.log('Creating chunks from a document...');
  try {
    const files = fs.readdirSync("./docs").filter(file => file.endsWith('.pdf'));

    let allDocs: Document[] = [];

    for (const file of files) {
      const filePath = path.join("./docs", file);
      const loader = new PDFLoader(filePath, { splitPages: false });
      const docs = await loader.load();
      allDocs = allDocs.concat(docs);
    }

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 512,
      chunkOverlap: 100,
    });

    const chunks = await textSplitter.splitDocuments(allDocs);

    console.log(`Successfully chunked ${files.length} PDFs into ${chunks.length} segments.`);
    return chunks;

  } catch (err) {
    console.error('Error loading or chunking PDFs:', err);
    return [];
  }
}


async function getChunkedDocsFromFlatFile() {
  console.log('Creating chunks from a document...');
  try {
    let chunks = []
    const loader = new TextLoader('docs/rmvmanual.txt');
    const docs = await loader.load();

    // by default chunkSize = 1000, chunkOverlap = 200
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 512,
      chunkOverlap: 100
    });
    chunks = [...await textSplitter.splitDocuments(docs)];

    console.log('Chunks created successfully!');

    return chunks;
  } catch (err) {
    console.error('An error occurred while attempting to load flat file or get chunks:', err);
  }

}


async function seedPineconeDb(pineconeClient: Pinecone) {
  console.log('Seeding the database...');

  const indexName = getEnv('PINECONE_INDEX');
  const indexCloud = getEnv('PINECONE_CLOUD');
  const indexRegion = getEnv('PINECONE_REGION');

  try {
    await createPineconeIndex(pineconeClient, indexName, indexCloud, indexRegion);

    const pineconeIndex = pineconeClient.index(indexName);
    const docs = await getChunkedDocsFromPdf();

    if (docs) {
      await PineconeStore.fromDocuments(
        docs,
        new OpenAIEmbeddings({ modelName: 'text-embedding-3-large', dimensions: 256 }),
        {
          pineconeIndex,
          maxConcurrency: 5,
          textKey: 'text'
        }
      );

      console.log('Database seeded successfully!');
    }
  } catch (err) {
    console.error('An error occurred while attempting to seed the database:', err);
  }
}

async function main() {
  validateEnviromentVariables();

  // Pinecone client automatically reads the PINECONE_API_KEY env variable
  const pc = new Pinecone();

  await seedPineconeDb(pc);
}

main().catch(err => {
  console.error('An error occurred while attempting to seed the database:', err);
});
