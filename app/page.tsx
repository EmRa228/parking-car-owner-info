"use client";
import { useState } from "react";

type Owner = {
  name: string;
  unit: string;
  phone: string;
};
type Car = {
  id: number;
  plate: string;
  color: string;
  model: string;
  owner?: Owner | null;
};

export default function Home() {
  const [search, setSearch] = useState({ plate: "", color: "", model: "" });
  const [insert, setInsert] = useState({ mobile: "", plate: "" });
  const [results, setResults] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    // At least one field must be filled
    if (!search.plate && !search.color && !search.model) {
      alert("Please fill at least one search field.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(search),
    });
    const data = await res.json();
    setResults(data);
    setLoading(false);
  };

  const handleInsert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!insert.mobile || !insert.plate) {
      alert("Mobile and Plate are required");
      return;
    }
    const res = await fetch("/api/insert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(insert),
    });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      alert("Data inserted successfully!");
      setInsert({ mobile: "", plate: "" });
    }
  };

  const revealPhone = (phone: string) => {
    alert(`Owner Phone: ${phone}`);
  };

  return (
    <div className="container mx-auto p-4">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Parking Car Owner Info</h1>
      </header>

      <section className="mb-8">
        <h2 className="text-2xl mb-2">Statistics</h2>
        {/* Placeholder for statistics */}
        <div className="p-4 bg-gray-100 rounded shadow">Some stats will go here...</div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl mb-2">Search Cars</h2>
        <form onSubmit={handleSearch} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Plate"
            value={search.plate}
            onChange={(e) => setSearch({ ...search, plate: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Color"
            value={search.color}
            onChange={(e) => setSearch({ ...search, color: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Model"
            value={search.model}
            onChange={(e) => setSearch({ ...search, model: e.target.value })}
            className="p-2 border rounded"
          />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl mb-2">Insert New Car Data</h2>
        <form onSubmit={handleInsert} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Mobile Number (required)"
            value={insert.mobile}
            onChange={(e) => setInsert({ ...insert, mobile: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Plate (required)"
            value={insert.plate}
            onChange={(e) => setInsert({ ...insert, plate: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <button type="submit" className="p-2 bg-green-500 text-white rounded">
            Insert Car Data
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-2xl mb-2">Search Results</h2>
        <div className="flex flex-col gap-4">
          {results.length === 0 && (
            <p className="text-center text-gray-500">No results yet.</p>
          )}
          {results.map((car) => (
            <div key={car.id} className="p-4 border rounded shadow">
              <p>
                <strong>Plate:</strong> {car.plate}
              </p>
              <p>
                <strong>Color:</strong> {car.color}
              </p>
              <p>
                <strong>Model:</strong> {car.model}
              </p>
              {car.owner && (
                <div className="mt-2">
                  <p>
                    <strong>Owner:</strong> {car.owner.name}
                  </p>
                  <p>
                    <strong>Unit:</strong> {car.owner.unit}
                  </p>
                  <button
                    onClick={() => revealPhone(car.owner.phone)}
                    className="mt-2 p-2 bg-blue-600 text-white rounded"
                  >
                    Call Owner
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
