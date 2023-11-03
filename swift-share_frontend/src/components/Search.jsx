import React, { useState, useEffect } from "react";

import MasonryLayout from "./MasonryLayout";
import { client } from "../client";
import {
  initialLoadQuery,
  loadMoreQuery,
  loadMoreQuerySearch,
  searchQuery,
} from "../utils/data";
import Spinner from "./Spinner";

const Search = ({ searchTerm }) => {
  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (searchTerm) {
      setLoading(true);
      const query = searchQuery(searchTerm.toLowerCase());
      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [searchTerm]);

  const fetchSearchData = async () => {
    const result = await client.fetch(
      loadMoreQuerySearch(pins?.length, searchTerm.toLowerCase())
    );
    setPins(result);
    if (result.length === pins?.length) {
      setHasMore(false);
    }
  };
  return (
    <div>
      {loading && <Spinner message="Searching for pins..." />}
      {pins?.length && searchTerm !== "" ? (
        <MasonryLayout
          pins={pins}
          setPins={setPins}
          hasMore={hasMore}
          additionalClass="mt-4"
          fetchData={fetchSearchData}
        />
      ) : null}
      {pins?.length === 0 && searchTerm !== "" && !loading && (
        <div className="mt-10 text-center text-xl">No pins found!</div>
      )}
    </div>
  );
};

export default Search;
