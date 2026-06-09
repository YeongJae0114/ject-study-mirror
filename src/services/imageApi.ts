import { apiClient } from "@/services/apiClient";

export interface ImageUploadUrlRequest {
  filename: string;
  contentType: string;
  fileSize: number;
}

export interface ImageUploadUrlResponse {
  imageId: number;
  uploadUrl: string;
  fileKey: string;
  imageUrl: string;
  expiresInSeconds: number;
}

export interface ImageConfirmResponse {
  imageId: number;
  status: "UPLOADED";
  fileKey: string;
  imageUrl: string;
  uploadedAt: string;
}

export const issueImageUploadUrl = (body: ImageUploadUrlRequest) =>
  apiClient.post<ImageUploadUrlResponse>("/api/v1/images/upload-url", body);

export const uploadImageToStorage = (uploadUrl: string, file: File) =>
  fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

export const confirmImageUpload = (imageId: number) =>
  apiClient.post<ImageConfirmResponse>(`/api/v1/images/${imageId}/confirm`);
