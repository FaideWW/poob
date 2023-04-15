import Image from "next/image";

export default async function Page({

}) {
  const cat = await fetch('https://cataas.com/cat?json=true');

  if (!cat.ok) { throw new Error('No cat :('); }

  const catJson = await cat.json();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Hello world
      <img src={`https://cataas.com${catJson.url}`} alt="cat" />
    </main>
  );
}
