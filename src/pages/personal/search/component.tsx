import { Input } from "@nextui-org/react";
import { useEffect, useState, useRef } from "react";

export const SearchComponent = () => {
  const [searchExpanded, setSearchExpanded] = useState(false);
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
  return (
    <>
      <div>
        <div
          className={`transition-all duration-300 ease-in-out ${
            searchExpanded ? "w-80" : "w-64"
          }`}
          style={{ overflow: "hidden" }} // Optional: To hide content when collapsed
        >
          <Input
            ref={searchRef}
            type="text"
            className="text-sepia rounded bg-black/90  border-sepia"
            onClick={() => setSearchExpanded(true)}
          >
            <p> "{">"}" </p>
          </Input>
        </div>
      </div>
    </>
  );
};
