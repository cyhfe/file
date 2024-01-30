import { uploadFile } from "./actions";
export default function Home() {
  return (
    <form action={uploadFile}>
      <input type="file" name="file" id="file" />
      <button type="submit">submit</button>
    </form>
  );
}
