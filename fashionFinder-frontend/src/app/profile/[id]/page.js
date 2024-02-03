export default function UserProfile({params}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="font-bold text-xl">
        Your Profile
      </h1>
      <hr />
      <p className="text-4xl">{params.id}</p>
    </div>
  );

}