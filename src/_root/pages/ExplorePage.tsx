import { Layout, Typography, Input, Spin } from "antd";
import GridPostList from "../../components/GridPostList";
import { useInView } from "react-intersection-observer";
import {
	useGetInfinitePosts,
	useGetSearchPosts,
} from "../../tanstack-query/Queries";
import { useEffect, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { LoadingOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Title } = Typography;

type SearchResultProps = {
	isSearchFetching: boolean;
	searchedPosts: any;
};

const SearchResults = ({
	isSearchFetching,
	searchedPosts,
}: SearchResultProps) => {

	
	if (isSearchFetching) {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					minHeight: "60vh",
				}}>
				<Spin indicator={<LoadingOutlined style={{ fontSize: 60 }} spin />} />
			</div>
		);
	} else if (searchedPosts && searchedPosts.documents.length > 0) {
		return <GridPostList posts={searchedPosts.documents} />;
	} else {
		return (
			<p style={{ marginTop: 10, textAlign: "center" }}>No results found</p>
		);
	}
};

const ExplorePage = () => {
	const { ref, inView } = useInView();
	const [searchText, setSearchText] = useState("");
	const debouncedSearchText = useDebounce(searchText);

	//Queries
	const { data: posts, fetchNextPage, hasNextPage } = useGetInfinitePosts();
	const { data: searchedPosts, isFetching: isSearchFetching } =
		useGetSearchPosts(debouncedSearchText);

	useEffect(() => {
		if (inView && !searchText) {
			fetchNextPage();
		}
	}, [inView, searchText]);

	if (!posts)
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					minHeight: "60vh",
				}}>
				<Spin indicator={<LoadingOutlined style={{ fontSize: 60 }} spin />} />
			</div>
		);

	const shouldShowSearchResults = searchText !== "";
	const shouldShowPosts =
		!shouldShowSearchResults &&
		posts.pages.every((item) => item.documents.length === 0);

	return (
		<Layout style={{ marginLeft: 200 }}>
			<Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
				{/* Title: Search post */}
				<Title level={2}>Search post</Title>

				{/* Search Input */}
				<Input
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					placeholder="Search posts..."
					style={{ marginBottom: 16, height: "40px" }}
				/>

				{/* Title: Popular Today */}
				<Title style={{ marginBottom: 16 }} level={3}>
					Popular Today
				</Title>

				{/* Your content for displaying popular posts goes here */}
				{shouldShowSearchResults ? (
					<SearchResults
						isSearchFetching={isSearchFetching}
						searchedPosts={searchedPosts}
					/>
				) : shouldShowPosts ? (
					<p style={{ textAlign: "center" }}>End of posts</p>
				) : (
					posts.pages.map((item, index) => (
						<GridPostList key={`page-${index}`} posts={item.documents} />
					))
				)}

				{hasNextPage && !searchText && (
					<div ref={ref}>
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								minHeight: "60vh",
							}}>
							<Spin
								indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />}
							/>
						</div>
					</div>
				)}
			</Content>
		</Layout>
	);
};

export default ExplorePage;
