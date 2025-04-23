import React from "react";
import PageHeader from "../components/PageHeader";
import PageMain from "../components/PageMain";

interface Place {
  id: number;
  email: string;
  name: string;
}

const PlacesPage = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users", {
    cache: "no-store",
  });
  const places: Place[] = await res.json();

  return (
    <>
      <PageHeader>Estabelecimentos</PageHeader>
      <PageMain>
        <table className="table-auto">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {places.map((place) => (
              <tr key={place.id}>
                <td>{place.name}</td>
                <td>{place.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </PageMain>
    </>
  );
};

export default PlacesPage;
