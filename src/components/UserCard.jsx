import React from "react";
import { Link } from "react-router-dom";
import { Card, Avatar, Button } from "antd";
const { Meta } = Card;

const UserCard = ({ user }) => {
	return (
		<Link to={`/profile/${user.$id}`}>
			<Card style={{ width: 300, marginTop: 16, border: "1px solid black" }}>
				<Meta
					avatar={<Avatar src={user?.imageURL} />}
					title={user?.name}
					description={
						<Button type="primary" style={{ width: "100%" }}>
							Follow
						</Button>
					}
				/>
			</Card>
		</Link>
	);
};

export default UserCard;
