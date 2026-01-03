import { pineconeIndex } from "@/lib/pinecone";
import { embed } from "ai";
import { google } from "@ai-sdk/google";

export async function generateEmbedding(text: string) {
  const { embedding } = await embed({
    model: google.textEmbeddingModel("text-embedding-004"),
    value: text,
  });

  return embedding;
}

export async function indexCodebase(
  repoId: string,
  files: { path: string; content: string }[]
) {
  const vectors: {
    id: string;
    values: number[];
    metadata: {
      repoId: string;
      path: string;
      content: string;
    };
  }[] = [];

  for (const file of files) {
    const content = `File: ${file.path}\n\n${file.content}`;

    // Truncate to stay within embedding limits
    const truncatedContent = content.slice(0, 8000);

    try {
      const embedding = await generateEmbedding(truncatedContent);

      vectors.push({
        id: `${repoId}-${file.path.replace(/\//g, "_")}`,
        values: embedding,
        metadata: {
          repoId,
          path: file.path,
          content: truncatedContent,
        },
      });
    } catch (error) {
      console.error(`Failed to embed file: ${file.path}`, error);
    }
  }

  if (vectors.length > 0) {
    const bZ = 100;
    for (let i = 0; i < vectors.length; i += bZ) {
      const batch = vectors.slice(i, i + bZ);
      await pineconeIndex.upsert(batch);
    }
  }

  console.log("indexing completed");
  return {
    indexedFiles: vectors.length,
  };
}

export async function retrieveContext(
  query: string,
  repoId: string,
  topK: number = 5
): Promise<string[]> {
  const embedding = await generateEmbedding(query);

  const results = await pineconeIndex.query({
    vector: embedding,
    filter: { repoId },
    topK,
    includeMetadata: true,
  });

  return (
    results.matches
      ?.map((match) => match.metadata?.content as string)
      .filter(Boolean) ?? []
  );
}
