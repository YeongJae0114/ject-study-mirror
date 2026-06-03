import { useMutation } from "@tanstack/react-query";

import { confirmImageUpload, getUploadUrl, uploadToS3 } from "@/services/images";

export const useUploadImage = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const uploadInfo = await getUploadUrl({
        filename: file.name,
        contentType: file.type,
        fileSize: file.size,
      });

      await uploadToS3(uploadInfo.uploadUrl, file);

      await confirmImageUpload(uploadInfo.imageId);

      return uploadInfo;
    },
  });
};
