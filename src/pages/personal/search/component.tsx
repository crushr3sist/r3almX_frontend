import { Card, CardBody, Input, Avatar } from "@nextui-org/react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import routes from "@/utils/routes";
import { debounce } from "lodash";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { Divider } from "@nextui-org/divider";
import { useNavigate } from "react-router-dom";

export const SearchComponent = () => {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
            Authorization: `Bearer ${routes.userToken}`,
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
    <div className="relative" ref={searchRef}>
      <div
        className={`transition-all duration-300 ease-in-out ${
          searchExpanded ? "w-80" : "z-50 w-64"
        }`}
        style={{ overflow: "hidden" }}
      >
        <div className="flex flex-col justify-normal">
          <Input
            type="text"
            classNames={{
              inputWrapper: [
                "!text-sepia",
                "!bg-black/90",
                "border",
                "hover:!bg-black/90",
                "focus-within:!bg-black/90",
                "dark:hover:!bg-black/90",
              ],
            }}
            className="z-100 bg-black/90 hover:bg-black/90"
            placeholder="Search..."
            onClick={() => setSearchExpanded(true)}
            onChange={(searchEvent) => {
              const value = searchEvent.target.value;
              setQuery(value);
              searchPing(value);
            }}
            value={query}
          />
          {searchExpanded && results.length > 0 && (
            <div className="absolute top-full mt-2 z-50 w-full">
              <Card className="flex flex-col bg-black/90 border border-sepia text-sepia">
                <CardBody>
                  {loading && <p>Loading...</p>}
                  {error && <p className="text-red-500">{error}</p>}
                  <ul className="pb-1">
                    {results.map((result, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          navigate(`/@/${result.username}`, {
                            state: { userId: result.id },
                          });
                        }}
                        className="flex p-2 items-center justify-between cursor-pointer hover:bg-black/80"
                      >
                        <div className="flex items-center">
                          <Avatar src={result.pfp} />
                          <h2 className="text-lg ml-2">{result.username}</h2>
                        </div>
                        <Divider orientation="vertical" />
                        <div className="flex items-center">
                          <BsFillPersonPlusFill />
                        </div>
                      </div>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
