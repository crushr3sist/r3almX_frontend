import { Button, Card, CardBody, Input, Avatar } from "@nextui-org/react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import routes from "@/utils/routes";
import { fetchToken } from "@/utils/login";
import { debounce } from "lodash";

const token = await fetchToken();

export const SearchComponent = () => {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const searchPing = debounce(async (queryText: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${routes.friendsSearch}?query=${queryText}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResults(response.data.results || []);
    } catch (err) {
      setError("Failed to fetch results.");
    } finally {
      setLoading(false);
    }
  }, 300); // Debounce delay

  return (
    <div>
      <div
        className={`transition-all duration-300 ease-in-out ${
          searchExpanded ? "w-80" : "w-64"
        }`}
        style={{ overflow: "hidden" }} // Optional: To hide content when collapsed
      >
        <div className="flex flex-col justify-normal">
          <Input
            ref={searchRef}
            type="text"
            classNames={{
              inputWrapper: ["text-sepia", "bg-black/90", "border"],
              innerWrapper: ["text-sepia", "bg-black/90"],
            }}
            className=""
            placeholder="Search..."
            onClick={() => setSearchExpanded(true)}
            onChange={(searchEvent) => {
              const value = searchEvent.target.value;
              setQuery(value);
              searchPing(value);
            }}
            value={query}
          />
          {searchExpanded && (
            <div>
              {loading && <p>Loading...</p>}
              {error && <p className="text-red-500">{error}</p>}
              {results.length > 0 && (
                <div>
                  <ul className="pb-1">
                    <Card className="flex flex-col bg-black/90 border border-sepia text-sepia">
                      <CardBody>
                        {results.map((result, index) => (
                          <div
                            key={index}
                            className="flex p-2 flex-row items-center "
                          >
                            <Avatar src={result.pfp} />
                            <h2 className="ml-2">{result.username}</h2>
                          </div>
                        ))}
                      </CardBody>
                    </Card>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
