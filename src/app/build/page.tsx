import Character from "./Character";

export default async function Page({}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <h1 className="text-4xl font-bold">Character builder</h1>
      <Character />
    </main>
  );
}
