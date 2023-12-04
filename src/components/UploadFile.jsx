import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";

const { Title, Text } = Typography;

const UploadFile = ({ fieldChange, mediaURL }) => {
	const [file, setFile] = useState([]);
	const [fileURL, setFileURL] = useState(mediaURL);

	const onDrop = useCallback(
		(acceptedFiles) => {
			setFile(acceptedFiles);
			fieldChange(acceptedFiles);
			setFileURL(URL.createObjectURL(acceptedFiles[0]));
		},
		[file, fieldChange]
	);

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		accept: {
			"image/*": [".png", ".jpeg", ".jpg"],
		},
	});

	return (
		<div {...getRootProps()}>
			<input {...getInputProps()} />
			{fileURL ? (
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
					}}>
					<img style={{ width: 500 }} src={fileURL} alt="image" />
					<p style={{ padding: 10, fontWeight: "bold" }}>
						Drop the files here ...
					</p>
				</div>
			) : (
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						gap: 10,
						padding: 70,
						border: "1px solid #d9d9d9",
						borderRadius: "5px",
					}}>
					<UploadOutlined style={{ fontSize: 96, color: "#D9D9D9" }} />
					<Title level={4} className="mb-2 mt-6">
						Drag photo here
					</Title>
					<Text type="secondary" className="mb-6">
						JPEG, PNG, JPG
					</Text>
					<Button type="primary" ghost>
						Select from computer
					</Button>
				</div>
			)}
		</div>
	);
};

export default UploadFile;
