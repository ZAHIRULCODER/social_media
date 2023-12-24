import { useState } from "react";
import { Upload, Card, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";

const getBase64 = (file: RcFile): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = (error) => reject(error);
	});

const CustomFileUploader = ({
	form,
	fieldName,
	imageURL,
}: {
	form: any;
	fieldName: string;
	imageURL?: string;
}) => {
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState("");
	const [previewTitle, setPreviewTitle] = useState("");
	const [fileList, setFileList] = useState<UploadFile[]>(
		imageURL
			? [{ uid: "-1", name: "Image", status: "done", url: imageURL }]
			: []
	);

	const handleCancel = () => setPreviewOpen(false);

	const handlePreview = async (file: UploadFile) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj as RcFile);
		}
		setPreviewImage(file.url || (file.preview as string));
		setPreviewOpen(true);
		setPreviewTitle(
			file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
		);
	};

	const handleChange: UploadProps["onChange"] = async ({
		fileList: newFileList,
	}) => {
		// Limit to only one file
		const latestFile = newFileList.slice(-1);
		setFileList(latestFile);
		// Check if latestFile is defined

		form.setFieldsValue({ [fieldName]: latestFile });
	};

	const uploadButton = (
		<div>
			<PlusOutlined />
			<div style={{ marginTop: 10 }}>Upload</div>
		</div>
	);

	return (
		<Card title="File Uploader" style={{ width: "100%" }}>
			<div style={{ marginLeft: 300 }}>
				<Upload
					listType="picture-card"
					fileList={fileList}
					onPreview={handlePreview}
					onChange={handleChange}
					beforeUpload={() => false}>
					{fileList?.length === 0 ? uploadButton : null}
				</Upload>
				<Modal
					open={previewOpen}
					title={previewTitle}
					footer={null}
					onCancel={handleCancel}>
					<img alt="example" style={{ width: "100%" }} src={previewImage} />
				</Modal>
			</div>
		</Card>
	);
};

export default CustomFileUploader;
