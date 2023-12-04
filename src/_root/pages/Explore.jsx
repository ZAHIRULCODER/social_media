import React, { useEffect, useState } from "react";
import { Input, Skeleton, Spin } from "antd";
import GridPostList from "../../components/GridPostList";
import SearchResults from "../../components/SearchResults";
import { useDebounce } from "../../hooks/useDebounce";
import {
	useGetInfinitePosts,
	useGetSearchPosts,
} from "../../tanstack-query/Queries";
import { useInView } from "react-intersection-observer";
import { LoadingOutlined } from "@ant-design/icons";

const Explore = () => {
	const { ref, inView } = useInView();
	const { data: posts, fetchNextPage, hasNextPage } = useGetInfinitePosts();
	const [searchText, setSearchText] = useState("");
	const debouncedSearchText = useDebounce(searchText);
	const { data: getSearchPosts, isFetching: isSearchFetching } =
		useGetSearchPosts(debouncedSearchText);

	useEffect(() => {
		if (inView && !searchText) {
			fetchNextPage();
		}
	}, [inView, searchText]);

	if (!posts) return <Skeleton active />;

	const shouldShowSearchResults = searchText !== "";
	const shouldShowPosts =
		!shouldShowSearchResults &&
		posts?.pages?.every((item) => item?.documents?.length === 0);

	return (
		<div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
			<div style={{ width: "70%", marginTop: 30 }}>
				<h1>Search Post</h1>
				<div style={{ marginTop: 20 }}>
					<Input
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						placeholder="Search"
						style={{ height: "40px" }}
					/>
				</div>
				<div style={{ marginTop: 40 }}>
					<h2>Popular Today</h2>
					<div
						style={{
							display: "flex",
							flexWrap: "wrap",
							gap: 2,
							width: "100%",
							marginTop: 25,
						}}>
						{shouldShowSearchResults ? (
							<SearchResults
								isSearchFetching={isSearchFetching}
								getSearchPosts={getSearchPosts}
							/>
						) : shouldShowPosts ? (
							<p>End of posts</p>
						) : (
							posts?.pages?.map((post, index) => (
								<GridPostList key={`page-${index}`} posts={post?.documents} />
							))
						)}
					</div>
				</div>
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}>
					{hasNextPage && !searchText && (
						<div ref={ref} style={{ marginTop: 50 }}>
							<Spin
								indicator={
									<LoadingOutlined
										style={{
											fontSize: 30,
										}}
										spin
									/>
								}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Explore;
