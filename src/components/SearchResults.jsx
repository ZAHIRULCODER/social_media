import { Skeleton } from "antd";
import React from "react";
import GridPostList from "./GridPostList";

const SearchResults = ({ getSearchPosts, isSearchFetching }) => {
	if (isSearchFetching) {
		return <Skeleton active />;
	} else if (getSearchPosts?.documents?.length > 0) {
		return <GridPostList posts={getSearchPosts?.documents} />;
	}
	return <p>No Result Found</p>;
};

export default SearchResults;
