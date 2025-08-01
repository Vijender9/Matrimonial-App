import React from 'react'


const PublicProfiles = () => {

      const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    axios.get("/api/public-profiles")
      .then(res => setProfiles(res.data.data))
      .catch(err => console.log(err));
  }, []);
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {profiles.map(profile => (
        <div key={profile._id} className="border p-4 shadow rounded">
          <img src={profile.profilePic || "/default.jpg"} alt="profile" className="h-32 w-32 object-cover mx-auto rounded-full" />
          <h3 className="text-center mt-2 font-bold">{profile.name}</h3>
          <p className="text-center text-sm">{profile.profession}</p>
          <p className="text-center text-gray-500">{profile.city || "Unknown"}</p>
        </div>
      ))}
    </div>
  )
}

export default PublicProfiles