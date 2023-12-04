import React from "react";
import { useGetAllUsers } from "../../tanstack-query/Queries";
import toast from "react-hot-toast";
import { Skeleton } from "antd";
import UserCard from "../../components/UserCard";

const AllUsers = () => {
	const {
		data: creators,
		isPending: isGettingAllUsers,
		isError: isErrorGettingCreators,
	} = useGetAllUsers();

	if (isErrorGettingCreators) {
		return toast.error("Error getting all creators");
	}

	return (
		<div
			style={{
				width: "100%",
				display: "flex",
				justifyContent: "center",
			}}>
			<div style={{ width: "70%", marginTop: 30, marginBottom: 10 }}>
				{isGettingAllUsers && !creators ? (
					<Skeleton active />
				) : (
					<div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
						{creators?.documents?.map((creator) => (
							<UserCard key={creator.$id} user={creator} />
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default AllUsers;
