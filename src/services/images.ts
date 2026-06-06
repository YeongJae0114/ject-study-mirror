import { apiClient } from "./apiClient";

export interface UploadUrlRequest {
  filename: string;
  contentType: string;
  fileSize: number;
}

export interface UploadUrlResponse {
  imageId: number;
  uploadUrl: string;
  fileKey: string;
  imageUrl: string;
  expiresInSeconds: number;
}

// 이미지 업로드를 위한 Presigned URL 발급
// 업로드 완료 후 imageId를 작품 등록 API에 전달
export const getUploadUrl = (payload: UploadUrlRequest) => {
  return apiClient.post<UploadUrlResponse>("/api/v1/images/upload-url", payload);
};

// Presigned URL을 이용해 S3에 이미지 업로드
export const uploadToS3 = async (uploadUrl: string, file: File) => {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error("S3 업로드 실패");
  }
};

// S3 업로드 확인. 업로드 성공 후 호출해야 이미지 등록 가능
export const confirmImageUpload = (imageId: number) => {
  return apiClient.post(`/api/v1/images/${imageId}/confirm`);
};
