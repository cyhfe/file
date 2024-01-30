1. 上传文件

```tsx
// app/page.ts
import { uploadFile } from "./actions";
export default function Home() {
  return (
    <form action={uploadFile}>
      <input type="file" name="file" id="file" />
      <button type="submit">submit</button>
    </form>
  );
}
```

2. server action 获取文件，切成固定大小，每个 chunk 交给无服务器函数处理

```tsx
// app/actions.ts
"use server";
export async function uploadFile(formdata: FormData) {
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
```

3. 无服务器函数可以并行处理固定大小的 chunk，所以总时间是恒定的。

```tsx
import { NextRequest, NextResponse } from "next/server";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: NextRequest) {
  const chunk = await request.json();
  // handle chunk
  await sleep(5000);
  return NextResponse.json("ok");
}
```
