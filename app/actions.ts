"use server";
export async function uploadFile(formdata: FormData) {
  const file = formdata.get("file") as File;
  const chunkSize = 1024 * 1024;
  const ab = await file.arrayBuffer();
  const buffer = Buffer.from(ab);
  const data = buffer.toString("utf-8");
  const chunks = [];
  for (let i = 0; i < buffer.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    chunks.push(chunk);
  }

  const uploadPromises = [];

  for (const chunk of chunks) {
    const chunkPromise = fetch(process.env.BASE_URL + "api/chunk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chunk }),
    });

    uploadPromises.push(chunkPromise);
  }

  await Promise.all(uploadPromises);
  console.log("done");
}
