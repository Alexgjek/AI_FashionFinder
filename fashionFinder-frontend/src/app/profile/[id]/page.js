export default function UserProfile({params}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1>
        Profile
      </h1>
      <hr />
      <p className="text-4xl">Profile Page {params.id}</p>
    </div>
  );

}