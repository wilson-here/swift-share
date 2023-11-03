import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { client } from "../client";
import MasonryLayout from "./MasonryLayout.jsx";
import Spinner from "./Spinner";
import {
  initialLoadQuery,
  initialLoadQuerySameCat,
  loadMoreQuery,
  loadMoreQuerySameCat,
  loadMoreQuerySameCatFeed,
} from "../utils/data";

const Feed = () => {
  const [loading, setLoading] = useState(false);
  const { categoryId } = useParams();
  const [pins, setPins] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (categoryId) {
      const query = initialLoadQuerySameCat(categoryId);
      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      });
    } else {
      client.fetch(initialLoadQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [categoryId]);

  if (loading)
    return <Spinner message="We are adding new ideas to your feed" />;

  if (!pins?.length) return <h2>No pins available</h2>;

  const fetchAllData = async () => {
    const result = await client.fetch(loadMoreQuery(pins?.length));
    setPins(result);
    if (result.length === pins?.length) {
      setHasMore(false);
    }
  };

  const fetchCatData = async () => {
    const result = await client.fetch(
      loadMoreQuerySameCatFeed(pins?.length, categoryId)
    );
    if (result.length) setPins(result);

    if (result.length === pins?.length || !result.length) {
      setHasMore(false);
    }
  };

  return (
    <div>
      {pins && (
        <MasonryLayout
          pins={pins}
          setPins={setPins}
          hasMore={hasMore}
          fetchData={categoryId ? fetchCatData : fetchAllData}
        />
      )}
    </div>
  );
};

export default Feed;
