"use server";
export async function uploadFile(formdata: FormData) {
  console.log("start upload");
  const start = Date.now();
  const file = formdata.get("file") as File;
  const chunkSize = 1024 * 1024;
  const chunks = await createChunks(file, chunkSize);

  const chunkPromises = [];
  for (const chunk of chunks) {
    const chunkPromise = fetch(process.env.BASE_URL + "api/chunk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chunk }),
    });

    chunkPromises.push(chunkPromise);
  }

  await Promise.all(chunkPromises);
  console.log(
    "file size: " + file.size + " cost: " + (Date.now() - start) + "ms"
  );
}

async function createChunks(file: File, chunkSize: number) {
  const chunks = [];
  let start = 0;

  while (start < file.size) {
    const chunk = Buffer.from(
      await file.slice(start, start + chunkSize).arrayBuffer()
    ).toString("utf-8");

    chunks.push(chunk);
    start += chunkSize;
  }

  return chunks;
}
