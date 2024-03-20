import Header from "@/components/Header";

export default function AlbumId( { params }){
  return (
    <main>
      <Header />
      <div className="bg-gray-300 p-4">
        <h1 className="flex items-center justify-center font-semibold text-4xl">{params.albumId}</h1>
      </div>

    </main>
  )
}